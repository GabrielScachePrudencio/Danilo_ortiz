// ─── Paleta de Cores Centralizada ───────────────────────────────────
export const PALETTE = {
  bgRoot: "#0d0d0f",
  bgCard: "#111114",
  bgModal: "#141416",
  textPrimary: "#e8e6e1",
  accent: "#e8b44c", // Ouro / Mostarda principal

  borderLight: "#1e1e22",
  borderMedium: "#2a2a2e",
  borderUltraLight: "#141416",
  textMuted: "#888888",
  textDark: "#555555",
  textUltraDark: "#444444",
  borderDefault: "#333333",

  accentTabAlpha: "#e8b44c18",

  success: "#4cde8c",
  successBg: "#1a3a2a",

  error: "#de4c4c",
  errorBg: "#2e1a1a",
  errorBorderAlpha: "#de4c4c44",

  warning: "#e8b44c",
  warningBg: "#2e2a1a",

  info: "#4ca8de",
  infoBg: "#1a2a3a",

  neutralMuted: "#666666",
  whitePure: "#ffffff",
};

// ─── estilos ─────────────────────────────────────────────────────────────
export const S = {
  root: {
    minHeight: "100vh", background: PALETTE.bgRoot, color: PALETTE.textPrimary,
    fontFamily: "'DM Mono', 'Fira Mono', monospace", display: "flex", flexDirection: "column",
  },
  body: { flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" },
  sectionTitle: {
    fontSize: 11, letterSpacing: "0.3em", color: PALETTE.textDark, textTransform: "uppercase",
    marginBottom: 20, borderBottom: `1px solid ${PALETTE.borderLight}`, paddingBottom: 10,
  },
  searchRow: { display: "flex", gap: 8, marginBottom: 24, alignItems: "center" },
  input: {
    flex: 1, background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 4,
    color: PALETTE.textPrimary, padding: "9px 14px", fontSize: 13, fontFamily: "inherit", outline: "none",
  },
  btnPrimary: {
    padding: "9px 20px", background: PALETTE.accent, color: PALETTE.bgRoot, border: "none",
    borderRadius: 4, fontFamily: "inherit", fontSize: 12, letterSpacing: "0.1em",
    textTransform: "uppercase", cursor: "pointer", fontWeight: 700,
  },
  btnGhost: {
    padding: "9px 20px", background: "transparent", color: PALETTE.textMuted,
    border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 4, fontFamily: "inherit",
    fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left", padding: "10px 14px", fontSize: 10, letterSpacing: "0.2em",
    color: PALETTE.textDark, textTransform: "uppercase", borderBottom: `1px solid ${PALETTE.borderLight}`,
  },
  td: { padding: "12px 14px", borderBottom: `1px solid ${PALETTE.borderUltraLight}`, verticalAlign: "middle" },
  rowHover: { background: PALETTE.bgCard, cursor: "pointer", transition: "background .15s" },
  badge: (tipo) => {
    const map = {
      ATIVADO:    { bg: PALETTE.successBg, color: PALETTE.success },
      DESATIVADO: { bg: PALETTE.errorBg, color: PALETTE.error },
      FINALIZADO: { bg: PALETTE.successBg, color: PALETTE.success },
      PENDENTE:   { bg: PALETTE.warningBg, color: PALETTE.warning },
      AGUARDANDO: { bg: PALETTE.infoBg, color: PALETTE.info },
      CANCELADO:  { bg: PALETTE.errorBg, color: PALETTE.error },
      TRUE:       { bg: PALETTE.infoBg, color: PALETTE.info },
      FALSE:      { bg: PALETTE.borderMedium, color: PALETTE.neutralMuted },
    };
    const s = map[tipo] || map.FALSE;
    return {
      ...s, display: "inline-block", padding: "3px 10px", borderRadius: 3,
      fontSize: 11, letterSpacing: "0.12em", fontWeight: 700,
    };
  },
  btnLink: {
    background: "transparent", border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 3,
    color: PALETTE.accent, padding: "4px 12px", fontSize: 11, letterSpacing: "0.1em",
    cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
  },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, marginBottom: 36 },
  card: { background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 6, padding: "20px 22px" },
  cardLabel: { fontSize: 10, letterSpacing: "0.25em", color: PALETTE.textDark, textTransform: "uppercase", marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: 700, color: PALETTE.accent, lineHeight: 1 },
  cardSub: { fontSize: 12, color: PALETTE.textUltraDark, marginTop: 4 },
  barRow: { marginBottom: 12 },
  barLabel: { display: "flex", justifyContent: "space-between", fontSize: 12, color: PALETTE.textMuted, marginBottom: 5 },
  barTrack: { height: 6, background: PALETTE.borderLight, borderRadius: 3, overflow: "hidden" },
  barFill: (pct) => ({ height: "100%", width: `${pct}%`, background: PALETTE.accent, borderRadius: 3, transition: "width .6s ease" }),
  tokenBox: { background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 6, padding: "28px 32px", maxWidth: 560 },
  tokenLabel: { fontSize: 10, letterSpacing: "0.25em", color: PALETTE.textDark, textTransform: "uppercase", marginBottom: 8, display: "block" },
  tokenInput: {
    width: "100%", background: PALETTE.bgRoot, border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 4,
    color: PALETTE.textPrimary, padding: "10px 14px", fontSize: 13,
    fontFamily: "'DM Mono', 'Fira Mono', monospace", outline: "none", boxSizing: "border-box", marginBottom: 16,
  },
  tokenStatus: (ok) => ({ fontSize: 12, color: ok ? PALETTE.success : PALETTE.error, marginTop: 10, letterSpacing: "0.05em" }),
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modal: { background: PALETTE.bgModal, border: `1px solid ${PALETTE.borderMedium}`, borderRadius: 8, padding: "32px 36px", minWidth: 320, textAlign: "center" },
  modalTitle: { fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: PALETTE.accent, marginBottom: 10 },
  modalText: { color: PALETTE.textMuted, fontSize: 13, marginBottom: 24 },
  modalRow: { display: "flex", gap: 10, justifyContent: "center" },
  erro: { background: PALETTE.errorBg, border: `1px solid ${PALETTE.errorBorderAlpha}`, color: PALETTE.error, borderRadius: 4, padding: "10px 16px", fontSize: 13, marginBottom: 20 },

  // ── parcelas por aluno ──
  alunoCard: {
    background: PALETTE.bgCard, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 6,
    marginBottom: 4, overflow: "hidden",
  },
  alunoCardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px", cursor: "pointer", transition: "background .15s",
  },
  parcelasContainer: { borderTop: `1px solid ${PALETTE.borderLight}` },
  parcelaRow: (status) => {
    const cores = {
      FINALIZADO: { border: PALETTE.success },
      PENDENTE:   { border: PALETTE.warning },
      AGUARDANDO: { border: PALETTE.info },
      CANCELADO:  { border: PALETTE.error },
    };
    return {
      display: "grid",
      gridTemplateColumns: "40px 1fr 1fr 140px",
      alignItems: "center",
      padding: "10px 20px 10px 32px",
      borderLeft: `3px solid ${(cores[status] || { border: PALETTE.borderDefault }).border}`,
      borderBottom: `1px solid ${PALETTE.borderUltraLight}`,
      fontSize: 12,
    };
  },

  // ── canceladas ──
  canceladaCard: {
    background: PALETTE.bgCard, border: `1px solid ${PALETTE.errorBg}`, borderRadius: 6,
    marginBottom: 8, padding: "20px 24px",
  },
  canceladaHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 14, flexWrap: "wrap", gap: 8,
  },
  canceladaGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12, marginTop: 12,
  },
  canceladaField: { background: PALETTE.bgRoot, border: `1px solid ${PALETTE.borderLight}`, borderRadius: 4, padding: "10px 14px" },
  canceladaFieldLabel: { fontSize: 9, letterSpacing: "0.25em", color: PALETTE.textDark, textTransform: "uppercase", marginBottom: 4 },
  canceladaFieldValue: { fontSize: 13, color: PALETTE.textPrimary },

  progressBar: () => ({
    height: 4, background: PALETTE.borderLight, borderRadius: 2, overflow: "hidden", marginTop: 8,
    position: "relative",
  }),
  progressFill: (pct, color) => ({
    height: "100%", width: `${Math.min(pct, 100)}%`,
    background: color || PALETTE.success, borderRadius: 2, transition: "width .5s ease",
  }),
};

