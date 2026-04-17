import { Router } from 'express';
import PDFDocument from 'pdfkit';
import pb from '../utils/pocketbaseClient.js';
import razorpay from '../utils/razorpay.js';
import { verifyRazorpaySignature, generateOrderNumber, generateReturnId } from '../utils/crypto.js';
import { pocketbaseAuth } from '../middleware/pocketbase-auth.js';
import { sendReturnConfirmationEmail } from '../utils/email-sender.js';
import logger from '../utils/logger.js';

const router = Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await pb.collection('users').getOne(req.pocketbaseUserId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    throw new Error('Failed to verify admin status');
  }
};

// POST /orders/create - Create new order
router.post('/create', pocketbaseAuth, async (req, res) => {
  const { items, shippingAddress, billingAddress, shippingMethod, subtotal, tax, totalAmount } = req.body;

  // Input validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required and must not be empty' });
  }

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    return res.status(400).json({ error: 'shippingAddress object is required' });
  }

  if (!billingAddress || typeof billingAddress !== 'object') {
    return res.status(400).json({ error: 'billingAddress object is required' });
  }

  if (!shippingMethod) {
    return res.status(400).json({ error: 'shippingMethod is required' });
  }

  if (typeof subtotal !== 'number' || subtotal < 0) {
    return res.status(400).json({ error: 'subtotal must be a non-negative number' });
  }

  if (typeof tax !== 'number' || tax < 0) {
    return res.status(400).json({ error: 'tax must be a non-negative number' });
  }

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({ error: 'totalAmount must be a positive number' });
  }

  // Generate unique order number
  const orderNumber = generateOrderNumber();

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // Convert to paise
    currency: 'INR',
    receipt: orderNumber,
  });

  // Create order record in PocketBase
  const order = await pb.collection('orders').create({
    userId: req.pocketbaseUserId,
    orderNumber,
    items: JSON.stringify(items),
    shippingAddress: JSON.stringify(shippingAddress),
    billingAddress: JSON.stringify(billingAddress),
    shippingMethod,
    subtotal,
    tax,
    totalAmount,
    status: 'Pending',
    paymentStatus: 'Pending',
    razorpayOrderId: razorpayOrder.id,
    orderDate: new Date().toISOString(),
  });

  logger.info(`Order created: ${orderNumber} (ID: ${order.id})`);

  res.json({
    orderId: order.id,
    orderNumber,
    razorpayOrderId: razorpayOrder.id,
  });
});

// POST /orders/verify-payment - Verify Razorpay payment
router.post('/verify-payment', pocketbaseAuth, async (req, res) => {
  const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

  // Input validation
  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  if (!razorpayPaymentId) {
    return res.status(400).json({ error: 'razorpayPaymentId is required' });
  }

  if (!razorpaySignature) {
    return res.status(400).json({ error: 'razorpaySignature is required' });
  }

  // Fetch order from PocketBase
  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    return res.status(400).json({ error: 'Order not found' });
  }

  // Verify signature
  const isValid = verifyRazorpaySignature(
    order.razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    process.env.RAZORPAY_SECRET_KEY
  );

  if (!isValid) {
    return res.json({ success: false, error: 'Payment verification failed' });
  }

  // Update order status
  await pb.collection('orders').update(orderId, {
    status: 'Confirmed',
    paymentStatus: 'Confirmed',
    razorpayPaymentId,
    paymentDate: new Date().toISOString(),
  });

  logger.info(`Payment verified for order: ${order.orderNumber}`);

  res.json({ success: true, orderId });
});

// GET /orders/:orderId - Get order details
router.get('/:orderId', pocketbaseAuth, async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Authorization check: user can view own orders, admin can view all
  const user = await pb.collection('users').getOne(req.pocketbaseUserId);
  if (user.role !== 'admin' && order.userId !== req.pocketbaseUserId) {
    return res.status(403).json({ error: 'Unauthorized to view this order' });
  }

  // Parse JSON fields
  const orderData = {
    ...order,
    items: JSON.parse(order.items),
    shippingAddress: JSON.parse(order.shippingAddress),
    billingAddress: JSON.parse(order.billingAddress),
  };

  res.json(orderData);
});

