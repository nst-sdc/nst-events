import { create } from 'zustand';
import { storage } from '../utils/storage';

import { BACKEND_URL } from '../constants/config';

interface Participant {
    id: string;
    name: string;
    email: string;
    status: 'approved' | 'pending' | 'rejected';
    checkInTime?: string;
    approved: boolean;
    createdAt: string;
    events?: { id: string; title: string }[];
    approvedBy?: { id: string; name: string; email: string };
    approvedAt?: string;
}

interface DashboardStats {
    totalParticipants: number;
    pendingApprovals: number;
    approvedUsers: number;
    todayCheckIns: number;
}

interface AdminState {
    stats: DashboardStats;
    participants: Participant[];
    isLoading: boolean;
    fetchStats: () => Promise<void>;
    validateParticipant: (qrData: string) => Promise<Participant | null>;
    approveParticipant: (id: string) => Promise<void>;
    rejectParticipant: (id: string) => Promise<void>;
    sendAlert: (title: string, message: string, options?: { targetScope: 'all' | 'event', targetEventIds?: string[] }) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    stats: {
        totalParticipants: 0,
        pendingApprovals: 0,
        approvedUsers: 0,
        todayCheckIns: 0,
    },
    participants: [],
    isLoading: false,

    fetchStats: async () => {
        set({ isLoading: true });
        try {
            const token = await storage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/admin/participants`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const participants: Participant[] = await response.json();

                const totalParticipants = participants.length;
                const approvedUsers = participants.filter(p => p.approved).length;
                const pendingApprovals = totalParticipants - approvedUsers;
                // Mock today check-ins for now as backend doesn't track check-in time specifically yet
                const todayCheckIns = 0;

                set({
                    participants,
                    stats: {
                        totalParticipants,
                        pendingApprovals,
                        approvedUsers,
                        todayCheckIns,
                    },
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            set({ isLoading: false });
        }
    },

    validateParticipant: async (qrData: string) => {
        set({ isLoading: true });
        try {
            const token = await storage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/admin/validate-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ qrData }),
            });

            if (response.ok) {
                const data = await response.json();
                set({ isLoading: false });
                // Map backend participant to frontend interface
                return {
                    ...data.participant,
                    status: data.participant.approved ? 'approved' : 'pending',
                    approvedBy: data.participant.approvedBy,
                    approvedAt: data.participant.approvedAt
                };
            }
            set({ isLoading: false });
            return null;
        } catch (e) {
            set({ isLoading: false });
            return null;
        }
    },

    approveParticipant: async (id: string) => {
        set({ isLoading: true });
        try {
            const token = await storage.getItem('token');
            await fetch(`${BACKEND_URL}/admin/approve/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh stats
            await get().fetchStats();
        } catch (error) {
            console.error('Error approving participant:', error);
            set({ isLoading: false });
        }
    },

    rejectParticipant: async (id: string) => {
        set({ isLoading: true });
        try {
            const token = await storage.getItem('token');
            await fetch(`${BACKEND_URL}/admin/reject/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            await get().fetchStats();
        } catch (error) {
            console.error('Error rejecting participant:', error);
            set({ isLoading: false });
        }
    },

    sendAlert: async (title: string, message: string, options?: { targetScope: 'all' | 'event', targetEventIds?: string[] }) => {
        set({ isLoading: true });
        try {
            const token = await storage.getItem('token');
            await fetch(`${BACKEND_URL}/admin/alerts/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    message,
                    targetScope: options?.targetScope || 'all',
                    targetEventIds: options?.targetEventIds || []
                }),
            });
            set({ isLoading: false });
        } catch (error) {
            console.error('Error sending alert:', error);
            set({ isLoading: false });
        }
    },
}));
