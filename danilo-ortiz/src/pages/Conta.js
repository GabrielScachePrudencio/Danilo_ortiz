import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";


/* ─── paleta de cores centralizada ─────────────────────────────────── */
const PALETTE = {
  bgPage: "#0a0a0a",
  textPrimary: "#f0ece4",
  accent: "#c4a064", // Dourado principal

  // Variações do Accent (Dourado) com Opacidade
  accentBorder: "rgba(196,160,100,0.15)",
  accentBorderLight: "rgba(196,160,100,0.12)",
  accentBorderSoft: "rgba(196,160,100,0.1)",
  accentTextMuted: "rgba(196,160,100,0.6)",
  accentTextSoft: "rgba(196,160,100,0.5)",
  accentBgGradient: "rgba(196,160,100,0.08)",

  // Variações do Texto Primário / Brancos com Opacidade
  whiteCardBg: "rgba(255,255,255,0.02)",
  textPrimaryMuted: "rgba(240,236,228,0.4)",
  textPrimarySoft: "rgba(240,236,228,0.5)",
  borderSecondaryBtn: "rgba(240,236,228,0.15)",
  borderBadgeDefault: "rgba(240,236,228,0.2)",

  // Estados de Feedback (Sucesso e Erro)
  success: "#6fcf7a",
  successBg: "rgba(90,180,100,0.12)",
  successBorder: "rgba(90,180,100,0.4)",

  error: "#e05555",
  errorBg: "rgba(224,85,85,0.12)",
  errorBorder: "rgba(224,85,85,0.4)",
};

/* ─── estilos ─────────────────────────────────────────────────────────── */
const S = {
  gateCard: {
    maxWidth: 440, margin: "0 auto", textAlign: "center",
    padding: "64px 48px", background: PALETTE.whiteCardBg,
    border: `1px solid ${PALETTE.accentBorder}`,
  },
  gateTitulo: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem",
    letterSpacing: "0.04em", color: PALETTE.textPrimary, marginBottom: 12,
  },
  gateDesc: {
    fontSize: "0.85rem", fontWeight: 300,
    color: PALETTE.textPrimaryMuted, letterSpacing: "0.05em", marginBottom: 36,
  },
  page: {
    minHeight: "100vh", background: PALETTE.bgPage,
    color: PALETTE.textPrimary, fontFamily: "'Barlow', sans-serif",
  },
  hero: {
    position: "relative", zIndex: 1, padding: "72px 48px 40px",
    borderBottom: `1px solid ${PALETTE.accentBorderLight}`,
    display: "flex", justifyContent: "space-between",
  },
  heroEyebrow: {
    fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.3em",
    textTransform: "uppercase", color: PALETTE.accentTextMuted, marginBottom: 12,
  },
  heroName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 0.9,
    letterSpacing: "0.04em", color: PALETTE.textPrimary, marginBottom: 8,
  },
  heroBadge: (tipo) => ({
    display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
    padding: "4px 14px", fontSize: "0.65rem", fontWeight: 600,
    letterSpacing: "0.2em", textTransform: "uppercase",
    border: `1px solid ${tipo === "ADMIN" ? PALETTE.accent : PALETTE.borderBadgeDefault}`,
    color: tipo === "ADMIN" ? PALETTE.accent : PALETTE.textPrimaryMuted,
    background: "transparent",
  }),
  content: {
    maxWidth: 860, margin: "0 auto", padding: "48px 48px 140px",
    position: "relative", zIndex: 1,
  },
  sectionLabel: {
    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.35em",
    textTransform: "uppercase", color: PALETTE.accentTextSoft,
    marginBottom: 24, paddingBottom: 12,
    borderBottom: `1px solid ${PALETTE.accentBorderSoft}`,
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 2, marginBottom: 48,
  },
  field: {
    background: PALETTE.whiteCardBg, border: `1px solid ${PALETTE.accentBorderSoft}`,
    padding: "20px 24px", transition: "all 0.25s ease", position: "relative",
  },
  fieldLabel: {
    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.25em",
    textTransform: "uppercase", color: PALETTE.accentTextSoft,
    marginBottom: 8, display: "block",
  },
  fieldValue: { fontSize: "0.95rem", color: PALETTE.textPrimary, wordBreak: "break-all" },
  input: {
    width: "100%", background: "transparent", border: "none",
    borderBottom: `1px solid ${PALETTE.accent}`, color: PALETTE.textPrimary,
    fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem",
    padding: "4px 0", outline: "none",
  },
  editBtn: {
    position: "absolute", top: 16, right: 16, background: "transparent",
    border: "none", color: PALETTE.accentTextMuted, cursor: "pointer",
    fontSize: "0.7rem", letterSpacing: "0.1em", fontFamily: "'Barlow', sans-serif",
    textTransform: "uppercase", transition: "color 0.2s", padding: 0,
  },
  saveBar: {
    display: "flex", justifyContent: "flex-end", gap: 12,
    marginTop: 32, paddingTop: 24, borderTop: `1px solid ${PALETTE.accentBorderSoft}`,
  },
  btnPrimary: {
    fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.75rem",
    letterSpacing: "0.15em", textTransform: "uppercase", padding: "12px 28px",
    background: PALETTE.accent, color: PALETTE.bgPage, border: `1px solid ${PALETTE.accent}`,
    cursor: "pointer", transition: "all 0.25s ease",
  },
  btnSecondary: {
    fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px",
    background: "transparent", color: PALETTE.textPrimaryMuted,
    border: `1px solid ${PALETTE.borderSecondaryBtn}`, cursor: "pointer",
    transition: "all 0.25s ease",
  },
  toast: (ok) => ({
    position: "fixed", bottom: 32, right: 32, padding: "14px 24px",
    background: ok ? PALETTE.successBg : PALETTE.errorBg,
    border: `1px solid ${ok ? PALETTE.successBorder : PALETTE.errorBorder}`,
    color: ok ? PALETTE.success : PALETTE.error, fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: "'Barlow', sans-serif", zIndex: 999, animation: "fadeIn 0.3s ease",
  }),
  planoInfoContainer: { marginTop: 24, display: "flex", flexDirection: "column", gap: 12 },
  planoTexto: { fontSize: "0.8rem", color: PALETTE.textPrimarySoft, letterSpacing: "0.05em" },
  planoDestaque: { color: PALETTE.accent, fontWeight: 600 },
  btnPagar: {
    alignSelf: "flex-start", marginTop: 8, fontFamily: "'Barlow', sans-serif",
    fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em",
    textTransform: "uppercase", padding: "10px 20px", background: PALETTE.accent,
    color: PALETTE.bgPage, border: "none", cursor: "pointer",
  },
  parcelaCard: {
    padding: "32px",
    background: `linear-gradient(145deg, ${PALETTE.accentBgGradient} 0%, ${PALETTE.whiteCardBg} 100%)`,
    borderLeft: `4px solid ${PALETTE.accent}`, display: "flex", flexDirection: "column",
    gap: 12, minWidth: "380px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  parcelaLabel: {
    fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase",
    color: PALETTE.accent, fontWeight: 700,
  },
  parcelaValor: {
    fontSize: "3.5rem", fontFamily: "'Bebas Neue', sans-serif",
    color: PALETTE.textPrimary, lineHeight: 1, margin: "8px 0",
  },
};
/* ─── campos ──────────────────────────────────────────────────────────── */
const CAMPOS_PESSOAIS = [
  { key: "nome",     label: "Nome Completo", editable: true },
  { key: "email",    label: "E-mail",        editable: true },
  { key: "whatsapp", label: "WhatsApp",      editable: true },
  { key: "cpf",      label: "CPF",           editable: true },
  { key: "cnpj",     label: "CNPJ",          editable: true },
  { key: "rua",      label: "Rua",           editable: true },
  { key: "numero",   label: "Número",        editable: true },
  { key: "bairro",   label: "Bairro",        editable: true }, // ← novo
  { key: "cidade",   label: "Cidade",        editable: true },
  { key: "estado",   label: "Estado",        editable: true }, // ← novo
  { key: "CEP",      label: "CEP",           editable: true },
];