// GET /orders/user/:userId - Get all orders for a user
router.get('/user/:userId', pocketbaseAuth, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Authorization check: user can only view own orders, admin can view all
  const user = await pb.collection('users').getOne(req.pocketbaseUserId);
  if (user.role !== 'admin' && userId !== req.pocketbaseUserId) {
    return res.status(403).json({ error: 'Unauthorized to view these orders' });
  }

  const orders = await pb.collection('orders').getFullList({
    filter: `userId = "${userId}"`,
    sort: '-orderDate',
  });

  // Parse JSON fields for each order
  const parsedOrders = orders.map((order) => ({
    ...order,
    items: JSON.parse(order.items),
    shippingAddress: JSON.parse(order.shippingAddress),
    billingAddress: JSON.parse(order.billingAddress),
  }));

  res.json(parsedOrders);
});

// PUT /orders/:orderId/status - Update order status (admin-only)
router.put('/:orderId/status', pocketbaseAuth, isAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status, notes, trackingNumber } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Prepare update data
  const updateData = { status };

  if (notes) {
    const timestamp = new Date().toISOString();
    const existingNotes = order.notes ? JSON.parse(order.notes) : [];
    existingNotes.push({ timestamp, note: notes });
    updateData.notes = JSON.stringify(existingNotes);
  }

  if (trackingNumber) {
    updateData.trackingNumber = trackingNumber;
  }

  const updatedOrder = await pb.collection('orders').update(orderId, updateData);

  logger.info(`Order status updated: ${order.orderNumber} -> ${status}`);

  // Parse JSON fields
  const orderData = {
    ...updatedOrder,
    items: JSON.parse(updatedOrder.items),
    shippingAddress: JSON.parse(updatedOrder.shippingAddress),
    billingAddress: JSON.parse(updatedOrder.billingAddress),
    notes: updatedOrder.notes ? JSON.parse(updatedOrder.notes) : [],
  };

  res.json(orderData);
});

