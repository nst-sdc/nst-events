import React from 'react';
import { View, Image, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDisplayProps {
    value: string;
    size?: number;
    color?: string;
    backgroundColor?: string;
}

export const QRCodeDisplay = ({ value, size = 200, color = 'black', backgroundColor = 'white' }: QRCodeDisplayProps) => {
    if (Platform.OS === 'web') {
        // Use a reliable QR code API for web to avoid adding new dependencies
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&color=${color.replace('#', '')}&bgcolor=${backgroundColor.replace('#', '')}`;
        return (
            <Image
                source={{ uri: qrUrl }}
                style={{ width: size, height: size }}
                resizeMode="contain"
            />
        );
    }

    return (
        <QRCode
            value={value}
            size={size}
            color={color}
            backgroundColor={backgroundColor}
        />
    );
};
