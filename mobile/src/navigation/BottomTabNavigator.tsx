import React from "react";

import type { Role } from "../types/auth";
import { DriverTabs } from "./DriverTabs";
import { ClientTabs } from "./ClientTabs";

type Props = {
  role: Role;
};

export function BottomTabNavigator({ role }: Props) {
  if (role === "DRIVER") {
    return <DriverTabs />;
  }

  return <ClientTabs />;
}
