import React, { useState, useEffect } from "react";
import { S, corStatus, emojiStatus, formatarValor, formatarData } from "./estilosAluno";

/* ─────────────────────────────────────────────────────────────
   Helpers de tradução / exibição
   ⚠️ Se você já tiver essas funções em outro arquivo
   (ex: estilosAluno.js ou utils.js), me avise para eu trocar
   por um import em vez de manter essas cópias locais.
───────────────────────────────────────────────────────────── */

function traduzirMpStatus(mpStatus) {
  const mapa = {
    approved: { texto: "Aprovado", cor: "#6fcf7a" },
    pending: { texto: "Pendente", cor: "#e0a055" },
    in_process: { texto: "Em análise", cor: "#e0a055" },
    rejected: { texto: "Rejeitado", cor: "#e05555" },
    cancelled: { texto: "Cancelado", cor: "#e05555" },
    refunded: { texto: "Reembolsado", cor: "#c4a064" },
    charged_back: { texto: "Estornado", cor: "#e05555" },
  };
  return mapa[mpStatus] || { texto: mpStatus, cor: "#c4a064" };
}

function traduzirStatusDetail(detail) {
  const mapa = {
    accredited: "Pagamento creditado com sucesso.",
    pending_contingency: "Aguardando confirmação do meio de pagamento.",
    pending_review_manual: "Pagamento em análise manual.",
    cc_rejected_insufficient_amount: "Saldo/limite insuficiente no cartão.",
    cc_rejected_bad_filled_card_number: "Número do cartão incorreto.",
    cc_rejected_bad_filled_date: "Data de validade incorreta.",
    cc_rejected_bad_filled_security_code: "Código de segurança incorreto.",
    cc_rejected_call_for_authorize: "Pagamento não autorizado pelo banco.",
    cc_rejected_card_disabled: "Cartão desabilitado. Contate seu banco.",
    cc_rejected_high_risk: "Pagamento recusado por segurança.",
    expired: "Pagamento expirado.",
  };
  return mapa[detail] || detail;
}

function traduzirMetodo(metodo) {
  const mapa = {
    pix: "Pix",
    credit_card: "Cartão de Crédito",
    debit_card: "Cartão de Débito",
    ticket: "Boleto",
    bank_transfer: "Transferência Bancária",
  };
  return mapa[metodo] || metodo;
}

function InfoRow({ label, valor, cor, mono, copiavel }) {
  const [copiado, setCopiado] = useState(false);

  if (!valor) return null;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(String(valor));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      /* silencioso */
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid rgba(196,160,100,0.06)",
        gap: 12,
      }}
    >
      <span style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.5)", flexShrink: 0 }}>
        {label}
      </span>
      <span
        onClick={copiavel ? copiar : undefined}
        title={copiavel ? "Clique para copiar" : undefined}
        style={{
          fontSize: "0.8rem",
          color: cor || "#f0ece4",
          fontFamily: mono ? "monospace" : "inherit",
          textAlign: "right",
          wordBreak: "break-all",
          cursor: copiavel ? "pointer" : "default",
        }}
      >
        {copiado ? "Copiado ✓" : valor}
      </span>
    </div>
  );
}

