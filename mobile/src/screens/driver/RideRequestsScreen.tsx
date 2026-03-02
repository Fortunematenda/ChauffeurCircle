import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import * as ridesApi from "../../api/ridesApi";
import * as tripApi from "../../api/tripApi";
import { useTripStore } from "../../stores/tripStore";
import type { DriverMainStackParamList } from "../../navigation/types";
import { CardContainer, DangerButton, PrimaryButton, StatusBadge } from "../../components";
import { theme } from "../../theme";

type Props = NativeStackScreenProps<DriverMainStackParamList, "RideRequests">;

export function RideRequestsScreen({ navigation }: Props) {
  const setActiveTripId = useTripStore((s) => s.setActiveTripId);

  const [rides, setRides] = useState<ridesApi.DriverRide[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const pending = useMemo(() => rides.filter((r) => r.status === "PENDING"), [rides]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ridesApi.getDriverRides();
      setRides(res.rides);
    } catch {
      Alert.alert("Error", "Failed to load ride requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onRespond(rideRequestId: string, action: "ACCEPT" | "REJECT") {
    try {
      await ridesApi.respondToRide({ rideRequestId, action });
      await load();
    } catch {
      Alert.alert("Error", "Failed to respond.");
    }
  }

  async function onStartTrip(rideRequestId: string) {
    try {
      const res = await tripApi.startTrip({ rideRequestId });
      setActiveTripId(res.tripId);
      navigation.navigate("ActiveTrip");
    } catch {
      Alert.alert("Error", "Unable to start trip. Ensure the ride is accepted and no trip exists yet.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Requests</Text>
          <Text style={styles.subtitle}>Pending: {pending.length}</Text>
        </View>
        <View style={styles.reloadButton}>
          <PrimaryButton title={loading ? "Loading..." : "Reload"} onPress={() => void load()} disabled={loading} />
        </View>
      </View>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.publicId}
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
        renderItem={({ item }) => {
          const badgeVariant =
            item.status === "ACCEPTED"
              ? "success"
              : item.status === "PENDING"
                ? "warning"
                : item.status === "REJECTED" || item.status === "CANCELLED"
                  ? "danger"
                  : "neutral";

          return (
            <CardContainer style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardTopLeft}>
                  <Text style={styles.cardId}>Ride {item.publicId}</Text>
                  <Text style={styles.cardMeta}>Client: {item.clientPhoneNumber}</Text>
                </View>
                <StatusBadge text={item.status} variant={badgeVariant} />
              </View>

              <View style={styles.routeRow}>
                <View style={styles.routeIconWrap}>
                  <Ionicons name="radio-button-on" size={14} color={theme.colors.accent} />
                </View>
                <View style={styles.routeTextWrap}>
                  <Text style={styles.routeLabel}>Pickup</Text>
                  <Text style={styles.routeValue}>{item.pickupAddress}</Text>
                </View>
              </View>

              <View style={styles.routeRow}>
                <View style={styles.routeIconWrap}>
                  <Ionicons name="location" size={14} color={theme.colors.primary} />
                </View>
                <View style={styles.routeTextWrap}>
                  <Text style={styles.routeLabel}>Dropoff</Text>
                  <Text style={styles.routeValue}>{item.dropoffAddress}</Text>
                </View>
              </View>

              {item.scheduledTime ? <Text style={styles.scheduled}>Scheduled: {item.scheduledTime}</Text> : null}

              <View style={styles.actions}>
                {item.status === "PENDING" ? (
                  <>
                    <PrimaryButton title="Accept" onPress={() => void onRespond(item.publicId, "ACCEPT")} />
                    <DangerButton title="Reject" onPress={() => void onRespond(item.publicId, "REJECT")} />
                  </>
                ) : null}

                {item.status === "ACCEPTED" ? (
                  <PrimaryButton title="Start trip" onPress={() => void onStartTrip(item.publicId)} />
                ) : null}
              </View>
            </CardContainer>
          );
        }}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No ride requests yet.</Text> : null}
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
  topRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  reloadButton: {
    width: 120,
  },
  listContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  cardTopLeft: {
    flex: 1,
  },
  cardId: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  cardMeta: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  routeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  routeIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(17, 24, 39, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  routeTextWrap: {
    flex: 1,
  },
  routeLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  routeValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginTop: 2,
  },
  scheduled: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  actions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  empty: {
    marginTop: theme.spacing.xl,
    textAlign: "center",
    color: theme.colors.textMuted,
  },
});
