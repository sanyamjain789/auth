import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsoopE6CgE05YbaazpzJMISQaChlPo150",
  authDomain: "authpro-64125.firebaseapp.com",
  projectId: "authpro-64125",
  storageBucket: "authpro-64125.firebasestorage.app",
  messagingSenderId: "1035831132503",
  appId: "1:1035831132503:android:b40e4dd240884fc5637e12",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

auth().setPersistence(auth.Auth.Persistence.LOCAL);

export { firebase, auth, firestore };
