import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME, PALETTE } from '../../constants/theme';
import { useAuthStore } from '../../context/authStore';

export default function ParticipantLayout() {
    const { user } = useAuthStore();

    // If not approved, we might want to show only the map or redirect
    // But since we have a specific route for map (/participant/map), 
    // and the index.tsx handles the redirection logic, we can keep this simple.
    // However, if the user is NOT approved, they shouldn't see the tabs.
    // The index.tsx should have redirected them to /participant/map if not approved.
    // But /participant/map is part of the stack in _layout.tsx, not this tab navigator.
    // Wait, the file structure implies /participant is a folder.
    // If we put _layout.tsx in /participant, it becomes a nested navigator.

    // Strategy:
    // 1. If user is approved, show Tabs.
    // 2. If user is NOT approved, they should be at /participant/map.
    //    If /participant/map is inside this layout, it will show tabs, which we don't want.
    //    So /participant/map should be OUTSIDE this tab layout or we hide tabs for it.

    // Current structure:
    // app/participant/home.tsx
    // app/participant/alerts.tsx
    // app/participant/navigation.tsx
    // app/participant/profile.tsx
    // app/participant/map.tsx

    // If I make app/participant/_layout.tsx a Tabs navigator, then 'map' will be a tab.
    // We want 'map' to be a standalone screen for unapproved users.
    // BUT 'map' is also used for unapproved users.

    // Solution:
    // We can use a 'group' for the tabs, e.g., app/participant/(tabs)/...
    // But to avoid refactoring folders right now, I will just hide the tab bar for the 'map' route
    // AND redirect unapproved users to 'map' if they try to access other tabs.
    // Actually, the root index.tsx already handles the redirect.
    // So if a user is not approved, they are sent to /participant/map.
    // We just need to make sure /participant/map doesn't show the tab bar.

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: THEME.light.tabBar,
                    borderTopColor: PALETTE.purpleLight,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: THEME.light.tabIconSelected,
                tabBarInactiveTintColor: THEME.light.tabIcon,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                    href: user?.approved ? '/participant/home' : null, // Hide from tab bar if not approved
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
                    // This is the Limited Access Map
                    // It should hide the tab bar
                    tabBarStyle: { display: 'none' },
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
