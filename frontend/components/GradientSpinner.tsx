import React, { useEffect } from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
    useAnimatedStyle,
    cancelAnimation,
} from 'react-native-reanimated';
import { GRADIENTS } from '../constants/theme';


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
    }, [rotation]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    return (
        <Animated.View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, animatedStyle]}>
            <Svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
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
            </Svg>
        </Animated.View>
    );
};
