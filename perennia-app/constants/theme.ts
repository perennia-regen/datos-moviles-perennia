/**
 * Perennia Design Tokens — Mobile App
 *
 * Source of truth: BackOffice globals.css + email-colors.ts
 * Keep in sync with:
 *   - BackOffice/web/src/app/globals.css (CSS variables)
 *   - BackOffice/web/src/lib/constants/email-colors.ts (hex values)
 */

// ── Brand Colors ──

export const brand = {
  /** Olive Green — primary brand, headers, CTAs */
  primary: "#6F8F07",
  /** Lime Green — accent, highlights, gradients */
  accent: "#93B524",
  /** Dark Brown — body text, headings */
  text: "#3D2920",
  /** Warm Brown — secondary accent, earthy tone */
  warmBrown: "#99673B",
  /** White */
  white: "#FFFFFF",
} as const;

// ── Semantic Colors ──

export const semantic = {
  /** Emerald — online, success, complete */
  success: "#4CAF50",
  successSubtle: "#e8f5e9",
  /** Red — errors, destructive, offline */
  destructive: "#dc3545",
  destructiveSubtle: "#ffebee",
  destructiveBorder: "#ffcdd2",
  /** Amber/Orange — warnings, pending */
  warning: "#e65100",
  warningSubtle: "#fff3e0",
  /** Info — informational states */
  info: "#1565c0",
  infoSubtle: "#e3f2fd",
} as const;

// ── Neutral Palette ──

export const neutral = {
  /** Warm off-white — screen backgrounds */
  background: "#f5f7f0",
  /** White — cards, inputs */
  surface: "#FFFFFF",
  /** Secondary text */
  textSecondary: "#666666",
  /** Muted text — captions, placeholders */
  textMuted: "#888888",
  /** Placeholder text */
  textPlaceholder: "#999999",
  /** Input placeholder */
  inputPlaceholder: "#aaaaaa",
  /** Borders — dividers, input borders */
  border: "#dddddd",
  /** Subtle border — section separators */
  borderSubtle: "#eeeeee",
  /** Disabled background */
  disabled: "#666666",
} as const;

// ── GIS / Map Colors ──

export const gis = {
  /** Lote polygon fills (with 50% alpha) */
  loteColors: [
    "#6F8F0780", "#c6282880", "#1565c080",
    "#f9a82580", "#7b1fa280", "#00838f80",
  ],
  /** Ambiente polygon fills (with 50% alpha) */
  ambienteColors: [
    "#e6510080", "#ad145280", "#6a1b9a80", "#ff6f0080",
  ],
  /** Teal — ambiente/intersection accent */
  ambienteTeal: "#00838f",
  /** Perimeter stroke */
  perimeter: "#ffffff",
  /** Measured polygon fill */
  measuredFill: "#4CAF5040",
  /** Measured stroke */
  measuredStroke: "#4CAF50",
} as const;

// ── Layer Toggle Config ──

export const layerColors = {
  perimetro: "#ffffff",
  lotes: brand.primary,
  ambientes: semantic.warning,
  ambienteLotes: gis.ambienteTeal,
} as const;

// ── Component Tokens ──

export const components = {
  /** Header / Navigation bar */
  header: {
    background: brand.primary,
    tint: brand.white,
  },
  /** Primary button */
  buttonPrimary: {
    background: brand.primary,
    text: brand.white,
  },
  /** Secondary/action button */
  buttonSecondary: {
    background: neutral.disabled,
    text: brand.white,
  },
  /** Finish/danger action */
  buttonDanger: {
    background: semantic.warning,
    text: brand.white,
  },
  /** Card */
  card: {
    background: neutral.surface,
    radius: 10,
    shadow: { color: "#000", opacity: 0.05, offsetY: 1, radius: 4, elevation: 2 },
  },
  /** Badge — default (scheduled/success) */
  badge: {
    background: semantic.successSubtle,
    text: brand.primary,
  },
  /** Badge — warning variant */
  badgeWarning: {
    background: semantic.warningSubtle,
    text: semantic.warning,
  },
  /** Badge — destructive variant */
  badgeDestructive: {
    background: semantic.destructiveSubtle,
    text: semantic.destructive,
  },
  /** Chip — selected state */
  chipSelected: {
    background: brand.primary,
    text: brand.white,
  },
  /** Chip — ambiente selected */
  chipAmbienteSelected: {
    background: gis.ambienteTeal,
    border: gis.ambienteTeal,
  },
  /** Input */
  input: {
    background: neutral.surface,
    border: neutral.border,
    text: brand.text,
    radius: 8,
  },
} as const;
