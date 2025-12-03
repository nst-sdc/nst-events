import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../context/authStore';
import { PALETTE, GRADIENTS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        // Mock login logic for demonstration
        // In a real app, you'd validate against a backend
        let role: 'admin' | 'participant' = 'participant';
        let approved = false;

        if (email.includes('admin')) {
            role = 'admin';
        } else if (email.includes('approved')) {
            approved = true;
        }

        await login(email, role, approved);
        // Navigation is handled by the index.tsx listener
    };

    const handleDemoLogin = async (role: 'admin' | 'participant', approved: boolean) => {
        const demoEmail = role === 'admin' ? 'admin@test.com' : (approved ? 'approved@test.com' : 'user@test.com');
        await login(demoEmail, role, approved);
    };

    return (
        <LinearGradient
            colors={[PALETTE.purpleDeep, PALETTE.purpleDark]}
            style={styles.container}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: PALETTE.creamLight }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: PALETTE.pinkLight }]}>Sign in to continue</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor={PALETTE.purpleMedium}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={PALETTE.purpleMedium}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
                        <LinearGradient
                            colors={GRADIENTS.secondary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.demoContainer}>
                        <Text style={styles.demoTitle}>Demo Login</Text>
                        <View style={styles.demoButtons}>
                            <TouchableOpacity
                                onPress={() => handleDemoLogin('admin', true)}
                                style={[styles.demoButton, { backgroundColor: PALETTE.purpleMedium }]}
                            >
                                <Text style={styles.demoButtonText}>Admin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDemoLogin('participant', true)}
                                style={[styles.demoButton, { backgroundColor: PALETTE.pinkDark }]}
                            >
                                <Text style={styles.demoButtonText}>Participant</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.l,
    },
    header: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        ...TYPOGRAPHY.h1,
        marginBottom: SPACING.s,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: SPACING.l,
        borderRadius: RADIUS.l,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputContainer: {
        marginBottom: SPACING.m,
    },
    label: {
        color: PALETTE.creamDark,
        marginBottom: SPACING.xs,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(28, 32, 68, 0.5)',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        color: PALETTE.creamLight,
        borderWidth: 1,
        borderColor: PALETTE.purpleDeep,
    },
    button: {
        marginTop: SPACING.m,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        alignItems: 'center',
    },
    buttonText: {
        color: PALETTE.navyDark,
        fontWeight: 'bold',
        fontSize: 16,
    },
    demoContainer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    demoTitle: {
        color: PALETTE.creamDark,
        marginBottom: SPACING.m,
        fontSize: 14,
        fontWeight: '600',
    },
    demoButtons: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    demoButton: {
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        borderRadius: RADIUS.m,
    },
    demoButtonText: {
        color: PALETTE.creamLight,
        fontWeight: 'bold',
        fontSize: 12,
    },
});
