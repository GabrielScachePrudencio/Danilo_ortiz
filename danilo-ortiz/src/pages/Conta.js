import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

/* ─── estilos ─────────────────────────────────────────────────────────── */
const S = {
  gateCard: {
    maxWidth: 440, margin: "0 auto", textAlign: "center",
    padding: "64px 48px", background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(196,160,100,0.15)",
  },
  gateTitulo: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem",
    letterSpacing: "0.04em", color: "#f0ece4", marginBottom: 12,
  },
  gateDesc: {
    fontSize: "0.85rem", fontWeight: 300,
    color: "rgba(240,236,228,0.4)", letterSpacing: "0.05em", marginBottom: 36,
  },
  page: {
    minHeight: "100vh", background: "#0a0a0a",
    color: "#f0ece4", fontFamily: "'Barlow', sans-serif",
  },
  hero: {
    position: "relative", zIndex: 1, padding: "72px 48px 40px",
    borderBottom: "1px solid rgba(196,160,100,0.12)",
    display: "flex", justifyContent: "space-between",
  },
  heroEyebrow: {
    fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.3em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.6)", marginBottom: 12,
  },
  heroName: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 0.9,
    letterSpacing: "0.04em", color: "#f0ece4", marginBottom: 8,
  },
  heroBadge: (tipo) => ({
    display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
    padding: "4px 14px", fontSize: "0.65rem", fontWeight: 600,
    letterSpacing: "0.2em", textTransform: "uppercase",
    border: `1px solid ${tipo === "ADMIN" ? "#c4a064" : "rgba(240,236,228,0.2)"}`,
    color: tipo === "ADMIN" ? "#c4a064" : "rgba(240,236,228,0.4)",
    background: "transparent",
  }),
  content: {
    maxWidth: 860, margin: "0 auto", padding: "48px 48px 140px",
    position: "relative", zIndex: 1,
  },
  sectionLabel: {
    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.35em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
    marginBottom: 24, paddingBottom: 12,
    borderBottom: "1px solid rgba(196,160,100,0.1)",
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 2, marginBottom: 48,
  },
  field: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(196,160,100,0.1)",
    padding: "20px 24px", transition: "all 0.25s ease", position: "relative",
  },
  fieldLabel: {
    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.25em",
    textTransform: "uppercase", color: "rgba(196,160,100,0.5)",
    marginBottom: 8, display: "block",
  },
  fieldValue: { fontSize: "0.95rem", color: "#f0ece4", wordBreak: "break-all" },
  input: {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid #c4a064", color: "#f0ece4",
    fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem",
    padding: "4px 0", outline: "none",
  },
  editBtn: {
    position: "absolute", top: 16, right: 16, background: "transparent",
    border: "none", color: "rgba(196,160,100,0.4)", cursor: "pointer",
    fontSize: "0.7rem", letterSpacing: "0.1em", fontFamily: "'Barlow', sans-serif",
    textTransform: "uppercase", transition: "color 0.2s", padding: 0,
  },
  saveBar: {
    display: "flex", justifyContent: "flex-end", gap: 12,
    marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(196,160,100,0.1)",
  },
  btnPrimary: {
    fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.75rem",
    letterSpacing: "0.15em", textTransform: "uppercase", padding: "12px 28px",
    background: "#c4a064", color: "#0a0a0a", border: "1px solid #c4a064",
    cursor: "pointer", transition: "all 0.25s ease",
  },
  btnSecondary: {
    fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px",
    background: "transparent", color: "rgba(240,236,228,0.4)",
    border: "1px solid rgba(240,236,228,0.15)", cursor: "pointer",
    transition: "all 0.25s ease",
  },
  toast: (ok) => ({
    position: "fixed", bottom: 32, right: 32, padding: "14px 24px",
    background: ok ? "rgba(90,180,100,0.12)" : "rgba(224,85,85,0.12)",
    border: `1px solid ${ok ? "rgba(90,180,100,0.4)" : "rgba(224,85,85,0.4)"}`,
    color: ok ? "#6fcf7a" : "#e05555", fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: "'Barlow', sans-serif", zIndex: 999, animation: "fadeIn 0.3s ease",
  }),
  planoInfoContainer: { marginTop: 24, display: "flex", flexDirection: "column", gap: 12 },
  planoTexto: { fontSize: "0.8rem", color: "rgba(240,236,228,0.5)", letterSpacing: "0.05em" },
  planoDestaque: { color: "#c4a064", fontWeight: 600 },
  btnPagar: {
    alignSelf: "flex-start", marginTop: 8, fontFamily: "'Barlow', sans-serif",
    fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em",
    textTransform: "uppercase", padding: "10px 20px", background: "#c4a064",
    color: "#0a0a0a", border: "none", cursor: "pointer",
  },
  parcelaCard: {
    padding: "32px",
    background: "linear-gradient(145deg, rgba(196,160,100,0.08) 0%, rgba(255,255,255,0.02) 100%)",
    borderLeft: "4px solid #c4a064", display: "flex", flexDirection: "column",
    gap: 12, minWidth: "380px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  parcelaLabel: {
    fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase",
    color: "#c4a064", fontWeight: 700,
  },
  parcelaValor: {
    fontSize: "3.5rem", fontFamily: "'Bebas Neue', sans-serif",
    color: "#f0ece4", lineHeight: 1, margin: "8px 0",
  },
};

