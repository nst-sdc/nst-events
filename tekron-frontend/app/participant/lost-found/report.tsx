import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../../constants/theme';
import { AppHeader } from '../../../components/AppHeader';
import { BACKEND_URL } from '../../../constants/config';
import { useAuthStore } from '../../../context/authStore';
import * as SecureStore from 'expo-secure-store';

export default function ReportItemScreen() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [type, setType] = useState<'LOST' | 'FOUND'>('LOST');
    const [category, setCategory] = useState('OTHER');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const CATEGORIES = ['ELECTRONICS', 'CLOTHING', 'ACCESSORIES', 'DOCUMENTS', 'OTHER'];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

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
                    category,
                    image // Send base64 image
                })
            });

            if (res.ok) {
                Alert.alert('Success', 'Item reported successfully. If you uploaded a photo, it will be visible after approval.', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                if (res.status === 401) {
                    Alert.alert('Session Expired', 'Please login again', [
                        { text: 'OK', onPress: () => logout() }
                    ]);
                    return;
                }
                const errorData = await res.json();
                console.error('Report item error:', errorData);
                Alert.alert('Error', errorData.message || 'Failed to report item');
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
                <Text style={styles.sectionHeader}>I am reporting a...</Text>
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'LOST' && styles.activeTypeButton]}
                        onPress={() => setType('LOST')}
                    >
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color={type === 'LOST' ? PALETTE.primaryBlue : PALETTE.mediumGray}
                        />
                        <Text style={[styles.typeText, type === 'LOST' && styles.activeTypeText]}>LOST ITEM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'FOUND' && styles.activeTypeButton]}
                        onPress={() => setType('FOUND')}
                    >
                        <Ionicons
                            name="gift-outline"
                            size={20}
                            color={type === 'FOUND' ? PALETTE.primaryBlue : PALETTE.mediumGray}
                        />
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

                <View style={styles.formGroup}>
                    <Text style={styles.label}>What is it?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Blue Water Bottle"
                        placeholderTextColor={PALETTE.mediumGray}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Where was it lost/found?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Room 304, Cafeteria"
                        placeholderTextColor={PALETTE.mediumGray}
                        value={location}
                        onChangeText={setLocation}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Any distinctive features..."
                        placeholderTextColor={PALETTE.mediumGray}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Photo Proof (Optional)</Text>
                    <Text style={styles.helperText}>Upload a photo to help identify the item. Photos require approval.</Text>

                    {image ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                                <Ionicons name="close-circle" size={24} color={PALETTE.alertRed} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                            <Ionicons name="camera-outline" size={24} color={PALETTE.primaryBlue} />
                            <Text style={styles.uploadButtonText}>Upload Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={PALETTE.white} />
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
        backgroundColor: PALETTE.bgLight,
    },
    content: {
        padding: SPACING.l,
        paddingBottom: SPACING.xxl,
    },
    sectionHeader: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.primaryBlue,
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    label: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        color: PALETTE.darkGray,
        marginBottom: SPACING.xs,
        fontSize: 14,
    },
    helperText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        marginBottom: SPACING.s,
    },
    formGroup: {
        marginBottom: SPACING.m,
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
        backgroundColor: PALETTE.white,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.s,
    },
    activeTypeButton: {
        borderColor: PALETTE.primaryBlue,
        backgroundColor: PALETTE.blueLight,
    },
    typeText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.mediumGray,
        fontSize: 13,
    },
    activeTypeText: {
        color: PALETTE.primaryBlue,
    },
    input: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        color: PALETTE.darkGray,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        fontSize: 14,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: PALETTE.primaryBlue,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        alignItems: 'center',
        marginTop: SPACING.l,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
        fontSize: 16,
    },
    categoryScroll: {
        marginBottom: SPACING.l,
    },
    categoryChip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.round,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        marginRight: SPACING.s,
        backgroundColor: PALETTE.white,
    },
    activeCategoryChip: {
        backgroundColor: PALETTE.primaryBlue,
        borderColor: PALETTE.primaryBlue,
    },
    categoryText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.mediumGray,
        fontSize: 12,
    },
    activeCategoryText: {
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.primaryBlue,
        borderStyle: 'dashed',
        borderRadius: RADIUS.m,
        backgroundColor: PALETTE.blueSuperLight,
        gap: SPACING.s,
    },
    uploadButtonText: {
        color: PALETTE.primaryBlue,
        fontWeight: '600',
    },
    imagePreviewContainer: {
        position: 'relative',
        borderRadius: RADIUS.m,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: PALETTE.mediumGray,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        backgroundColor: PALETTE.lightGray,
    },
    removeImageBtn: {
        position: 'absolute',
        top: SPACING.s,
        right: SPACING.s,
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.round,
    }
});
