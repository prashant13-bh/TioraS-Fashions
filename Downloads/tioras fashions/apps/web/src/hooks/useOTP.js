
import { useState } from 'react';
import apiServerClient from '@/lib/apiServerClient';
import { toast } from 'sonner';

export const useOTP = () => {
  const [otpId, setOtpId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async (phoneNumber, email) => {
    setIsLoading(true);
    try {
      const response = await apiServerClient.fetch('/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send OTP');
      }

      const data = await response.json();
      setOtpId(data.otpId);
      toast.success('OTP sent successfully');
      return { success: true, otpId: data.otpId, expiresIn: data.expiresIn };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otpCode, phoneNumber, email) => {
    setIsLoading(true);
    try {
      const response = await apiServerClient.fetch('/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpId, otpCode, phoneNumber, email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid OTP');
      }

      const data = await response.json();
      return { success: true, userId: data.userId, token: data.token };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOTP, verifyOTP, isLoading, otpId };
};
