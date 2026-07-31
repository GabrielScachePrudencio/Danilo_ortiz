import React from "react";
import { S, formatarValor, formatarData, corStatusAssinatura } from "./estilosAluno";

export function PerfilHeader({ aluno, mensalidade }) {
  const ultimaParcela = mensalidade?.parcelas?.find(
    (p) => p.status === "PENDENTE" || p.status === "AGUARDANDO"
  );

  return (
    <div style={S.perfilHeader}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={S.perfilEyebrow}>Perfil do Aluno</p>
          <h1 style={S.perfilNome}>{aluno?.nome ?? "—"}</h1>
          <p style={S.perfilEmail}>{aluno?.email ?? "—"}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={S.heroBadge(aluno?.tipoUsuario)}>{aluno?.tipoUsuario}</span>

            <span style={S.statusPillGrande(aluno?.statusAssinatura)}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: corStatusAssinatura(aluno?.statusAssinatura).color,
                }}
              />
              {aluno?.statusAssinatura}
            </span>

            {mensalidade?.nomePlano && (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#c4a064",
                  border: "1px solid rgba(196,160,100,0.35)",
                  background: "rgba(196,160,100,0.06)",
                }}
              >
                {mensalidade.nomePlano}

                 {mensalidade.atribuidoPorNome && (
                          <p style={S.planoTexto}>
                            ATRIBUÍDO POR:{" "}
                            <span style={S.planoDestaque}>{mensalidade.atribuidoPorNome}</span>
                            {mensalidade.dataAtribuicao && ` em ${formatarData(mensalidade.dataAtribuicao)}`}
                          </p>
                        )}
              </span>
            )}
          </div>
        </div>

        {ultimaParcela && (
          <div style={{ textAlign: "right", minWidth: 180 }}>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(196,160,100,0.5)",
                marginBottom: 4,
              }}
            >
              Próxima Parcela
            </p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#f0ece4" }}>
              {formatarValor(ultimaParcela.valor)}
            </p>
            <p style={{ fontSize: "0.7rem", color: "rgba(240,236,228,0.4)" }}>
              vence em {formatarData(ultimaParcela.dataVencimento)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
