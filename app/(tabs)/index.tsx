import { Colors, Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertBanner } from '@/components/home/AlertBanner';
import { EventCard } from '@/components/home/EventCard';
import { QuickActions } from '@/components/home/QuickActions';
import { UserHeader } from '@/components/home/UserHeader';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Temporary state for demonstration
  const [isApproved, setIsApproved] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserHeader
          name="Alex Chen"
          role="Participant"
          status={isApproved ? 'approved' : 'pending'}
        />

        <AlertBanner
          message="Final schedule for 'Hackathon 2025' has been updated. Check your timings."
          type="info"
        />

        <EventCard
          eventName="Cyber Security Workshop"
          location="Building C, Room 304"
          time="10:00 AM - 12:00 PM"
          isApproved={isApproved}
          onPress={() => console.log('Event card pressed')}
        />

        <QuickActions />

        {/* Debug Toggle - Remove in production */}
        <TouchableOpacity
          style={[styles.debugButton, { backgroundColor: colors.surfaceHighlight }]}
          onPress={() => setIsApproved(!isApproved)}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            Debug: Toggle Status ({isApproved ? 'Approved' : 'Pending'})
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
  debugButton: {
    padding: Spacing.m,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: Spacing.xl,
  },
});
