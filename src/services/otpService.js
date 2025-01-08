// src/services/otpService.js
import axios from 'axios';
import { TWO_FACTOR_API_KEY } from '../utils/constants';

// Send OTP to the provided phone number
export const sendOTP = async (phoneNumber) => {
  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${phoneNumber}/AUTOGEN`
    );
    return response.data.Details; // Returns OTP session ID
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP.');
  }
};

// Verify the OTP with the session ID
export const verifyOTP = async (otpSession, otp) => {
  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${otpSession}/${otp}`
    );
    return response.data.Status === 'Success'; // Returns true if OTP is valid
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Invalid OTP.');
  }
};
