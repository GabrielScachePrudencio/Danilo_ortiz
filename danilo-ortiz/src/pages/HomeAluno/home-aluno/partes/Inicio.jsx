import React from "react";
import { S, formatarValor, formatarData } from "./estilosAluno";
import { BannerSisrun } from "./BannerSisrun";

export function Inicio({
  aluno,
  mensalidade,
  modoAdmin,
  onIrParaAssinatura,
  onIrParaParcelas,
  onIrParaDados,
  onConfirmarSisrun,
}) {
  // banner de Sisrun só faz sentido pro próprio aluno, nunca pro admin visitando
  const deveExibirSisrun =
    !modoAdmin &&
    aluno &&
    mensalidade?.statusLiberacao === "ATIVADO" &&
    aluno.criouContaSisrun === false;

  const ultimaParcela = mensalidade?.parcelas?.find(
    (p) => p.status === "PENDENTE" || p.status === "AGUARDANDO"
  );

  const parcelasPagas = mensalidade?.parcelas?.filter((p) => p.status === "FINALIZADO").length ?? 0;
  const totalParcelas = mensalidade?.parcelas?.length ?? 0;

  return (
    <>
      {/* ── observação do aluno, sempre visível no topo do resumo ── */}
      {aluno?.observacao && (
        <div
          style={{
            ...S.parcelaCard,
            marginBottom: 20,
            borderLeft: "3px solid #4ca8de",
            background: "rgba(76,168,222,0.05)",
          }}
        >
          <span style={{ ...S.parcelaLabel, color: "#4ca8de" }}>📝 Observação</span>
          <p
            style={{
              marginTop: 10,
              fontSize: "0.88rem",
              color: "#f0ece4",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {aluno.observacao}
          </p>
        </div>
      )}

      {deveExibirSisrun && (
        <BannerSisrun nomeAluno={aluno?.nome} onConfirmarCriou={onConfirmarSisrun} />
      )}

      {/* ── cards principais: plano, status, próxima parcela ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div
          style={{ ...S.parcelaCard, cursor: onIrParaAssinatura ? "pointer" : "default" }}
          onClick={onIrParaAssinatura}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(196,160,100,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(196,160,100,0.12)")}
        >
          <span style={S.parcelaLabel}>Plano Atual</span>
          {mensalidade?.nomePlano ? (
            <>
              <div style={{ ...S.parcelaValor, fontSize: "1.5rem" }}>{mensalidade.nomePlano}</div>
              <p style={{ ...S.planoTexto, marginTop: 10, fontSize: "0.85rem" }}>
                <span style={S.planoDestaque}>R$ {mensalidade.valorMensalidade}</span> / mês
              </p>
            </>
          ) : (
            <div style={{ ...S.parcelaValor, fontSize: "1.1rem", opacity: 0.6 }}>Nenhum plano ativo</div>
          )}
        </div>

        <div
          style={{ ...S.parcelaCard, cursor: onIrParaParcelas ? "pointer" : "default" }}
          onClick={onIrParaParcelas}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(196,160,100,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(196,160,100,0.12)")}
        >
          <span style={S.parcelaLabel}>Próxima Parcela</span>
          {ultimaParcela ? (
            <>
              <div style={S.parcelaValor}>{formatarValor(ultimaParcela.valor)}</div>
              <p style={{ ...S.planoTexto, marginTop: 10, fontSize: "0.85rem" }}>
                Vencimento:{" "}
                <span style={{ color: "#f0ece4" }}>{formatarData(ultimaParcela.dataVencimento)}</span>
              </p>
            </>
          ) : (
            <div style={{ ...S.parcelaValor, fontSize: "1.1rem", opacity: 0.6 }}>Sem débitos</div>
          )}
        </div>

        <div style={S.parcelaCard}>
          <span style={S.parcelaLabel}>Progresso do Plano</span>
          <div style={S.parcelaValor}>
            {totalParcelas > 0 ? `${parcelasPagas}/${totalParcelas}` : "—"}
          </div>
          <p style={{ ...S.planoTexto, marginTop: 10, fontSize: "0.85rem" }}>parcelas pagas</p>
          {totalParcelas > 0 && (
            <div style={{ height: 4, background: "rgba(196,160,100,0.1)", marginTop: 12, borderRadius: 2, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.round((parcelasPagas / totalParcelas) * 100)}%`,
                  background: "#c4a064",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── vigência do plano, agora com fundo tintado na cor do status ── */}
      {mensalidade?.dataInicio && (
        <div
          style={{
            ...S.cardTintado(mensalidade.statusLiberacao),
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <span style={S.parcelaLabel}>Vigência do Plano</span>
            <p style={{ fontSize: "0.95rem", color: "#f0ece4", marginTop: 6 }}>
              {formatarData(mensalidade.dataInicio)} até {formatarData(mensalidade.dataFim)}
            </p>
          </div>
          <span style={S.statusPillGrande(mensalidade.statusLiberacao)}>{mensalidade.statusLiberacao}</span>
        </div>
      )}

      {/* ── atalhos rápidos ── */}
      <p style={S.sectionLabel}>Acesso Rápido</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <button
          onClick={onIrParaAssinatura}
          style={{ ...S.btnSecondary, textAlign: "left", padding: "16px 20px", fontSize: "0.72rem" }}
        >
          📋 Ver detalhes do plano
        </button>
        <button
          onClick={onIrParaParcelas}
          style={{ ...S.btnSecondary, textAlign: "left", padding: "16px 20px", fontSize: "0.72rem" }}
        >
          💳 Ver parcelas e histórico
        </button>
        <button
          onClick={onIrParaDados}
          style={{ ...S.btnSecondary, textAlign: "left", padding: "16px 20px", fontSize: "0.72rem" }}
        >
          ✏️ {modoAdmin ? "Editar dados do aluno" : "Editar meus dados"}
        </button>
      </div>
    </>
  );
}