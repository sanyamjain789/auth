// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { sendOTP, verifyOTP } from '../services/otpService'; // Import OTP service
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSession, setOtpSession] = useState(null); // Store OTP session ID
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Handle sending OTP
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }

    try {
      // Check if user exists in Firestore
      const userDoc = await firestore().collection('users').doc(phoneNumber).get();
      if (!userDoc.exists) {
        // If user doesn't exist, navigate to registration page
        Alert.alert('User Not Found', 'This phone number is not registered.');
        navigation.navigate('Register', { phoneNumber }); // Pass phone number to registration page
        return;
      }

      // Call the OTP service to send OTP
      const sessionId = await sendOTP(phoneNumber);
      setOtpSession(sessionId); // Store OTP session ID
      if (isMounted) {
        Alert.alert('OTP Sent', 'Check your phone for the OTP.');
      }
    } catch (error) {
      console.error(error);
      if (isMounted) {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    }
  };

  // Handle verifying OTP
  const handleVerifyOTP = async () => {
    if (!otpSession || !otp) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      return;
    }

    try {
      // Verify OTP with the OTP service
      const isVerified = await verifyOTP(otpSession, otp);
      if (isVerified) {
        // OTP verified, redirect to dashboard
        if (isMounted) {
          Alert.alert('Success', 'OTP verified successfully!');
        }
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Invalid OTP', 'The OTP entered is incorrect.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Send OTP" onPress={handleSendOTP} />

      {otpSession && (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
              marginTop: 20,
            }}
          />
          <Button title="Verify OTP" onPress={handleVerifyOTP} />
        </>
      )}
    </View>
  );
};

export default LoginScreen;
