import { useState } from "react";

/* ─── paleta de cores (mesma do Login.js) ───────────────────────────── */
export const PALETTE = {
  bgPage: "#0a0a0a",
  textPrimary: "#f0ece4",
  accent: "#c4a064",

  accentGlow: "rgba(196,160,100,0.1)",
  accentBorder: "rgba(196,160,100,0.2)",
  accentBorderLight: "rgba(196,160,100,0.15)",
  accentBorderSoft: "rgba(196,160,100,0.12)",
  accentBorderUltraLight: "rgba(196,160,100,0.1)",
  accentBgBadge: "rgba(196,160,100,0.06)",
  accentTextMuted: "rgba(196,160,100,0.5)",
  accentTextUltraMuted: "rgba(196,160,100,0.3)",
  accentBorderOutlined: "rgba(196,160,100,0.4)",

  whiteCardBg: "rgba(255,255,255,0.02)",
  whiteInputBg: "rgba(255,255,255,0.03)",
  textSecondaryBtn: "rgba(240,236,228,0.35)",
  borderSecondaryBtn: "rgba(240,236,228,0.1)",

  error: "#e05555",
  errorBorder: "rgba(224,85,85,0.3)",
  errorBg: "rgba(224,85,85,0.05)",

  success: "#6fcf7a",
  successBorder: "rgba(111,207,122,0.3)",
  successBg: "rgba(111,207,122,0.05)",

  info: "#4ca8de",
  infoBg: "rgba(76,168,222,0.08)",
  infoBorder: "rgba(76,168,222,0.3)",
};

