import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface IndoorMapProps {
    imageUrl?: string;
    imageSource?: any;
    markers?: { x: number; y: number; label: string }[];
}

export const IndoorMap = ({ imageUrl, imageSource, markers = [] }: IndoorMapProps) => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const source = imageSource || (imageUrl ? { uri: imageUrl } : null);

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={composed}>
                <Animated.View style={[styles.mapWrapper, animatedStyle]}>
                    {source ? (
                        <Image
                            source={source}
                            style={{
                                width: windowWidth,
                                height: windowHeight * 0.6,
                            }}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={[styles.placeholderMap, { width: windowWidth, height: windowHeight * 0.6 }]}>
                            <Ionicons name="map" size={64} color={PALETTE.primaryBlue} />
                            <Text style={styles.placeholderText}>No Map Available</Text>
                        </View>
                    )}

                    {markers.map((marker, index) => (
                        <View
                            key={index}
                            style={[
                                styles.marker,
                                { left: `${marker.x}%`, top: `${marker.y}%` }
                            ]}
                        >
                            <Ionicons name="location" size={24} color={PALETTE.primaryMint} />
                            <View style={styles.markerLabel}>
                                <Text style={styles.markerText}>{marker.label}</Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>
            </GestureDetector>

            <View style={styles.controls}>
                <Text style={styles.hintText}>Pinch to zoom • Drag to move</Text>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    mapWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Removed fixed dimensions from styles since they apply dynamically now
    placeholderMap: {
        backgroundColor: PALETTE.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
    },
    placeholderText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginTop: SPACING.m,
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
        width: 100,
        marginLeft: -50,
        marginTop: -30,
    },
    markerLabel: {
        backgroundColor: PALETTE.white,
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: RADIUS.s,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    markerText: {
        color: PALETTE.primaryBlue,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: SPACING.xl,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.round,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    hintText: {
        color: PALETTE.white,
        fontSize: 12,
        fontWeight: '500',
    },
});
