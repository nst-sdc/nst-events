import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { BACKEND_URL } from '../constants/config';
import { storage } from '../utils/storage';

interface FeedbackModalProps {
    visible: boolean;
    onClose: () => void;
    eventId: string;
    eventName: string;
}

export const FeedbackModal = ({ visible, onClose, eventId, eventName }: FeedbackModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            const token = await storage.getItem('token');
            const res = await fetch(`${BACKEND_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ eventId, rating, comment })
            });

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setRating(0);
                    setComment('');
                }, 2000);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={PALETTE.navyDark} />
                    </TouchableOpacity>

                    {submitted ? (
                        <View style={styles.successContainer}>
                            <Ionicons name="checkmark-circle" size={64} color={PALETTE.purpleDeep} />
                            <Text style={styles.successText}>Thank you for your feedback!</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.title}>Rate {eventName}</Text>

                            <View style={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                        <Ionicons
                                            name={star <= rating ? "star" : "star-outline"}
                                            size={40}
                                            color={PALETTE.purpleDeep}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Optional comment..."
                                placeholderTextColor={PALETTE.navyLight}
                                multiline
                                numberOfLines={4}
                                value={comment}
                                onChangeText={setComment}
                            />

                            <TouchableOpacity
                                style={[styles.submitButton, rating === 0 && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={rating === 0 || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={PALETTE.purpleDeep} />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.l,
    },
    content: {
        backgroundColor: PALETTE.creamLight,
        borderRadius: RADIUS.l,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.m,
        right: SPACING.m,
    },
    title: {
        ...TYPOGRAPHY.h2,
        color: PALETTE.navyDark,
        marginBottom: SPACING.l,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: SPACING.s,
        marginBottom: SPACING.l,
    },
    input: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: PALETTE.purpleLight,
    },
    submitButton: {
        backgroundColor: PALETTE.creamDark,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.m,
        width: '100%',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitButtonText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.purpleDeep,
    },
    successContainer: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    successText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.navyDark,
        marginTop: SPACING.m,
    },
});
