import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import * as tripApi from "../../api/tripApi";
import { CardContainer, DangerButton, PrimaryButton } from "../../components";
import { useTripStore } from "../../stores/tripStore";
import { theme } from "../../theme";

export function ActiveTripScreen() {
  const activeTripId = useTripStore((s) => s.activeTripId);
  const clearActiveTripId = useTripStore((s) => s.clearActiveTripId);

  const [tripId, setTripId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [fare, setFare] = useState("");
  const [busy, setBusy] = useState(false);

  const effectiveTripId = useMemo(() => tripId.trim() || activeTripId || "", [tripId, activeTripId]);

  async function onSendLocation() {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!effectiveTripId || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      Alert.alert("Invalid input", "Please provide trip id + latitude + longitude.");
      return;
    }

    try {
      setBusy(true);
      await tripApi.sendLocation({ tripId: effectiveTripId, latitude: lat, longitude: lng });
      Alert.alert("Location sent");
    } catch {
      Alert.alert("Error", "Failed to send location.");
    } finally {
      setBusy(false);
    }
  }

  async function onEndTrip() {
    if (!effectiveTripId) {
      Alert.alert("Invalid input", "Please provide a trip id.");
      return;
    }

    const fareNumber = fare.trim().length > 0 ? Number(fare) : undefined;
    if (fareNumber !== undefined && !Number.isFinite(fareNumber)) {
      Alert.alert("Invalid input", "Fare must be a number.");
      return;
    }

    try {
      setBusy(true);
      await tripApi.endTrip({ tripId: effectiveTripId, fare: fareNumber });
      clearActiveTripId();
      setTripId("");
      setLatitude("");
      setLongitude("");
      setFare("");
      Alert.alert("Trip ended");
    } catch {
      Alert.alert("Error", "Failed to end trip.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Active trip</Text>
        <Text style={styles.subtitle}>Send location updates and complete the trip.</Text>
      </View>

      <CardContainer>
        <Text style={styles.cardTitle}>Trip</Text>
        <Text style={styles.helpText}>Stored trip: {activeTripId ?? "(none)"}</Text>
        <TextInput
          value={tripId}
          onChangeText={setTripId}
          placeholder="Trip ID (optional override)"
          autoCapitalize="none"
          style={styles.input}
        />
        <Text style={styles.hint}>If you leave this blank, we will use the stored trip id.</Text>
      </CardContainer>

      <View style={styles.section}>
        <CardContainer>
          <Text style={styles.cardTitle}>Location update</Text>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput value={latitude} onChangeText={setLatitude} placeholder="-26.2041" keyboardType="numeric" style={styles.input} />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput value={longitude} onChangeText={setLongitude} placeholder="28.0473" keyboardType="numeric" style={styles.input} />
            </View>
          </View>
          <PrimaryButton title={busy ? "Sending..." : "Send location"} onPress={() => void onSendLocation()} disabled={busy} />
        </CardContainer>
      </View>

      <View style={styles.section}>
        <CardContainer>
          <Text style={styles.cardTitle}>Complete trip</Text>
          <Text style={styles.hint}>Add a fare (optional) and end the trip.</Text>
          <Text style={styles.label}>Fare</Text>
          <TextInput value={fare} onChangeText={setFare} placeholder="0.00" keyboardType="numeric" style={styles.input} />
          <DangerButton title={busy ? "Ending..." : "End trip"} onPress={() => void onEndTrip()} disabled={busy} />
        </CardContainer>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerBlock: {
    marginBottom: theme.spacing.md,
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
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  helpText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
});
