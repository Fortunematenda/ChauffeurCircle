import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

type Props = {
  label?: string;
  size?: number;
};

export function Avatar({ label, size = 28 }: Props) {
  const initials = useMemo(() => {
    const raw = (label ?? "").trim();
    if (!raw) return "CC";
    return raw
      .replace(/\s+/g, " ")
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [label]);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}> 
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(30, 58, 138, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(30, 58, 138, 0.18)",
  },
  text: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
});
