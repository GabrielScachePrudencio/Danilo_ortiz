import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { S, corStatus, emojiStatus, formatarValor, formatarData } from "./estilosAluno";
import { ModalParcela } from "./ModalParcela";
import { SecaoHistorico } from "./SecaoHistorico";

export function ParcelasTab({ mensalidade, historico, urlMensalidade, token, onAtualizar }) {
  const navigate = useNavigate();
  const [parcelaSelecionada, setParcelaSelecionada] = useState(null); // { ...parcela, _index, nomePlano }
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [mensalidadeExpandida, setMensalidadeExpandida] = useState(null);

  function irParaPagamento(parcela) {
    setParcelaSelecionada(null);
    navigate(`/home/telapagamento/${mensalidade.planoId}?parcelaId=${parcela.id}`);
  }

  // usado pelas parcelas do plano ATUAL
  function selecionarParcelaAtual(p, index) {
    setParcelaSelecionada({ ...p, _index: index, nomePlano: mensalidade?.nomePlano ?? "—" });
  }

  // usado pelas parcelas do HISTÓRICO (mensalidades antigas)
  function selecionarParcelaHistorico(parcelaComIndex, nomePlano) {
    setParcelaSelecionada({ ...parcelaComIndex, nomePlano: nomePlano ?? "—" });
  }

  return (
    <>
      {parcelaSelecionada && (
        <ModalParcela
          parcela={parcelaSelecionada}
          urlMensalidade={urlMensalidade}
          nomePlano={parcelaSelecionada.nomePlano ?? mensalidade?.nomePlano ?? "—"}
          onClose={() => setParcelaSelecionada(null)}
          onPagar={irParaPagamento}
          token={token}
          onConfirmado={onAtualizar}
        />
      )}

      {/* parcelas do plano atual — só faz sentido se houver um plano ativo */}
      {mensalidade ? (
        <>
          <p style={S.sectionLabel}>
            Parcelas do plano atual
            <span style={{ color: "rgba(196,160,100,0.4)", fontWeight: 400, fontSize: "0.55rem", marginLeft: 8 }}>
              clique em uma parcela para ver detalhes
            </span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 48 }}>
            {mensalidade.parcelas?.map((p, index) => {
              const cs = corStatus(p.status);
              return (
                <div
                  key={p.id}
                  onClick={() => selecionarParcelaAtual(p, index)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr 1fr 130px 24px",
                    alignItems: "center",
                    padding: "14px 18px",
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(196,160,100,0.06)",
                    borderLeft: `2px solid ${cs.color}`,
                    cursor: "pointer",
                    opacity: p.status === "FINALIZADO" ? 0.75 : 1,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(196,160,100,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.015)")}
                >
                  <span style={{ fontSize: "0.62rem", color: "rgba(196,160,100,0.35)" }}>#{index + 1}</span>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(196,160,100,0.4)", textTransform: "uppercase", marginBottom: 2 }}>
                      Vencimento
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#f0ece4" }}>{formatarData(p.dataVencimento)}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "rgba(196,160,100,0.4)", textTransform: "uppercase", marginBottom: 2 }}>
                      Valor
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#c4a064", fontWeight: 600 }}>{formatarValor(p.valor)}</span>
                  </div>

                  <span
                    style={{
                      fontSize: "0.58rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      padding: "4px 10px",
                      textTransform: "uppercase",
                      background: cs.bg,
                      color: cs.color,
                      border: `1px solid ${cs.border}`,
                      justifySelf: "start",
                    }}
                  >
                    {emojiStatus(p.status)} {p.status}
                  </span>

                  <span style={{ fontSize: "0.75rem", color: "rgba(196,160,100,0.3)", justifySelf: "end" }}>›</span>
                </div>
              );
            })}

            {(!mensalidade.parcelas || mensalidade.parcelas.length === 0) && (
              <p style={{ color: "rgba(240,236,228,0.4)", fontSize: "0.8rem", padding: "16px 0" }}>
                Nenhuma parcela registrada.
              </p>
            )}
          </div>
        </>
      ) : (
        <p style={{ color: "rgba(240,236,228,0.5)", fontSize: "0.85rem", marginBottom: 32 }}>
          Nenhum plano ativo no momento.
        </p>
      )}

      {/* histórico de mensalidades anteriores — sempre visível, mesmo sem plano ativo */}
      <SecaoHistorico
        historico={historico}
        historicoAberto={historicoAberto}
        setHistoricoAberto={setHistoricoAberto}
        mensalidadeExpandida={mensalidadeExpandida}
        setMensalidadeExpandida={setMensalidadeExpandida}
        formatarValor={formatarValor}
        onSelecionarParcela={selecionarParcelaHistorico}
      />
    </>
  );
}