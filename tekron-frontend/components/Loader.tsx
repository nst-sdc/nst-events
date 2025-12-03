import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { PALETTE } from '../constants/theme';

interface LoaderProps {
    visible: boolean;
}

export function Loader({ visible }: LoaderProps) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <View style={styles.loaderBox}>
                    <ActivityIndicator size="large" color={PALETTE.pinkLight} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(28, 32, 68, 0.7)', // Navy dark with opacity
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderBox: {
        padding: 24,
        backgroundColor: PALETTE.purpleDeep,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
});
