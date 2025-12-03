import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

type Severity = 'info' | 'warning' | 'emergency';

export default function AnnouncementsScreen() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<Severity>('info');
    const [sending, setSending] = useState(false);
    const router = useRouter();

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setSending(true);
        try {
            const { error } = await supabase
                .from('alerts')
                .insert({
                    title,
                    message,
                    severity,
                    created_at: new Date().toISOString(),
                });

            if (error) throw error;

            Alert.alert('Success', 'Announcement sent successfully!');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'New Announcement', headerBackTitle: 'Back' }} />

            <View style={styles.form}>
                <Input
                    label="Title"
                    placeholder="e.g., Schedule Update"
                    value={title}
                    onChangeText={setTitle}
                />

                <Input
                    label="Message"
                    placeholder="Enter your message here..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100 }}
                />

                <ThemedText style={styles.label}>Severity Level</ThemedText>
                <View style={styles.severityContainer}>
                    {(['info', 'warning', 'emergency'] as const).map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.severityChip,
                                severity === s && styles.activeSeverity,
                                { borderColor: getSeverityColor(s) }
                            ]}
                            onPress={() => setSeverity(s)}
                        >
                            <ThemedText style={{ color: severity === s ? getSeverityColor(s) : '#888' }}>
                                {s.toUpperCase()}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button
                    label={sending ? "Sending..." : "Broadcast Announcement"}
                    onPress={handleSend}
                    variant="glow"
                    style={styles.button}
                    disabled={sending}
                />
            </View>
        </View>
    );
}

function getSeverityColor(severity: Severity) {
    switch (severity) {
        case 'emergency': return Colors.dark.error;
        case 'warning': return Colors.dark.warning;
        case 'info': return Colors.dark.info;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: Spacing.l,
    },
    form: {
        gap: Spacing.l,
    },
    label: {
        color: '#888',
        marginBottom: Spacing.s,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    severityContainer: {
        flexDirection: 'row',
        gap: Spacing.m,
    },
    severityChip: {
        flex: 1,
        padding: Spacing.m,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: '#111',
    },
    activeSeverity: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    button: {
        marginTop: Spacing.xl,
    }
});
