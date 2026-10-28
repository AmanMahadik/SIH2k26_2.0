// packages/ui/src/tokens.ts
// AICTE Official Design Tokens

export const AICTE_TOKENS = {
  colors: {
    primary: '#0B1D3A',      // Deep AICTE Navy
    secondary: '#1E3A8A',    // Royal Blue
    accent: '#D4AF37',       // Metallic Gold
    tirangaSaffron: '#FF9933',
    tirangaGreen: '#138808',
    surface: '#F8FAFC',
    cardBackground: '#FFFFFF',
    textMain: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
  },
  typography: {
    fontFamilySans: 'Inter, system-ui, -apple-system, sans-serif',
    titleWeight: '700',
    bodyWeight: '400',
  },
  regulatoryColors: {
    verified: { bg: '#DEF7EC', text: '#03543F', border: '#31C48D' },
    mismatch_detected: { bg: '#FDE8E8', text: '#9B1C1C', border: '#F98080' },
    expired: { bg: '#FEF08A', text: '#854D0E', border: '#FACC15' },
    verification_pending: { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' },
    source_unavailable: { bg: '#EDE9FE', text: '#5B21B6', border: '#A78BFA' },
    manual_review_required: { bg: '#FCE7F3', text: '#9D174D', border: '#F472B6' },
    unsupported: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
  },
} as const;
