import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Avatar, CardContainer, DangerButton } from "../../components";
import { useAuthStore } from "../../stores/authStore";
import { theme } from "../../theme";

export function ProfileScreen() {
  const phoneNumber = useAuthStore((s) => s.phoneNumber);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <CardContainer>
        <View style={styles.profileRow}>
          <Avatar label={phoneNumber ?? undefined} size={44} />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{phoneNumber ?? "—"}</Text>
            <Text style={styles.profileMeta}>{role ?? "—"}</Text>
          </View>
        </View>
      </CardContainer>

      <Text style={styles.sectionTitle}>Settings</Text>
      <CardContainer style={styles.settingsCard}>
        <SettingsRow title="Notifications" icon="notifications-outline" onPress={() => {}} />
        <View style={styles.divider} />
        <SettingsRow title="Privacy" icon="lock-closed-outline" onPress={() => {}} />
      </CardContainer>

      <View style={styles.logoutSection}>
        <DangerButton
          title="Logout"
          onPress={() => {
            Alert.alert("Logout", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Logout", style: "destructive", onPress: () => void logout() },
            ]);
          }}
        />
      </View>
    </View>
  );
}

function SettingsRow(props: { title: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={props.onPress} style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}>
      <View style={styles.rowLeft}>
        <View style={styles.iconWrap}>
          <Ionicons name={props.icon} size={18} color={theme.colors.textMuted} />
        </View>
        <Text style={styles.rowTitle}>{props.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.label,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  profileMeta: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  settingsCard: {
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  row: {
    height: 52,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPressed: {
    backgroundColor: "rgba(17, 24, 39, 0.03)",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(107, 114, 128, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  logoutSection: {
    marginTop: theme.spacing.lg,
  },
});
