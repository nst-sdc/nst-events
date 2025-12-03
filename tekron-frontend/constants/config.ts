import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':')[0];

export const BACKEND_URL = localhost
    ? `http://${localhost}:3000`
    : 'http://10.254.204.96:3000'; 
