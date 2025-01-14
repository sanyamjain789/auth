// // src/screens/LoginScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { sendOTP, verifyOTP } from '../services/otpService';
// import { getUserSession, setUserSession, invalidatePreviousSession, setUserSessionInFirestore } from '../services/sessionService';

// const LoginScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSession, setOtpSession] = useState(null);

//   const handleSendOTP = async () => {
//     if (!phoneNumber || phoneNumber.length < 10) {
//       Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
//       return;
//     }

//     try {
//       // Invalidate previous session if any
//       await invalidatePreviousSession(phoneNumber);

//       const sessionId = await sendOTP(phoneNumber);
//       setOtpSession(sessionId);
//       Alert.alert('OTP Sent', 'Check your phone for the OTP.');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to send OTP. Please try again.');
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otpSession || !otp) {
//       Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
//       return;
//     }

//     try {
//       const isVerified = await verifyOTP(otpSession, otp);
//       if (isVerified) {
//         // OTP verified, log user in
//         const sessionData = {
//           phoneNumber,
//           sessionId: otpSession, // Store session ID
//         };

//         // Set user session locally and in Firestore
//         await setUserSession(sessionData);
//         await setUserSessionInFirestore(phoneNumber, otpSession);

//         navigation.replace('Dashboard');
//       } else {
//         Alert.alert('Invalid OTP', 'The OTP entered is incorrect.');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to verify OTP. Please try again.');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
//       <TextInput
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//         style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }}
//       />
//       <Button title="Send OTP" onPress={handleSendOTP} />

//       {otpSession && (
//         <>
//           <TextInput
//             placeholder="Enter OTP"
//             value={otp}
//             onChangeText={setOtp}
//             keyboardType="number-pad"
//             style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 20 }}
//           />
//           <Button title="Verify OTP" onPress={handleVerifyOTP} />
//         </>
//       )}
//     </View>
//   );
// };

// export default LoginScreen;
// src/screens/LoginScreen.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { sendOTP, verifyOTP } from '../services/otpService';
// import firestore from '@react-native-firebase/firestore';
// import DeviceInfo from 'react-native-device-info';

// const LoginScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSession, setOtpSession] = useState(null);
//   const [isMounted, setIsMounted] = useState(true);
//   const [resendTimer, setResendTimer] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//     }

//     return () => {
//       clearInterval(timer);
//       setIsMounted(false);
//     };
//   }, [resendTimer]);

//   const handleSendOTP = async () => {
//     if (!phoneNumber || phoneNumber.length < 10) {
//       Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
//       return;
//     }

//     try {
//       const userDoc = await firestore().collection('users').doc(phoneNumber).get();
//       if (!userDoc.exists) {
//         Alert.alert('User Not Found', 'This phone number is not registered.');
//         navigation.navigate('Register', { phoneNumber });
//         return;
//       }

//       const sessionId = await sendOTP(phoneNumber);
//       setOtpSession(sessionId);
//       if (isMounted) {
//         Alert.alert('OTP Sent', 'Check your phone for the OTP.');
//         setResendTimer(90);
//       }
//     } catch (error) {
//       console.error(error);
//       if (isMounted) {
//         Alert.alert('Error', 'Failed to send OTP. Please try again.');
//       }
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otpSession || !otp) {
//       Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
//       return;
//     }

//     try {
//       const isVerified = await verifyOTP(otpSession, otp);
//       if (isVerified) {
//         const deviceId = DeviceInfo.getUniqueId();
//         await firestore().collection('users').doc(phoneNumber).update({ deviceId });
//         Alert.alert('Success', 'OTP verified successfully!');
//         navigation.replace('Dashboard');
//       } else {
//         Alert.alert('Invalid OTP', 'The OTP entered is incorrect.');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to verify OTP. Please try again.');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
//       <TextInput
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//         style={{
//           borderWidth: 1,
//           borderColor: '#ccc',
//           borderRadius: 5,
//           padding: 10,
//           marginBottom: 10,
//         }}
//       />
//       <Button
//         title={resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Send OTP'}
//         onPress={handleSendOTP}
//         disabled={resendTimer > 0}
//       />

//       {otpSession && (
//         <>
//           <TextInput
//             placeholder="Enter OTP"
//             value={otp}
//             onChangeText={setOtp}
//             keyboardType="number-pad"
//             style={{
//               borderWidth: 1,
//               borderColor: '#ccc',
//               borderRadius: 5,
//               padding: 10,
//               marginTop: 20,
//             }}
//           />
//           <Button title="Verify OTP" onPress={handleVerifyOTP} />
//         </>
//       )}
//     </View>
//   );
// };

// export default LoginScreen;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { sendOTP, verifyOTP } from '../services/otpService';
// import firestore from '@react-native-firebase/firestore';
// import uuid from 'react-native-uuid'; // Install with `npm install react-native-uuid`

// const LoginScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSession, setOtpSession] = useState(null);
//   const [resendTimer, setResendTimer] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setInterval(() => {
//         setResendTimer(prev => prev - 1);
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [resendTimer]);

