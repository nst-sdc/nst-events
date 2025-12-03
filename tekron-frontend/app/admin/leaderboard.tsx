import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '../../constants/config';

interface LeaderboardEntry {
    id: string;
    score: number;
    participant: {
        name: string;
        email: string;
    };
}

export default function AdminLeaderboard() {
    const { eventId } = useLocalSearchParams();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${BACKEND_URL}/admin/events/${eventId}/leaderboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchLeaderboard();
        }
    }, [eventId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaderboard();
    };

    const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => (
        <View style={styles.row}>
            <View style={styles.rankContainer}>
                <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.participantInfo}>
                <Text style={styles.nameText}>{item.participant.name}</Text>
                <Text style={styles.emailText}>{item.participant.email}</Text>
            </View>
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{item.score}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader title="Leaderboard" showBack />
            {loading && !refreshing ? (
                <Loader visible={true} />
            ) : (
                <FlatList
                    data={leaderboard}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.creamLight} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No participants yet</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.navyDark,
    },
    listContent: {
        padding: SPACING.m,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.purpleDeep,
        padding: SPACING.m,
        marginBottom: SPACING.s,
        borderRadius: RADIUS.m,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PALETTE.purpleMedium,
        borderRadius: RADIUS.s,
        paddingVertical: 4,
        marginRight: SPACING.m,
    },
    rankText: {
        ...TYPOGRAPHY.h4,
        color: PALETTE.creamLight,
    },
    participantInfo: {
        flex: 1,
    },
    nameText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.creamLight,
        fontWeight: 'bold',
    },
    emailText: {
        ...TYPOGRAPHY.caption,
        color: PALETTE.purpleLight,
    },
    scoreContainer: {
        minWidth: 60,
        alignItems: 'flex-end',
    },
    scoreText: {
        ...TYPOGRAPHY.h3,
        color: PALETTE.pinkLight,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: PALETTE.purpleLight,
    },
});