// ─── componentes auxiliares ─────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    ATIVADO:    { bg: "#1a3a2a", color: "#4cde8c" },
    DESATIVADO: { bg: "#2e1a1a", color: "#de4c4c" },
    FINALIZADO: { bg: "#1a3a2a", color: "#4cde8c" },
    PENDENTE:   { bg: "#2e2a1a", color: "#e8b44c" },
    AGUARDANDO: { bg: "#1a2a3a", color: "#4ca8de" },
    CANCELADO:  { bg: "#2e1a1a", color: "#de4c4c" },
  };
  const s = map[String(status).toUpperCase()] || { bg: "#2a2a2e", color: "#666" };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 3,
      fontSize: 11, letterSpacing: "0.12em", fontWeight: 700,
      background: s.bg, color: s.color,
    }}>
      {status}
    </span>
  );
}

export function Campo({ label, value, color }) {
  return (
    <div style={S.canceladaField}>
      <div style={S.canceladaFieldLabel}>{label}</div>
      <div style={{ ...S.canceladaFieldValue, color: color || "#e8e6e1" }}>{value ?? "—"}</div>
    </div>
  );
}

export function InfoMini({ label, value, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 12, color: color || "#e8e6e1" }}>{value ?? "—"}</span>
    </div>
  );
}

export function fmtData(iso) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("pt-BR"); } catch { return iso; }
}

export function fmtMoeda(v) {
  if (v === null || v === undefined) return "—";
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}