import React from "react";
import { PALETTE } from "./estilosAluno";

export function BannerSisrun({ nomeAluno, onConfirmarCriou }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        padding: "16px 20px",
        marginBottom: 24,
        background: PALETTE.errorBg,
        border: `1px solid ${PALETTE.errorBorder}`,
      }}
    >
      <div>
        <p style={{ fontSize: "0.8rem", color: PALETTE.error, fontWeight: 600, marginBottom: 4 }}>
          ⚠ Conta Sisrun não criada
        </p>
        <p style={{ fontSize: "0.75rem", color: "rgba(240,236,228,0.6)" }}>
          {nomeAluno ? `${nomeAluno}, você` : "Você"} ainda não criou sua conta no Sisrun. Ela é
          necessária para acompanhar seus treinos.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
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
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "9px 16px",
            background: "transparent",
            color: PALETTE.error,
            border: `1px solid ${PALETTE.errorBorder}`,
            cursor: "pointer",
          }}
        >
          Criar conta →
        </button>

        {onConfirmarCriou && (
          <button
            onClick={onConfirmarCriou}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "9px 16px",
              background: "transparent",
              color: "rgba(240,236,228,0.5)",
              border: "1px solid rgba(240,236,228,0.15)",
              cursor: "pointer",
            }}
          >
            Já criei
          </button>
        )}
      </div>
    </div>
  );
}
