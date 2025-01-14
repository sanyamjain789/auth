 //npm install @react-navigation/native @react-navigation/stack
// npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
//npm install react-native-reanimated react-native-get-random-values
// npm install axios
// npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
//>> npm install axios react-native-device-info react-native-netinfo
//>> npm install react-native-geolocation-service
//npm install --force
// src/screens/DashboardScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import { auth } from '../utils/firebaseConfig'; // Ensure this path is correct

// const DashboardScreen = ({ navigation }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(user => {
//       setCurrentUser(user);  // Set the current user to state
//     });

//     // Cleanup the listener when the component is unmounted
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     if (!currentUser) {
//       Alert.alert('No User', 'No user is currently signed in.');
//       return;
//     }

//     try {
//       await auth().signOut();
//       Alert.alert('Logged Out', 'You have been logged out successfully.');

//       // Reset the navigation stack to prevent going back to Dashboard
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Failed to log out.');
//       console.error(error);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>
//         {currentUser ? Welcome, ${currentUser.displayName || 'User'}! : 'Loading...'}
//       </Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default DashboardScreen;

// import React from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import { auth } from '../utils/firebaseConfig';

// const DashboardScreen = ({ navigation }) => {
//   const handleLogout = async () => {
//     try {
//       await auth().signOut();
//       Alert.alert('Logged Out', 'You have been logged out successfully.');
//       navigation.replace('Login');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to log out.');
//       console.error(error);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the Dashboard!</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default DashboardScreen;
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import auth from '@react-native-firebase/auth';

// const DashboardScreen = ({ navigation }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged((user) => {
//       if (user) {
//         setCurrentUser(user);
//       } else {
//         // No user is signed in, navigate to Login
//         navigation.replace('Login');
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, [navigation]);

//   const handleLogout = async () => {
//     if (!currentUser) {
//       Alert.alert('Error', 'No user currently signed in.');
//       return;
//     }

//     try {
//       await auth().signOut();
//       Alert.alert('Logged Out', 'You have been logged out successfully.');
//       navigation.replace('Login');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to log out.');
//       console.error(error);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the Dashboard!</Text>
//       {currentUser && (
//         <Text style={{ marginBottom: 20 }}>
//           Logged in as: {currentUser.phoneNumber || currentUser.email}
//         </Text>
//       )}
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default DashboardScreen;
// src/screens/DashboardScreen.js
// // src/screens/DashboardScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import DeviceInfo from 'react-native-device-info';
// import { checkVPNUsage } from '../services/securityChecks';

// const DashboardScreen = ({ navigation }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(async (user) => {
//       try {
//         if (user) {
//           const deviceId = DeviceInfo.getUniqueId();
//           const userDoc = await firestore().collection('users').doc(user.phoneNumber).get();

//           if (userDoc.exists && userDoc.data().deviceId !== deviceId) {
//             await auth().signOut();
//             Alert.alert('Session Expired', 'Logged in on another device.');
//             navigation.replace('Login');
//           } else {
//             setCurrentUser(user);

//             const isUsingVPN = await checkVPNUsage();
//             if (isUsingVPN) {
//               Alert.alert('VPN Detected', 'Please turn off VPN to use this app.');
//             }
//           }
//         } else {
//           navigation.replace('Login');
//         }
//       } catch (error) {
//         console.error('Error handling auth state:', error);
//       }
//     });

//     return () => unsubscribe();
//   }, [navigation]);

//   const handleLogout = async () => {
//     try {
//       const deviceId = DeviceInfo.getUniqueId();
//       await firestore().collection('users').doc(currentUser.phoneNumber).update({ deviceId: null });
//       await auth().signOut();
//       Alert.alert('Logged Out', 'You have been logged out successfully.');
//       navigation.replace('Login');
//     } catch (error) {
//       console.error('Logout error:', error);
//       Alert.alert('Error', 'Failed to log out.');
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the Dashboard!</Text>
//       {currentUser && (
//         <Text style={{ marginBottom: 20 }}>
//           Logged in as: {currentUser.phoneNumber || currentUser.email}
//         </Text>
//       )}
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default DashboardScreen;
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { checkVPNUsage } from '../services/securityChecks';

// const DashboardScreen = ({ navigation, user }) => {
//   const [sessionValid, setSessionValid] = useState(true);

//   useEffect(() => {
//     const checkSession = firestore()
//       .collection('users')
//       .doc(user.phoneNumber)
//       .onSnapshot(doc => {
//         const data = doc.data();
//         if (data.activeSessionId !== user.sessionId) {
//           setSessionValid(false);
//           Alert.alert('Session Expired', 'You have been logged out due to login on another device.');
//           handleLogout();
//         }
//       });

//     return () => checkSession();
//   }, [user]);

//   useEffect(() => {
//     const checkSecurity = async () => {
//       const isUsingVPN = await checkVPNUsage();
//       if (isUsingVPN) {
//         Alert.alert('Security Alert', 'VPN usage detected. Logging out.');
//         handleLogout();
//       }
//     };
//     checkSecurity();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await firestore().collection('users').doc(user.phoneNumber).update({ activeSessionId: null });
//       await auth().signOut();
//       navigation.replace('Login');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       Alert.alert('Error', 'Failed to log out.');
//     }
//   };

//   if (!sessionValid) return null;

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the Dashboard!</Text>
//       <Text style={{ marginBottom: 20 }}>Logged in as: {user.phoneNumber}</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// export default DashboardScreen;

import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ route, navigation }) => {
  const phoneNumber = route?.params?.phoneNumber;

  // Redirect to Login if phoneNumber is missing
  // React.useEffect(() => {
  //   if (!phoneNumber) {
  //     Alert.alert('Session Error', 'You have been logged out. Redirecting to login.');
  //     navigation.replace('Login');
  //   }
  // }, [phoneNumber]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userPhoneNumber'); // Clear saved phoneNumber
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {phoneNumber}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default DashboardScreen;
