import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate auth token (simple JWT-like token)
export const generateAuthToken = (userId) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    })
  ).toString('base64');

  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'your-secret-key')
    .update(`${header}.${payload}`)
    .digest('base64');

  return `${header}.${payload}.${signature}`;
};
