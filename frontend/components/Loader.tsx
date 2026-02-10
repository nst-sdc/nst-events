import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { GradientSpinner } from './GradientSpinner';
import { PALETTE } from '../constants/theme';

interface LoaderProps {
    visible: boolean;
}

export function Loader({ visible }: LoaderProps) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <View style={styles.loaderBox}>
                    <GradientSpinner size={50} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderBox: {
        padding: 24,
        backgroundColor: PALETTE.white,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
