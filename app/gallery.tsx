import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PixelBadge } from '@/components/ui/PixelBadge';
import { QRGenerator } from '@/components/ui/QRGenerator';
import { Toast } from '@/components/ui/Toast';
import { ThemedText } from '@/components/ui/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

export default function GalleryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [modalVisible, setModalVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{
                title: 'UI Kit Gallery',
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
            }} />

            <ScrollView contentContainerStyle={styles.content}>
                <Section title="Typography">
                    <ThemedText variant="h1">Heading 1</ThemedText>
                    <ThemedText variant="h2">Heading 2</ThemedText>
                    <ThemedText variant="h3">Heading 3</ThemedText>
                    <ThemedText variant="body">Body text. Lorem ipsum dolor sit amet.</ThemedText>
                    <ThemedText variant="caption">Caption text</ThemedText>
                    <ThemedText variant="button">Button text</ThemedText>
                </Section>

                <Section title="Buttons">
                    <View style={styles.row}>
                        <Button label="Filled" onPress={() => { }} />
                        <Button label="Glow" variant="glow" onPress={() => { }} />
                    </View>
                    <View style={styles.row}>
                        <Button label="Outline" variant="outline" onPress={() => { }} />
                        <Button label="Pixel" variant="pixel" onPress={() => { }} />
                    </View>
                    <View style={styles.row}>
                        <Button label="Ghost" variant="ghost" onPress={() => { }} />
                        <Button label="Loading" loading onPress={() => { }} />
                    </View>
                </Section>

                <Section title="Inputs">
                    <Input label="Text Input" placeholder="Enter text..." />
                    <Input label="With Icon" leftIcon="search" placeholder="Search..." />
                    <Input label="Error State" error="This field is required" />
                </Section>

                <Section title="Badges">
                    <View style={styles.row}>
                        <PixelBadge label="Default" />
                        <PixelBadge label="Success" status="success" />
                        <PixelBadge label="Warning" status="warning" />
                    </View>
                    <View style={styles.row}>
                        <PixelBadge label="Error" status="error" />
                        <PixelBadge label="Info" status="info" />
                    </View>
                </Section>

                <Section title="Cards">
                    <Card variant="glow" glowColor="primary">
                        <ThemedText variant="h3">Primary Glow Card</ThemedText>
                        <ThemedText>Content with neon glow.</ThemedText>
                    </Card>
                    <View style={{ height: 20 }} />
                    <Card variant="glow" glowColor="secondary">
                        <ThemedText variant="h3">Secondary Glow Card</ThemedText>
                        <ThemedText>Content with violet glow.</ThemedText>
                    </Card>
                    <View style={{ height: 20 }} />
                    <Card variant="outlined">
                        <ThemedText variant="h3">Outlined Card</ThemedText>
                        <ThemedText>Subtle border style.</ThemedText>
                    </Card>
                </Section>

                <Section title="QR Tools">
                    <View style={{ alignItems: 'center', marginBottom: Spacing.m }}>
                        <QRGenerator value="https://tekron.app" size={150} color={colors.primary} />
                        <ThemedText variant="caption" style={{ marginTop: Spacing.s }}>Generated QR Code</ThemedText>
                    </View>
                    <Button label="Open QR Scanner (Demo)" onPress={() => { }} variant="outline" />
                </Section>

                <Section title="Feedback">
                    <Button label="Show Modal" onPress={() => setModalVisible(true)} />
                    <View style={{ height: 10 }} />
                    <Button label="Show Toast" onPress={() => setToastVisible(true)} />
                </Section>
            </ScrollView>

            <Modal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="Example Modal"
            >
                <ThemedText>This is a pixel-styled modal dialog.</ThemedText>
                <View style={{ marginTop: Spacing.m }}>
                    <Button label="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>

            <Toast
                visible={toastVisible}
                onHide={() => setToastVisible(false)}
                message="This is a success toast notification."
                type="success"
            />
        </View>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <ThemedText variant="h2" style={styles.sectionTitle}>{title}</ThemedText>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: Spacing.l,
        paddingBottom: Spacing.xxxl,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        marginBottom: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
        paddingBottom: Spacing.xs,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.m,
        marginBottom: Spacing.m,
        flexWrap: 'wrap',
    },
});
