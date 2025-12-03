import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':')[0];

export const BACKEND_URL = localhost
    ? `http://${localhost}:3000`
    : 'http://10.254.204.96:3000';
// Replace with your computer's local IP address
// You can find this in the Metro bundler logs (e.g., exp://192.168.1.5:8081 -> use http://192.168.1.5:3000)
