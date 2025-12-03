import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface IndoorMapProps {
    imageUrl?: string;
    markers?: { x: number; y: number; label: string }[];
}

export const IndoorMap = ({ imageUrl, markers = [] }: IndoorMapProps) => {
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

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={composed}>
                <Animated.View style={[styles.mapWrapper, animatedStyle]}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.mapImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.placeholderMap}>
                            <Ionicons name="map" size={64} color={PALETTE.purpleLight} />
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
                            <Ionicons name="location" size={24} color={PALETTE.pinkLight} />
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
    mapImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.6,
    },
    placeholderMap: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.6,
        backgroundColor: PALETTE.purpleDeep,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: PALETTE.purpleMedium,
    },
    placeholderText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.purpleLight,
        marginTop: SPACING.m,
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
    },
    markerLabel: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: SPACING.s,
        paddingVertical: 2,
        borderRadius: RADIUS.s,
        marginTop: 2,
    },
    markerText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    controls: {
        position: 'absolute',
        bottom: SPACING.xl,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.round,
    },
    hintText: {
        color: 'white',
        fontSize: 12,
    },
});
