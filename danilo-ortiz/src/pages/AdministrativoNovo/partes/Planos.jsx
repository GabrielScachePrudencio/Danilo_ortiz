import React, { useEffect, useState } from "react";
import { S, InfoMini, fmtMoeda } from "./estilos";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function Planos() {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [planos, setPlanos] = useState([]);
  const [editando, setEditando] = useState(null); // { id, nome, valor, duracaomeses }
  const [salvando, setSalvando] = useState(false);
  const [status, setStatus] = useState(null); // { id, ok }
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    try {
      const res = await fetch(`${API}/planos`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setPlanos(await res.json());
      else setErro("Erro ao carregar planos.");
    } catch {
      setErro("Falha na conexão ao buscar planos.");
    }
  }

  async function salvarPlano() {
    if (!editando) return;
    setSalvando(true);
    setStatus(null);
    try {
      const res = await fetch(`${API}/planos/${editando.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editando.nome,
          valor: parseFloat(editando.valor),
          duracaomeses: parseInt(editando.duracaomeses),
        }),
      });
      if (res.ok) {
        const atualizado = await res.json();
        setPlanos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)));
        setStatus({ id: editando.id, ok: true });
        setEditando(null);
      } else {
        setStatus({ id: editando.id, ok: false });
      }
    } catch {
      setStatus({ id: editando?.id, ok: false });
    } finally {
      setSalvando(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  return (
    <>
      <p style={S.sectionTitle}>Gerenciar Planos</p>
      {erro && <div style={S.erro}>{erro}</div>}

      <div
        style={{
          background: "#0d0d0f", border: "1px solid #1e2a1e",
          borderRadius: 4, padding: "10px 16px", marginBottom: 24,
          fontSize: 11, color: "#4cde8c", letterSpacing: "0.05em",
        }}
      >
        ⚠ Alterações afetam apenas <strong>novas assinaturas</strong>. Assinaturas existentes mantêm o valor e parcelas originais.
      </div>

      {planos.map((plano) => {
        const emEdicao = editando?.id === plano.id;
        const ok = status?.id === plano.id && status?.ok;
        const err = status?.id === plano.id && !status?.ok;

        return (
          <div
            key={plano.id}
            style={{ ...S.tokenBox, marginBottom: 16, borderColor: emEdicao ? "#4cde8c44" : "#1e1e22" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>
                  #{plano.id}
                </span>
                <span style={{ fontSize: 14, color: "#e8e6e1", fontWeight: 600 }}>{plano.nome}</span>
              </div>
              {!emEdicao && (
                <button
                  style={S.btnGhost}
                  onClick={() =>
                    setEditando({
                      id: plano.id,
                      nome: plano.nome,
                      valor: plano.valor,
                      duracaomeses: plano.duracaomeses,
                    })
                  }
                >
                  ✏ Editar
                </button>
              )}
            </div>

            {!emEdicao && (
              <div style={{ display: "flex", gap: 32 }}>
                <InfoMini label="Valor mensal" value={fmtMoeda(plano.valor)} color="#e8b44c" />
                <InfoMini label="Duração" value={`${plano.duracaomeses} mês(es)`} />
                <InfoMini label="Nº de parcelas" value={plano.duracaomeses} color="#4cde8c" />
              </div>
            )}

            {emEdicao && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                      Nome do plano
                    </div>
                    <input
                      style={{ ...S.input, margin: 0 }}
                      value={editando.nome}
                      onChange={(e) => setEditando((ed) => ({ ...ed, nome: e.target.value }))}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                      Valor mensal (R$)
                    </div>
                    <input
                      style={{ ...S.input, margin: 0, color: "#e8b44c" }}
                      type="number"
                      min="0"
                      step="0.01"
                      value={editando.valor}
                      onChange={(e) => setEditando((ed) => ({ ...ed, valor: e.target.value }))}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                      Duração / parcelas (meses)
                    </div>
                    <input
                      style={{ ...S.input, margin: 0, color: "#4cde8c" }}
                      type="number"
                      min="1"
                      step="1"
                      value={editando.duracaomeses}
                      onChange={(e) => setEditando((ed) => ({ ...ed, duracaomeses: e.target.value }))}
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: "#0d0d0f", border: "1px solid #1e1e22",
                    borderRadius: 4, padding: "10px 14px",
                    fontSize: 11, color: "#666", letterSpacing: "0.05em",
                  }}
                >
                  Preview → <span style={{ color: "#e8e6e1" }}>{editando.nome}</span>
                  {" · "}
                  <span style={{ color: "#e8b44c" }}>{fmtMoeda(editando.valor)}/mês</span>
                  {" · "}
                  <span style={{ color: "#4cde8c" }}>{editando.duracaomeses} parcela(s)</span>
                  {" = "}
                  <span style={{ color: "#e8e6e1" }}>{fmtMoeda(editando.valor * editando.duracaomeses)} total</span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={S.btnPrimary} onClick={salvarPlano} disabled={salvando}>
                    {salvando ? "Salvando…" : "✓ Salvar"}
                  </button>
                  <button style={S.btnGhost} onClick={() => setEditando(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {ok && <div style={S.tokenStatus(true)}>✓ Plano atualizado com sucesso.</div>}
            {err && <div style={S.tokenStatus(false)}>✗ Erro ao salvar. Tente novamente.</div>}
          </div>
        );
      })}
    </>
  );
}