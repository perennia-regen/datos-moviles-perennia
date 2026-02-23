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
// Converted from BackOffice globals.css OKLCH values

export const semantic = {
  /** Emerald — realizado, aprobado, cobrada */
  success: "#2E8B47",
  successSubtle: "#EBF5ED",
  successText: "#1E6A30",
  successBorder: "#C4E5CC",

  /** Warm Red — rechazado, errores, offline */
  destructive: "#dc3545",
  destructiveSubtle: "#FAEBED",
  destructiveText: "#A12935",
  destructiveBorder: "#F0C8CD",

  /** Amber — informe pendiente, warnings */
  warning: "#C08B1A",
  warningSubtle: "#F8F2E3",
  warningText: "#7A5C10",
  warningBorder: "#EDE0B8",

  /** Yellow-Lime — rendición pendiente, solicitada factura */
  caution: "#8E9A10",
  cautionSubtle: "#F4F5DC",
  cautionText: "#5E6A0A",
  cautionBorder: "#E2E5B0",

  /** Warm Blue — pendiente agenda, solicitado, emitida */
  info: "#3478AE",
  infoSubtle: "#E8F0F7",
  infoText: "#1E5580",
  infoBorder: "#C0D8EC",

  /** Olive Green — agendado */
  scheduled: "#588A1B",
  scheduledSubtle: "#EDF5DC",
  scheduledText: "#3A6010",
  scheduledBorder: "#D4E6B0",

  /** Warm Violet — informe enviado, subida factura */
  inReview: "#8B50C4",
  inReviewSubtle: "#F0E8F8",
  inReviewText: "#5C2E8F",
  inReviewBorder: "#D8C8EA",

  /** Warm Sky — enviado presupuesto, enviada factura */
  sent: "#4A8BA8",
  sentSubtle: "#E5F0F5",
  sentText: "#2E6378",
  sentBorder: "#C0D8E5",

  /** Warm Gray — borrador, sin presupuesto, esperando */
  neutral: "#8A8480",
  neutralSubtle: "#F2F0ED",
  neutralText: "#6B6460",
  neutralBorder: "#E0DDD9",
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

// ── Chart Colors ──
// Aligned with BackOffice --chart-1 through --chart-5

export const chart = {
  olive: "#6F8F07",
  lime: "#93B524",
  warmBrown: "#7A5E3E",
  amber: "#C08B1A",
  teal: "#3A7A9E",
} as const;

// ── GIS / Map Colors ──
// Aligned with BackOffice web/src/lib/gis/colors.ts

export const gis = {
  /** Lote polygon fills — same as BackOffice LOTE_COLORS + 50% alpha */
  loteColors: [
    "#2563eb80", "#16a34a80", "#dc262680", "#ca8a0480",
    "#9333ea80", "#0891b280", "#e11d4880", "#65a30d80",
  ],
  /** Ambiente polygon fills — same as BackOffice AMBIENTE_COLORS + 50% alpha */
  ambienteColors: [
    "#93c5fd80", "#86efac80", "#fca5a580", "#fde68a80",
    "#c4b5fd80", "#67e8f980", "#fda4af80", "#bef26480",
  ],
  /** Teal — ambiente/intersection accent */
  ambienteTeal: "#0891b2",
  /** Perimeter stroke */
  perimeter: "#ffffff",
  /** Measured polygon fill */
  measuredFill: "#2E8B4740",
  /** Measured stroke */
  measuredStroke: "#2E8B47",
} as const;

// ── Layer Toggle Config ──

export const layerColors = {
  perimetro: "#ffffff",
  lotes: brand.primary,
  ambientes: semantic.caution,
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
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
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
