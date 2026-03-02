import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import * as clientApi from "../../api/clientApi";
import { getApiErrorMessage } from "../../utils/apiError";

export function DriversScreen() {
  const [drivers, setDrivers] = useState<clientApi.DriverRelationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientApi.getDrivers();
      setDrivers(res.drivers);
    } catch {
      Alert.alert("Error", "Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onAcceptInvite(driverPhoneNumber: string) {
    Alert.alert("Accept invite", `Accept invite from ${driverPhoneNumber}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: () => {
          void (async () => {
            try {
              await clientApi.acceptInvite({ driverPhoneNumber });
              await load();
            } catch (e) {
              Alert.alert("Error", getApiErrorMessage(e, "Failed to accept invite"));
            }
          })();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.help}>Only ACTIVE drivers can receive ride requests.</Text>

      <FlatList
        data={drivers}
        keyExtractor={(item) => item.driverPhoneNumber}
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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.driverPhoneNumber}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Added: {item.createdAt}</Text>
            {item.status === "PENDING" ? (
              <View style={styles.actions}>
                <Button title="Accept invite" onPress={() => onAcceptInvite(item.driverPhoneNumber)} />
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No drivers yet.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  help: {
    marginBottom: 12,
    color: "#444",
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  title: {
    fontWeight: "700",
    marginBottom: 6,
  },
  actions: {
    marginTop: 10,
  },
  empty: {
    marginTop: 24,
    textAlign: "center",
    color: "#666",
  },
});
