import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import * as driverApi from "../../api/driverApi";
import { CardContainer, PrimaryButton } from "../../components";
import { theme } from "../../theme";

export function InviteClientScreen() {
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [busy, setBusy] = useState(false);

  async function onInvite() {
    try {
      setBusy(true);
      const res = await driverApi.inviteClient({ clientPhoneNumber });
      Alert.alert("Invite sent", `Status: ${res.status}`);
      setClientPhoneNumber("");
    } catch {
      Alert.alert("Invite failed", "Please verify the phone number exists as a CLIENT.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Invite client</Text>
        <Text style={styles.subtitle}>Add a client to your private network by phone number.</Text>
      </View>

      <CardContainer>
        <Text style={styles.label}>Client phone number</Text>
        <TextInput
          value={clientPhoneNumber}
          onChangeText={setClientPhoneNumber}
          placeholder="+2782..."
          keyboardType="phone-pad"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.hint}>The client must already be registered as a CLIENT.</Text>

        <View style={styles.spacer} />
        <PrimaryButton
          title={busy ? "Inviting..." : "Send invite"}
          onPress={onInvite}
          disabled={busy || clientPhoneNumber.trim().length === 0}
        />
      </CardContainer>
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
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  spacer: {
    height: theme.spacing.md,
  },
});
