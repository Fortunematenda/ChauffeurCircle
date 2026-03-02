import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../stores/authStore";
import type { ClientMainStackParamList } from "../../navigation/types";
import { CardContainer, PrimaryButton } from "../../components";
import { theme } from "../../theme";

type Props = NativeStackScreenProps<ClientMainStackParamList, "ClientDashboard">;

export function ClientDashboardScreen({ navigation }: Props) {
  const phoneNumber = useAuthStore((s) => s.phoneNumber);

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const containerStyle = {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
    ],
  } as const;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View style={containerStyle}>
        <View style={styles.headerBlock}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>Signed in as {phoneNumber}</Text>
        </View>

        <CardContainer>
          <Text style={styles.heroTitle}>Where to?</Text>
          <Text style={styles.heroSubtitle}>Request a ride from your private drivers.</Text>
          <View style={styles.spacer} />
          <PrimaryButton title="Request a ride" onPress={() => navigation.navigate("RequestRide")} />
        </CardContainer>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.quickGrid}>
            <QuickAction title="Drivers" icon="people-outline" onPress={() => navigation.navigate("Drivers")} />
            <QuickAction title="History" icon="time-outline" onPress={() => navigation.navigate("MyRequests")} />
            <QuickAction title="Active trip" icon="navigate-outline" onPress={() => navigation.navigate("ActiveTrip")} />
            <QuickAction title="Trips" icon="car-outline" onPress={() => navigation.navigate("TripHistory")} />
          </View>
        </View>

        <View style={styles.section}>
          <Pressable onPress={() => navigation.navigate("MyRequests")} style={({ pressed }) => [styles.linkRow, pressed ? styles.linkRowPressed : null]}>
            <View style={styles.linkLeft}>
              <Text style={styles.linkTitle}>Recent requests</Text>
              <Text style={styles.linkSubtitle}>View your latest ride requests</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.footerHint}>Logout is available in Profile.</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function QuickAction(props: { title: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={props.onPress} style={({ pressed }) => [styles.quickCard, pressed ? styles.quickCardPressed : null]}>
      <View style={styles.quickIconWrap}>
        <Ionicons name={props.icon} size={20} color={theme.colors.primary} />
      </View>
      <Text style={styles.quickTitle}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerBlock: {
    marginBottom: theme.spacing.md,
  },
  greeting: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  heroTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  heroSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  spacer: {
    height: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  quickCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  quickCardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.96,
  },
  quickIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(30, 58, 138, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  quickTitle: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  linkRow: {
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkRowPressed: {
    backgroundColor: "rgba(17, 24, 39, 0.03)",
  },
  linkLeft: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  linkTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  linkSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  footerHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
