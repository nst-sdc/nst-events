import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';

export default function TermsOfService() {
    return (
        <View style={styles.container}>
            <AppHeader title="Terms of Service" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.heading}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                    Welcome to Tekron. By using our application, you agree to comply with and be bound by the following terms and conditions of use.
                </Text>

                <Text style={styles.heading}>2. Acceptable Use</Text>
                <Text style={styles.paragraph}>
                    You agree to use our app only for lawful purposes. You must not use our app in any way that causes, or may cause, damage to the app or impairment of the availability or accessibility of the app.
                </Text>

                <Text style={styles.heading}>3. User Content</Text>
                <Text style={styles.paragraph}>
                    In these terms and conditions, &quot;your user content&quot; means material (including without limitation text, images, audio material, video material, and audio-visual material) that you submit to this app, for whatever purpose.
                </Text>

                <Text style={styles.heading}>4. Privacy</Text>
                <Text style={styles.paragraph}>
                    Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and disclose personal information.
                </Text>

                <Text style={styles.heading}>5. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions about these Terms of Service, please contact the administration.
                </Text>

                <View style={styles.footerSpacer} />
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Created & Managed by{' '}
                    <Text
                        style={styles.linkText}
                        onPress={() => Linking.openURL('https://www.linkedin.com/in/arpitsarang')}
                    >
                        Arpit
                    </Text>
                    {' '}&{' '}
                    <Text
                        style={styles.linkText}
                        onPress={() => Linking.openURL('https://www.linkedin.com/in/harshpatel101')}
                    >
                        Harsh
                    </Text>
                </Text>
                <Text style={styles.footerSubText}>© 2026 Tekron. All rights reserved.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    content: {
        padding: SPACING.l,
        paddingBottom: SPACING.xl * 2,
    },
    heading: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.s,
        marginTop: SPACING.m,
    },
    paragraph: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        marginBottom: SPACING.m,
        lineHeight: 22,
    },
    footerSpacer: {
        height: SPACING.xl,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: PALETTE.white,
        padding: SPACING.m,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: PALETTE.blueLight,
    },
    footerText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        marginBottom: 4,
    },
    linkText: {
        color: PALETTE.primaryBlue,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footerSubText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
    },
});
