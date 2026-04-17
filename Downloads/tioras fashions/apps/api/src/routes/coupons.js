import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// Helper function to validate coupon
const validateCoupon = async (code, orderAmount, cartItems = []) => {
  // Fetch coupon from PocketBase
  const coupons = await pb.collection('coupons').getFullList({
    filter: `code = "${code}"`,
  });

  if (coupons.length === 0) {
    return { valid: false, error: 'Coupon code not found' };
  }

  const coupon = coupons[0];

  // Check if coupon is active
  if (!coupon.active) {
    return { valid: false, error: 'Coupon is not active' };
  }

  // Check expiration
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: 'Coupon has expired' };
  }

  // Check usage limit
  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
    return { valid: false, error: 'Coupon usage limit exceeded' };
  }

  // Check minimum order amount
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    return { valid: false, error: `Minimum order amount of ₹${coupon.minOrderAmount} required` };
  }

  // Check applicable categories/products
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const applicableCategories = Array.isArray(coupon.applicableCategories)
      ? coupon.applicableCategories
      : JSON.parse(coupon.applicableCategories);

    if (cartItems.length > 0) {
      const hasApplicableItem = cartItems.some((item) =>
        applicableCategories.includes(item.category)
      );

      if (!hasApplicableItem) {
        return { valid: false, error: 'Coupon not applicable to items in cart' };
      }
    }
  }

  return {
    valid: true,
    coupon,
  };
};

// POST /coupons/validate
router.post('/validate', async (req, res) => {
  const { code, orderAmount, cartItems = [] } = req.body;

  // Input validation
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'code is required and must be a string' });
  }

  if (typeof orderAmount !== 'number' || orderAmount <= 0) {
    return res.status(400).json({ error: 'orderAmount must be a positive number' });
  }

  const validation = await validateCoupon(code, orderAmount, cartItems);

  if (!validation.valid) {
    return res.json(validation);
  }

  const coupon = validation.coupon;

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    // Cap discount at maxDiscount if specified
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discountAmount = coupon.discountValue;
  }

  logger.info(`Coupon validated: ${code}, discount: ₹${discountAmount}`);

  res.json({
    valid: true,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Math.round(discountAmount * 100) / 100,
  });
});

// POST /coupons/apply
router.post('/apply', async (req, res) => {
  const { code, orderAmount, cartItems = [] } = req.body;

  // Input validation
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'code is required and must be a string' });
  }

  if (typeof orderAmount !== 'number' || orderAmount <= 0) {
    return res.status(400).json({ error: 'orderAmount must be a positive number' });
  }

  // Validate coupon
  const validation = await validateCoupon(code, orderAmount, cartItems);

  if (!validation.valid) {
    return res.json({ success: false, error: validation.error });
  }

  const coupon = validation.coupon;

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discountAmount = coupon.discountValue;
  }

  // Increment currentUses
  await pb.collection('coupons').update(coupon.id, {
    currentUses: (coupon.currentUses || 0) + 1,
  });

  const newTotal = Math.max(0, orderAmount - discountAmount);

  logger.info(`Coupon applied: ${code}, discount: ₹${discountAmount}, new total: ₹${newTotal}`);

  res.json({
    success: true,
    discountAmount: Math.round(discountAmount * 100) / 100,
    newTotal: Math.round(newTotal * 100) / 100,
  });
});

export default router;