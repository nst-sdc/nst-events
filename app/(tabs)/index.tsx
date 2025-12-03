import { AlertBanner } from '@/components/home/AlertBanner';
import { ScheduleList } from '@/components/home/ScheduleList';
import { StatusCard } from '@/components/home/StatusCard';
import { UserHeader } from '@/components/home/UserHeader';
import { AnimatedScreen } from '@/components/ui/AnimatedScreen';
import { Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, approved } = useAuthStore();

  // Mock Data - Replace with real data from backend later
  const scheduleItems = [
    { id: '1', time: '10:00 AM', title: 'Opening Ceremony', description: 'Main Hall', isActive: false },
    { id: '2', time: '11:00 AM', title: 'Hacking Begins', description: 'All Venues', isActive: true },
    { id: '3', time: '01:00 PM', title: 'Lunch Break', description: 'Cafeteria', isActive: false },
    { id: '4', time: '06:00 PM', title: 'Mentoring Round 1', description: 'Meeting Rooms', isActive: false },
  ];

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <UserHeader
            name={user?.email?.split('@')[0] || 'Participant'}
            role="Participant"
            status={approved ? 'approved' : 'pending'}
          />

          <StatusCard
            status={approved ? 'approved' : 'pending'}
            location={approved ? "Main Hall - Floor 1" : undefined}
            time={approved ? "09:00 AM" : undefined}
          />

          <AlertBanner
            message="Welcome to Tekron 2.0! Check-in at the desk to get started."
            type="info"
          />

          <ScheduleList items={scheduleItems} />

        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
});