//   const handleSendOTP = async () => {
//     if (!phoneNumber || phoneNumber.length < 10) {
//       Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
//       return;
//     }

//     try {
//       const userDoc = await firestore().collection('users').doc(phoneNumber).get();
//       if (!userDoc.exists) {
//         Alert.alert('User Not Found', 'This phone number is not registered.');
//         navigation.navigate('Register', { phoneNumber });
//         return;
//       }

//       const sessionId = await sendOTP(phoneNumber);
//       setOtpSession(sessionId);
//       Alert.alert('OTP Sent', 'Check your phone for the OTP.');
//       setResendTimer(90); // Set timer for resend
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       Alert.alert('Error', 'Failed to send OTP. Please try again.');
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otpSession || !otp) {
//       Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
//       return;
//     }

//     try {
//       const isVerified = await verifyOTP(otpSession, otp);
//       if (isVerified) {
//         // Generate a unique session ID
//         const sessionId = uuid.v4();

//         // Update Firestore with the active session ID
//         await firestore().collection('users').doc(phoneNumber).update({
//           activeSessionId: sessionId,
//         });

//         Alert.alert('Success', 'OTP verified successfully!');
//         navigation.replace('Dashboard', { sessionId }); // Pass sessionId to Dashboard
//       } else {
//         Alert.alert('Invalid OTP', 'The OTP entered is incorrect.');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       Alert.alert('Error', 'Failed to verify OTP. Please try again.');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
//       <TextInput
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//         style={{
//           borderWidth: 1,
//           borderColor: '#ccc',
//           borderRadius: 5,
//           padding: 10,
//           marginBottom: 10,
//         }}
//       />
//       <Button
//         title={resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Send OTP'}
//         onPress={handleSendOTP}
//         disabled={resendTimer > 0}
//       />

//       {otpSession && (
//         <>
//           <TextInput
//             placeholder="Enter OTP"
//             value={otp}
//             onChangeText={setOtp}
//             keyboardType="number-pad"
//             style={{
//               borderWidth: 1,
//               borderColor: '#ccc',
//               borderRadius: 5,
//               padding: 10,
//               marginTop: 20,
//             }}
//           />
//           <Button title="Verify OTP" onPress={handleVerifyOTP} />
//         </>
//       )}
//     </View>
//   );
// };

// export default LoginScreen;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { sendOTP, verifyOTP } from '../services/otpService';
// import firestore from '@react-native-firebase/firestore';
// import uuid from 'react-native-uuid'; // Install with `npm install react-native-uuid`

// const LoginScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSession, setOtpSession] = useState(null);
//   const [resendTimer, setResendTimer] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setInterval(() => {
//         setResendTimer(prev => prev - 1);
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [resendTimer]);

//   const handleSendOTP = async () => {
//     if (!phoneNumber || phoneNumber.length < 10) {
//       Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
//       return;
//     }

//     try {
//       const userDoc = await firestore().collection('users').doc(phoneNumber).get();
//       if (!userDoc.exists) {
//         Alert.alert('User Not Found', 'This phone number is not registered.');
//         navigation.navigate('Register', { phoneNumber });
//         return;
//       }