/* ─── modal detalhes da parcela ───────────────────────────────────────── */
export function ModalParcela({ parcela, urlMensalidade, nomePlano, onClose, onPagar, token, onConfirmado }) {
  const [detalhe, setDetalhe] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [verificando, setVerificando] = useState(false);
  const [resultadoVerificacao, setResultadoVerificacao] = useState(null);

  useEffect(() => {
    async function buscarDetalhe() {
      setCarregando(true);
      try {
        const res = await fetch(`${urlMensalidade}/parcela/${parcela.id}`, {
          headers: { Authorization: `Bearer ${token}` },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parcela.id]);

  async function verificarPagamento() {
    setVerificando(true);
    setResultadoVerificacao(null);
    try {
      const res = await fetch(`${urlMensalidade}/verificar-pagamento/${parcela.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResultadoVerificacao(data);

      if (data.status === "FINALIZADO") {
        const res2 = await fetch(`${urlMensalidade}/parcela/${parcela.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res2.ok) setDetalhe(await res2.json());

        await onConfirmado?.();
      }
    } catch {
      setResultadoVerificacao({
        status: "ERRO",
        mensagem: "Erro de conexão. Tente novamente.",
      });
    } finally {
      setVerificando(false);
    }
  }

  const d = detalhe ?? parcela;

  const statusExibido = d.mpStatus
    ? traduzirMpStatus(d.mpStatus)
    : { texto: d.status, cor: corStatus(d.status).color };

  const podePagar = d.status === "PENDENTE" || d.status === "AGUARDANDO";
  const foiPago = d.status === "FINALIZADO" || d.mpStatus === "approved";

  function fmtData(iso) {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#111",
          border: "1px solid rgba(196,160,100,0.18)",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 40px 80px rgba(0,0,0,0.85)",
          animation: "slideUp 0.22s ease",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* ── header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px 20px",
            borderBottom: "1px solid rgba(196,160,100,0.1)",
            background: "rgba(196,160,100,0.03)",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.35em",
                color: "rgba(196,160,100,0.45)",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Parcela #{(parcela._index ?? 0) + 1} — {nomePlano}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#f0ece4", fontWeight: 600 }}>
              Detalhes do Pagamento
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(240,236,228,0.1)",
              color: "rgba(240,236,228,0.3)",
              cursor: "pointer",
              fontSize: 13,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* ── loading ── */}
        {carregando ? (
          <div style={{ padding: "52px 24px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#c4a064",
                    animation: `db 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontSize: "0.68rem",
                color: "rgba(240,236,228,0.25)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Consultando Mercado Pago…
            </p>
          </div>
        ) : (
          <div style={{ padding: "20px 20px 8px" }}>
            {/* ── bloco principal: status + valor ── */}
            <div style={{ display: "flex", alignItems: "stretch", gap: 2, marginBottom: 16 }}>
              <div
                style={{
                  flex: 1,
                  padding: "18px 18px",
                  background: `${statusExibido.cor}0f`,
                  border: `1px solid ${statusExibido.cor}30`,
                  borderLeft: `3px solid ${statusExibido.cor}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: "0.52rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(240,236,228,0.3)",
                  }}
                >
                  Status
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.1rem" }}>{emojiStatus(d.status)}</span>
                  <span
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      color: statusExibido.cor,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {statusExibido.texto}
                  </span>
                </div>
                {d.mpStatusDetail && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(240,236,228,0.45)",
                      lineHeight: 1.4,
                      marginTop: 2,
                    }}
                  >
                    {traduzirStatusDetail(d.mpStatusDetail)}
                  </span>
                )}
              </div>

              <div
                style={{
                  padding: "18px 20px",
                  textAlign: "right",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(196,160,100,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 4,
                  minWidth: 120,
                }}
              >
                <span
                  style={{
                    fontSize: "0.52rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(240,236,228,0.3)",
                  }}
                >
                  Valor
                </span>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "2rem",
                    color: "#f0ece4",
                    lineHeight: 1,
                  }}
                >
                  {formatarValor(d.valor ?? d.mpValorTransacao ?? 0)}
                </span>
                {d.mpValorTransacao && Number(d.mpValorTransacao) !== Number(d.valor) && (
                  <span style={{ fontSize: "0.62rem", color: "#e0a055" }}>
                    MP: {formatarValor(d.mpValorTransacao)}
                  </span>
                )}
              </div>
            </div>

            {/* ── seção: Informações da Parcela ── */}
            <p
              style={{
                fontSize: "0.52rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(196,160,100,0.4)",
                marginBottom: 3,
              }}
            >
              Parcela
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 14 }}>
              <InfoRow label="Vencimento" valor={fmtData(d.dataVencimento)} />
              <InfoRow label="Número da Parcela" valor={`${(parcela._index ?? 0) + 1}ª parcela`} />
              <InfoRow label="Plano" valor={nomePlano} />
            </div>

            {/* ── seção: Pagamento ── */}
            {(d.mpStatus || d.formaPagamento || d.mpDataAprovacao || d.mpPaymentId) && (
              <>
                <p
                  style={{
                    fontSize: "0.52rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(196,160,100,0.4)",
                    marginBottom: 3,
                    marginTop: 14,
                  }}
                >
                  Pagamento
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 14 }}>
                  {(d.mpMetodoPagamento || d.formaPagamento) && (
                    <InfoRow
                      label="Método"
                      valor={traduzirMetodo(d.mpMetodoPagamento || d.formaPagamento)}
                    />
                  )}

                  {d.mpDataAprovacao && (
                    <InfoRow
                      label="Data do Pagamento"
                      valor={fmtData(d.mpDataAprovacao)}
                      cor="#6fcf7a"
                    />
                  )}

                  {d.mpPaymentId && (
                    <InfoRow
                      label="ID da Transação"
                      valor={String(d.mpPaymentId)}
                      mono
                      copiavel
                    />
                  )}

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

            {/* ── avisos contextuais ── */}
            {podePagar && !d.mpStatus && (
              <div
                style={{
                  padding: "11px 14px",
                  marginBottom: 16,
                  background: "rgba(224,160,85,0.05)",
                  border: "1px solid rgba(224,160,85,0.18)",
                  borderLeft: "3px solid #e0a055",
                }}
              >
                <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.6 }}>
                  <span style={{ color: "#e0a055", fontWeight: 700 }}>Parcela em aberto. </span>
                  Clique em <strong style={{ color: "#f0ece4" }}>Ir para Pagamento</strong> para pagar.
                  Se já pagou e ainda aparece pendente, aguarde alguns minutos e volte aqui.
                </p>
              </div>
            )}

            {podePagar && d.mpStatus === "approved" && (
              <div
                style={{
                  padding: "11px 14px",
                  marginBottom: 16,
                  background: "rgba(111,207,122,0.05)",
                  border: "1px solid rgba(111,207,122,0.2)",
                  borderLeft: "3px solid #6fcf7a",
                }}
              >
                <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.6 }}>
                  <span style={{ color: "#6fcf7a", fontWeight: 700 }}>
                    Pagamento aprovado no Mercado Pago!{" "}
                  </span>
                  O sistema ainda está processando a confirmação. Aguarde alguns minutos.
                </p>
              </div>
            )}

            {foiPago && d.status === "FINALIZADO" && (
              <div
                style={{
                  padding: "11px 14px",
                  marginBottom: 16,
                  background: "rgba(111,207,122,0.05)",
                  border: "1px solid rgba(111,207,122,0.18)",
                  borderLeft: "3px solid #6fcf7a",
                }}
              >
                <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.45)", lineHeight: 1.6 }}>
                  <span style={{ color: "#6fcf7a", fontWeight: 700 }}>Pagamento confirmado. </span>
                  Guarde o ID da transação acima como comprovante. Em caso de dúvidas, entre em
                  contato com o suporte.
                </p>
              </div>
            )}

            {d.mpErro && !d.mpStatus && (
              <div
                style={{
                  padding: "11px 14px",
                  marginBottom: 16,
                  background: "rgba(196,160,100,0.04)",
                  border: "1px solid rgba(196,160,100,0.12)",
                  borderLeft: "3px solid rgba(196,160,100,0.4)",
                }}
              >
                <p style={{ fontSize: "0.68rem", color: "rgba(240,236,228,0.35)", lineHeight: 1.5 }}>
                  ℹ️{" "}
                  {d.mpErro === "Aguardando confirmação do Mercado Pago"
                    ? "Nenhum pagamento registrado ainda para esta parcela."
                    : d.mpErro}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── footer ── */}
        {!carregando && (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "14px 20px 20px",
              justifyContent: "flex-end",
              borderTop: "1px solid rgba(196,160,100,0.07)",
              flexWrap: "wrap",
              position: "sticky",
              bottom: 0,
              background: "#111",
            }}
          >
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

            {resultadoVerificacao && (
              <div
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  marginTop: 4,
                  background:
                    resultadoVerificacao.status === "FINALIZADO"
                      ? "rgba(111,207,122,0.08)"
                      : resultadoVerificacao.status === "PENDENTE"
                      ? "rgba(224,160,85,0.08)"
                      : "rgba(224,85,85,0.08)",
                  border: `1px solid ${
                    resultadoVerificacao.status === "FINALIZADO"
                      ? "rgba(111,207,122,0.3)"
                      : resultadoVerificacao.status === "PENDENTE"
                      ? "rgba(224,160,85,0.3)"
                      : "rgba(224,85,85,0.3)"
                  }`,
                  fontSize: "0.7rem",
                  color:
                    resultadoVerificacao.status === "FINALIZADO"
                      ? "#6fcf7a"
                      : resultadoVerificacao.status === "PENDENTE"
                      ? "#e0a055"
                      : "#e05555",
                  letterSpacing: "0.05em",
                }}
              >
                {resultadoVerificacao.mensagem}
              </div>
            )}

            {/* pendente/aguardando → pagar (só aparece se onPagar foi passado, ex: tela do próprio aluno) */}
            {podePagar && onPagar && (
              <button onClick={() => onPagar(d)} style={{ ...S.btnPrimary, padding: "9px 20px", fontSize: "0.68rem" }}>
                Ir para Pagamento →
              </button>
            )}

            {/* finalizado → ver comprovante (idem, opcional) */}
            {d.status === "FINALIZADO" && onPagar && (
              <button
                onClick={() => onPagar(d)}
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "9px 18px",
                  background: "transparent",
                  color: "#6fcf7a",
                  border: "1px solid rgba(111,207,122,0.28)",
                  cursor: "pointer",
                }}
              >
                Ver Comprovante →
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes db { 0%,80%,100%{transform:translateY(0);opacity:.3} 40%{transform:translateY(-7px);opacity:1} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}