import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { useAuthStore } from '../../context/authStore';
import { BACKEND_URL } from '../../constants/config';
import { storage } from '../../utils/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface Photo {
    id: string;
    url: string;
    uploader: {
        name: string;
    };
    caption?: string;
}

export default function PhotoGallery() {
    const { width } = useWindowDimensions();
    const COLUMN_COUNT = 2;
    const ITEM_WIDTH = (width - (SPACING.l * 2) - SPACING.m) / COLUMN_COUNT;
    const { logout } = useAuthStore();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const insets = useSafeAreaInsets();

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
                const token = await storage.getItem('token');
                const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;

                const res = await fetch(`${BACKEND_URL}/photos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        url: base64Img,
                        caption: 'Tekron Moment'
                    })
                });

                if (res.ok) {
                    Alert.alert('Success', 'Your photo has been submitted for approval.');
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

    const downloadPhoto = async (photoUrl: string) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant permission to save photos to your gallery.');
                return;
            }

            const filename = photoUrl.split('/').pop() || `photo_${Date.now()}.jpg`;
            const fileUri = `${(FileSystem as any).cacheDirectory}${filename}`;

            const { uri } = await FileSystem.downloadAsync(photoUrl, fileUri);
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert('Saved', 'Photo saved to your gallery!');
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Failed to save photo.');
        }
    };

    const renderItem = ({ item }: { item: Photo }) => (
        <View style={[styles.photoCard, { width: ITEM_WIDTH }]}>
            <Image source={{ uri: item.url }} style={styles.photo} resizeMode="cover" />
            <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => downloadPhoto(item.url)}
            >
                <Ionicons name="download-outline" size={20} color={PALETTE.white} />
            </TouchableOpacity>
            <View style={styles.captionContainer}>
                <Text style={styles.uploaderName} numberOfLines={1}>By {item.uploader.name}</Text>
                {item.caption && <Text style={styles.caption} numberOfLines={1}>{item.caption}</Text>}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader
                title="Gallery"
                showBack
                rightIcon="log-out-outline"
                onRightPress={logout}
            />

            <LinearGradient
                colors={[PALETTE.bgLight, PALETTE.blueLight]}
                style={styles.contentGradient}
            >
                <FlatList
                    data={photos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingBottom: insets.bottom + SPACING.xxl }
                    ]}
                    columnWrapperStyle={styles.columnWrapper}
                    refreshing={isLoading}
                    onRefresh={fetchPhotos}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="images-outline" size={48} color={PALETTE.blueMedium} />
                            <Text style={styles.emptyText}>No photos yet. Be the first to share a moment!</Text>
                        </View>
                    }
                />
            </LinearGradient>

            <TouchableOpacity
                style={styles.fab}
                onPress={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? (
                    <ActivityIndicator color={PALETTE.navyDark} />
                ) : (
                    <Ionicons name="camera" size={30} color={PALETTE.navyDark} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.bgLight,
    },
    contentGradient: {
        flex: 1,
    },
    listContent: {
        padding: SPACING.l,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    photoCard: {
        backgroundColor: PALETTE.white,
        borderRadius: RADIUS.m,
        overflow: 'hidden',
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: PALETTE.blueLight,
        shadowColor: PALETTE.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    photo: {
        width: '100%',
        height: 140,
        backgroundColor: PALETTE.lightGray,
    },
    captionContainer: {
        padding: SPACING.s,
        borderTopWidth: 1,
        borderTopColor: PALETTE.blueLight,
    },
    uploaderName: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.primaryBlue,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    caption: {
        fontSize: 10,
        color: PALETTE.darkGray,
    },
    downloadBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: SPACING.xl,
        right: SPACING.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: PALETTE.pinkLight,
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
        marginTop: SPACING.xl,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.mediumGray,
        textAlign: 'center',
        marginTop: SPACING.m,
    },
});
