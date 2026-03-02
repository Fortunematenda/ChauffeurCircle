import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ClientTripHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip History</Text>
      <Text>Coming in a later phase.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
});
