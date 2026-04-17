import 'dotenv/config';
import logger from './logger.js';

// Send OTP via SMS using Twilio
export const sendOtpSms = async (phoneNumber, otpCode) => {
  // Check if Twilio credentials are available
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    logger.warn('Twilio credentials not configured. OTP SMS not sent.');
    return;
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`,
        Body: `Your OTP is: ${otpCode}. Valid for 10 minutes.`,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.status} ${response.statusText}`);
    }

    logger.info(`OTP SMS sent to ${phoneNumber}`);
  } catch (error) {
    logger.error(`Failed to send OTP SMS: ${error.message}`);
    throw new Error(`Failed to send OTP via SMS: ${error.message}`);
  }
};

// Send OTP via Email
export const sendOtpEmail = async (email, otpCode) => {
  // Check if email service is configured
  if (!process.env.EMAIL_SERVICE_URL) {
    logger.warn('Email service not configured. OTP email not sent.');
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
        subject: 'Your OTP Code',
        html: `
          <h2>OTP Verification</h2>
          <p>Your OTP code is: <strong>${otpCode}</strong></p>
          <p>This code is valid for 10 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.status} ${response.statusText}`);
    }

    logger.info(`OTP email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send OTP email: ${error.message}`);
    throw new Error(`Failed to send OTP via email: ${error.message}`);
  }
};
