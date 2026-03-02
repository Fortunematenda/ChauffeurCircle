import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../theme";
import { Avatar } from "./Avatar";
import { NotificationIcon } from "./NotificationIcon";

type Props = {
  title: string;
  onPressNotifications: () => void;
  onPressProfile: () => void;
};

export function AppHeader({ title, onPressNotifications, onPressProfile }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.right}>
          <NotificationIcon onPress={onPressNotifications} />
          <Pressable
            accessibilityRole="button"
            onPress={onPressProfile}
            style={({ pressed }) => [styles.avatarButton, pressed ? styles.pressed : null]}
          >
            <Avatar />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.card,
  },
  container: {
    height: 56,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: "rgba(17, 24, 39, 0.06)",
  },
});
