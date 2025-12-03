import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ThemedText } from './Typography';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    icon?: keyof typeof Ionicons.glyphMap; // Alias for leftIcon
}

export function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    style,
    secureTextEntry,
    icon,
    ...rest
}: InputProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPassword = secureTextEntry && !isPasswordVisible;
    const showPasswordToggle = secureTextEntry !== undefined;

    return (
        <View style={styles.container}>
            {label && (
                <ThemedText variant="caption" style={[styles.label, { color: isFocused ? colors.primary : colors.textSecondary }]}>
                    {label}
                </ThemedText>
            )}
            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error
                            ? colors.error
                            : isFocused
                                ? colors.primary
                                : colors.border,
                        borderBottomWidth: 2, // Neon underline style
                        borderWidth: 0,
                    },
                ]}
            >
                {(leftIcon || icon) && (
                    <Ionicons
                        name={leftIcon || icon}
                        size={20}
                        color={isFocused ? colors.primary : colors.textSecondary}
                        style={styles.iconLeft}
                    />
                )}
                <TextInput
                    style={[
                        styles.input,
                        Typography.body,
                        { color: colors.text },
                        style,
                    ]}
                    placeholderTextColor={colors.textMuted}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword}
                    {...rest}
                />
                {(rightIcon || showPasswordToggle) && (
                    <TouchableOpacity
                        onPress={showPasswordToggle ? () => setIsPasswordVisible(!isPasswordVisible) : onRightIconPress}
                        disabled={!showPasswordToggle && !onRightIconPress}
                    >
                        <Ionicons
                            name={showPasswordToggle ? (isPasswordVisible ? 'eye-off' : 'eye') : rightIcon}
                            size={20}
                            color={colors.textSecondary}
                            style={styles.iconRight}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <ThemedText style={[styles.error, { color: colors.error }]}>
                    {error}
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.l,
    },
    label: {
        marginBottom: Spacing.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.m,
        height: 56,
    },
    input: {
        flex: 1,
        height: '100%',
    },
    iconLeft: {
        marginRight: Spacing.s,
    },
    iconRight: {
        marginLeft: Spacing.s,
    },
    error: {
        fontSize: 12,
        marginTop: Spacing.xs,
    },
});
