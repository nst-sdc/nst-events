import React, { useEffect } from 'react';
import { socket } from '../context/socket';
import { useAuthStore } from '../context/authStore';
import { useAdminStore } from '../context/adminStore';
import { useRouter, useSegments } from 'expo-router';

export const SocketHandler = () => {
    const { user, updateUser } = useAuthStore();
    const { updateParticipantInList } = useAdminStore();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const onParticipantUpdated = (data: any) => {
            // 1. Update Admin Store (if admin is viewing user list)
            updateParticipantInList(data);

            // 2. Update Auth Store (if current user is the target)
            if (user && user.id === data.id) {
                updateUser({
                    approved: data.approved,
                    approvedBy: data.approvedBy, // If user interface supports these
                    approvedAt: data.approvedAt
                });

                // Redirect logic
                const inParticipantGroup = segments[0] === 'participant';

                if (data.approved) {
                    // If approved and currently on map (waiting screen), go home
                    if (inParticipantGroup && (segments as string[]).includes('map')) {
                        router.replace('/participant/home' as any);
                    }
                } else {
                    // If revokved and currently in restricted area, go to map/wait
                    if (inParticipantGroup && !(segments as string[]).includes('map')) {
                        router.replace('/participant/map' as any);
                    }
                }
            }
        };

        socket.on('participantUpdated', onParticipantUpdated);

        return () => {
            socket.off('participantUpdated', onParticipantUpdated);
        };
    }, [user, updateParticipantInList, updateUser, segments]);

    return null;
};
