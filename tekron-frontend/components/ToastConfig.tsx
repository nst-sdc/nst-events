import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { PALETTE, TYPOGRAPHY, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';



const styles = StyleSheet.create({
    base: {
        width: '90%',
        maxWidth: 400,
        alignSelf: 'center',
        height: 80, // Bigger height
        backgroundColor: PALETTE.white,
        borderLeftWidth: 6, // Thicker accent
        borderRadius: RADIUS.m,
        ...SHADOWS.medium, // Professional shadow
        justifyContent: 'center',
        paddingHorizontal: SPACING.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: SPACING.m,
        flex: 1,
    },
    text1: {
        ...TYPOGRAPHY.h4,
        fontSize: 16,
        color: PALETTE.darkGray,
        marginBottom: 2,
    },
    text2: {
        ...TYPOGRAPHY.caption,
        fontSize: 14,
        color: PALETTE.mediumGray,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
});

export const toastConfig: ToastConfig = {
    success: (props) => (
        <View style={[styles.base, { borderLeftColor: PALETTE.primaryMint }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={24} color={PALETTE.primaryMint} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text1}>{props.text1}</Text>
                <Text style={styles.text2}>{props.text2}</Text>
            </View>
        </View>
    ),
    error: (props) => (
        <View style={[styles.base, { borderLeftColor: PALETTE.alertRed }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={24} color={PALETTE.alertRed} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text1}>{props.text1}</Text>
                <Text style={styles.text2}>{props.text2}</Text>
            </View>
        </View>
    ),
    info: (props) => (
        <View style={[styles.base, { borderLeftColor: PALETTE.primaryBlue }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={24} color={PALETTE.primaryBlue} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text1}>{props.text1}</Text>
                <Text style={styles.text2}>{props.text2}</Text>
            </View>
        </View>
    ),
    warning: (props) => (
        <View style={[styles.base, { borderLeftColor: PALETTE.primaryOrange }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="warning" size={24} color={PALETTE.primaryOrange} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.text1}>{props.text1}</Text>
                <Text style={styles.text2}>{props.text2}</Text>
            </View>
        </View>
    ),
};