const CAMPOS_CONTA = [
  { key: "tipoUsuario",      label: "Tipo de Usuário",   editable: false },
  { key: "statusAssinatura", label: "Status Assinatura", editable: false },
  { key: "planoAtual.id",    label: "Plano Atual (ID)",  editable: false },
  { key: "dataCadastro",     label: "Data de Cadastro",  editable: false },
  { key: "criouContaSisrun", label: "Conta Sisrun",      editable: false },
];

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}


const DANILO_WHATSAPP = "5516997551222";

/* ─── helpers de cor/status ───────────────────────────────────────────── */
function corStatus(status) {
  switch (status) {
    case "FINALIZADO":  return { color: "#6fcf7a", bg: "rgba(111,207,122,0.08)", border: "rgba(111,207,122,0.25)" };
    case "PENDENTE":    return { color: "#e0a055", bg: "rgba(224,160,85,0.08)",  border: "rgba(224,160,85,0.25)"  };
    case "AGUARDANDO":  return { color: "#55a8e0", bg: "rgba(85,168,224,0.08)",  border: "rgba(85,168,224,0.25)"  };
    case "CANCELADO":   return { color: "#e05555", bg: "rgba(224,85,85,0.08)",   border: "rgba(224,85,85,0.25)"   };
    default:            return { color: "#c4a064", bg: "rgba(196,160,100,0.08)", border: "rgba(196,160,100,0.25)" };
  }
}

function emojiStatus(status) {
  switch (status) {
    case "FINALIZADO": return "✓";
    case "PENDENTE":   return "⏳";
    case "AGUARDANDO": return "🔄";
    case "CANCELADO":  return "✕";
    default:           return "•";
  }
}

// Traduz mpStatus (approved/pending/rejected) para português
function traduzirMpStatus(mpStatus) {
  switch (mpStatus) {
    case "approved":      return { texto: "Aprovado",         cor: "#6fcf7a" };
    case "pending":       return { texto: "Pendente",         cor: "#e0a055" };
    case "in_process":    return { texto: "Em análise",       cor: "#55a8e0" };
    case "rejected":      return { texto: "Recusado",         cor: "#e05555" };
    case "cancelled":     return { texto: "Cancelado",        cor: "#e05555" };
    case "refunded":      return { texto: "Reembolsado",      cor: "#55a8e0" };
    case "charged_back":  return { texto: "Estornado",        cor: "#e05555" };
    default:              return { texto: mpStatus ?? "—",    cor: "#c4a064" };
  }
}

// Traduz mpStatusDetail para uma frase amigável
function traduzirStatusDetail(detail) {
  const mapa = {
    accredited:                         "Pagamento confirmado com sucesso",
    partially_refunded:                 "Reembolso parcial realizado",
    pending_waiting_payment:            "Aguardando o pagamento ser realizado",
    pending_waiting_transfer:           "Aguardando transferência bancária",
    pending_review_manual:              "Em análise manual pelo Mercado Pago",
    pending_contingency:                "Processando — tente novamente em breve",
    pending_challenge:                  "Aguardando confirmação extra do banco",
    cc_rejected_insufficient_amount:    "Saldo insuficiente no cartão",
    cc_rejected_bad_filled_card_number: "Número do cartão inválido",
    cc_rejected_bad_filled_date:        "Data de validade inválida",
    cc_rejected_bad_filled_other:       "Dados do cartão incorretos",
    cc_rejected_call_for_authorize:     "Ligue para o banco para autorizar",
    cc_rejected_card_disabled:          "Cartão desativado — entre em contato com o banco",
    cc_rejected_duplicated_payment:     "Pagamento duplicado detectado",
    cc_rejected_high_risk:              "Recusado por suspeita de fraude",
    rejected_by_bank:                   "Recusado pelo banco",
    rejected_insufficient_data:         "Dados insuficientes para processar",
    by_admin:                           "Cancelado pelo administrador",
    expired:                            "Prazo de pagamento expirado",
  };
  return mapa[detail] ?? detail ?? "—";
}

// Traduz método de pagamento
function traduzirMetodo(metodo) {
  const mapa = {
    pix:               "Pix",
    credit_card:       "Cartão de Crédito",
    debit_card:        "Cartão de Débito",
    ticket:            "Boleto",
    bank_transfer:     "Transferência Bancária",
    account_money:     "Saldo Mercado Pago",
    prepaid_card:      "Cartão Pré-pago",
  };
  return mapa[metodo] ?? metodo ?? "—";
}

