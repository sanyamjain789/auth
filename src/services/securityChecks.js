// src/services/securityChecks.js
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

export const checkRootedDevice = async () => DeviceInfo.isRooted();

export const checkVPNUsage = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isVpn;
};
