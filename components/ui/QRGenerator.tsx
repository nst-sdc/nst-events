import { Colors, Layout, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRGeneratorProps {
    value: string;
    size?: number;
    color?: string;
    backgroundColor?: string;
    style?: ViewStyle;
}

export function QRGenerator({
    value,
    size = 200,
    color = Colors.dark.primary,
    backgroundColor = 'transparent',
    style,
}: QRGeneratorProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.qrContainer}>
                <QRCode
                    value={value}
                    size={size}
                    color={color}
                    backgroundColor={backgroundColor === 'transparent' ? 'white' : backgroundColor} // QRCode doesn't support transparent bg well for scanning
                />
                {/* Pixel corners for style */}
                <View style={[styles.corner, styles.topLeft, { borderColor: color }]} />
                <View style={[styles.corner, styles.topRight, { borderColor: color }]} />
                <View style={[styles.corner, styles.bottomLeft, { borderColor: color }]} />
                <View style={[styles.corner, styles.bottomRight, { borderColor: color }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrContainer: {
        padding: Spacing.m,
        backgroundColor: '#FFF', // QR codes need high contrast
        borderRadius: Layout.radius.s,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 15,
        height: 15,
        borderWidth: 3,
        backgroundColor: 'transparent',
    },
    topLeft: {
        top: -4,
        left: -4,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: -4,
        right: -4,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: -4,
        left: -4,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: -4,
        right: -4,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
});