// POST /orders/:orderId/invoice - Generate and save invoice PDF
router.post('/:orderId/invoice', pocketbaseAuth, async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Authorization check
  const user = await pb.collection('users').getOne(req.pocketbaseUserId);
  if (user.role !== 'admin' && order.userId !== req.pocketbaseUserId) {
    return res.status(403).json({ error: 'Unauthorized to generate invoice for this order' });
  }

  // Parse order data
  const items = JSON.parse(order.items);
  const shippingAddress = JSON.parse(order.shippingAddress);
  const customer = await pb.collection('users').getOne(order.userId);

  // Generate invoice number
  const invoiceNumber = `INV-${order.orderNumber}`;

  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  });

  // Set response headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceNumber}.pdf"`);

  // Pipe PDF to response
  doc.pipe(res);

  // Header
  doc.fontSize(24).font('Helvetica-Bold').text('TioraS Fashions Studio', { align: 'center' });
  doc.fontSize(10).font('Helvetica').text('Custom Fashion & Embroidery Designs', { align: 'center' });
  doc.text('Email: info@tiorasfashions.com | Phone: +91-XXXXXXXXXX', { align: 'center' });
  doc.moveDown();

  // Invoice details
  doc.fontSize(12).font('Helvetica-Bold').text('INVOICE', { align: 'left' });
  doc.fontSize(10).font('Helvetica');
  doc.text(`Invoice Number: ${invoiceNumber}`, { align: 'left' });
  doc.text(`Order Number: ${order.orderNumber}`, { align: 'left' });
  doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, { align: 'left' });
  doc.moveDown();

  // Customer details
  doc.fontSize(11).font('Helvetica-Bold').text('Bill To:', { align: 'left' });
  doc.fontSize(10).font('Helvetica');
  doc.text(`${customer.name || 'Customer'}`);
  doc.text(`Email: ${customer.email}`);
  doc.text(`Phone: ${customer.phone || 'N/A'}`);
  doc.moveDown();

  // Shipping address
  doc.fontSize(11).font('Helvetica-Bold').text('Shipping Address:', { align: 'left' });
  doc.fontSize(10).font('Helvetica');
  doc.text(`${shippingAddress.street || ''}`);
  doc.text(`${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zipCode || ''}`);
  doc.text(`${shippingAddress.country || ''}`);
  doc.moveDown();

  // Items table
  doc.fontSize(11).font('Helvetica-Bold').text('Order Items:', { underline: true });
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const col1 = 50;
  const col2 = 250;
  const col3 = 350;
  const col4 = 450;

  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Item', col1, tableTop);
  doc.text('Quantity', col2, tableTop);
  doc.text('Price', col3, tableTop);
  doc.text('Total', col4, tableTop);

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let yPosition = tableTop + 25;
  doc.font('Helvetica');

  items.forEach((item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    doc.fontSize(9).text(item.name || 'Item', col1, yPosition);
    doc.text(item.quantity || 1, col2, yPosition);
    doc.text(`₹${(item.price || 0).toFixed(2)}`, col3, yPosition);
    doc.text(`₹${itemTotal.toFixed(2)}`, col4, yPosition);
    yPosition += 20;
  });

  doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
  yPosition += 10;

  // Price summary
  doc.fontSize(10).font('Helvetica');
  doc.text(`Subtotal: ₹${order.subtotal.toFixed(2)}`, col3, yPosition);
  yPosition += 15;
  doc.text(`Shipping: ₹${(order.totalAmount - order.subtotal - order.tax).toFixed(2)}`, col3, yPosition);
  yPosition += 15;
  doc.text(`Tax: ₹${order.tax.toFixed(2)}`, col3, yPosition);
  yPosition += 15;

  doc.font('Helvetica-Bold').fontSize(11);
  doc.text(`Total: ₹${order.totalAmount.toFixed(2)}`, col3, yPosition);

  doc.moveDown(2);

  // Payment info
  doc.fontSize(10).font('Helvetica-Bold').text('Payment Information:', { underline: true });
  doc.font('Helvetica');
  doc.text(`Payment Method: Razorpay`);
  doc.text(`Payment Status: ${order.paymentStatus}`);
  if (order.razorpayPaymentId) {
    doc.text(`Payment ID: ${order.razorpayPaymentId}`);
  }

  doc.moveDown(2);

  // Footer
  doc.fontSize(9).text('Thank you for your business!', { align: 'center' });
  doc.text('For inquiries, contact: info@tiorasfashions.com', { align: 'center' });

  // Finalize PDF
  doc.end();

  logger.info(`Invoice generated for order: ${order.orderNumber}`);
});

// POST /orders/:orderId/cancel - Cancel order within 24 hours
router.post('/:orderId/cancel', pocketbaseAuth, async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Authorization check: user can cancel own orders, admin can cancel any
  const user = await pb.collection('users').getOne(req.pocketbaseUserId);
  if (user.role !== 'admin' && order.userId !== req.pocketbaseUserId) {
    return res.status(403).json({ error: 'Unauthorized to cancel this order' });
  }

  // Check if order is within 24 hours
  const orderDate = new Date(order.orderDate);
  const now = new Date();
  const hoursDifference = (now - orderDate) / (1000 * 60 * 60);

  if (hoursDifference > 24) {
    return res.json({ success: false, error: 'Cancellation window expired' });
  }

  // Initiate refund via Razorpay
  let refundId = null;
  if (order.razorpayPaymentId && order.paymentStatus === 'Confirmed') {
    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: Math.round(order.totalAmount * 100), // Convert to paise
    });
    refundId = refund.id;
  }

  // Update order status
  await pb.collection('orders').update(orderId, {
    status: 'Cancelled',
    refundId: refundId || null,
    cancelledDate: new Date().toISOString(),
  });

  logger.info(`Order cancelled: ${order.orderNumber}, Refund ID: ${refundId}`);

  res.json({ success: true, refundId });
});

