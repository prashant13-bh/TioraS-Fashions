import 'dotenv/config';
import logger from './logger.js';

// Send return confirmation email
export const sendReturnConfirmationEmail = async (email, returnData) => {
  // Check if email service is configured
  if (!process.env.EMAIL_SERVICE_URL) {
    logger.warn('Email service not configured. Return confirmation email not sent.');
    return;
  }

  try {
    const response = await fetch(process.env.EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Return Initiated - ${returnData.returnId}`,
        html: `
          <h2>Return Confirmation</h2>
          <p>Your return request has been initiated successfully.</p>
          <p><strong>Return ID:</strong> ${returnData.returnId}</p>
          <p><strong>Order ID:</strong> ${returnData.orderId}</p>
          <p><strong>Refund Amount:</strong> ₹${returnData.refundAmount.toFixed(2)}</p>
          <p><strong>Reason:</strong> ${returnData.reason}</p>
          <p>We will process your return and initiate the refund within 5-7 business days.</p>
          <p>For more details, please visit your account dashboard.</p>
          <p>Thank you for your business!</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.status} ${response.statusText}`);
    }

    logger.info(`Return confirmation email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send return confirmation email: ${error.message}`);
    throw new Error(`Failed to send return confirmation email: ${error.message}`);
  }
};

// Send order status notification email
export const sendOrderStatusEmail = async (email, orderData) => {
  // Check if email service is configured
  if (!process.env.EMAIL_SERVICE_URL) {
    logger.warn('Email service not configured. Order status email not sent.');
    return;
  }

  try {
    const response = await fetch(process.env.EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Order Status Update - ${orderData.orderNumber}`,
        html: `
          <h2>Order Status Update</h2>
          <p>Your order status has been updated.</p>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Status:</strong> ${orderData.status}</p>
          <p><strong>Total Amount:</strong> ₹${orderData.totalAmount.toFixed(2)}</p>
          ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ''}
          <p>You can track your order in your account dashboard.</p>
          <p>Thank you for your business!</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.status} ${response.statusText}`);
    }

    logger.info(`Order status email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send order status email: ${error.message}`);
    throw new Error(`Failed to send order status email: ${error.message}`);
  }
};
