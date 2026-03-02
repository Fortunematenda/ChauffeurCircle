import Constants from "expo-constants";

export function getApiBaseUrl(): string {
  const configured = Constants.expoConfig?.extra?.apiBaseUrl;

  const trimmed = typeof configured === "string" ? configured.trim() : "";
  if (trimmed.length > 0) {
    const hostUri = (Constants.expoConfig as { hostUri?: unknown } | undefined)?.hostUri;
    const host = typeof hostUri === "string" ? hostUri.split(":")[0] : null;

    if (host && (trimmed.includes("localhost") || trimmed.includes("127.0.0.1"))) {
      return trimmed.replace("localhost", host).replace("127.0.0.1", host);
    }

    return trimmed;
  }

  return "http://localhost:4000";
}
