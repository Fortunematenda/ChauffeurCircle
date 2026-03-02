import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import * as clientRidesApi from "../../api/clientRidesApi";

export function MyRequestsScreen() {
  const [rides, setRides] = useState<clientRidesApi.ClientRide[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientRidesApi.getClientRides();
      setRides(res.rides);
    } catch {
      Alert.alert("Error", "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Button title={loading ? "Loading..." : "Reload"} onPress={() => void load()} disabled={loading} />

      <FlatList
        data={rides}
        keyExtractor={(item) => item.publicId}
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
            <Text style={styles.cardTitle}>{item.status}</Text>
            <Text>Ride ID: {item.publicId}</Text>
            {item.tripId ? <Text>Trip: {item.tripId} ({item.tripStatus ?? ""})</Text> : null}
            <Text>Driver: {item.driverPhoneNumber}</Text>
            <Text>Pickup: {item.pickupAddress}</Text>
            <Text>Dropoff: {item.dropoffAddress}</Text>
            {item.scheduledTime ? <Text>Scheduled: {item.scheduledTime}</Text> : null}
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No requests yet.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },
  empty: {
    marginTop: 24,
    textAlign: "center",
    color: "#666",
  },
});
