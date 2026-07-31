import React from "react";
import { useNavigate } from "react-router-dom";
import { S, formatarData } from "./estilosAluno";

export function AssinaturaTab({ mensalidade, idAluno, modoAdmin, onCancelar, onRenovar, onTrocarDePlano }) {
  const navigate = useNavigate();

  if (!mensalidade) {
    return (
      <div style={S.gateCard}>
        <h2 style={S.gateTitulo}>Nenhuma assinatura ativa</h2>
        <p style={S.gateDesc}>
          {modoAdmin
            ? "Este aluno ainda não possui um plano contratado."
            : "Você ainda não possui um plano contratado. Escolha um plano e comece agora."}
        </p>
        {!modoAdmin && (
          <button style={S.btnPrimary} onClick={() => navigate("/")}>
            Ver planos →
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <p style={S.sectionLabel}>{modoAdmin ? "Plano do Aluno" : "Meu Plano"}</p>

      <div style={S.planoInfoContainer}>
        <p style={S.planoTexto}>
          PLANO: <span style={S.planoDestaque}>{mensalidade.nomePlano}</span>
        </p>
        <p style={S.planoTexto}>
          VALOR MENSAL: <span style={S.planoDestaque}>R$ {mensalidade.valorMensalidade}</span>
        </p>
        <p style={S.planoTexto}>
          VIGÊNCIA: {formatarData(mensalidade.dataInicio)} até {formatarData(mensalidade.dataFim)}
        </p>
        <p style={S.planoTexto}>
          STATUS: <span style={S.planoDestaque}>{mensalidade.statusLiberacao}</span>
        </p>
       
        {mensalidade.atribuidoPorNome && (
          <p style={S.planoTexto}>
            ATRIBUÍDO POR:{" "}
            <span style={S.planoDestaque}>{mensalidade.atribuidoPorNome}</span>
            {mensalidade.dataAtribuicao && ` em ${formatarData(mensalidade.dataAtribuicao)}`}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
        {/* pagar/ativar e trocar de plano envolvem checkout — não fazem sentido na sessão do admin,
            então só aparecem quando é o próprio aluno vendo a própria conta */}
        {!modoAdmin && mensalidade.statusLiberacao === "DESATIVADO" && (
          <>
            <button
              style={S.btnPagar}
              onClick={() => navigate(`/home/telapagamento/${mensalidade.planoId}`)}
            >
              Pagar e Ativar Conta
            </button>

            <button
              onClick={onTrocarDePlano}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "12px 20px",
                background: "transparent",
                color: "rgba(224,85,85,0.6)",
                border: "1px solid rgba(224,85,85,0.2)",
                cursor: "pointer",
              }}
            >
              Trocar de plano
            </button>
          </>
        )}

        {modoAdmin && mensalidade.statusLiberacao === "DESATIVADO" && (
          <p style={{ fontSize: "0.78rem", color: "rgba(240,236,228,0.4)" }}>
            Este plano está desativado. A ativação/pagamento deve ser feita pelo próprio aluno.
          </p>
        )}

        {/* cancelar e renovar são ações administrativas legítimas — continuam disponíveis pro admin */}
        {mensalidade.statusLiberacao === "ATIVADO" && (
          <button
            onClick={onCancelar}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "12px 22px",
              background: "transparent",
              color: "#e05555",
              border: "1px solid rgba(224,85,85,0.35)",
              cursor: "pointer",
            }}
          >
            {modoAdmin ? "Cancelar Plano do Aluno" : "Cancelar Plano"}
          </button>
        )}

        {mensalidade.statusLiberacao === "EXPIRADO" && (
          <button
            onClick={onRenovar}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "12px 22px",
              background: "transparent",
              color: "#c4a064",
              border: "1px solid rgba(196,160,100,0.4)",
              cursor: "pointer",
            }}
          >
            ↻ {modoAdmin ? "Renovar Mensalidade do Aluno" : "Renovar Mensalidade"}
          </button>
        )}
      </div>
    </>
  );
}
