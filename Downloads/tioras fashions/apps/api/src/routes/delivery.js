import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// Helper function to calculate delivery date
const calculateDeliveryDate = (shippingMethod) => {
  const today = new Date();
  let minDays, maxDays;

  if (shippingMethod === 'express') {
    minDays = 1;
    maxDays = 2;
  } else if (shippingMethod === 'standard') {
    minDays = 3;
    maxDays = 5;
  } else {
    minDays = 5;
    maxDays = 7;
  }

  const estimatedDate = new Date(today);
  estimatedDate.setDate(estimatedDate.getDate() + minDays);

  return {
    minDays,
    maxDays,
    estimatedDeliveryDate: estimatedDate.toISOString().split('T')[0],
  };
};

// POST /delivery/estimate
router.post('/estimate', async (req, res) => {
  const { pincode, shippingMethod = 'standard' } = req.body;

  // Input validation
  if (!pincode || typeof pincode !== 'string') {
    return res.status(400).json({ error: 'pincode is required and must be a string' });
  }

  if (!shippingMethod || !['standard', 'express', 'economy'].includes(shippingMethod)) {
    return res.status(400).json({ error: 'shippingMethod must be one of: standard, express, economy' });
  }

  // Fetch delivery zone from PocketBase
  const zones = await pb.collection('deliveryZones').getFullList({
    filter: `pincodes ~ "${pincode}"`,
  });

  if (zones.length === 0) {
    return res.status(400).json({ error: 'Delivery not available for this pincode' });
  }

  const zone = zones[0];

  // Get shipping cost for the method
  let deliveryCost = 0;
  if (shippingMethod === 'express') {
    deliveryCost = zone.expressCost || 100;
  } else if (shippingMethod === 'standard') {
    deliveryCost = zone.standardCost || 50;
  } else {
    deliveryCost = zone.economyCost || 30;
  }

  // Calculate delivery date
  const deliveryInfo = calculateDeliveryDate(shippingMethod);

  logger.info(`Delivery estimate calculated for pincode: ${pincode}, method: ${shippingMethod}`);

  res.json({
    estimatedDeliveryDate: deliveryInfo.estimatedDeliveryDate,
    deliveryDays: `${deliveryInfo.minDays}-${deliveryInfo.maxDays} days`,
    deliveryCost,
    shippingMethod,
    zone: zone.zoneName,
  });
});

export default router;