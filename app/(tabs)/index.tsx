import { Colors, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertBanner } from '@/components/home/AlertBanner';
import { EventCard } from '@/components/home/EventCard';
import { QuickActions } from '@/components/home/QuickActions';
import { UserHeader } from '@/components/home/UserHeader';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/Typography';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

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
          name="Arpit Sarang"
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

        {/* Debug Controls */}
        <View style={styles.debugContainer}>
          <ThemedText variant="caption" style={{ marginBottom: Spacing.s, textAlign: 'center' }}>Debug Controls</ThemedText>
          <Button
            label={`Toggle Status (${isApproved ? 'Approved' : 'Pending'})`}
            variant="outline"
            onPress={() => setIsApproved(!isApproved)}
            style={{ marginBottom: Spacing.m }}
          />
          <Button
            label="View UI Kit Gallery"
            variant="pixel"
            onPress={() => router.push('/gallery')}
          />
        </View>

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
  debugContainer: {
    marginTop: Spacing.xl,
    padding: Spacing.m,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
});
