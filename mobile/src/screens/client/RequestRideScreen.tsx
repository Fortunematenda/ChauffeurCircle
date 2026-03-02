import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

import * as clientApi from "../../api/clientApi";
import * as clientRidesApi from "../../api/clientRidesApi";
import { getApiErrorMessage } from "../../utils/apiError";

export function RequestRideScreen() {
  const [drivers, setDrivers] = useState<clientApi.DriverRelationship[]>([]);
  const [selectedDriverPhoneNumber, setSelectedDriverPhoneNumber] = useState("");

  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [dropoffLat, setDropoffLat] = useState("");
  const [dropoffLng, setDropoffLng] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [busy, setBusy] = useState(false);

  const activeDrivers = useMemo(() => drivers.filter((d) => d.status === "ACTIVE"), [drivers]);

  const loadDrivers = useCallback(async () => {
    try {
      const res = await clientApi.getDrivers();
      setDrivers(res.drivers);
      if (!selectedDriverPhoneNumber && res.drivers.length > 0) {
        const firstActive = res.drivers.find((d) => d.status === "ACTIVE");
        if (firstActive) {
          setSelectedDriverPhoneNumber(firstActive.driverPhoneNumber);
        }
      }
    } catch {
      // ignore
    }
  }, [selectedDriverPhoneNumber]);

  useEffect(() => {
    void loadDrivers();
  }, [loadDrivers]);

  const canSubmit =
    selectedDriverPhoneNumber.trim().length > 0 &&
    pickupAddress.trim().length > 0 &&
    dropoffAddress.trim().length > 0 &&
    Number.isFinite(Number(pickupLat)) &&
    Number.isFinite(Number(pickupLng)) &&
    Number.isFinite(Number(dropoffLat)) &&
    Number.isFinite(Number(dropoffLng));

  async function onSubmit() {
    if (activeDrivers.length === 0) {
      Alert.alert("No ACTIVE drivers", "Ask your driver to invite you and accept the invite.");
      return;
    }

    if (!canSubmit) {
      Alert.alert("Invalid input", "Please fill pickup/dropoff and coordinates.");
      return;
    }

    try {
      setBusy(true);
      const res = await clientRidesApi.requestRide({
        driverPhoneNumber: selectedDriverPhoneNumber.trim(),
        pickupAddress: pickupAddress.trim(),
        pickupLat: Number(pickupLat),
        pickupLng: Number(pickupLng),
        dropoffAddress: dropoffAddress.trim(),
        dropoffLat: Number(dropoffLat),
        dropoffLng: Number(dropoffLng),
        scheduledTime: scheduledTime.trim().length > 0 ? scheduledTime.trim() : undefined,
      });

      Alert.alert("Ride requested", `Request ID: ${res.rideRequestId}`);
      setPickupAddress("");
      setPickupLat("");
      setPickupLng("");
      setDropoffAddress("");
      setDropoffLat("");
      setDropoffLng("");
      setScheduledTime("");
    } catch (e) {
      Alert.alert("Request failed", getApiErrorMessage(e, "Unable to request ride"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Driver phone number (must be ACTIVE)</Text>
      <TextInput
        value={selectedDriverPhoneNumber}
        onChangeText={setSelectedDriverPhoneNumber}
        placeholder={activeDrivers[0]?.driverPhoneNumber ?? "No ACTIVE drivers"}
        keyboardType="phone-pad"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Pickup</Text>
      <TextInput value={pickupAddress} onChangeText={setPickupAddress} placeholder="Pickup address" style={styles.input} />
      <TextInput value={pickupLat} onChangeText={setPickupLat} placeholder="Pickup lat" keyboardType="numeric" style={styles.input} />
      <TextInput value={pickupLng} onChangeText={setPickupLng} placeholder="Pickup lng" keyboardType="numeric" style={styles.input} />

      <Text style={styles.sectionTitle}>Dropoff</Text>
      <TextInput value={dropoffAddress} onChangeText={setDropoffAddress} placeholder="Dropoff address" style={styles.input} />
      <TextInput value={dropoffLat} onChangeText={setDropoffLat} placeholder="Dropoff lat" keyboardType="numeric" style={styles.input} />
      <TextInput value={dropoffLng} onChangeText={setDropoffLng} placeholder="Dropoff lng" keyboardType="numeric" style={styles.input} />

      <Text style={styles.sectionTitle}>Scheduled time (optional)</Text>
      <TextInput value={scheduledTime} onChangeText={setScheduledTime} placeholder='ISO string e.g. "2026-03-02T14:30:00Z"' style={styles.input} />

      <Button title={busy ? "Requesting..." : "Request ride"} onPress={onSubmit} disabled={busy || !canSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginBottom: 6,
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 8,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
});
