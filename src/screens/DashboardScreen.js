//npm install @react-navigation/native @react-navigation/stack
// npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
//npm install react-native-reanimated react-native-get-random-values
// npm install axios
// npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
//>> npm install axios react-native-device-info react-native-netinfo
//>> npm install react-native-geolocation-service
//npm install --force
// src/screens/DashboardScreen.js
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { auth } from '../utils/firebaseConfig';

const DashboardScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default DashboardScreen;
