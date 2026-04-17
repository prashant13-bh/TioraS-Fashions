import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import { pocketbaseAuth } from '../middleware/pocketbase-auth.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /notifications/preferences - Create or update notification preferences
router.post('/preferences', pocketbaseAuth, async (req, res) => {
  const {
    emailOrderStatus = true,
    emailPriceDrop = true,
    emailNewProducts = true,
    emailPromotions = true,
    pushOrderStatus = true,
    pushPriceDrop = true,
    pushNewProducts = true,
    pushPromotions = true,
  } = req.body;

  // Check if preferences already exist for this user
  const existingPrefs = await pb.collection('notificationPreferences').getFullList({
    filter: `userId = "${req.pocketbaseUserId}"`,
  });

  let preferences;

  if (existingPrefs.length > 0) {
    // Update existing preferences
    preferences = await pb.collection('notificationPreferences').update(existingPrefs[0].id, {
      emailOrderStatus,
      emailPriceDrop,
      emailNewProducts,
      emailPromotions,
      pushOrderStatus,
      pushPriceDrop,
      pushNewProducts,
      pushPromotions,
      updatedAt: new Date().toISOString(),
    });
  } else {
    // Create new preferences
    preferences = await pb.collection('notificationPreferences').create({
      userId: req.pocketbaseUserId,
      emailOrderStatus,
      emailPriceDrop,
      emailNewProducts,
      emailPromotions,
      pushOrderStatus,
      pushPriceDrop,
      pushNewProducts,
      pushPromotions,
      createdAt: new Date().toISOString(),
    });
  }

  logger.info(`Notification preferences updated for user: ${req.pocketbaseUserId}`);

  res.json({
    success: true,
    preferences: {
      id: preferences.id,
      emailOrderStatus: preferences.emailOrderStatus,
      emailPriceDrop: preferences.emailPriceDrop,
      emailNewProducts: preferences.emailNewProducts,
      emailPromotions: preferences.emailPromotions,
      pushOrderStatus: preferences.pushOrderStatus,
      pushPriceDrop: preferences.pushPriceDrop,
      pushNewProducts: preferences.pushNewProducts,
      pushPromotions: preferences.pushPromotions,
    },
  });
});

// GET /notifications - Get all notifications for authenticated user
router.get('/', pocketbaseAuth, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await pb.collection('notifications').getList(parseInt(page), parseInt(limit), {
    filter: `userId = "${req.pocketbaseUserId}"`,
    sort: '-createdAt',
  });

  // Count unread notifications
  const unreadNotifications = await pb.collection('notifications').getFullList({
    filter: `userId = "${req.pocketbaseUserId}" && isRead = false`,
  });

  logger.info(`Fetched ${result.items.length} notifications for user: ${req.pocketbaseUserId}`);

  res.json({
    notifications: result.items,
    unreadCount: unreadNotifications.length,
    pagination: {
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    },
  });
});

// POST /notifications/:notificationId/read - Mark notification as read
router.post('/:notificationId/read', pocketbaseAuth, async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    return res.status(400).json({ error: 'notificationId is required' });
  }

  const notification = await pb.collection('notifications').getOne(notificationId);

  if (!notification) {
    throw new Error('Notification not found');
  }

  // Authorization check: user can only mark own notifications as read
  if (notification.userId !== req.pocketbaseUserId) {
    return res.status(403).json({ error: 'Unauthorized to mark this notification as read' });
  }

  // Mark as read
  await pb.collection('notifications').update(notificationId, {
    isRead: true,
    readAt: new Date().toISOString(),
  });

  logger.info(`Notification marked as read: ${notificationId}`);

  res.json({ success: true });
});

// POST /notifications/mark-all-read - Mark all notifications as read
router.post('/mark-all-read', pocketbaseAuth, async (req, res) => {
  // Fetch all unread notifications for user
  const unreadNotifications = await pb.collection('notifications').getFullList({
    filter: `userId = "${req.pocketbaseUserId}" && isRead = false`,
  });

  // Mark all as read
  for (const notification of unreadNotifications) {
    await pb.collection('notifications').update(notification.id, {
      isRead: true,
      readAt: new Date().toISOString(),
    });
  }

  logger.info(`Marked ${unreadNotifications.length} notifications as read for user: ${req.pocketbaseUserId}`);

  res.json({ success: true, markedCount: unreadNotifications.length });
});

export default router;