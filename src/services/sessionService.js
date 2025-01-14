// src/services/sessionService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

// Firestore reference to track sessions
const usersCollection = firestore().collection('users');

// Check if user is logged in and return the session state
export const getUserSession = async () => {
  try {
    const userSession = await AsyncStorage.getItem('userSession');
    return userSession ? JSON.parse(userSession) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Set user session in AsyncStorage
export const setUserSession = async (userData) => {
  try {
    await AsyncStorage.setItem('userSession', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

// Clear user session from AsyncStorage
export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem('userSession');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// Check and invalidate session if another device logs in
export const invalidatePreviousSession = async (phoneNumber) => {
  try {
    const snapshot = await usersCollection.where('phoneNumber', '==', phoneNumber).get();
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const sessionId = userDoc.data().sessionId;

      // If session ID exists, invalidate the previous session by updating Firestore
      await usersCollection.doc(phoneNumber).update({
        sessionId: null, // Invalidate previous session
      });
    }
  } catch (error) {
    console.error('Error invalidating previous session:', error);
  }
};

// Set the session ID for the current user when they log in
export const setUserSessionInFirestore = async (phoneNumber, sessionId) => {
  try {
    await usersCollection.doc(phoneNumber).update({
      sessionId,
    });
  } catch (error) {
    console.error('Error setting session in Firestore:', error);
  }
};
