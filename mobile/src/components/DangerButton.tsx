import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from "react-native";

import { theme } from "../theme";

type Props = PressableProps & {
  title: string;
  loading?: boolean;
};

export function DangerButton({ title, loading, disabled, style, ...rest }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
        style as never,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? <ActivityIndicator color={theme.colors.card} /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.card,
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  disabled: {
    opacity: 0.55,
  },
});
