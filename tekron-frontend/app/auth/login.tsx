import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, RADIUS, TYPOGRAPHY, GRADIENTS, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../context/authStore';
import { Popup } from '../../components/Popup';

const { width } = Dimensions.get('window');

export default function Login() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { login, isLoading } = useAuthStore();

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Popup State
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState<'success' | 'error' | 'info'>('info');

    const showPopup = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupType(type);
        setPopupVisible(true);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showPopup('Missing Info', 'Please enter your codename (email) and secret key (password).', 'error');
            return;
        }

        try {
            await login(email, password);
        } catch (error: any) {
            showPopup('Access Denied', error.message || 'Invalid credentials.', 'error');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={GRADIENTS.header}
                style={[styles.headerBackground, { paddingTop: insets.top + SPACING.l, paddingBottom: SPACING.xl }]}
            >
                <View style={styles.headerContent}>
                    {/* Logo Removed */}
                    <Text style={styles.appTitle}>TEKRON 2.0</Text>
                    <Text style={styles.appSubtitle}>The Ultimate Tech Showdown</Text>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardContainer}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>Identity Verification</Text>
                        <Text style={styles.sectionSubtitle}>Enter your credentials to access the system.</Text>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Codename</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color={PALETTE.gray} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="user@tekron.com"
                                    placeholderTextColor={PALETTE.mediumGray}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Secret Key</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color={PALETTE.gray} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={PALETTE.mediumGray}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={PALETTE.gray} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password Removed */}

                        <TouchableOpacity onPress={handleLogin} activeOpacity={0.9} disabled={isLoading} style={styles.loginBtnContainer}>
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                style={styles.loginButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={PALETTE.white} />
                                ) : (
                                    <Text style={styles.loginButtonText}>JACK IN</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Register Link Removed */}

                </ScrollView>
            </KeyboardAvoidingView>

            <Popup
                visible={popupVisible}
                title={popupTitle}
                message={popupMessage}
                type={popupType}
                onClose={() => setPopupVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgSuperLight,
    },
    headerBackground: {
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        ...SHADOWS.medium,
        zIndex: 1,
    },
    headerContent: {
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: PALETTE.white,
        letterSpacing: 1,
        marginBottom: 4,
    },
    appSubtitle: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    keyboardContainer: {
        flex: 1,
        zIndex: 2,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xl,
    },
    formContainer: {
        // Removed floating card styling (white bg, shadow)
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.navyDark,
        textAlign: 'center',
        marginBottom: SPACING.xs,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        fontSize: 14,
    },
    formGroup: {
        marginBottom: SPACING.l,
    },
    label: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.darkGray,
        marginBottom: SPACING.s,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
        height: 50,
        // Added shadow to inputs since card is gone
        ...SHADOWS.small,
    },
    inputIcon: {
        paddingHorizontal: SPACING.m,
    },
    input: {
        flex: 1,
        height: '100%',
        color: PALETTE.navyDark,
        ...TYPOGRAPHY.body,
        fontSize: 16,
    },
    eyeIcon: {
        paddingHorizontal: SPACING.m,
    },
    loginBtnContainer: {
        marginTop: SPACING.m,
    },
    loginButton: {
        height: 56,
        borderRadius: RADIUS.l,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    loginButtonText: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.white,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
