// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegistrationScreen';
// import DashboardScreen from '../screens/DashboardScreen'; // Ensure proper import

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="Dashboard" component={DashboardScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegistrationScreen';
// import DashboardScreen from '../screens/DashboardScreen';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

// const Stack = createStackNavigator();

// const App = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(async user => {
//       if (user) {
//         const userDoc = await firestore().collection('users').doc(user.phoneNumber).get();
//         const sessionId = userDoc.data()?.activeSessionId;

//         // If a valid session exists, store it in state
//         setUser({ ...user, sessionId });
//       } else {
//         setUser(null);
//       }
//       if (initializing) setInitializing(false);
//     });

//     return subscriber; // Unsubscribe on unmount
//   }, []);

//   if (initializing) return null;

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {!user ? (
//           <>
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Register" component={RegisterScreen} />
//           </>
//         ) : (
//           <Stack.Screen name="Dashboard">
//             {props => <DashboardScreen {...props} user={user} />}
//           </Stack.Screen>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegistrationScreen';
// import DashboardScreen from '../screens/DashboardScreen';

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="Dashboard" component={DashboardScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RegisterScreen from '../screens/RegistrationScreen';
const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const phoneNumber = await AsyncStorage.getItem('userPhoneNumber');
      setIsLoggedIn(!!phoneNumber);
    };
    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Dashboard' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        < Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
