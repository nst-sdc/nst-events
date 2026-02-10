import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../context/authStore';
import { BACKEND_URL } from '../constants/config';
import { storage } from '../utils/storage';

let Notifications: any;

// Only require expo-notifications if we are NOT in Expo Go on Android
// SDK 53+ removed support for remote notifications in Expo Go on Android
const isExpoGoAndroid = Platform.OS === 'android' && Constants.appOwnership === 'expo';

if (!isExpoGoAndroid) {
    try {
        Notifications = require('expo-notifications');
    } catch (error) {
        console.warn('expo-notifications could not be loaded', error);
    }
}

export const usePushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const [notification, setNotification] = useState<any | undefined>(); // Changed type to any for safety
    const notificationListener = useRef<any | undefined>(undefined);
    const responseListener = useRef<any | undefined>(undefined);
    const { user } = useAuthStore();

    const registerForPushNotificationsAsync = async () => {
        // Check if running in Expo Go on Android, which doesn't support push notifications in SDK 53+
        if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
            console.warn('Push notifications are not supported in Expo Go on Android (SDK 53+). Use a development build.');
            return;
        }

        // Web support for push notifications requires Service Workers and VAPID keys.
        // For this migration, we gracefully skip it on web to prevent runtime errors.
        if (Platform.OS === 'web') {
            console.log('Push notifications skipped on Web (requires VAPID configuration).');
            return;
        }

        let token;

        if (Platform.OS === 'android' && Notifications) {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice && Notifications) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }

            // Get the project ID from Expo config
            const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

            if (!projectId) {
                console.warn('Project ID not found in app config. Skipping push token registration.');
                return;
            }

            try {
                // Check if running in Expo Go on Android, which doesn't support push notifications in SDK 53+
                if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
                    console.warn('Push notifications are not supported in Expo Go on Android (SDK 53+). Use a development build.');
                    return;
                }

                token = (await Notifications.getExpoPushTokenAsync({
                    projectId,
                })).data;
                console.log('Expo Push Token:', token);
            } catch (e) {
                console.error('Error getting push token:', e);
            }
        } else {
            if (!Notifications) {
                console.warn("Notifications module not loaded");
            } else {
                console.log('Must use physical device for Push Notifications');
            }
        }

        return token;
    };

    const sendTokenToBackend = async (token: string) => {
        try {
            const authToken = await storage.getItem('token');
            if (!authToken) return;

            await fetch(`${BACKEND_URL}/notifications/push-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ pushToken: token })
            });
        } catch (error) {
            console.error('Error sending push token to backend:', error);
        }
    };

    useEffect(() => {
        // Check if running in Expo Go on Android, which doesn't support push notifications in SDK 53+
        if ((Platform.OS !== 'android' || Constants.appOwnership !== 'expo') && Notifications) {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
        }
    }, []);

    useEffect(() => {
        if (user) {
            registerForPushNotificationsAsync().then(token => {
                setExpoPushToken(token);
                if (token) {
                    sendTokenToBackend(token);
                }
            });

            if (Notifications) {
                notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
                    setNotification(notification);
                });

                responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
                    const data = response.notification.request.content.data;
                    console.log('Notification Response:', JSON.stringify(response, null, 2));


                    if (data?.alertId) {
                        // Navigate to alerts list
                        // Use a timeout to ensure navigation happens after any app initialization
                        setTimeout(() => {
                            // Validated: /participant/alerts exists
                            router.push('/participant/alerts');
                            console.log("Navigating to alert:", data.alertId);
                        }, 500);
                    } else if (data?.eventId) {
                        // Navigate to event details
                        setTimeout(() => {
                            router.push(`/participant/events/${data.eventId}` as any);
                            console.log("Navigating to event:", data.eventId);
                        }, 500);
                    }
                });
            }

            return () => {
                if (notificationListener.current) {
                    notificationListener.current.remove();
                }
                if (responseListener.current) {
                    responseListener.current.remove();
                }
            };
        }
    }, [user]);

    return {
        expoPushToken,
        notification
    };
};
