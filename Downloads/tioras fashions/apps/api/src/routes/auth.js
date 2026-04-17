import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import { generateOTP, generateAuthToken } from '../utils/auth.js';
import { sendOtpSms, sendOtpEmail } from '../utils/otp-sender.js';
import logger from '../utils/logger.js';

const router = Router();

// Validate phone number format (Indian format)
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[^\d]/g, ''));
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { phoneNumber, email } = req.body;

  // Input validation
  if (!phoneNumber && !email) {
    return res.status(400).json({ error: 'Either phoneNumber or email is required' });
  }

  if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  if (email && !validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Check for existing pending OTP
  let filter = '';
  if (phoneNumber) {
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    filter = `phoneNumber = "${cleanPhone}" && verified = false && expiresAt > "${new Date().toISOString()}"`;
  } else if (email) {
    filter = `email = "${email}" && verified = false && expiresAt > "${new Date().toISOString()}"`;
  }

  const existingOtp = await pb.collection('otpVerification').getFullList({
    filter,
  });

  if (existingOtp.length > 0) {
    return res.status(400).json({ error: 'OTP already sent. Please wait before requesting a new one.' });
  }

  // Generate OTP
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  // Store OTP in PocketBase
  const otpRecord = await pb.collection('otpVerification').create({
    phoneNumber: phoneNumber ? phoneNumber.replace(/[^\d]/g, '') : null,
    email: email || null,
    otpCode,
    verified: false,
    attempts: 0,
    expiresAt,
  });

  // Send OTP via SMS or Email
  if (phoneNumber) {
    await sendOtpSms(phoneNumber, otpCode);
  } else if (email) {
    await sendOtpEmail(email, otpCode);
  }

  logger.info(`OTP sent to ${phoneNumber || email}`);

  res.json({
    success: true,
    otpId: otpRecord.id,
    expiresIn: 600, // 10 minutes in seconds
  });
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { otpId, otpCode, phoneNumber, email } = req.body;

  // Input validation
  if (!otpId) {
    return res.status(400).json({ error: 'otpId is required' });
  }

  if (!otpCode) {
    return res.status(400).json({ error: 'otpCode is required' });
  }

  if (!phoneNumber && !email) {
    return res.status(400).json({ error: 'Either phoneNumber or email is required' });
  }

  // Fetch OTP record
  const otpRecord = await pb.collection('otpVerification').getOne(otpId);

  if (!otpRecord) {
    throw new Error('OTP record not found');
  }

  // Check if OTP is expired
  if (new Date(otpRecord.expiresAt) < new Date()) {
    throw new Error('OTP has expired');
  }

  // Check attempts
  if (otpRecord.attempts >= 3) {
    throw new Error('Maximum OTP verification attempts exceeded');
  }

  // Verify OTP code
  if (otpRecord.otpCode !== otpCode) {
    // Increment attempts
    await pb.collection('otpVerification').update(otpId, {
      attempts: otpRecord.attempts + 1,
    });
    return res.status(400).json({ error: 'Invalid OTP code' });
  }

  // Mark OTP as verified
  await pb.collection('otpVerification').update(otpId, {
    verified: true,
  });

  // Create or update user
  const cleanPhone = phoneNumber ? phoneNumber.replace(/[^\d]/g, '') : null;
  let user = null;

  // Try to find existing user by phone or email
  let existingUsers = [];
  if (cleanPhone) {
    existingUsers = await pb.collection('users').getFullList({
      filter: `phone = "${cleanPhone}"`,
    });
  } else if (email) {
    existingUsers = await pb.collection('users').getFullList({
      filter: `email = "${email}"`,
    });
  }

  if (existingUsers.length > 0) {
    user = existingUsers[0];
    // Update user with phone/email if needed
    if (cleanPhone && !user.phone) {
      user = await pb.collection('users').update(user.id, {
        phone: cleanPhone,
      });
    }
    if (email && !user.email) {
      user = await pb.collection('users').update(user.id, {
        email,
      });
    }
  } else {
    // Create new user
    user = await pb.collection('users').create({
      phone: cleanPhone,
      email: email || null,
      username: email ? email.split('@')[0] : `user_${cleanPhone}`,
      verified: true,
    });
  }

  // Generate auth token
  const authToken = generateAuthToken(user.id);

  logger.info(`OTP verified for user: ${user.id}`);

  res.json({
    success: true,
    userId: user.id,
    token: authToken,
  });
});

export default router;