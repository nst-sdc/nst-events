import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, PALETTE } from '../../constants/theme';
import { useAuthStore } from '../../context/authStore';

export default function ParticipantLayout() {
    const { user } = useAuthStore();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    display: 'none',
                },
                tabBarActiveTintColor: PALETTE.primaryBlue,
                tabBarInactiveTintColor: PALETTE.mediumGray,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                    href: user?.approved ? '/participant/home' : null,
                    tabBarStyle: { display: 'none' },
                }}
                redirect={!user?.approved}
            />

            <Tabs.Screen
                name="alerts"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="notifications-outline" size={size} color={color} />
                    ),
                    href: user?.approved ? '/participant/alerts' : null,
                }}
                redirect={!user?.approved}
            />

            <Tabs.Screen
                name="navigation"
                options={{
                    title: 'Nav',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map-outline" size={size} color={color} />
                    ),
                    href: user?.approved ? '/participant/navigation' : null,
                }}
                redirect={!user?.approved}
            />

            <Tabs.Screen
                name="gallery"
                options={{
                    title: 'Gallery',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="images-outline" size={size} color={color} />
                    ),
                    href: user?.approved ? '/participant/gallery' : null,
                }}
                redirect={!user?.approved}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                    href: user?.approved ? '/participant/profile' : null,
                }}
                redirect={!user?.approved}
            />

            <Tabs.Screen
                name="map"
                options={{
                    tabBarStyle: { display: 'none' },
                    href: null,
                }}
            />

            <Tabs.Screen
                name="lost-found"
                options={{
                    href: null,
                    tabBarStyle: { display: 'none' },
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
