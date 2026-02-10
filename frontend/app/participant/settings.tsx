import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';

interface SettingsRowProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    isSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (val: boolean) => void;
    showChevron?: boolean;
    color?: string;
}

const SettingsRow = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    isSwitch,
    switchValue,
    onSwitchChange,
    showChevron = true,
    color = PALETTE.primaryBlue
}: SettingsRowProps) => {
    return (
        <TouchableOpacity
            style={styles.row}
            onPress={isSwitch ? undefined : onPress}
            disabled={isSwitch && !onPress}
            activeOpacity={isSwitch ? 1 : 0.7}
        >
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color === PALETTE.alertRed ? PALETTE.pinkLight : PALETTE.blueLight }]}>
                    <Ionicons name={icon} size={20} color={color} />
                </View>
                <View>
                    <Text style={[styles.rowTitle, { color: color === PALETTE.alertRed ? PALETTE.alertRed : PALETTE.darkGray }]}>{title}</Text>
                    {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
                </View>
            </View>

            <View style={styles.rowRight}>
                {value && <Text style={styles.rowValue}>{value}</Text>}
                {isSwitch ? (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ false: PALETTE.mediumGray, true: PALETTE.primaryBlue }}
                        thumbColor={PALETTE.white}
                    />
                ) : showChevron && (
                    <Ionicons name="chevron-forward" size={20} color={PALETTE.gray} />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default function Settings() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", style: "destructive", onPress: logout }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Settings" showBack={true} />

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.card}>
                    <SettingsRow
                        icon="notifications-outline"
                        title="Push Notifications"
                        subtitle="Receive updates about events"
                        isSwitch
                        switchValue={notificationsEnabled}
                        onSwitchChange={setNotificationsEnabled}
                    />
                </View>

                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.card}>
                    <SettingsRow
                        icon="information-circle-outline"
                        title="About App"
                        value="v2.0.0"
                        showChevron={false}
                    />
                    <View style={styles.divider} />
                    <SettingsRow
                        icon="shield-checkmark-outline"
                        title="Privacy Policy"
                        onPress={() => router.push('/participant/privacy')}
                    />
                    <View style={styles.divider} />
                    <SettingsRow
                        icon="document-text-outline"
                        title="Terms of Service"
                        onPress={() => router.push('/participant/terms')}
                    />
                </View>

                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.card}>
                    <SettingsRow
                        icon="log-out-outline"
                        title="Sign Out"
                        color={PALETTE.alertRed}
                        onPress={handleLogout}
                        showChevron={false}
                    />
                </View>

                <Text style={styles.versionText}>Tekron 2.0 • Build 2024.1</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgSuperLight,
    },
    content: {
        flex: 1,
        padding: SPACING.m,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
        fontSize: 14,
        color: PALETTE.gray,
        marginBottom: SPACING.s,
        marginTop: SPACING.m,
        marginLeft: SPACING.s,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        ...SHADOWS.small,
        marginBottom: SPACING.s,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
        backgroundColor: PALETTE.white,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.m,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowTitle: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: PALETTE.darkGray,
    },
    rowSubtitle: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
        marginTop: 2,
    },
    rowValue: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: PALETTE.bgSuperLight,
        marginLeft: SPACING.xl + SPACING.l,
    },
    versionText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        textAlign: 'center',
        marginTop: SPACING.xl,
    },
});
