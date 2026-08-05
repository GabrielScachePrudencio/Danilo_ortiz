import React, { useState } from "react";
import { S } from "./estilos";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function ModalImportarPlanilha({ aberto, aoFechar, aoImportar }) {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [criarMensalidade, setCriarMensalidade] = useState(false);

  if (!aberto) return null;

  async function enviar() {
    if (!arquivo) return;
    setEnviando(true);
    setErro("");
    try {
      const formData = new FormData();
      formData.append("file", arquivo);
      formData.append("criarMensalidade", criarMensalidade);
      const res = await fetch(`${API}/import/admin/importar-planilha`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResultado(data);
      aoImportar?.();
    } catch {
      setErro("Falha ao importar a planilha.");
    } finally {
      setEnviando(false);
    }
  }

  function fecharTudo() {
    setArquivo(null);
    setResultado(null);
    setErro("");
    aoFechar();
  }

  return (
    <div style={S.overlay}>
      <div style={{ ...S.modal, width: 560, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={S.modalTitle}>Importar alunos de planilha</div>

        {!resultado && (
          <>
            <p style={S.modalText}>
              Envie um .xlsx ou .csv. A primeira linha deve ter os nomes das colunas
              (nome, email, telefone, cpf, plano — ordem livre). Linhas com nome ou
              e-mail ausentes serão marcadas como erro; os demais campos faltando
              ficam sinalizados para completar depois.
            </p>
           <div
  style={{
    border: "2px dashed #cfd8dc",
    borderRadius: 10,
    padding: 24,
    textAlign: "center",
    background: "#fafafa",
    marginBottom: 18,
  }}
>
  {!arquivo ? (
    <>
      <div style={{ fontSize: 40 }}>📄</div>

      <div
        style={{
          fontWeight: 600,
          marginTop: 8,
          marginBottom: 6,
        }}
      >
        Selecione uma planilha
      </div>

      <div
        style={{
          color: "#777",
          fontSize: 13,
          marginBottom: 15,
        }}
      >
        Formatos aceitos: .xlsx e .csv
      </div>

      <label
        style={{
          background: "#1976d2",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: 6,
          cursor: "pointer",
          display: "inline-block",
          fontWeight: 600,
        }}
      >
        Escolher arquivo

        <input
          hidden
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setArquivo(e.target.files[0])}
        />
      </label>
    </>
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 42 }}>📊</div>

      <div style={{ flex: 1, textAlign: "left" }}>
        <div
          style={{
            fontWeight: 600,
            wordBreak: "break-all",
          }}
        >
          {arquivo.name}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#777",
            marginTop: 4,
          }}
        >
          {(arquivo.size / 1024).toFixed(1)} KB
        </div>
      </div>

      <button
        type="button"
        onClick={() => setArquivo(null)}
        style={{
          background: "#ef5350",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Remover
      </button>
    </div>
  )}
</div>

<label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 12,
    background: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 18,
    cursor: "pointer",
  }}
>
  <input
    type="checkbox"
    checked={criarMensalidade}
    onChange={(e) => setCriarMensalidade(e.target.checked)}
  />

  <div>
    <div style={{ fontWeight: 600 }}>
      Criar mensalidade automaticamente
    </div>

    <div
      style={{
        fontSize: 12,
        color: "#666",
      }}
    >
      Utiliza o vencimento e o valor da planilha e cria a mensalidade como paga.
    </div>
  </div>
</label>

{erro && <div style={S.erro}>{erro}</div>}

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  }}
>
  <button
    style={S.btnGhost}
    onClick={fecharTudo}
  >
    Cancelar
  </button>

  <button
    style={S.btnPrimary}
    onClick={enviar}
    disabled={!arquivo || enviando}
  >
    {enviando ? "Importando..." : "Importar"}
  </button>
</div>
          </>
        )}

        {resultado && (
          <>
            <p style={S.modalText}>
              {resultado.criados} criados · {resultado.criadosComPendencia} criados com pendência ·{" "}
              {resultado.erros} com erro
            </p>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Linha</th>
                  <th style={S.th}>Nome</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Detalhe</th>
                </tr>
              </thead>
              <tbody>
                {resultado.linhas.map((l) => (
                  <tr key={l.linha}>
                    <td style={S.td}>{l.linha}</td>
                    <td style={S.td}>{l.nome || l.email || "—"}</td>
                    <td style={S.td}>{l.status}</td>
                    <td style={{ ...S.td, color: "#888", fontSize: 12 }}>
                      {l.status === "ERRO" ? l.mensagemErro : (l.camposFaltando || []).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={S.modalRow}>
              <button style={S.btnPrimary} onClick={fecharTudo}>Fechar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}