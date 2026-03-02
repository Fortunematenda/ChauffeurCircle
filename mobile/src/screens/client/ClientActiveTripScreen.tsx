import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

import * as clientRidesApi from "../../api/clientRidesApi";
import * as tripApi from "../../api/tripApi";
import { getApiErrorMessage } from "../../utils/apiError";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready" };

export function ClientActiveTripScreen() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [tripDetails, setTripDetails] = useState<tripApi.TripDetails["trip"] | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const latestLocationText = useMemo(() => {
    if (!tripDetails?.latestLocation) return "(no location yet)";
    const loc = tripDetails.latestLocation;
    return `${loc.latitude}, ${loc.longitude} @ ${loc.timestamp}`;
  }, [tripDetails]);

  const findActiveTrip = useCallback(async (): Promise<string | null> => {
    const res = await clientRidesApi.getClientRides();
    const tripRide = res.rides.find((r) => r.tripId && r.tripStatus === "ONGOING");
    return tripRide?.tripId ?? null;
  }, []);

  const refreshTrip = useCallback(
    async (tripId: string) => {
      const res = await tripApi.getTrip(tripId);
      setTripDetails(res.trip);
    },
    [setTripDetails]
  );

  const startPolling = useCallback(
    (tripId: string) => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      pollingRef.current = setInterval(() => {
        void (async () => {
          try {
            await refreshTrip(tripId);
          } catch {
            // keep polling; transient issues shouldn't break UI
          }
        })();
      }, 5000);
    },
    [refreshTrip]
  );

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const load = useCallback(async () => {
    try {
      setLoadState({ status: "loading" });
      const tripId = await findActiveTrip();
      setActiveTripId(tripId);

      if (!tripId) {
        setTripDetails(null);
        setLoadState({ status: "ready" });
        stopPolling();
        return;
      }

      await refreshTrip(tripId);
      setLoadState({ status: "ready" });
      startPolling(tripId);
    } catch (e) {
      stopPolling();
      setLoadState({ status: "error", message: getApiErrorMessage(e, "Failed to load active trip") });
    }
  }, [findActiveTrip, refreshTrip, startPolling, stopPolling]);

  useEffect(() => {
    void load();
    return () => {
      stopPolling();
    };
  }, [load, stopPolling]);

  async function onManualReload() {
    try {
      await load();
    } catch {
      Alert.alert("Error", "Reload failed");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Trip</Text>

      <Button title={loadState.status === "loading" ? "Loading..." : "Reload"} onPress={() => void onManualReload()} />

      {loadState.status === "error" ? <Text style={styles.error}>{loadState.message}</Text> : null}

      {!activeTripId ? (
        <Text style={styles.help}>No ongoing trip found. Once your driver starts a trip, it will appear here.</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip: {activeTripId}</Text>
          <Text>Status: {tripDetails?.status ?? "(loading...)"}</Text>
          <Text>Driver: {tripDetails?.driverPhoneNumber ?? ""}</Text>
          <Text>Pickup: {tripDetails?.pickupAddress ?? ""}</Text>
          <Text>Dropoff: {tripDetails?.dropoffAddress ?? ""}</Text>
          <Text>Latest location: {latestLocationText}</Text>
        </View>
      )}
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
  help: {
    marginTop: 12,
    color: "#444",
  },
  error: {
    marginTop: 12,
    color: "#b00020",
  },
  card: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
  },
  cardTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },
});
