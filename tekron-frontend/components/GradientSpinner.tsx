import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    Easing,
    useAnimatedStyle,
    cancelAnimation,
    interpolate,
} from 'react-native-reanimated';
import { PALETTE, GRADIENTS } from '../constants/theme';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface GradientSpinnerProps {
    size?: number;
    strokeWidth?: number;
    colors?: readonly [string, string];
}

export const GradientSpinner = ({
    size = 60,
    strokeWidth = 4,
    colors = GRADIENTS.primary,
}: GradientSpinnerProps) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1200, // Slightly slower for elegance
                easing: Easing.linear,
            }),
            -1
        );
        return () => cancelAnimation(rotation);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <AnimatedSvg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={animatedStyle}
            >
                <Defs>
                    <LinearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={colors[0]} stopOpacity="1" />
                        <Stop offset="100%" stopColor={colors[1]} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#spinnerGradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={circumference * 0.2} // 20% gap
                    strokeLinecap="round"
                />
            </AnimatedSvg>
        </View>
    );
};
