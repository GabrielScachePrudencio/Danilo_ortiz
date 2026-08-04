import React, { useState } from "react";
import { S } from "./estilos";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function ModalImportarPlanilha({ aberto, aoFechar, aoImportar }) {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
  const [arquivo, setArquivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  if (!aberto) return null;

  async function enviar() {
    if (!arquivo) return;
    setEnviando(true);
    setErro("");
    try {
      const formData = new FormData();
      formData.append("file", arquivo);
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
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setArquivo(e.target.files[0])}
            />
            {erro && <div style={S.erro}>{erro}</div>}
            <div style={S.modalRow}>
              <button style={S.btnPrimary} onClick={enviar} disabled={!arquivo || enviando}>
                {enviando ? "Importando…" : "Importar"}
              </button>
              <button style={S.btnGhost} onClick={fecharTudo}>Cancelar</button>
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