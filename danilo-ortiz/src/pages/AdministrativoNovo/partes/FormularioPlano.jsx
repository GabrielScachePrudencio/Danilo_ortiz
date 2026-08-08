import React from "react";
import { S, fmtMoeda } from "./estilos";

/**
 * Formulário de criação/edição de plano.
 * Usado tanto para "Adicionar plano" (editando.id === null)
 * quanto para editar um plano existente (editando.id === <id>).
 */
export function FormularioPlano({ editando, setEditando, salvarPlano, salvando }) {
  if (!editando) return null;

  return (
    <div
      style={{
        ...S.tokenBox,
        margin: "0 0 14px 0",
        padding: 20,
        borderColor: "#4cde8c66",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* TÍTULO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              color: "#555",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            {editando.id ? `Editando plano #${editando.id}` : "Novo plano"}
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#e8e6e1",
              fontWeight: 700,
            }}
          >
            {editando.nome || "Novo plano"}
          </div>
        </div>
      </div>

      {/* CAMPOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
          gap: 14,
          width: "100%",
        }}
      >
        {/* NOME */}
        <div style={{ minWidth: 0 }}>
          <Rotulo texto="Nome do plano" />
          <input
            style={{
              ...S.input,
              margin: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
            value={editando.nome}
            onChange={(e) =>
              setEditando((ed) => ({ ...ed, nome: e.target.value }))
            }
            placeholder="Ex.: Plano FIT - Mensal"
          />
        </div>

        {/* VALOR */}
        <div style={{ minWidth: 0 }}>
          <Rotulo texto="Valor / mês" />
          <input
            style={{
              ...S.input,
              margin: 0,
              width: "100%",
              boxSizing: "border-box",
              color: "#e8b44c",
            }}
            type="number"
            min="0"
            step="0.01"
            value={editando.valor}
            onChange={(e) =>
              setEditando((ed) => ({ ...ed, valor: e.target.value }))
            }
          />
        </div>

        {/* DURAÇÃO */}
        <div style={{ minWidth: 0 }}>
          <Rotulo texto="Duração (meses)" />
          <input
            style={{
              ...S.input,
              margin: 0,
              width: "100%",
              boxSizing: "border-box",
              color: "#4cde8c",
            }}
            type="number"
            min="1"
            step="1"
            value={editando.duracaomeses}
            onChange={(e) =>
              setEditando((ed) => ({ ...ed, duracaomeses: e.target.value }))
            }
          />
        </div>

        {/* FREQUÊNCIA */}
        <div style={{ minWidth: 0 }}>
          <Rotulo texto="Frequência semanal" />
          <input
            style={{
              ...S.input,
              margin: 0,
              width: "100%",
              boxSizing: "border-box",
              color: "#4cde8c",
            }}
            type="number"
            min="1"
            step="1"
            value={editando.frequenciaSemanal}
            onChange={(e) =>
              setEditando((ed) => ({
                ...ed,
                frequenciaSemanal: e.target.value,
              }))
            }
            placeholder="Ex.: 2"
          />
        </div>

        {/* GRUPO */}
        <div style={{ minWidth: 0 }}>
          <Rotulo texto="Grupo" />
          <select
            style={{
              ...S.input,
              margin: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
            value={editando.grupo || ""}
            onChange={(e) =>
              setEditando((ed) => ({ ...ed, grupo: e.target.value }))
            }
          >
            <option value="">Selecione...</option>
            <option value="FIT">FIT</option>
            <option value="INTENSE">INTENSE</option>
            <option value="POWER">POWER</option>
          </select>
        </div>

        {/* PERÍODO */}
        <div style={{ minWidth: 0 }}>
          <Rotulo texto="Período" />
          <select
            style={{
              ...S.input,
              margin: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
            value={editando.periodo || "MENSAL"}
            onChange={(e) =>
              setEditando((ed) => ({ ...ed, periodo: e.target.value }))
            }
          >
            <option value="MENSAL">Mensal</option>
            <option value="SEMESTRAL">Semestral</option>
          </select>
        </div>

        {/* STATUS */}
        <div style={{ minWidth: 0 }}>
          <Rotulo texto="Status" />
          <button
            type="button"
            onClick={() =>
              setEditando((ed) => ({ ...ed, ativo: !ed.ativo }))
            }
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: 4,
              border: `1px solid ${editando.ativo ? "#285b3c" : "#4a2b2b"}`,
              background: editando.ativo ? "#153522" : "#2a2020",
              color: editando.ativo ? "#4cde8c" : "#e47777",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {editando.ativo ? "✓ ATIVO" : "✕ INATIVO"}
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      <div
        style={{
          marginTop: 18,
          background: "#0d0d0f",
          border: "1px solid #1e1e22",
          borderRadius: 4,
          padding: "12px 14px",
          fontSize: 11,
          color: "#666",
          lineHeight: 1.7,
          overflow: "hidden",
        }}
      >
        <strong
          style={{
            color: "#555",
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Preview
        </strong>

        <div style={{ marginTop: 4, color: "#e8e6e1", wordBreak: "break-word" }}>
          {editando.nome || "Nome do plano"}

          {editando.grupo && (
            <>
              {" · "}
              <span style={{ color: "#e8e6e1" }}>{editando.grupo}</span>
            </>
          )}

          {editando.periodo && (
            <>
              {" · "}
              <span style={{ color: "#888" }}>
                {editando.periodo === "SEMESTRAL" ? "Semestral" : "Mensal"}
              </span>
            </>
          )}

          {editando.frequenciaSemanal !== "" && (
            <>
              {" · "}
              <span style={{ color: "#4cde8c" }}>
                {editando.frequenciaSemanal}x / semana
              </span>
            </>
          )}

          {" · "}
          <span style={{ color: "#e8b44c" }}>
            {fmtMoeda(editando.valor)}/mês
          </span>

          {" · "}
          <span style={{ color: "#888" }}>
            {editando.duracaomeses}{" "}
            {editando.duracaomeses == 1 ? "mês" : "meses"}
          </span>

          {" · "}
          <span style={{ color: "#888" }}>
            Total:{" "}
            {fmtMoeda(
              Number(editando.valor || 0) * Number(editando.duracaomeses || 0)
            )}
          </span>
        </div>
      </div>

      {/* BOTÕES */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          marginTop: 18,
        }}
      >
        <button
          style={S.btnGhost}
          onClick={() => setEditando(null)}
          disabled={salvando}
        >
          Cancelar
        </button>

        <button style={S.btnPrimary} onClick={salvarPlano} disabled={salvando}>
          {salvando
            ? "Salvando…"
            : editando.id
            ? "✓ Salvar alterações"
            : "✓ Criar plano"}
        </button>
      </div>
    </div>
  );
}

function Rotulo({ texto }) {
  return (
    <div
      style={{
        fontSize: 9,
        letterSpacing: "0.15em",
        color: "#555",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {texto}
    </div>
  );
}