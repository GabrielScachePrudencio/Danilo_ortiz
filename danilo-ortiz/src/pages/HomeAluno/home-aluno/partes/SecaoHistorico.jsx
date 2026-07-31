import React from "react";
import { corStatus, emojiStatus } from "./estilosAluno";

export function SecaoHistorico({
  historico,
  historicoAberto,
  setHistoricoAberto,
  mensalidadeExpandida,
  setMensalidadeExpandida,
  formatarValor,
  onSelecionarParcela, // (parcelaComIndex, nomePlano) => void — abre o ModalParcela
}) {
  if (!historico?.historicoMensalidades?.length) return null;

  const total = historico.historicoMensalidades.length;

  function badgeHistorico(status) {
    switch (status) {
      case "CANCELADO":
        return { cor: "#e05555", bg: "rgba(224,85,85,0.08)", border: "rgba(224,85,85,0.25)" };
      case "DESATIVADO":
        return { cor: "#e0a055", bg: "rgba(224,160,85,0.08)", border: "rgba(224,160,85,0.25)" };
      default:
        return { cor: "#c4a064", bg: "rgba(196,160,100,0.08)", border: "rgba(196,160,100,0.25)" };
    }
  }

  return (
    <div style={{ marginBottom: 48 }}>
      {/* label da seção */}
      <p
        style={{
          fontSize: "0.6rem",
          fontWeight: 600,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(196,160,100,0.5)",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px solid rgba(196,160,100,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Histórico de Mensalidades</span>
        <span style={{ color: "rgba(196,160,100,0.3)", fontWeight: 400, fontSize: "0.55rem" }}>
          {total} mensalidade{total !== 1 ? "s" : ""} anterior{total !== 1 ? "es" : ""}
        </span>
      </p>

      {/* botão toggle */}
      <button
        onClick={() => setHistoricoAberto((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(196,160,100,0.1)",
          borderLeft: "2px solid rgba(196,160,100,0.3)",
          cursor: "pointer",
          fontFamily: "'Barlow', sans-serif",
          transition: "background 0.15s, border-color 0.15s",
          marginBottom: historicoAberto ? 3 : 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(196,160,100,0.04)";
          e.currentTarget.style.borderColor = "rgba(196,160,100,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.015)";
          e.currentTarget.style.borderLeftColor = "rgba(196,160,100,0.3)";
          e.currentTarget.style.borderTopColor = "rgba(196,160,100,0.1)";
          e.currentTarget.style.borderRightColor = "rgba(196,160,100,0.1)";
          e.currentTarget.style.borderBottomColor = "rgba(196,160,100,0.1)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(196,160,100,0.5)",
            }}
          >
            {historicoAberto ? "Ocultar histórico" : "Ver histórico completo"}
          </span>
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "2px 8px",
              background: "rgba(196,160,100,0.08)",
              border: "1px solid rgba(196,160,100,0.2)",
              color: "rgba(196,160,100,0.6)",
            }}
          >
            {total}
          </span>
        </div>
        <span
          style={{
            fontSize: "0.75rem",
            color: "rgba(196,160,100,0.35)",
            transform: historicoAberto ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          ›
        </span>
      </button>

      {/* lista de mensalidades */}
      {historicoAberto && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {historico.historicoMensalidades.map((m) => {
            const badge = badgeHistorico(m.statusLiberacao);
            const aberta = mensalidadeExpandida === m.id;

            return (
              <div key={m.id}>
                {/* cabeçalho da mensalidade */}
                <div
                  onClick={() => setMensalidadeExpandida(aberta ? null : m.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto 36px",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 20px",
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(196,160,100,0.06)",
                    borderLeft: `2px solid ${badge.cor}`,
                    cursor: "pointer",
                    transition: "background 0.15s",
                    opacity: 0.8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(196,160,100,0.03)";
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.01)";
                    e.currentTarget.style.opacity = "0.8";
                  }}
                >
                  {/* info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "0.82rem", color: "#f0ece4", fontWeight: 500 }}>
                        Mensalidade #{m.id}
                      </span>
                      {m.nomePlano && (
                        <span
                          style={{
                            fontSize: "0.58rem",
                            color: "rgba(196,160,100,0.45)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {m.nomePlano}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.62rem", color: "rgba(240,236,228,0.25)", letterSpacing: "0.05em" }}>
                      {m.dataInicio ? new Date(m.dataInicio).toLocaleDateString("pt-BR") : "—"} →{" "}
                      {m.dataFim ? new Date(m.dataFim).toLocaleDateString("pt-BR") : "—"}
                    </span>
                  </div>

                  {/* valor */}
                  <span style={{ fontSize: "0.85rem", color: "rgba(196,160,100,0.6)", fontWeight: 600 }}>
                    {formatarValor(m.valorMensalidade)}
                  </span>

                  {/* status badge */}
                  <span
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      padding: "3px 9px",
                      textTransform: "uppercase",
                      background: badge.bg,
                      color: badge.cor,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    {m.statusLiberacao}
                  </span>

                  {/* seta */}
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(196,160,100,0.3)",
                      transform: aberta ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      display: "inline-block",
                      textAlign: "right",
                    }}
                  >
                    ›
                  </span>
                </div>

                {/* parcelas da mensalidade — clicáveis, abrem o ModalParcela */}
                {aberta && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {m.parcelas?.length ? (
                      m.parcelas.map((p, idx) => {
                        const cs = corStatus(p.status);
                        return (
                          <div
                            key={p.id}
                            onClick={() =>
                              onSelecionarParcela?.({ ...p, _index: idx }, m.nomePlano)
                            }
                            style={{
                              display: "grid",
                              gridTemplateColumns: "44px 1fr 1fr 130px",
                              alignItems: "center",
                              padding: "11px 20px 11px 36px",
                              background: "rgba(255,255,255,0.008)",
                              border: "1px solid rgba(196,160,100,0.04)",
                              borderLeft: `2px solid ${cs.color}40`,
                              cursor: onSelecionarParcela ? "pointer" : "default",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              if (onSelecionarParcela) e.currentTarget.style.background = "rgba(196,160,100,0.03)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.008)";
                            }}
                          >
                            <span style={{ fontSize: "0.58rem", color: "rgba(196,160,100,0.25)", letterSpacing: "0.1em" }}>
                              #{idx + 1}
                            </span>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span
                                style={{
                                  fontSize: "0.48rem",
                                  letterSpacing: "0.2em",
                                  color: "rgba(196,160,100,0.3)",
                                  textTransform: "uppercase",
                                  marginBottom: 2,
                                }}
                              >
                                Vencimento
                              </span>
                              <span style={{ fontSize: "0.78rem", color: "rgba(240,236,228,0.6)" }}>
                                {p.dataVencimento ? new Date(p.dataVencimento).toLocaleDateString("pt-BR") : "—"}
                              </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span
                                style={{
                                  fontSize: "0.48rem",
                                  letterSpacing: "0.2em",
                                  color: "rgba(196,160,100,0.3)",
                                  textTransform: "uppercase",
                                  marginBottom: 2,
                                }}
                              >
                                Valor
                              </span>
                              <span style={{ fontSize: "0.78rem", color: "rgba(196,160,100,0.5)", fontWeight: 600 }}>
                                {formatarValor(p.valor)}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                padding: "3px 8px",
                                textTransform: "uppercase",
                                background: cs.bg,
                                color: `${cs.color}99`,
                                border: `1px solid ${cs.border}66`,
                              }}
                            >
                              {emojiStatus(p.status)} {p.status}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          padding: "12px 20px 12px 36px",
                          background: "rgba(255,255,255,0.008)",
                          border: "1px solid rgba(196,160,100,0.04)",
                        }}
                      >
                        <span style={{ fontSize: "0.68rem", color: "rgba(240,236,228,0.2)", letterSpacing: "0.1em" }}>
                          Nenhuma parcela registrada
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}