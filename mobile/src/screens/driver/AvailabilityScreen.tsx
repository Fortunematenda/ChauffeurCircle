import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CardContainer } from "../../components";
import { theme } from "../../theme";

export function AvailabilityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability</Text>
      <CardContainer>
        <Text style={styles.cardTitle}>Settings</Text>
        <Text style={styles.text}>Coming in a later phase.</Text>
      </CardContainer>
    </View>
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
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