//       const sessionId = await sendOTP(phoneNumber);
//       setOtpSession(sessionId);
//       Alert.alert('OTP Sent', 'Check your phone for the OTP.');
//       setResendTimer(90); // Set timer for resend
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       Alert.alert('Error', 'Failed to send OTP. Please try again.');
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otpSession || !otp) {
//       Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
//       return;
//     }

//     try {
//       const isVerified = await verifyOTP(otpSession, otp);
//       if (isVerified) {
//         // Generate a unique session ID
//         const sessionId = uuid.v4();

//         // Update Firestore with the active session ID
//         await firestore().collection('users').doc(phoneNumber).update({
//           activeSessionId: sessionId,
//         });

//         Alert.alert('Success', 'OTP verified successfully!');
//         navigation.replace('Dashboard', { sessionId }); // Pass sessionId to Dashboard
//       } else {
//         Alert.alert('Invalid OTP', 'The OTP entered is incorrect.');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       Alert.alert('Error', 'Failed to verify OTP. Please try again.');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
//       <TextInput
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//         style={{
//           borderWidth: 1,
//           borderColor: '#ccc',
//           borderRadius: 5,
//           padding: 10,
//           marginBottom: 10,
//         }}
//       />
//       <Button
//         title={resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Send OTP'}
//         onPress={handleSendOTP}
//         disabled={resendTimer > 0}
//       />

//       {otpSession && (
//         <>
//           <TextInput
//             placeholder="Enter OTP"
//             value={otp}
//             onChangeText={setOtp}
//             keyboardType="number-pad"
//             style={{
//               borderWidth: 1,
//               borderColor: '#ccc',
//               borderRadius: 5,
//               padding: 10,
//               marginTop: 20,
//             }}
//           />
//           <Button title="Verify OTP" onPress={handleVerifyOTP} />
//         </>
//       )}
//     </View>
//   );
// };

// export default LoginScreen;

// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const LoginScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const handleLogin = async () => {
//     if (!phoneNumber) {
//       Alert.alert('Error', 'Please enter your phone number.');
//       return;
//     }

//     try {
//       // Simulate login (you can replace with actual authentication)
//       await AsyncStorage.setItem('userPhoneNumber', phoneNumber); // Save phoneNumber locally
//       navigation.replace('Dashboard', { phoneNumber });
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Login Failed', 'Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
//       <TextInput
//         placeholder="Enter phone number"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         style={{
//           borderWidth: 1,
//           borderColor: '#ccc',
//           borderRadius: 5,
//           padding: 10,
//           marginBottom: 10,
//         }}
//       />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// };

// export default LoginScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { sendOTP, verifyOTP } from '../services/otpService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid'; // Install with `npm install react-native-uuid`

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSession, setOtpSession] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }

    try {
      const userDoc = await firestore().collection('users').doc(phoneNumber).get();
      if (!userDoc.exists) {
        Alert.alert('User Not Found', 'This phone number is not registered.');
        navigation.navigate('Register', { phoneNumber });
        return;
      }

      const sessionId = await sendOTP(phoneNumber);
      setOtpSession(sessionId);
      Alert.alert('OTP Sent', 'Check your phone for the OTP.');
      setResendTimer(90); // Set timer for resend
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpSession || !otp) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      return;
    }

    try {
      const isVerified = await verifyOTP(otpSession, otp);
      if (isVerified) {
        // Generate a unique session ID
        const sessionId = uuid.v4();

        // Update Firestore with the active session ID
        await firestore().collection('users').doc(phoneNumber).update({
          activeSessionId: sessionId,
        });

        // Save phone number and sessionId to AsyncStorage
        await AsyncStorage.setItem('userPhoneNumber', phoneNumber);
        await AsyncStorage.setItem('sessionId', sessionId);

        Alert.alert('Success', 'OTP verified successfully!');
        navigation.replace('Dashboard', { sessionId }); // Pass sessionId to Dashboard
      } else {
        Alert.alert('Invalid OTP', 'The OTP entered is incorrect.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
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
      <Button
        title={resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Send OTP'}
        onPress={handleSendOTP}
        disabled={resendTimer > 0}
      />

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
