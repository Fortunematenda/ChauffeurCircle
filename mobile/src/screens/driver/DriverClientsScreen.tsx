import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import * as driverApi from "../../api/driverApi";
import { CardContainer, StatusBadge } from "../../components";
import { theme } from "../../theme";

export function DriverClientsScreen() {
  const [clients, setClients] = useState<
    Array<{ clientPhoneNumber: string; status: "PENDING" | "ACTIVE" | "BLOCKED"; createdAt: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await driverApi.getClients();
      setClients(res.clients);
    } catch {
      Alert.alert("Error", "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.clientPhoneNumber}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.headerTitle}>Clients</Text>
            <Text style={styles.headerSubtitle}>Your private network of clients.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const variant = item.status === "ACTIVE" ? "success" : item.status === "PENDING" ? "warning" : "danger";
          return (
            <CardContainer style={styles.card}>
              <Text style={styles.title}>{item.clientPhoneNumber}</Text>
              <StatusBadge text={item.status} variant={variant} />
              <Text style={styles.meta}>Added: {item.createdAt}</Text>
            </CardContainer>
          );
        }}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No clients yet.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  headerBlock: {
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  meta: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  empty: {
    marginTop: theme.spacing.xl,
    textAlign: "center",
    color: theme.colors.textMuted,
  },
});
