import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../../constants/theme';
import { AppHeader } from '../../../components/AppHeader';
import { BACKEND_URL } from '../../../constants/config';
import * as SecureStore from 'expo-secure-store';

export default function ReportItemScreen() {
    const router = useRouter();
    const [type, setType] = useState<'LOST' | 'FOUND'>('LOST');
    const [category, setCategory] = useState('OTHER');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const CATEGORIES = ['ELECTRONICS', 'CLOTHING', 'ACCESSORIES', 'DOCUMENTS', 'OTHER'];

    const handleSubmit = async () => {
        if (!title.trim() || !location.trim()) {
            Alert.alert('Error', 'Please fill in Title and Location');
            return;
        }

        setSubmitting(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch(`${BACKEND_URL}/lost-found/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    type,
                    title,
                    description,
                    location,
                    category
                })
            });

            if (res.ok) {
                Alert.alert('Success', 'Item reported successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error', 'Failed to report item');
            }
        } catch (error) {
            console.error('Error reporting item:', error);
            Alert.alert('Error', 'Failed to report item');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Report Item" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>I am reporting a...</Text>
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'LOST' && styles.activeTypeButton]}
                        onPress={() => setType('LOST')}
                    >
                        <Text style={[styles.typeText, type === 'LOST' && styles.activeTypeText]}>LOST ITEM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'FOUND' && styles.activeTypeButton]}
                        onPress={() => setType('FOUND')}
                    >
                        <Text style={[styles.typeText, type === 'FOUND' && styles.activeTypeText]}>FOUND ITEM</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryChip, category === cat && styles.activeCategoryChip]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[styles.categoryText, category === cat && styles.activeCategoryText]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.label}>What is it?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Blue Water Bottle"
                    placeholderTextColor={PALETTE.purpleLight}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Where was it lost/found?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Room 304, Cafeteria"
                    placeholderTextColor={PALETTE.purpleLight}
                    value={location}
                    onChangeText={setLocation}
                />

                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Any distinctive features..."
                    placeholderTextColor={PALETTE.purpleLight}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={PALETTE.navyDark} />
                    ) : (
                        <Text style={styles.submitButtonText}>SUBMIT REPORT</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.navyDark,
    },
    content: {
        padding: SPACING.l,
    },
    label: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.creamLight,
        marginBottom: SPACING.s,
        marginTop: SPACING.m,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginBottom: SPACING.l,
    },
    typeButton: {
        flex: 1,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.purpleLight,
        alignItems: 'center',
    },
    activeTypeButton: {
        backgroundColor: PALETTE.pinkLight,
        borderColor: PALETTE.pinkLight,
    },
    typeText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.purpleLight,
        fontSize: 14,
    },
    activeTypeText: {
        color: PALETTE.navyDark,
    },
    input: {
        backgroundColor: PALETTE.purpleDeep,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        color: PALETTE.creamLight,
        borderWidth: 1,
        borderColor: PALETTE.purpleMedium,
        marginBottom: SPACING.s,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: PALETTE.creamLight,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    submitButtonText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.navyDark,
    },
    categoryScroll: {
        marginBottom: SPACING.l,
    },
    categoryChip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.purpleLight,
        marginRight: SPACING.s,
        backgroundColor: PALETTE.purpleDeep,
    },
    activeCategoryChip: {
        backgroundColor: PALETTE.pinkLight,
        borderColor: PALETTE.pinkLight,
    },
    categoryText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
    },
    activeCategoryText: {
        color: PALETTE.navyDark,
        fontWeight: 'bold',
    },
});
