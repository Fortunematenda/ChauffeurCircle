import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

type Variant = "success" | "warning" | "danger" | "neutral";

type Props = {
  text: string;
  variant?: Variant;
};

function backgroundFor(variant: Variant): string {
  switch (variant) {
    case "success":
      return "rgba(16, 185, 129, 0.14)";
    case "warning":
      return "rgba(245, 158, 11, 0.16)";
    case "danger":
      return "rgba(239, 68, 68, 0.14)";
    default:
      return "rgba(107, 114, 128, 0.14)";
  }
}

function textFor(variant: Variant): string {
  switch (variant) {
    case "success":
      return theme.colors.accent;
    case "warning":
      return "#B45309";
    case "danger":
      return theme.colors.danger;
    default:
      return theme.colors.textMuted;
  }
}

export function StatusBadge({ text, variant = "neutral" }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: backgroundFor(variant) }]}>
      <Text style={[styles.text, { color: textFor(variant) }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
