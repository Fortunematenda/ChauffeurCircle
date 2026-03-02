export const theme = {
  colors: {
    primary: "#1E3A8A",
    accent: "#10B981",
    background: "#F3F4F6",
    card: "#FFFFFF",
    text: "#111827",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    danger: "#EF4444",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 10,
    md: 14,
    lg: 18,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: "700" as const },
    h2: { fontSize: 20, fontWeight: "700" as const },
    h3: { fontSize: 16, fontWeight: "700" as const },
    body: { fontSize: 14, fontWeight: "400" as const },
    label: { fontSize: 14, fontWeight: "500" as const },
    caption: { fontSize: 12, fontWeight: "400" as const },
  },
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 2,
    },
  },
};
