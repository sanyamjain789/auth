// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params; // Get the phone number passed from LoginScreen
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    if (!userName || !email) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      // Create a user profile in Firestore
      await firestore().collection('users').doc(phoneNumber).set({
        userName,
        email,
        phoneNumber,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Navigate back to login after registration
      Alert.alert('Registration Success', 'User registered successfully!');
      navigation.replace('Login'); // Redirect to login screen after registration
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <TextInput
        placeholder="User Name"
        value={userName}
        onChangeText={setUserName}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