// POST /returns/request - Request return for order
router.post('/:orderId/returns/request', pocketbaseAuth, async (req, res) => {
  const { orderId } = req.params;
  const { items, reason, comments, returnShippingMethod = 'standard' } = req.body;

  // Input validation
  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required and must not be empty' });
  }

  if (!reason || typeof reason !== 'string') {
    return res.status(400).json({ error: 'reason is required and must be a string' });
  }

  // Fetch order from PocketBase
  const order = await pb.collection('orders').getOne(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Authorization check: user can only request return for own orders
  if (order.userId !== req.pocketbaseUserId) {
    return res.status(403).json({ error: 'Unauthorized to request return for this order' });
  }

  // Check if order is eligible for return (within 30 days)
  const orderDate = new Date(order.orderDate);
  const now = new Date();
  const daysDifference = (now - orderDate) / (1000 * 60 * 60 * 24);

  if (daysDifference > 30) {
    return res.json({ success: false, error: 'Return window expired (30 days)' });
  }

  // Calculate refund amount
  const orderItems = JSON.parse(order.items);
  let refundAmount = 0;
  items.forEach((returnItem) => {
    const orderItem = orderItems.find((oi) => oi.id === returnItem.id);
    if (orderItem) {
      refundAmount += (orderItem.price || 0) * (returnItem.quantity || 1);
    }
  });

  // Generate return ID
  const returnId = generateReturnId();

  // Create return record in PocketBase
  const returnRecord = await pb.collection('returns').create({
    orderId,
    userId: req.pocketbaseUserId,
    returnId,
    items: JSON.stringify(items),
    reason,
    comments: comments || null,
    returnShippingMethod,
    refundAmount,
    status: 'Initiated',
    refundStatus: 'Pending',
    createdAt: new Date().toISOString(),
  });

  // Fetch user for email
  const user = await pb.collection('users').getOne(req.pocketbaseUserId);

  // Send return confirmation email
  await sendReturnConfirmationEmail(user.email, {
    returnId,
    orderId: order.orderNumber,
    refundAmount,
    reason,
  });

  logger.info(`Return requested: ${returnId} for order ${order.orderNumber}`);

  res.json({
    success: true,
    returnId: returnRecord.id,
    returnNumber: returnId,
    refundAmount,
  });
});

// GET /returns/:returnId - Get return details
router.get('/returns/:returnId', pocketbaseAuth, async (req, res) => {
  const { returnId } = req.params;

  if (!returnId) {
    return res.status(400).json({ error: 'returnId is required' });
  }

  const returnRecord = await pb.collection('returns').getOne(returnId);

  if (!returnRecord) {
    throw new Error('Return record not found');
  }

  // Authorization check: user can only view own returns
  if (returnRecord.userId !== req.pocketbaseUserId) {
    return res.status(403).json({ error: 'Unauthorized to view this return' });
  }

  // Parse JSON fields
  const returnData = {
    id: returnRecord.id,
    orderId: returnRecord.orderId,
    returnId: returnRecord.returnId,
    status: returnRecord.status,
    refundStatus: returnRecord.refundStatus,
    refundAmount: returnRecord.refundAmount,
    items: JSON.parse(returnRecord.items),
    reason: returnRecord.reason,
    comments: returnRecord.comments,
    returnShippingMethod: returnRecord.returnShippingMethod,
    createdAt: returnRecord.createdAt,
    updatedAt: returnRecord.updated,
  };

  res.json(returnData);
});

// GET /admin/orders - Get all orders (admin-only)
router.get('/admin/all', pocketbaseAuth, isAdmin, async (req, res) => {
  const { status, startDate, endDate, searchQuery, page = 1, limit = 20 } = req.query;

  let filter = '';

  if (status) {
    filter += `status = "${status}"`;
  }

  if (startDate && endDate) {
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();
    if (filter) filter += ' && ';
    filter += `orderDate >= "${start}" && orderDate <= "${end}"`;
  }

  if (searchQuery) {
    if (filter) filter += ' && ';
    filter += `(orderNumber ~ "${searchQuery}" || id ~ "${searchQuery}")`;
  }

  const options = {
    sort: '-orderDate',
    page: parseInt(page),
    perPage: parseInt(limit),
  };

  if (filter) {
    options.filter = filter;
  }

  const result = await pb.collection('orders').getList(options.page, options.perPage, options);

  // Parse JSON fields for each order
  const orders = result.items.map((order) => ({
    ...order,
    items: JSON.parse(order.items),
    shippingAddress: JSON.parse(order.shippingAddress),
    billingAddress: JSON.parse(order.billingAddress),
  }));

  res.json({
    orders,
    pagination: {
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    },
  });
});

export default router;