/* ─── campos ──────────────────────────────────────────────────────────── */
const CAMPOS_PESSOAIS = [
  { key: "nome",     label: "Nome Completo", editable: true },
  { key: "email",    label: "E-mail",        editable: true },
  { key: "whatsapp", label: "WhatsApp",      editable: true },
  { key: "senha",    label: "Senha",         editable: true, type: "password" },
  { key: "CPF",      label: "CPF",           editable: true },
  { key: "CNPJ",     label: "CNPJ",          editable: true },
  { key: "rua",      label: "Rua",           editable: true },
  { key: "numero",   label: "Número",        editable: true },
  { key: "cidade",   label: "Cidade",        editable: true },
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

const SISRUN_STEPS = [
  {
    titulo: "Acesse o site ou app do SISRUN",
    descricao: "Baixe o aplicativo SISRUN na App Store ou Google Play, ou acesse pelo navegador em sisrun.com.br.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+1+%E2%80%94+Acessar+o+SISRUN",
  },
  {
    titulo: "Clique em 'Criar Conta'",
    descricao: "Na tela inicial do app, toque no botão 'Criar Conta' ou 'Cadastrar-se' na parte inferior da tela de login.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+2+%E2%80%94+Criar+Conta",
  },
  {
    titulo: "Preencha seus dados pessoais",
    descricao: "Informe seu nome completo, e-mail e crie uma senha forte. Use o mesmo e-mail cadastrado aqui na plataforma.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+3+%E2%80%94+Preencher+Dados",
  },
  {
    titulo: "Confirme seu e-mail",
    descricao: "Verifique sua caixa de entrada e clique no link de confirmação enviado pelo SISRUN para ativar sua conta.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+4+%E2%80%94+Confirmar+E-mail",
  },
  {
    titulo: "Anote seu usuário e avise o Danilo",
    descricao: "Com a conta criada, copie seu nome de usuário do SISRUN e envie para o Danilo pelo WhatsApp.",
    img: "https://placehold.co/480x240/0d0d0d/c4a064?text=Passo+5+%E2%80%94+Avisar+o+Danilo",
  },
];

const DANILO_WHATSAPP = "5516996339294";

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
function ModalParcela({ parcela, urlMensalidade, onClose, onPagar, nomePlano }) {
  const [detalhe, setDetalhe] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDetalhe() {
      setCarregando(true);
      try {
        const res = await fetch(`${urlMensalidade}/parcela/${parcela.id}`);
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

/* ─── modal tutorial sisrun ───────────────────────────────────────────── */
function ModalSisrun({ onClose, nomeAluno, confirmarTrocaStatus  }) {
  const [passo, setPasso] = useState(0);
  const total = SISRUN_STEPS.length;
  const step = SISRUN_STEPS[passo];
  const isUltimo = passo === total - 1;
  const msgWhats = encodeURIComponent(`Olá Danilo! Sou ${nomeAluno || "aluno da plataforma"} e acabei de criar minha conta no SISRUN. Meu usuário é: `);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.2s ease" }}>
      <div style={{ background: "#111", border: "1px solid rgba(196,160,100,0.2)", width: "100%", maxWidth: 520, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid rgba(196,160,100,0.1)", background: "rgba(196,160,100,0.03)" }}>
          <div>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(196,160,100,0.5)", textTransform: "uppercase", marginBottom: 2 }}>Tutorial SISRUN</p>
            <p style={{ fontSize: "0.88rem", color: "#f0ece4", fontWeight: 600 }}>Como criar sua conta</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(240,236,228,0.12)", color: "rgba(240,236,228,0.35)", cursor: "pointer", fontSize: 14, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
        </div>
        <div style={{ position: "relative", background: "#0a0a0a" }}>
          <img src={step.img} alt={`Passo ${passo + 1}`} style={{ width: "100%", height: 200, objectFit: "cover", display: "block", opacity: 0.85 }} />
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
            {SISRUN_STEPS.map((_, i) => (
              <div key={i} onClick={() => setPasso(i)} style={{ width: i === passo ? 22 : 6, height: 6, borderRadius: 3, background: i === passo ? "#c4a064" : "rgba(196,160,100,0.25)", cursor: "pointer", transition: "all 0.3s ease" }} />
            ))}
          </div>
        </div>
        <div style={{ padding: "22px 26px 8px" }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(196,160,100,0.45)", marginBottom: 7 }}>Passo {passo + 1} de {total}</p>
          <h3 style={{ fontSize: "1rem", color: "#f0ece4", marginBottom: 9, fontWeight: 600, lineHeight: 1.3 }}>{step.titulo}</h3>
          <p style={{ fontSize: "0.83rem", color: "rgba(240,236,228,0.52)", lineHeight: 1.65 }}>{step.descricao}</p>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "16px 26px 22px", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
          {isUltimo ? (
            <a href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", background: "#25d366", color: "#fff", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, fontFamily: "'Barlow', sans-serif", textDecoration: "none" }}>
              <WaIcon /> Avisar Danilo
            </a>
          ) : <div />}
          <div style={{ display: "flex", gap: 8 }}>
            {passo > 0 && <button onClick={() => setPasso((p) => p - 1)} style={{ ...S.btnSecondary, padding: "9px 18px", fontSize: "0.7rem" }}>← Voltar</button>}
            {!isUltimo
              ? <button onClick={() => setPasso((p) => p + 1)} style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.7rem" }}>Próximo →</button>
              : <button onClick={confirmarTrocaStatus} style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.7rem" }}>Concluir ✓</button>
            }
          </div>
        </div>
      </div>
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
function BannerSisrun({ nomeAluno, onAbrirTutorial }) {
  const [visivel, setVisivel] = useState(true);
  const msgWhats = encodeURIComponent(`Olá Danilo! Sou ${nomeAluno || "aluno da plataforma"} e quero informar meu usuário do SISRUN. Meu usuário é: `);
  if (!visivel) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 400, width: "calc(100% - 40px)", maxWidth: 680, background: "linear-gradient(135deg, #150f00 0%, #0f0f0f 70%)", border: "1px solid #c4a064", borderLeft: "5px solid #c4a064", padding: "16px 20px", boxShadow: "0 8px 48px rgba(196,160,100,0.18), 0 2px 12px rgba(0,0,0,0.6)", animation: "slideUp 0.4s ease", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(196,160,100,0.1)", border: "1px solid rgba(196,160,100,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "pulse 2s infinite", fontSize: 17 }}>⚡</div>
      <div style={{ flex: 1, minWidth: 180 }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c4a064", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Você ainda não criou sua conta no SISRUN!</p>
        <p style={{ fontSize: "0.76rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.5 }}>Crie agora e avise o Danilo com seu usuário para ele te encontrar no app.</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={onAbrirTutorial} style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 15px", background: "#c4a064", color: "#0a0a0a", border: "none", cursor: "pointer" }}>Como criar →</button>
        <a href={`https://wa.me/${DANILO_WHATSAPP}?text=${msgWhats}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 13px", background: "transparent", color: "#25d366", border: "1px solid rgba(37,211,102,0.3)", cursor: "pointer", textDecoration: "none" }}><WaIcon /> Falar com Danilo</a>
        <button onClick={() => setVisivel(false)} style={{ background: "transparent", border: "none", color: "rgba(240,236,228,0.2)", cursor: "pointer", fontSize: 15, padding: "8px 6px", lineHeight: 1 }}>✕</button>
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


  const [emailLogado, setEmailLogado] = useState(null);

  const [aluno, setAluno]                                     = useState(null);
  const [MensalidadeParcelasDTOS, setMensalidadeParcelasDTOS] = useState({});
  const [editado, setEditado]                                 = useState({});
  const [erro, setErro]                                       = useState(null);
  const [salvando, setSalvando]                               = useState(false);
  const [toast, setToast]                                     = useState(null);
  const [modalSisrun, setModalSisrun]                         = useState(false);

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
  const API = isRailway   ? "http://localhost:3001"  : (process.env.REACT_APP_API_URL || "http://localhost:3001");

  
  
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

      if (res.ok) { const d = await res.json(); setAluno(d); setEditado(d); }
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

  function atualizarCampo(key, valor) {
    setEditado((prev) => {
      const keys = key.split(".");
      if (keys.length === 1) return { ...prev, [key]: valor };
      return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: valor } };
    });
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
  } finally {
    setModalSisrun(false);
  }
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
        />
      )}

      {/* ── MODAL SISRUN ── */}
      {modalSisrun && <ModalSisrun onClose={() => setModalSisrun(false)} nomeAluno={aluno?.nome} confirmarTrocaStatus={confirmarTrocaStatusSisrun}/>}

      {/* ── BANNER FIXO SISRUN ── */}
      {deveExibirSisrun && (
        <BannerSisrun nomeAluno={aluno?.nome} onAbrirTutorial={() => setModalSisrun(true)} />
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
              <span onClick={() => setModalSisrun(true)} title="Clique para ver como criar" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "4px 14px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid rgba(224,85,85,0.55)", color: "#e05555", background: "rgba(224,85,85,0.07)", cursor: "pointer", animation: "pulse 2.5s infinite" }}>
                ⚠ SISRUN não criado — clique aqui
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
              {MensalidadeParcelasDTOS.statusLiberacao === "DESATIVADO" && (
                <button style={S.btnPagar} onClick={() => navigate(`/home/telapagamento/${MensalidadeParcelasDTOS.planoId}`)}>
                  Pagar e Ativar Conta
                </button>
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
          <div style={{ marginBottom: 36, background: "linear-gradient(135deg, rgba(196,160,100,0.05) 0%, transparent 100%)", border: "1px solid rgba(196,160,100,0.22)", borderLeft: "4px solid #c4a064", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c4a064", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 5 }}>⚡ Conta SISRUN pendente</p>
              <p style={{ fontSize: "0.8rem", color: "rgba(240,236,228,0.48)", lineHeight: 1.6, maxWidth: 420 }}>Sua assinatura está ativa mas você ainda não criou sua conta no SISRUN. Crie e informe seu usuário ao Danilo para ter acesso completo ao app.</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setModalSisrun(true)} style={{ ...S.btnPrimary, padding: "9px 18px", fontSize: "0.68rem" }}>Ver tutorial</button>
              <a href={`https://wa.me/${DANILO_WHATSAPP}?text=${encodeURIComponent(`Olá Danilo! Sou ${aluno?.nome} e criei minha conta no SISRUN. Meu usuário é: `)}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "9px 14px", background: "transparent", color: "#25d366", border: "1px solid rgba(37,211,102,0.28)", cursor: "pointer", textDecoration: "none" }}>
                <WaIcon /> Conversar com Danilo
              </a>
            </div>
          </div>
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