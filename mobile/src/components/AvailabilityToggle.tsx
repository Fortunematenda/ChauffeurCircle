import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

type Props = {
  value: boolean;
  onChange: (next: boolean) => void;
};

export function AvailabilityToggle({ value, onChange }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onChange(!value)} style={styles.container}>
      <View style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
        <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
      </View>
      <Text style={styles.label}>{value ? "Available" : "Offline"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  track: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
  },
  trackOn: {
    backgroundColor: "rgba(16, 185, 129, 0.25)",
  },
  trackOff: {
    backgroundColor: "rgba(107, 114, 128, 0.2)",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  thumbOn: {
    backgroundColor: theme.colors.accent,
    alignSelf: "flex-end",
  },
  thumbOff: {
    backgroundColor: theme.colors.textMuted,
    alignSelf: "flex-start",
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
});