/* ─── estilos ────────────────────────────────────────────────────────── */
export const S = {
  page: {
    minHeight: "100vh",
    background: PALETTE.bgPage,
    color: PALETTE.textPrimary,
    fontFamily: "'Barlow', sans-serif",
  },
  content: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "40px 48px 100px",
  },

  /* ── cabeçalho de perfil persistente (nome, email, badges) ── */
  perfilHeader: {
    padding: "36px 48px",
    borderBottom: `1px solid ${PALETTE.accentBorderSoft}`,
    background: "rgba(196,160,100,0.02)",
  },
  perfilEyebrow: {
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
    marginBottom: 10,
  },
  perfilNome: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "3rem",
    letterSpacing: "0.02em",
    color: PALETTE.textPrimary,
    lineHeight: 1,
    marginBottom: 10,
  },
  perfilEmail: {
    fontSize: "0.95rem",
    color: "rgba(240,236,228,0.5)",
    marginBottom: 16,
    letterSpacing: "0.02em",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: 32,
    padding: "40px 24px",
    borderBottom: `1px solid ${PALETTE.accentBorderSoft}`,
  },
  heroEyebrow: {
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
    marginBottom: 6,
  },
  heroName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.4rem",
    letterSpacing: "0.03em",
    color: PALETTE.textPrimary,
    lineHeight: 1,
    marginBottom: 14,
  },
  heroBadge: (tipo) => {
    const map = {
      ATIVADO: { color: PALETTE.success, border: PALETTE.successBorder, bg: PALETTE.successBg },
      DESATIVADO: { color: PALETTE.error, border: PALETTE.errorBorder, bg: PALETTE.errorBg },
      EXPIRADO: { color: PALETTE.accent, border: PALETTE.accentBorderOutlined, bg: PALETTE.accentBgBadge },
      ADMIN: { color: PALETTE.info, border: PALETTE.infoBorder, bg: PALETTE.infoBg },
      ALUNO: { color: PALETTE.accentTextMuted, border: PALETTE.accentBorderLight, bg: PALETTE.accentBgBadge },
    };
    const s = map[tipo] || map.ALUNO;
    return {
      display: "inline-block",
      padding: "4px 12px",
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: s.color,
      border: `1px solid ${s.border}`,
      background: s.bg,
    };
  },

  planoInfoContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  planoTexto: {
    fontSize: "0.75rem",
    letterSpacing: "0.04em",
    color: "rgba(240,236,228,0.55)",
  },
  planoDestaque: {
    color: PALETTE.accent,
    fontWeight: 600,
  },
  btnPagar: {
    alignSelf: "flex-start",
    marginTop: 14,
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "12px 24px",
    background: PALETTE.accent,
    color: PALETTE.bgPage,
    border: `1px solid ${PALETTE.accent}`,
    cursor: "pointer",
  },

  parcelaCard: {
    background: PALETTE.whiteCardBg,
    border: `1px solid ${PALETTE.accentBorderSoft}`,
    borderLeft: `3px solid ${PALETTE.accent}`,
    padding: "26px 28px",
  },
  parcelaLabel: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
  },
  parcelaValor: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.2rem",
    color: PALETTE.textPrimary,
    marginTop: 8,
  },

  sectionLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: `1px solid ${PALETTE.accentBorderSoft}`,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 3,
    marginBottom: 44,
  },
  saveBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 20,
    borderTop: `1px solid ${PALETTE.accentBorderSoft}`,
  },

  // pill de status GRANDE, com fundo cheio — substitui o heroBadge pequeno
  statusPillGrande: (status) => {
    const c = corStatusAssinatura(status);
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 18px",
      fontSize: "0.8rem",
      fontWeight: 800,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
    };
  },

  // card com fundo inteiro tintado na cor do status
  cardTintado: (status) => {
    const c = corStatusAssinatura(status);
    return {
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.color}`,
      padding: "26px 28px",
    };
  },

  // banner de aviso "modo admin"
  bannerModoAdmin: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    padding: "12px 32px",
    background: "rgba(76,168,222,0.08)",
    borderBottom: "1px solid rgba(76,168,222,0.3)",
    fontSize: "0.78rem",
    color: "#4ca8de",
  },

  btnPrimary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 600,
    fontSize: "0.75rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "12px 24px",
    background: PALETTE.accent,
    color: PALETTE.bgPage,
    border: `1px solid ${PALETTE.accent}`,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnSecondary: {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 400,
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "12px 20px",
    background: "transparent",
    color: "rgba(240,236,228,0.4)",
    border: "1px solid rgba(240,236,228,0.15)",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  gateCard: {
    maxWidth: 380,
    padding: "40px 36px",
    background: PALETTE.whiteCardBg,
    border: `1px solid ${PALETTE.accentBorder}`,
    textAlign: "center",
  },
  gateTitulo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.6rem",
    color: PALETTE.textPrimary,
    marginBottom: 10,
  },
  gateDesc: {
    fontSize: "0.82rem",
    color: "rgba(240,236,228,0.5)",
    marginBottom: 24,
    lineHeight: 1.6,
  },

  toast: (ok) => ({
    position: "fixed",
    bottom: 28,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 22px",
    fontSize: "0.8rem",
    letterSpacing: "0.03em",
    background: ok ? "#12241a" : "#241212",
    color: ok ? PALETTE.success : PALETTE.error,
    border: `1px solid ${ok ? PALETTE.successBorder : PALETTE.errorBorder}`,
    zIndex: 300,
    animation: "slideUp 0.25s ease",
  }),

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    background: "#121212",
    border: `1px solid ${PALETTE.accentBorder}`,
    padding: "32px 30px",
  },
  modalTitulo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.4rem",
    letterSpacing: "0.04em",
    color: PALETTE.textPrimary,
    marginBottom: 20,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: "0.58rem",
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: PALETTE.accentTextMuted,
  },
  input: {
    background: PALETTE.whiteInputBg,
    border: `1px solid ${PALETTE.accentBorderLight}`,
    color: PALETTE.textPrimary,
    fontFamily: "'Barlow', sans-serif",
    fontSize: "0.9rem",
    padding: "11px 14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
};

/* ─── helpers ────────────────────────────────────────────────────────── */
export function corStatus(status) {
  const map = {
    FINALIZADO: { color: PALETTE.success, bg: PALETTE.successBg, border: PALETTE.successBorder },
    PENDENTE: { color: PALETTE.error, bg: PALETTE.errorBg, border: PALETTE.errorBorder },
    AGUARDANDO: { color: PALETTE.info, bg: PALETTE.infoBg, border: PALETTE.infoBorder },
    CANCELADO: { color: "#888", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.1)" },
  };
  return map[status] || map.CANCELADO;
}

// cores fortes por status de assinatura (aluno/mensalidade) — pra blocos grandes, não só bolinhas
export function corStatusAssinatura(status) {
  const map = {
    ATIVADO: { bg: "rgba(111,207,122,0.12)", color: "#6fcf7a", border: "rgba(111,207,122,0.45)" },
    DESATIVADO: { bg: "rgba(224,85,85,0.12)", color: "#e05555", border: "rgba(224,85,85,0.45)" },
    EXPIRADO: { bg: "rgba(196,160,100,0.16)", color: "#c4a064", border: "rgba(196,160,100,0.5)" },
    CANCELADO: { bg: "rgba(224,85,85,0.12)", color: "#e05555", border: "rgba(224,85,85,0.45)" },
  };
  return map[status] || map.DESATIVADO;
}

export function emojiStatus(status) {
  const map = {
    FINALIZADO: "✓",
    PENDENTE: "●",
    AGUARDANDO: "◐",
    CANCELADO: "✕",
  };
  return map[status] || "•";
}

export function formatarValor(valor) {
  if (!valor && valor !== 0) return "—";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarData(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
}

// pega valor de um objeto aninhado a partir de uma chave tipo "endereco.rua"
export function getNestedValue(obj, key) {
  if (!obj) return "";
  const keys = key.split(".");
  return keys.reduce((acc, k) => (acc ? acc[k] : ""), obj) ?? "";
}

/* ─── campos editáveis do perfil ─────────────────────────────────────── */
export const CAMPOS_PESSOAIS = [
  { key: "nome", label: "Nome Completo", editable: true },
  { key: "whatsapp", label: "WhatsApp", editable: true },
  { key: "cpf", label: "CPF", editable: false },
  { key: "cnpj", label: "CNPJ", editable: true },
  { key: "cep", label: "CEP", editable: true },
  { key: "rua", label: "Rua", editable: true },
  { key: "numero", label: "Número", editable: true },
  { key: "bairro", label: "Bairro", editable: true },
  { key: "cidade", label: "Cidade", editable: true },
  { key: "estado", label: "Estado", editable: true },
  { key: "observacao", label: "Observação", editable: true },
];
export const CAMPOS_CONTA = [
  { key: "email", label: "E-mail", editable: false },
  { key: "statusAssinatura", label: "Status da Assinatura", editable: false },
  { key: "tipoUsuario", label: "Tipo de Usuário", editable: false },
];

/* ─── componente: campo de informação (visualização/edição inline) ──── */
export function CampoInfo({ label, value, editable, type = "text", onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        background: focused ? "rgba(196,160,100,0.04)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${focused ? "rgba(196,160,100,0.35)" : "rgba(196,160,100,0.08)"}`,
        padding: "20px 22px",
        transition: "all 0.2s",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: "0.6rem",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(196,160,100,0.5)",
          marginBottom: 10,
        }}
      >
        {label}
      </span>

      {editable ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${focused ? "#c4a064" : "rgba(196,160,100,0.25)"}`,
            color: "#f0ece4",
            fontFamily: "'Barlow', sans-serif",
            fontSize: "1rem",
            padding: "4px 0",
            outline: "none",
          }}
        />
      ) : (
        <span style={{ fontSize: "1rem", color: "#f0ece4" }}>{value || "—"}</span>
      )}
    </div>
  );
}

