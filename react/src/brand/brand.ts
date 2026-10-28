export const BRAND = {
  name: "Kodez",
  tagline: "Secure access, beautifully simple.",
  logoSvg: null as string | null,
  colors: {
    primary: "#ff7f56",
    primaryHover: "#cb6241",
    ink: "#231f20",
    paper: "#f5f4f2",
    surface: "#ffffff",
    muted: "#6b6667",
    line: "#e6e2df",
    success: "#1f9d61",
    error: "#d03c38",
  },
  radius: "12px",
  panel: {
    headline: "One login for everything you do.",
    points: [
      {
        icon: "ShieldCheck",
        text: "Protected by Auth0 – MFA, passkeys and attack protection built in.",
      },
      {
        icon: "Palette",
        text: "Fully branded screens, designed and deployed by your own team.",
      },
      {
        icon: "RefreshCw",
        text: "Roll out screen by screen. Roll back in one click.",
      },
    ],
  },
} as const;