/* ─── modal troca de senha ────────────────────────────────────────────── */
function ModalTrocarSenha({ onClose, idAluno, token, API, mostrarToast }) {
  const [senhaAtual, setSenhaAtual]   = useState("");
  const [senhaNova, setSenhaNova]     = useState("");
  const [confirmar, setConfirmar]     = useState("");
  const [salvando, setSalvando]       = useState(false);
  const [erroLocal, setErroLocal]     = useState("");

  async function handleTrocar() {
    setErroLocal("");
    if (!senhaAtual || !senhaNova || !confirmar) {
      setErroLocal("Preencha todos os campos.");
      return;
    }
    if (senhaNova !== confirmar) {
      setErroLocal("A nova senha e a confirmação não conferem.");
      return;
    }
    if (senhaNova.length < 6) {
      setErroLocal("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch(`${API}/alunos/${idAluno}/trocar-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual, senhaNova }),
      });

      if (res.ok) {
        mostrarToast("Senha alterada com sucesso!", true);
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setErroLocal(data.message || "Senha atual incorreta ou erro ao salvar.");
      }
    } catch {
      setErroLocal("Erro de conexão.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 700,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#111", border: "1px solid rgba(196,160,100,0.18)",
        width: "100%", maxWidth: 420,
        boxShadow: "0 40px 80px rgba(0,0,0,0.85)",
        animation: "slideUpCenter 0.22s ease",
      }}>
        {/* header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "15px 20px", borderBottom: "1px solid rgba(196,160,100,0.1)",
          background: "rgba(196,160,100,0.03)",
        }}>
          <div>
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.35em", color: "rgba(196,160,100,0.45)", textTransform: "uppercase", marginBottom: 3 }}>
              Segurança
            </p>
            <p style={{ fontSize: "0.88rem", color: "#f0ece4", fontWeight: 600 }}>Trocar Senha</p>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(240,236,228,0.1)",
            color: "rgba(240,236,228,0.3)", cursor: "pointer", fontSize: 13,
            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}>✕</button>
        </div>

        {/* body */}
        <div style={{ padding: "24px 24px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Senha Atual",         value: senhaAtual, set: setSenhaAtual },
            { label: "Nova Senha",           value: senhaNova,  set: setSenhaNova  },
            { label: "Confirmar Nova Senha", value: confirmar,  set: setConfirmar  },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label style={{
                display: "block", fontSize: "0.58rem", fontWeight: 600,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(196,160,100,0.55)", marginBottom: 8,
              }}>
                {label}
              </label>
              <input
                type="password"
                value={value}
                onChange={(e) => set(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrocar()}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(196,160,100,0.2)",
                  borderBottom: "2px solid rgba(196,160,100,0.5)",
                  color: "#f0ece4", fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.9rem", padding: "10px 14px", outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#c4a064")}
                onBlur={(e)  => (e.target.style.borderBottomColor = "rgba(196,160,100,0.5)")}
              />
            </div>
          ))}

          {erroLocal && (
            <p style={{
              fontSize: "0.72rem", color: "#e05555", letterSpacing: "0.04em",
              background: "rgba(224,85,85,0.07)", border: "1px solid rgba(224,85,85,0.2)",
              padding: "10px 14px", lineHeight: 1.5,
            }}>
              ✕ &nbsp;{erroLocal}
            </p>
          )}
        </div>

        {/* footer */}
        <div style={{
          display: "flex", gap: 8, padding: "20px 24px 24px",
          justifyContent: "flex-end", borderTop: "1px solid rgba(196,160,100,0.07)", marginTop: 16,
        }}>
          <button onClick={onClose} style={{ ...S.btnSecondary, padding: "9px 18px", fontSize: "0.7rem" }}>
            Cancelar
          </button>
          <button
            onClick={handleTrocar}
            disabled={salvando}
            style={{ ...S.btnPrimary, padding: "9px 22px", fontSize: "0.7rem", opacity: salvando ? 0.6 : 1 }}
          >
            {salvando ? "Salvando..." : "Confirmar Troca →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUpCenter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── linha de info dentro do modal ──────────────────────────────────── */
function InfoRow({ label, valor, cor, mono = false, copiavel = false }) {
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    navigator.clipboard.writeText(String(valor)).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 16px",
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(196,160,100,0.06)",
      gap: 12,
    }}>
      <span style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,236,228,0.3)", flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontSize: mono ? "0.7rem" : "0.82rem",
          color: cor ?? "#f0ece4",
          fontFamily: mono ? "monospace" : "inherit",
          letterSpacing: mono ? "0.04em" : 0,
          wordBreak: "break-all", textAlign: "right",
        }}>
          {valor}
        </span>
        {copiavel && (
          <button
            onClick={copiar}
            title="Copiar"
            style={{
              background: "transparent", border: "1px solid rgba(196,160,100,0.2)",
              color: copiado ? "#6fcf7a" : "rgba(196,160,100,0.5)",
              cursor: "pointer", fontSize: "0.6rem", padding: "2px 7px",
              letterSpacing: "0.08em", fontFamily: "inherit", flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            {copiado ? "✓" : "copiar"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── modal detalhes da parcela ───────────────────────────────────────── */
function ModalParcela({ parcela, urlMensalidade, onClose, onPagar, nomePlano, token, onConfirmado }) {
  const [detalhe, setDetalhe] = useState(null);
  const [carregando, setCarregando] = useState(true);
  // Adiciona esse estado no ModalParcela
  const [verificando, setVerificando] = useState(false);
  const [resultadoVerificacao, setResultadoVerificacao] = useState(null);

  async function verificarPagamento() {
        setVerificando(true);
        setResultadoVerificacao(null);
        try {
            const res = await fetch(`${urlMensalidade}/verificar-pagamento/${parcela.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setResultadoVerificacao(data);

            if (data.status === "FINALIZADO") {
                // Recarrega os detalhes da parcela no modal
                const res2 = await fetch(`${urlMensalidade}/parcela/${parcela.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res2.ok) setDetalhe(await res2.json());

                await onConfirmado?.();
            }
        } catch {
            setResultadoVerificacao({
                status: "ERRO",
                mensagem: "Erro de conexão. Tente novamente."
            });
        } finally {
            setVerificando(false);
        }
    }

  useEffect(() => {
    async function buscarDetalhe() {
      setCarregando(true);
      try {
        const res = await fetch(`${urlMensalidade}/parcela/${parcela.id}`, {
          headers: { Authorization: `Bearer ${token}` }  
      });
        if (res.ok) setDetalhe(await res.json());
        else setDetalhe(parcela);
      } catch {
        setDetalhe(parcela);
      } finally {
        setCarregando(false);
      }
    }
    buscarDetalhe();
  }, [parcela.id]);

  const d = detalhe ?? parcela;

  // status final a exibir: preferir mpStatus se existir
  const statusExibido = d.mpStatus
    ? traduzirMpStatus(d.mpStatus)
    : { texto: d.status, cor: corStatus(d.status).color };

  const csLocal = corStatus(d.status);
  const podePagar = d.status === "PENDENTE" || d.status === "AGUARDANDO";
  const foiPago   = d.status === "FINALIZADO" || d.mpStatus === "approved";

  // formata data
  function fmtData(iso) {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    } catch { return iso; }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 600,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#111", border: "1px solid rgba(196,160,100,0.18)",
        width: "100%", maxWidth: 480,
        boxShadow: "0 40px 80px rgba(0,0,0,0.85)",
        animation: "slideUp 0.22s ease",
        maxHeight: "90vh", overflowY: "auto",
      }}>

        {/* ── header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "15px 20px", borderBottom: "1px solid rgba(196,160,100,0.1)",
          background: "rgba(196,160,100,0.03)", position: "sticky", top: 0, zIndex: 1,
        }}>
          <div>
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.35em", color: "rgba(196,160,100,0.45)", textTransform: "uppercase", marginBottom: 3 }}>
              Parcela #{(parcela._index ?? 0) + 1} — {nomePlano}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#f0ece4", fontWeight: 600 }}>Detalhes do Pagamento</p>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(240,236,228,0.1)",
            color: "rgba(240,236,228,0.3)", cursor: "pointer", fontSize: 13,
            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit", flexShrink: 0,
          }}>✕</button>
        </div>

        {/* ── loading ── */}
        {carregando ? (
          <div style={{ padding: "52px 24px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#c4a064",
                  animation: `db 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <p style={{ fontSize: "0.68rem", color: "rgba(240,236,228,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Consultando Mercado Pago…
            </p>
          </div>
        ) : (
          <div style={{ padding: "20px 20px 8px" }}>

            {/* ── bloco principal: status + valor ── */}
            <div style={{
              display: "flex", alignItems: "stretch", gap: 2, marginBottom: 16,
            }}>
              {/* status MP */}
              <div style={{
                flex: 1, padding: "18px 18px",
                background: `${statusExibido.cor}0f`,
                border: `1px solid ${statusExibido.cor}30`,
                borderLeft: `3px solid ${statusExibido.cor}`,
                display: "flex", flexDirection: "column", justifyContent: "center", gap: 6,
              }}>
                <span style={{ fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,236,228,0.3)" }}>
                  Status
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.1rem" }}>{emojiStatus(d.status)}</span>
                  <span style={{ fontSize: "0.92rem", fontWeight: 700, color: statusExibido.cor, letterSpacing: "0.05em" }}>
                    {statusExibido.texto}
                  </span>
                </div>
                {/* status detail traduzido */}
                {d.mpStatusDetail && (
                  <span style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.4, marginTop: 2 }}>
                    {traduzirStatusDetail(d.mpStatusDetail)}
                  </span>
                )}
              </div>

              {/* valor */}
              <div style={{
                padding: "18px 20px", textAlign: "right",
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(196,160,100,0.08)",
                display: "flex", flexDirection: "column", justifyContent: "center", gap: 4,
                minWidth: 120,
              }}>
                <span style={{ fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,236,228,0.3)" }}>
                  Valor
                </span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#f0ece4", lineHeight: 1 }}>
                  R$ {Number(d.valor ?? d.mpValorTransacao ?? 0).toFixed(2).replace(".", ",")}
                </span>
                {/* se valor pago no MP for diferente do valor da parcela */}
                {d.mpValorTransacao && Number(d.mpValorTransacao) !== Number(d.valor) && (
                  <span style={{ fontSize: "0.62rem", color: "#e0a055" }}>
                    MP: R$ {Number(d.mpValorTransacao).toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
            </div>

            {/* ── seção: Informações da Parcela ── */}
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(196,160,100,0.4)", marginBottom: 3 }}>
              Parcela
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 14 }}>
              <InfoRow label="Vencimento" valor={fmtData(d.dataVencimento)} />
              <InfoRow label="Número da Parcela" valor={`${(parcela._index ?? 0) + 1}ª parcela`} />
            </div>

            {/* ── seção: Pagamento ── */}
            {(d.mpStatus || d.formaPagamento || d.mpDataAprovacao || d.mpPaymentId) && (
              <>
                <p style={{ fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(196,160,100,0.4)", marginBottom: 3, marginTop: 14 }}>
                  Pagamento
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 14 }}>

                  {/* método */}
                  {(d.mpMetodoPagamento || d.formaPagamento) && (
                    <InfoRow
                      label="Método"
                      valor={traduzirMetodo(d.mpMetodoPagamento || d.formaPagamento)}
                    />
                  )}

                  {/* data aprovação */}
                  {d.mpDataAprovacao && (
                    <InfoRow
                      label="Data do Pagamento"
                      valor={fmtData(d.mpDataAprovacao)}
                      cor="#6fcf7a"
                    />
                  )}

                  {/* ID da transação MP — o mais importante para comprovante */}
                  {d.mpPaymentId && (
                    <InfoRow
                      label="ID da Transação"
                      valor={String(d.mpPaymentId)}
                      mono
                      copiavel
                    />
                  )}

                  {/* status MP bruto (para suporte) */}
                  {d.mpStatus && (
                    <InfoRow
                      label="Status Mercado Pago"
                      valor={traduzirMpStatus(d.mpStatus).texto}
                      cor={traduzirMpStatus(d.mpStatus).cor}
                    />
                  )}
                </div>
              </>
            )}

            {/* ── aviso contextual ── */}
            {podePagar && !d.mpStatus && (
              <div style={{
                padding: "11px 14px", marginBottom: 16,
                background: "rgba(224,160,85,0.05)", border: "1px solid rgba(224,160,85,0.18)",
                borderLeft: "3px solid #e0a055",
              }}>
                <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.6 }}>
                  <span style={{ color: "#e0a055", fontWeight: 700 }}>Parcela em aberto. </span>
                  Clique em <strong style={{ color: "#f0ece4" }}>Ir para Pagamento</strong> para pagar.
                  Se já pagou e ainda aparece pendente, aguarde alguns minutos e volte aqui.
                </p>
              </div>
            )}

            {/* aprovado mas webhook pode estar atrasado */}
            {podePagar && d.mpStatus === "approved" && (
              <div style={{
                padding: "11px 14px", marginBottom: 16,
                background: "rgba(111,207,122,0.05)", border: "1px solid rgba(111,207,122,0.2)",
                borderLeft: "3px solid #6fcf7a",
              }}>
                <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.6 }}>
                  <span style={{ color: "#6fcf7a", fontWeight: 700 }}>Pagamento aprovado no Mercado Pago! </span>
                  O sistema ainda está processando a confirmação. Aguarde alguns minutos.
                </p>
              </div>
            )}

            {foiPago && d.status === "FINALIZADO" && (
              <div style={{
                padding: "11px 14px", marginBottom: 16,
                background: "rgba(111,207,122,0.05)", border: "1px solid rgba(111,207,122,0.18)",
                borderLeft: "3px solid #6fcf7a",
              }}>
                <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.6 }}>
                  <span style={{ color: "#6fcf7a", fontWeight: 700 }}>Pagamento confirmado. </span>
                  Guarde o ID da transação acima como comprovante. Em caso de dúvidas, entre em contato com o Danilo.
                </p>
              </div>
            )}

            {/* erro MP (ex: webhook ainda não chegou) */}
            {d.mpErro && !d.mpStatus && (
              <div style={{
                padding: "11px 14px", marginBottom: 16,
                background: "rgba(196,160,100,0.04)", border: "1px solid rgba(196,160,100,0.12)",
                borderLeft: "3px solid rgba(196,160,100,0.4)",
              }}>
                <p style={{ fontSize: "0.68rem", color: "rgba(240,236,228,0.35)", lineHeight: 1.5 }}>
                  ℹ️ {d.mpErro === "Aguardando confirmação do Mercado Pago"
                    ? "Nenhum pagamento registrado ainda para esta parcela."
                    : d.mpErro}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── footer ── */}
        {!carregando && (
          <div style={{
            display: "flex", gap: 8, padding: "14px 20px 20px",
            justifyContent: "flex-end", borderTop: "1px solid rgba(196,160,100,0.07)",
            flexWrap: "wrap", position: "sticky", bottom: 0,
            background: "#111",
          }}>
            <button onClick={onClose} style={{ ...S.btnSecondary, padding: "9px 18px", fontSize: "0.68rem" }}>
              Fechar
            </button>
{/* Botão "Já paguei" — aparece quando tem mpPaymentId e ainda não finalizou */}
{podePagar && d.mpPaymentId && (
    <button
        onClick={verificarPagamento}
        disabled={verificando}
        style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "9px 18px",
            background: "transparent",
            color: verificando ? "rgba(196,160,100,0.4)" : "#c4a064",
            border: `1px solid ${verificando ? "rgba(196,160,100,0.15)" : "rgba(196,160,100,0.35)"}`,
            cursor: verificando ? "not-allowed" : "pointer",
            transition: "all 0.2s",
        }}
    >
        {verificando ? "Verificando..." : "✓ Já paguei"}
    </button>
)}

              {/* Resultado da verificação */}
              {resultadoVerificacao && (
                  <div style={{
                      width: "100%",
                      padding: "10px 14px",
                      marginTop: 4,
                      background: resultadoVerificacao.status === "FINALIZADO"
                          ? "rgba(111,207,122,0.08)"
                          : resultadoVerificacao.status === "PENDENTE"
                          ? "rgba(224,160,85,0.08)"
                          : "rgba(224,85,85,0.08)",
                      border: `1px solid ${
                          resultadoVerificacao.status === "FINALIZADO" ? "rgba(111,207,122,0.3)"
                          : resultadoVerificacao.status === "PENDENTE"  ? "rgba(224,160,85,0.3)"
                          : "rgba(224,85,85,0.3)"
                      }`,
                      fontSize: "0.7rem",
                      color: resultadoVerificacao.status === "FINALIZADO" ? "#6fcf7a"
                          : resultadoVerificacao.status === "PENDENTE"   ? "#e0a055"
                          : "#e05555",
                      letterSpacing: "0.05em",
                  }}>
                      {resultadoVerificacao.mensagem}
                  </div>
              )}
            {/* pendente/aguardando → pagar */}
            {podePagar && (
              <button onClick={() => onPagar(d)} style={{ ...S.btnPrimary, padding: "9px 20px", fontSize: "0.68rem" }}>
                Ir para Pagamento →
              </button>
            )}

            {/* finalizado → ver comprovante (confirma via tela de pagamento) */}
            {d.status === "FINALIZADO" && (
              <button onClick={() => onPagar(d)} style={{
                fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.68rem",
                letterSpacing: "0.12em", textTransform: "uppercase", padding: "9px 18px",
                background: "transparent", color: "#6fcf7a",
                border: "1px solid rgba(111,207,122,0.28)", cursor: "pointer",
              }}>
                Ver Comprovante →
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes db { 0%,80%,100%{transform:translateY(0);opacity:.3} 40%{transform:translateY(-7px);opacity:1} }
      `}</style>
    </div>
  );
}



/* ─── componente campo editável ───────────────────────────────────────── */
function CampoInfo({ label, value, editable, type = "text", onChange }) {
  const [editando, setEditando] = useState(false);
  const [local, setLocal] = useState(value ?? "—");
  useEffect(() => setLocal(value ?? "—"), [value]);
  const salvar = () => { onChange?.(local); setEditando(false); };

  
  return (
    <div
      style={S.field}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(196,160,100,0.35)"; e.currentTarget.style.background = "rgba(196,160,100,0.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(196,160,100,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
    >
      <span style={S.fieldLabel}>{label}</span>
      {editando ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input autoFocus type={type} value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && salvar()} style={S.input} />
          <button style={{ ...S.editBtn, position: "static", color: "#c4a064" }} onClick={salvar}>✓</button>
          <button style={{ ...S.editBtn, position: "static" }} onClick={() => { setLocal(value ?? "—"); setEditando(false); }}>✕</button>
        </div>
      ) : (
        <span style={S.fieldValue}>{type === "password" && local !== "—" ? "••••••••" : String(local)}</span>
      )}
      {editable && !editando && (
        <button style={S.editBtn} onClick={() => setEditando(true)}
          onMouseEnter={(e) => (e.target.style.color = "#c4a064")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(196,160,100,0.4)")}>
          editar
        </button>
      )}
    </div>
  );
}


function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

/* ─── banner fixo sisrun ──────────────────────────────────────────────── */
function BannerSisrun({ nomeAluno, onConfirmarCriou  }) {
  const [visivel, setVisivel] = useState(true);

  const msgWhats = encodeURIComponent(
    `Olá Danilo! Sou ${
      nomeAluno || "aluno da plataforma"
    } e acabei de criar minha conta no SISRUN. Meu usuário é: `
  );

  if (!visivel) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 400,
        width: "calc(100% - 40px)",
        maxWidth: 680,
        background: "linear-gradient(135deg, #150f00 0%, #0f0f0f 70%)",
        border: "1px solid #c4a064",
        borderLeft: "5px solid #c4a064",
        padding: "16px 20px",
        boxShadow:
          "0 8px 48px rgba(196,160,100,0.18), 0 2px 12px rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(196,160,100,0.1)",
          border: "1px solid rgba(196,160,100,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 17,
        }}
      >
        ⚡
      </div>

      <div style={{ flex: 1, minWidth: 180 }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#c4a064",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          Você ainda não criou sua conta no SISRUN!
        </p>

        <p
          style={{
            fontSize: "0.76rem",
            color: "rgba(240,236,228,0.45)",
            lineHeight: 1.5,
          }}
        >
          Crie agora e avise o Danilo com seu usuário para ter acesso
          completo ao app.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexShrink: 0,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={() =>
            window.open(
              "https://appsisrun.com.br/sisrun/forms/cadastro.xhtml?assessoria=2dassessoriaesportiva",
              "_blank"
            )
          }
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 700,
            fontSize: "0.66rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "8px 15px",
            background: "#c4a064",
            color: "#0a0a0a",
            border: "none",
            cursor: "pointer",
          }}
        >
          Criar conta →
        </button>

        <a
          href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
            fontSize: "0.66rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "8px 13px",
            background: "transparent",
            color: "#25d366",
            border: "1px solid rgba(37,211,102,0.3)",
            textDecoration: "none",
          }}
        >
          <WaIcon /> Falar com Danilo
        </a>

        {/* 3. ← NOVO: confirma que já criou */}
        <button
          onClick={onConfirmarCriou}
          style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 13px", background: "transparent", color: "rgba(240,236,228,0.5)", border: "1px solid rgba(240,236,228,0.15)", cursor: "pointer" }}
        >
          ✓ Já criei minha conta
        </button>

        <button
          onClick={() => setVisivel(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(240,236,228,0.2)",
            cursor: "pointer",
            fontSize: 15,
            padding: "8px 6px",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}


/* ─── página principal ────────────────────────────────────────────────── */
export default function Conta() {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
//  const { idAluno } = useParams();
const token = localStorage.getItem("token");
const [idAluno, setIdAluno] = useState(null);
  
const { idAlunoE: idParam } = useParams();
const isAdminView = searchParams.get("admin") === "true";
  const [modalSenha, setModalSenha] = useState(false);

const [ehNovaAssinatura, setehNovaAssinatura] = useState(false);


  const [emailLogado, setEmailLogado] = useState(null);

  const [aluno, setAluno]                                     = useState(null);
  const [MensalidadeParcelasDTOS, setMensalidadeParcelasDTOS] = useState({});
  const [editado, setEditado]                                 = useState({});
  const [erro, setErro]                                       = useState(null);
  const [salvando, setSalvando]                               = useState(false);
  const [toast, setToast]                                     = useState(null);

  // modal de parcela
  const [parcelaSelecionada, setParcelaSelecionada]           = useState(null);

/*
  const url =
    window.location.hostname === "localhost" || window.location.hostname === "192.168.15.19"
      ? "http://192.168.15.19:3001/alunos"
      : "http://201.95.94.106:3001/alunos";

  const urlMensalidade =
    window.location.hostname === "localhost" || window.location.hostname === "192.168.15.19"
      ? "http://192.168.15.19:3001/mensalidades"
      : "http://201.95.94.106:3001/mensalidades";
*/
const isRailway = window.location.hostname.includes("railway.app");


// fallback seguro (NUNCA gera undefined/...)
//const API = isRailway   ? "https://backend-production-af1ab.up.railway.app"   : (process.env.REACT_APP_API_URL || "http://localhost:3001");
const API = process.env.REACT_APP_API_URL || "http://localhost:3001";
  
  
  const url = API+"/alunos";
  const urlMensalidade = API+"/mensalidades";
  


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/alunos/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
      if (!res.ok) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error();
      }
      return res.json();
    })
    .then(data => {
      setEmailLogado(data.email);
   
      if (isAdminView && data.tipoUsuario !== "ADMIN") {
        navigate("/home/conta");
        return;
      }
      // se é admin visualizando outro aluno, usa o id da URL
      // se é o próprio aluno, usa o id do token
      const idFinal = (isAdminView && idParam) ? Number(idParam) : data.id;
      setIdAluno(idFinal);
    })
    .catch(() => {})
}, []);

  useEffect(() => {
    if (!idAluno) return;
    pegarAlunoPorId();
    pegarDadosMensalidadeAlunoPorId();
  }, [idAluno]);


  async function pegarAlunoPorId() {
    try {
      const res = await fetch(`${url}/${idAluno}`, {
        headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
      });

      if (res.ok) { 
        const d = await res.json();
        setAluno(d);
           setEditado(d);
         }
      else setErro("Aluno não encontrado no banco.");
    } catch { setErro("Erro de conexão com o servidor."); }
  }

  async function cancelarPlano() {
    const confirmou = window.confirm(
      "Tem certeza que deseja cancelar seu plano? Seu acesso será desativado imediatamente."
    );
    if (!confirmou) return;

    try {
      const res = await fetch(`${urlMensalidade}/cancelar-mensalidade/${idAluno}?idQuemCancelou=${idAluno}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
      });

      if (res.ok) {
        mostrarToast("Plano cancelado com sucesso.", true);
        // Recarrega os dados do aluno para refletir o novo status
        await pegarAlunoPorId();
        await pegarDadosMensalidadeAlunoPorId();
      } else {
        mostrarToast("Erro ao cancelar plano.", false);
      }
    } catch {
      mostrarToast("Erro de conexão ao cancelar.", false);
    }
  }

  async function pegarDadosMensalidadeAlunoPorId() {
    try {
      const res = await fetch(`${urlMensalidade}/${idAluno}`, {
        headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
      });
      if (res.ok) { const d = await res.json(); setMensalidadeParcelasDTOS(d); }
    } catch { /* silencioso */ }
  }

async function cancelarEVoltar() {
    try {
        // só cancela se estava em processo de nova assinatura
        if (ehNovaAssinatura && idAluno) {
            await fetch(`${API}/mensalidades/cancelar-sem-log/${idAluno}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
        }
    } catch {
        // silencia — o importante é navegar
    } finally {
        navigate("/");
    }
}

  function atualizarCampo(key, valor) {
    if (key === "CEP")    valor = valor.replace(/\D/g, "").slice(0, 8);
    if (key === "CPF")    valor = valor.replace(/\D/g, "").slice(0, 11);
    if (key === "CNPJ")   valor = valor.replace(/\D/g, "").slice(0, 14);
    if (key === "numero") valor = valor.replace(/\D/g, "");

    setEditado((prev) => {
      const keys = key.split(".");
      if (keys.length === 1) return { ...prev, [key]: valor };
      return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: valor } };
    });
  }

  

  async function salvarAlteracoes() {
    setSalvando(true);
    try {
      const res = await fetch(`${url}/${idAluno}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`  // <-- adicionar
        },
        body: JSON.stringify(editado),
      });

      if (res.ok) {
        const updated = await res.json();
        setAluno(updated); setEditado(updated);
        mostrarToast("Alterações salvas com sucesso!", true);
      } else mostrarToast("Erro ao salvar alterações.", false);
    } catch { mostrarToast("Erro de conexão ao salvar.", false); }
    finally { setSalvando(false); }
  }

  function formatarValor(valor) {
    if (!valor && valor !== 0) return "—";
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

async function confirmarTrocaStatusSisrun() {
  try {
    const res = await fetch(`${url}/atualizar-status-contasisrun-aluno/${idAluno}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }  // <-- adicionar
    });

    if (res.ok) {
      // Atualiza localmente
      setAluno((prev) => ({
        ...prev,
        criouContaSisrun: true, // ou muda o campo correto que você usa
      }));

      mostrarToast("Status atualizado com sucesso!", true);
    } else {
      mostrarToast("Erro ao atualizar status.", false);
    }
  } catch (err) {
    mostrarToast("Erro de conexão.", false);
  } 
}


  function mostrarToast(msg, ok) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  // Sempre redireciona para a tela de pagamento (correto),
  // independente do status — pq pode ter pago e o sistema ainda não atualizou
  function irParaPagamento(parcela) {
    setParcelaSelecionada(null);
    navigate(`/home/telapagamento/${MensalidadeParcelasDTOS.planoId}?parcelaId=${parcela.id}`);
  }

  const deslogar = (e) => { e.preventDefault(); localStorage.clear(); navigate("/"); };

  const deveExibirSisrun =
    aluno &&
    MensalidadeParcelasDTOS?.statusLiberacao === "ATIVADO" &&
    aluno.criouContaSisrun === false;

  const ultimaParcela = MensalidadeParcelasDTOS?.parcelas?.find(
    (p) => p.status === "PENDENTE" || p.status === "AGUARDANDO"
  );
    
  /* ── carregando ── */
  if (!aluno && !erro) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,228,0.25)" }}>Carregando...</p>
      </div>
    );
  }

  if (erro && !aluno) {
    return (
      <div style={{ ...S.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <p style={{ color: "#e05555" }}>{erro}</p>
        <button style={S.btnPrimary} onClick={() => navigate("/login")}>Fazer Login</button>
        <button style={S.btnSecondary} onClick={() => navigate("/")}>Voltar</button>
      </div>
    );
  }

  if (!emailLogado) {
    return (
      <div style={S.page}>
        <div style={{ ...S.content, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", paddingTop: 0 }}>
          <div style={S.gateCard}>
            <h2 style={S.gateTitulo}>Login necessário</h2>
            <p style={S.gateDesc}>Para continuar, você precisa estar logado na plataforma.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button style={S.btnPrimary} onClick={() => navigate("/login")}>Fazer Login</button>
              <button style={S.btnSecondary} onClick={() => navigate("/")}>← Voltar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container" style={S.page}>

      {/* ── MODAL PARCELA ── */}
      {parcelaSelecionada && (
        <ModalParcela
          parcela={parcelaSelecionada}
          urlMensalidade={urlMensalidade}
          nomePlano={MensalidadeParcelasDTOS?.nomePlano ?? "—"}
          onClose={() => setParcelaSelecionada(null)}
          onPagar={irParaPagamento}
          token={token}    
          onConfirmado={pegarDadosMensalidadeAlunoPorId}  
        />
      )}

     

      {modalSenha && (
        <ModalTrocarSenha
          onClose={() => setModalSenha(false)}
          idAluno={idAluno}
          token={token}
          API={API}
          mostrarToast={mostrarToast}
        />
      )}



      {/* ── BANNER FIXO SISRUN ── */}
     {deveExibirSisrun && (
        <BannerSisrun nomeAluno={aluno?.nome} 
            onConfirmarCriou={confirmarTrocaStatusSisrun}  
/>  
      )}

      {/* ── NAV ── */}
      <nav className="nav-bar">
        <span style={{ marginRight: "auto", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(196,160,100,0.4)" }}>
          #{idAluno}
        </span>
        {aluno?.tipoUsuario === "ADMIN" && (
          <button className="btn-login" onClick={() => navigate("/home/administrativo")}>Administrativo</button>
        )}
        <button className="btn-sair" onClick={deslogar}>Sair</button>
        <button className="btn-sair" onClick={() => navigate("/")}>Voltar</button>
      </nav>

      {/* ── HERO ── */}
      <header style={{ ...S.hero, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <p style={S.heroEyebrow}>Perfil do aluno</p>
          <h1 style={S.heroName}>{aluno?.nome ?? "—"}</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <span style={S.heroBadge(aluno?.tipoUsuario)}>{aluno?.tipoUsuario}</span>
            <span style={S.heroBadge(aluno?.statusAssinatura)}>{aluno?.statusAssinatura}</span>
            {aluno?.criouContaSisrun === false && aluno?.statusAssinatura === "ATIVADO" && (
            <span
              onClick={() => window.open("https://appsisrun.com.br/sisrun/forms/cadastro.xhtml?assessoria=2dassessoriaesportiva", "_blank")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "4px 14px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid rgba(224,85,85,0.55)", color: "#e05555", background: "rgba(224,85,85,0.07)", cursor: "pointer" }}
            >
              ⚠ SISRUN não criado — clique aqui para criar
            </span>
              )}

          </div>

          {MensalidadeParcelasDTOS?.nomePlano && (
            <div style={S.planoInfoContainer}>
              <p style={{ ...S.planoTexto, margin: "2px 0" }}>PLANO: <span style={S.planoDestaque}>{MensalidadeParcelasDTOS.nomePlano}</span></p>
              <p style={{ ...S.planoTexto, margin: "2px 0" }}>VALOR MENSAL: <span style={S.planoDestaque}>R$ {MensalidadeParcelasDTOS.valorMensalidade}</span></p>
              <p style={{ ...S.planoTexto, margin: "2px 0" }}>
                VIGÊNCIA:{" "}
                {new Date(MensalidadeParcelasDTOS.dataInicio).toLocaleDateString("pt-BR")} até{" "}
                {new Date(MensalidadeParcelasDTOS.dataFim).toLocaleDateString("pt-BR")}
              </p>
              {MensalidadeParcelasDTOS?.statusLiberacao === "DESATIVADO" && (
              <>
                  <button style={S.btnPagar} onClick={() => navigate(`/home/telapagamento/${MensalidadeParcelasDTOS.planoId}`)}>
                      Pagar e Ativar Conta
                  </button>

                  {/* ← ADICIONA AQUI — cancelar sem gerar log */}
                  <button
                      onClick={async () => {
                          const confirmou = window.confirm("Deseja cancelar e trocar de plano? Isso vai remover sua associação atual.");
                          if (!confirmou) return;
                          try {
                              await fetch(`${API}/mensalidades/cancelar-sem-log/${idAluno}`, {
                                  method: "POST",
                                  headers: { Authorization: `Bearer ${token}` }
                              });
                              mostrarToast("Plano removido. Escolha outro plano.", true);
                              await pegarAlunoPorId();
                              await pegarDadosMensalidadeAlunoPorId();
                          } catch {
                              mostrarToast("Erro ao cancelar.", false);
                          }
                      }}
                      style={{
                          alignSelf: "flex-start",
                          marginTop: 6,
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 500,
                          fontSize: "0.65rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "7px 14px",
                          background: "transparent",
                          color: "rgba(224,85,85,0.6)",
                          border: "1px solid rgba(224,85,85,0.2)",
                          cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { e.target.style.color = "#e05555"; e.target.style.borderColor = "rgba(224,85,85,0.5)"; }}
                      onMouseLeave={(e) => { e.target.style.color = "rgba(224,85,85,0.6)"; e.target.style.borderColor = "rgba(224,85,85,0.2)"; }}
                  >
                      Trocar de plano
                  </button>
              </>
          )}
            </div>
          )}

        {/* Botão cancelar — só aparece se o plano estiver ativo */}
{MensalidadeParcelasDTOS?.statusLiberacao === "ATIVADO" && (
  <button
    onClick={cancelarPlano}
    style={{
      alignSelf: "flex-start",
      marginTop: 8,
      fontFamily: "'Barlow', sans-serif",
      fontWeight: 600,
      fontSize: "0.7rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      padding: "9px 18px",
      background: "transparent",
      color: "#e05555",
      border: "1px solid rgba(224,85,85,0.35)",
      cursor: "pointer",
      transition: "all 0.2s",
    }}
    onMouseEnter={(e) => {
      e.target.style.background = "rgba(224,85,85,0.08)";
      e.target.style.borderColor = "rgba(224,85,85,0.7)";
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "transparent";
      e.target.style.borderColor = "rgba(224,85,85,0.35)";
    }}
  >
    Cancelar Plano
  </button>
)}


        </div>

        {/* card próxima parcela */}
        <div style={{ minWidth: "280px" }}>
          {ultimaParcela ? (
            <div
              style={{ ...S.parcelaCard, marginTop: 0, cursor: "pointer" }}
              onClick={() => setParcelaSelecionada({ ...ultimaParcela, _index: MensalidadeParcelasDTOS.parcelas.indexOf(ultimaParcela) })}
              title="Clique para ver detalhes"
            >
              <span style={S.parcelaLabel}>Próxima Parcela <span style={{ fontSize: "0.55rem", color: "rgba(196,160,100,0.5)", marginLeft: 6 }}>— clique para detalhes</span></span>
              <div style={S.parcelaValor}>
                R$ {ultimaParcela.valor.toFixed(2).replace(".", ",")}
              </div>
              <p style={{ ...S.planoTexto, fontSize: "0.7rem", margin: "4px 0" }}>
                Vencimento: <span style={{ color: "#f0ece4" }}>{new Date(ultimaParcela.dataVencimento).toLocaleDateString("pt-BR")}</span>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: ultimaParcela.status === "PENDENTE" ? "#e05555" : "#6fcf7a" }} />
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", fontWeight: "bold", textTransform: "uppercase", color: ultimaParcela.status === "PENDENTE" ? "#e05555" : "#6fcf7a" }}>
                  {ultimaParcela.status}
                </span>
              </div>
               {/* ← ADICIONA ISSO */}
              {ultimaParcela.status === "PENDENTE" && (
                <p style={{
                  fontSize: "0.62rem",
                  color: "rgba(196,160,100,0.5)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.5,
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: "1px solid rgba(196,160,100,0.1)",
                }}>
                  Já pagou? Clique aqui para verificar o status do seu pagamento.
                </p>
              )}
            </div>
          ) : (
            <div style={{ ...S.parcelaCard, opacity: 0.5, borderLeftColor: "rgba(196,160,100,0.1)" }}>
              <span style={S.parcelaLabel}>Nenhuma parcela</span>
              <div style={{ ...S.parcelaValor, fontSize: "0.9rem" }}>Sem débitos</div>
            </div>
          )}
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main style={S.content}>
        {erro && <p style={{ color: "#e05555", marginBottom: 16, fontSize: "0.82rem" }}>{erro}</p>}

        {/* bloco sisrun */}
        {deveExibirSisrun && (
          <BannerSisrun nomeAluno={aluno?.nome} />  // sem onAbrirTutorial
        )}

        {/* ── HISTÓRICO DE PARCELAS — clicável ── */}
        <p style={S.sectionLabel}>Últimos meses / Parcelas <span style={{ color: "rgba(196,160,100,0.4)", fontWeight: 400, fontSize: "0.55rem", marginLeft: 8 }}>clique em uma parcela para ver detalhes</span></p>

        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 48 }}>
          {MensalidadeParcelasDTOS.parcelas?.map((p, index) => {
            const cs = corStatus(p.status);
            const isPendente = p.status === "PENDENTE" || p.status === "AGUARDANDO";
            return (
              <div
                key={p.id}
                onClick={() => setParcelaSelecionada({ ...p, _index: index })}
                style={{
                  display: "grid", gridTemplateColumns: "44px 1fr 1fr 130px 36px",
                  alignItems: "center", padding: "14px 20px",
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(196,160,100,0.06)",
                  borderLeft: `2px solid ${cs.color}`,
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
                  opacity: p.status === "FINALIZADO" ? 0.75 : 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,160,100,0.04)"; e.currentTarget.style.borderColor = cs.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; e.currentTarget.style.borderLeftColor = cs.color; e.currentTarget.style.borderTopColor = "rgba(196,160,100,0.06)"; e.currentTarget.style.borderRightColor = "rgba(196,160,100,0.06)"; e.currentTarget.style.borderBottomColor = "rgba(196,160,100,0.06)"; }}
              >
                {/* número */}
                <span style={{ fontSize: "0.62rem", color: "rgba(196,160,100,0.35)", letterSpacing: "0.1em" }}>#{index + 1}</span>

                {/* data */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(196,160,100,0.4)", textTransform: "uppercase", marginBottom: 2 }}>Vencimento</span>
                  <span style={{ fontSize: "0.85rem", color: "#f0ece4" }}>{new Date(p.dataVencimento).toLocaleDateString("pt-BR")}</span>
                </div>

                {/* valor */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(196,160,100,0.4)", textTransform: "uppercase", marginBottom: 2 }}>Valor</span>
                  <span style={{ fontSize: "0.85rem", color: "#c4a064", fontWeight: 600 }}>{formatarValor(p.valor)}</span>
                </div>

                {/* status badge */}
                <div>
                  <span style={{
                    fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.08em",
                    padding: "4px 10px", borderRadius: 3, textTransform: "uppercase",
                    background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`,
                  }}>
                    {emojiStatus(p.status)} {p.status}
                  </span>
                </div>

                {/* seta → */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "0.75rem", color: "rgba(196,160,100,0.3)", transition: "color 0.15s" }}>›</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* dados pessoais */}
        <p style={S.sectionLabel}>Dados Pessoais</p>
        <div style={S.grid}>
          {CAMPOS_PESSOAIS.map(({ key, label, editable, type }) => (
            <CampoInfo key={key} label={label} type={type} editable={editable}
              value={getNestedValue(editado, key)} onChange={(val) => atualizarCampo(key, val)} />
          ))}
        </div>

        {/* dados da conta */}
        <p style={S.sectionLabel}>Dados da Conta</p>
        <div style={S.grid}>
          {CAMPOS_CONTA.map(({ key, label, editable }) => (
            <CampoInfo key={key} label={label} editable={editable}
              value={getNestedValue(editado, key)} onChange={(val) => atualizarCampo(key, val)} />
          ))}
        </div>
        <div style={{ marginTop: 8, marginBottom: 32, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setModalSenha(true)}
            style={{
              ...S.btnSecondary,
              fontSize: "0.7rem", padding: "9px 18px",
              color: "rgba(196,160,100,0.7)",
              borderColor: "rgba(196,160,100,0.25)",
            }}
          >
            🔒 Trocar Senha
          </button>
        </div>
        {/* salvar */}
        <div style={S.saveBar}>
          <button style={S.btnSecondary} onClick={() => setEditado(aluno)}
            onMouseEnter={(e) => { e.target.style.color = "#f0ece4"; e.target.style.borderColor = "rgba(240,236,228,0.5)"; }}
            onMouseLeave={(e) => { e.target.style.color = "rgba(240,236,228,0.4)"; e.target.style.borderColor = "rgba(240,236,228,0.15)"; }}>
            Descartar
          </button>
          <button style={{ ...S.btnPrimary, opacity: salvando ? 0.6 : 1 }}
            onClick={salvarAlteracoes} disabled={salvando}
            onMouseEnter={(e) => { if (!salvando) { e.target.style.background = "transparent"; e.target.style.color = "#c4a064"; } }}
            onMouseLeave={(e) => { e.target.style.background = "#c4a064"; e.target.style.color = "#0a0a0a"; }}>
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </main>

      {toast && <div style={S.toast(toast.ok)}>{toast.ok ? "✓" : "✕"} &nbsp; {toast.msg}</div>}

      <style>{`
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translate(-50%,20px)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(196,160,100,0.3)} 50%{box-shadow:0 0 0 8px rgba(196,160,100,0)} }
      `}</style>
    </div>
  );
}