import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, GRADIENTS } from '../../../constants/theme';
import { BACKEND_URL } from '../../../constants/config';
import { useAuthStore } from '../../../context/authStore';
import { storage } from '../../../utils/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportItemScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
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
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Stubs since we aren't handling real file upload in this snippet context
    const uploadImage = async (uri: string) => {
        return uri;
    };

    const handleSubmit = async () => {
        if (!title.trim() || !location.trim()) {
            Alert.alert('Missing Details', 'Please provide at least a title and location.');
            return;
        }

        setSubmitting(true);
        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadImage(image);
            }

            const token = await storage.getItem('token');
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
                Alert.alert('Success', 'Item reported successfully!', [
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
            <LinearGradient
                colors={GRADIENTS.header}
                style={[styles.headerGradient, { paddingTop: insets.top }]}
            >
                <View style={styles.headerContentWrapper}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={PALETTE.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Report Item</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* TYPE SELECTOR */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>I am reporting a...</Text>
                        <View style={styles.typeSelector}>
                            <TouchableOpacity
                                style={[styles.typeButton, type === 'LOST' && styles.activeLostButton]}
                                onPress={() => setType('LOST')}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="search"
                                    size={24}
                                    color={type === 'LOST' ? PALETTE.white : PALETTE.gray}
                                />
                                <Text style={[styles.typeText, type === 'LOST' && styles.activeTypeText]}>Lost Item</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.typeButton, type === 'FOUND' && styles.activeFoundButton]}
                                onPress={() => setType('FOUND')}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="gift"
                                    size={24}
                                    color={type === 'FOUND' ? PALETTE.white : PALETTE.gray}
                                />
                                <Text style={[styles.typeText, type === 'FOUND' && styles.activeTypeText]}>Found Item</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* CATEGORY */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        category === cat && (type === 'LOST' ? styles.activeCategoryChipLost : styles.activeCategoryChipFound)
                                    ]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        category === cat && styles.activeCategoryText
                                    ]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* DETAILS FORM */}
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>What is it?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Blue Water Bottle"
                                placeholderTextColor={PALETTE.gray}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Where was it?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Room 304, Cafeteria"
                                placeholderTextColor={PALETTE.gray}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Any distinctive features, brands, or marks..."
                                placeholderTextColor={PALETTE.gray}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Photo (Optional)</Text>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.placeholder}>
                                        <View style={styles.cameraIconCircle}>
                                            <Ionicons name="camera" size={28} color={PALETTE.primaryBlue} />
                                        </View>
                                        <Text style={styles.placeholderText}>Tap to upload photo</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        <LinearGradient
                            colors={type === 'LOST' ? [PALETTE.primaryOrange, PALETTE.orangeDark] : [PALETTE.primaryBlue, PALETTE.blueDark]}
                            style={styles.submitGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {submitting ? (
                                <ActivityIndicator color={PALETTE.white} />
                            ) : (
                                <Text style={styles.submitButtonText}>SUBMIT REPORT</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgSuperLight,
    },
    headerGradient: {
        paddingBottom: SPACING.l,
        borderBottomLeftRadius: RADIUS.xl,
        borderBottomRightRadius: RADIUS.xl,
        ...SHADOWS.medium,
        zIndex: 10,
    },
    headerContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    backButton: {
        padding: SPACING.s,
    },
    content: {
        padding: SPACING.l,
        paddingBottom: SPACING.xl * 2,
    },
    section: {
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.darkGray,
        marginBottom: SPACING.m,
        fontWeight: 'bold',
    },
    typeSelector: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.s,
        borderRadius: RADIUS.l,
        backgroundColor: PALETTE.white,
        borderWidth: 2,
        borderColor: PALETTE.lightGray,
        gap: 8,
        ...SHADOWS.small,
    },
    activeLostButton: {
        backgroundColor: PALETTE.primaryOrange,
        borderColor: PALETTE.primaryOrange,
    },
    activeFoundButton: {
        backgroundColor: PALETTE.primaryBlue,
        borderColor: PALETTE.primaryBlue,
    },
    typeText: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.gray,
        fontSize: 16,
        fontWeight: '600',
    },
    activeTypeText: {
        color: PALETTE.white,
        fontWeight: 'bold',
    },
    label: {
        ...TYPOGRAPHY.body,
        color: PALETTE.darkGray,
        marginBottom: SPACING.s,
        fontWeight: '600',
    },
    categoryScroll: {
        flexGrow: 0,
    },
    categoryChip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 10,
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.round,
        marginRight: SPACING.s,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
    },
    activeCategoryChipLost: {
        backgroundColor: PALETTE.orangeLight,
        borderColor: PALETTE.primaryOrange,
    },
    activeCategoryChipFound: {
        backgroundColor: PALETTE.blueLight,
        borderColor: PALETTE.primaryBlue,
    },
    categoryText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.gray,
        fontSize: 14,
    },
    activeCategoryText: {
        color: PALETTE.darkGray,
        fontWeight: 'bold',
    },
    formCard: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.l,
        padding: SPACING.m,
        ...SHADOWS.small,
        marginBottom: SPACING.l,
    },
    inputGroup: {
        marginBottom: SPACING.m,
    },
    input: {
        backgroundColor: PALETTE.bgSuperLight,
        padding: SPACING.m,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        borderColor: PALETTE.lightGray,
        ...TYPOGRAPHY.body,
        color: PALETTE.navyDark,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    imagePicker: {
        height: 160,
        backgroundColor: PALETTE.bgSuperLight,
        borderRadius: RADIUS.m,
        borderWidth: 2,
        borderColor: PALETTE.lightGray,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
    },
    cameraIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: PALETTE.blueLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    placeholderText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.gray,
    },
    submitButton: {
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        marginTop: SPACING.s,
        ...SHADOWS.medium,
    },
    submitGradient: {
        paddingVertical: SPACING.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.white,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
