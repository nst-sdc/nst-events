import React from 'react';
import { View, Text, StyleSheet, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { GradientButton } from '../../components/GradientButton';
import { PALETTE, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function Navigation() {
    const handleOpenMaps = () => {
        Linking.openURL('https://maps.app.goo.gl/m1h5Hkgu3LsUrnLd9');
    };

    const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
          iframe { width: 100%; height: 100%; border: 0; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d699.6968808032617!2d73.91286237932246!3d18.621136861780464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7007ca391d7%3A0x9da4723c416a8ee5!2sNewton%20school%20of%20technology%20pune%20campus!5e1!3m2!1sen!2sin!4v1764750287016!5m2!1sen!2sin"
          allowfullscreen=""
          loading="lazy"
        ></iframe>
      </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Event Location</Text>
                <View style={styles.locationInfo}>
                    <Text style={styles.building}>MCA Building</Text>
                    <Text style={styles.floor}>4th Floor</Text>
                </View>
            </View>

            <View style={styles.mapContainer}>
                {Platform.OS === 'web' ? (
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d699.6968808032617!2d73.91286237932246!3d18.621136861780464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7007ca391d7%3A0x9da4723c416a8ee5!2sNewton%20school%20of%20technology%20pune%20campus!5e1!3m2!1sen!2sin!4v1764750287016!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                    />
                ) : (
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: mapHtml }}
                        style={styles.webview}
                    />
                )}
            </View>

            <View style={styles.footer}>
                <GradientButton
                    title="Open in Google Maps"
                    onPress={handleOpenMaps}
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    header: {
        padding: SPACING.l,
        paddingTop: SPACING.xxl,
        backgroundColor: PALETTE.primaryBlue,
    },
    title: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.white,
        marginBottom: SPACING.m,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: SPACING.s,
    },
    building: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryOrange,
    },
    floor: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255,255,255,0.8)',
    },
    mapContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        opacity: 0.99,
    },
    footer: {
        padding: SPACING.l,
        backgroundColor: PALETTE.white,
        borderTopWidth: 1,
        borderTopColor: PALETTE.lightGray,
    },
    button: {
        marginBottom: SPACING.s,
    },
});
