import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/ui/Typography';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setSession } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                // Session update will trigger global routing in _layout.tsx
                await setSession(data.session);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <ThemedText variant="h1" style={styles.title}>TEKRON</ThemedText>
                    <ThemedText variant="body" style={styles.subtitle}>Event Management System</ThemedText>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        leftIcon="mail"
                        style={styles.input}
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        leftIcon="lock-closed"
                        style={styles.input}
                    />

                    {error && (
                        <ThemedText style={styles.error}>{error}</ThemedText>
                    )}

                    <Button
                        label="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        variant="glow"
                        style={styles.button}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Pure black
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxxl,
    },
    title: {
        fontSize: 48,
        color: '#00FFFF', // Neon Cyan
        textShadowColor: '#00FFFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        letterSpacing: 4,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Pixel-inspired fallback
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#00FF00', // Neon Green
        marginTop: Spacing.s,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 12,
        opacity: 0.8,
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: '#111111',
        borderColor: '#00FF00', // Neon Green border
        borderWidth: 1,
        color: '#FFFFFF',
    },
    button: {
        marginTop: Spacing.l,
        shadowColor: '#FF00FF', // Neon Purple glow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    error: {
        color: '#FF0000',
        textAlign: 'center',
        marginTop: Spacing.s,
        textShadowColor: '#FF0000',
        textShadowRadius: 5,
    },
});
