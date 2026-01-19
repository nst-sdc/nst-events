import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';

export default function PrivacyPolicy() {
    return (
        <View style={styles.container}>
            <AppHeader title="Privacy Policy" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.heading}>1. Data Collection</Text>
                <Text style={styles.paragraph}>
                    We collect information such as your name, email address, and usage data to provide and improve our services.
                </Text>

                <Text style={styles.heading}>2. Use of Information</Text>
                <Text style={styles.paragraph}>
                    The information we collect is used to personalize your experience, improve our app, and communicate with you about updates and services.
                </Text>

                <Text style={styles.heading}>3. Data Protection</Text>
                <Text style={styles.paragraph}>
                    We implement a variety of security measures to maintain the safety of your personal information.
                </Text>

                <Text style={styles.heading}>4. Third-Party Disclosure</Text>
                <Text style={styles.paragraph}>
                    We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
                </Text>

                <Text style={styles.heading}>5. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If there are any questions regarding this privacy policy, you may contact us using the information below.
                </Text>

                <View style={styles.footerSpacer} />
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Created & Managed by NST-SDC</Text>
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
        color: PALETTE.primaryBlue,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    footerSubText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
    },
});
