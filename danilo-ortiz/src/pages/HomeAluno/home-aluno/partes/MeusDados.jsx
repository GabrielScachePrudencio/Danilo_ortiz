import React from "react";
import { S, CampoInfo, CAMPOS_PESSOAIS, CAMPOS_CONTA, getNestedValue } from "./estilosAluno";

export function MeusDados({ editado, atualizarCampo, salvarAlteracoes, descartarAlteracoes, salvando, onAbrirSenha }) {
  // separa o campo de observação pra exibir num textarea grande, fora do grid de campos curtos
  const campoObservacao = CAMPOS_PESSOAIS.find(({ key }) => /observ/i.test(key));
  const camposPessoaisSemObservacao = CAMPOS_PESSOAIS.filter(({ key }) => !/observ/i.test(key));

  return (
    <>
      <p style={S.sectionLabel}>Dados Pessoais</p>
      <div style={S.grid}>
        {camposPessoaisSemObservacao.map(({ key, label, editable, type }) => (
          <CampoInfo
            key={key}
            label={label}
            type={type}
            editable={editable}
            value={getNestedValue(editado, key)}
            onChange={(val) => atualizarCampo(key, val)}
          />
        ))}
      </div>

      {campoObservacao && (
        <div style={{ marginBottom: 32 }}>
          <span style={{ ...S.parcelaLabel, display: "block", marginBottom: 8 }}>
            {campoObservacao.label}
          </span>
          <textarea
            rows={6}
            disabled={!campoObservacao.editable}
            value={getNestedValue(editado, campoObservacao.key) ?? ""}
            onChange={(e) => atualizarCampo(campoObservacao.key, e.target.value)}
            style={{
              width: "100%",
              minHeight: 140,
              resize: "vertical",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(196,160,100,0.15)",
              borderRadius: 8,
              padding: "12px 14px",
              color: "#f0ece4",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              lineHeight: 1.5,
              outline: "none",
            }}
          />
        </div>
      )}

      <p style={S.sectionLabel}>Dados da Conta</p>
      <div style={S.grid}>
        {CAMPOS_CONTA.map(({ key, label, editable }) => (
          <CampoInfo
            key={key}
            label={label}
            editable={editable}
            value={getNestedValue(editado, key)}
            onChange={(val) => atualizarCampo(key, val)}
          />
        ))}
      </div>

      {onAbrirSenha && (
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onAbrirSenha}
            style={{
              ...S.btnSecondary,
              fontSize: "0.7rem",
              padding: "10px 18px",
              color: "rgba(196,160,100,0.7)",
              borderColor: "rgba(196,160,100,0.25)",
            }}
          >
            🔒 Trocar Senha
          </button>
        </div>
      )}

      <div style={S.saveBar}>
        <button style={S.btnSecondary} onClick={descartarAlteracoes}>
          Descartar
        </button>
        <button
          style={{ ...S.btnPrimary, opacity: salvando ? 0.6 : 1 }}
          onClick={salvarAlteracoes}
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </>
  );
}