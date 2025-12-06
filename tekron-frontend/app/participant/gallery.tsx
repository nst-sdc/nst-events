import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_URL } from '../../constants/config';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

interface Photo {
    id: string;
    url: string;
    uploader: {
        name: string;
    };
    caption?: string;
}

export default function PhotoGallery() {
    const { logout } = useAuthStore();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/photos/public`);
            if (res.ok) {
                const data = await res.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setIsUploading(true);
            try {
                const token = await SecureStore.getItemAsync('token');
                // In a real app, upload to S3/Cloudinary and get URL. 
                // Here we simulate by sending base64 (not recommended for production but works for demo)
                const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;

                const res = await fetch(`${BACKEND_URL}/photos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        url: base64Img, // Storing base64 directly for simplicity in this demo
                        caption: 'Tekron Moment'
                    })
                });

                if (res.ok) {
                    Alert.alert('Success', 'Photo uploaded for moderation!');
                } else {
                    Alert.alert('Error', 'Failed to upload photo');
                }
            } catch (error) {
                console.error('Upload error:', error);
                Alert.alert('Error', 'Failed to upload photo');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const renderItem = ({ item }: { item: Photo }) => (
        <View style={styles.photoCard}>
            <Image source={{ uri: item.url }} style={styles.photo} resizeMode="cover" />
            <View style={styles.captionContainer}>
                <Text style={styles.uploaderName}>By {item.uploader.name}</Text>
                {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader
                title="Photo Wall"
                rightIcon="log-out-outline"
                onRightPress={logout}
            />

            <FlatList
                data={photos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                refreshing={isLoading}
                onRefresh={fetchPhotos}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No photos yet. Be the first!</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? (
                    <ActivityIndicator color={PALETTE.purpleDeep} />
                ) : (
                    <Ionicons name="camera" size={28} color={PALETTE.purpleDeep} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    listContent: {
        padding: SPACING.s,
    },
    photoCard: {
        flex: 1,
        margin: SPACING.s,
        backgroundColor: '#1a1a2e',
        borderRadius: RADIUS.m,
        overflow: 'hidden',
        height: 200,
    },
    photo: {
        width: '100%',
        height: 150,
    },
    captionContainer: {
        padding: SPACING.s,
    },
    uploaderName: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
        fontWeight: 'bold',
    },
    caption: {
        ...TYPOGRAPHY.caption,
        color: 'white',
        fontSize: 10,
    },
    fab: {
        position: 'absolute',
        bottom: SPACING.xl,
        right: SPACING.xl,
        backgroundColor: PALETTE.creamLight,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: 'white',
        ...TYPOGRAPHY.body,
    },
});
