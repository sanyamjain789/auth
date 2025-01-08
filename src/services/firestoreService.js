import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('users');

export const getUserByPhoneNumber = async (phoneNumber) => {
  const snapshot = await usersCollection.where('phoneNumber', '==', phoneNumber).get();
  return snapshot.empty ? null : snapshot.docs[0].data();
};

export const registerNewUser = async (userData) => {
  await usersCollection.add(userData);
};
