import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { theme } from "../theme";

type Props = ViewProps & {
  variant?: "default" | "flat";
};

export function CardContainer({ style, variant = "default", ...rest }: Props) {
  return <View style={[styles.base, variant === "default" ? styles.default : styles.flat, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  default: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  flat: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
