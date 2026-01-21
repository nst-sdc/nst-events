import { Platform } from 'react-native';

export const BACKEND_URL = Platform.OS === 'web'
    ? 'https://tekron-2-0-apk.onrender.com'
    : 'https://tekron-2-0-apk.onrender.com';

export const SOCKET_URL = BACKEND_URL;
console.log('Configured SOCKET_URL:', SOCKET_URL);
// Replace with your computer's local IP address
// You can find this in the Metro bundler logs (e.g., exp://192.168.1.5:8081 -> use http://192.168.1.5:3000)
