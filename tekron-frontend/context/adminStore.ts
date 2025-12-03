import { create } from 'zustand';

interface Participant {
    id: string;
    name: string;
    email: string;
    status: 'approved' | 'pending' | 'rejected';
    checkInTime?: string;
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
    sendAlert: (title: string, message: string) => Promise<void>;
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
        // Mock API call
        setTimeout(() => {
            set({
                stats: {
                    totalParticipants: 150,
                    pendingApprovals: 12,
                    approvedUsers: 138,
                    todayCheckIns: 45,
                },
                isLoading: false,
            });
        }, 1000);
    },

    validateParticipant: async (qrData: string) => {
        set({ isLoading: true });
        try {
            const data = JSON.parse(qrData);
            // Mock validation
            const participant: Participant = {
                id: data.id,
                name: 'John Doe', // In real app, fetch from DB using ID
                email: data.email,
                status: 'pending',
            };
            set({ isLoading: false });
            return participant;
        } catch (e) {
            set({ isLoading: false });
            return null;
        }
    },

    approveParticipant: async (id: string) => {
        set({ isLoading: true });
        setTimeout(() => {
            // Update local stats for immediate feedback
            const { stats } = get();
            set({
                isLoading: false,
                stats: {
                    ...stats,
                    pendingApprovals: stats.pendingApprovals - 1,
                    approvedUsers: stats.approvedUsers + 1,
                },
            });
        }, 1000);
    },

    rejectParticipant: async (id: string) => {
        set({ isLoading: true });
        setTimeout(() => {
            const { stats } = get();
            set({
                isLoading: false,
                stats: {
                    ...stats,
                    pendingApprovals: stats.pendingApprovals - 1,
                },
            });
        }, 1000);
    },

    sendAlert: async (title: string, message: string) => {
        set({ isLoading: true });
        setTimeout(() => {
            set({ isLoading: false });
        }, 1000);
    },
}));
