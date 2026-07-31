import React, { useEffect, useState } from "react";
import { S } from "./estilos";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

const CAMPOS = [
  { key: "mpaccesstoken", label: "Access Token (produção)" },
  { key: "mppublickey", label: "Public Key (produção)" },
  { key: "mpclientid", label: "Client ID" },
  { key: "mpclientsecret", label: "Client Secret" },
  { key: "mpaccesstokentest", label: "Access Token (teste)" },
  { key: "mppublickeytest", label: "Public Key (teste)" },
];

export function MercadoPago() {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [credAtual, setCredAtual] = useState({});
  const [credentials, setCredentials] = useState({
    mpaccesstoken: "", mppublickey: "", mpclientsecret: "", mpclientid: "",
    mpaccesstokentest: "", mppublickeytest: "", mpambiente: "PRODUCAO",
  });
  const [salvando, setSalvando] = useState(null);
  const [statusSalvo, setStatusSalvo] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    pegarConfiguracaoAtual();
  }, []);

  async function pegarConfiguracaoAtual() {
    try {
      const res = await fetch(`${API}/configuracao`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const d = await res.json();
        setCredAtual({
          mpaccesstoken: d.mpaccesstoken || "",
          mppublickey: d.mppublickey || "",
          mpclientid: d.mpclientid || "",
          mpclientsecret: d.mpclientsecret || "",
          mpaccesstokentest: d.mpaccesstokentest || "",
          mppublickeytest: d.mppublickeytest || "",
          mpambiente: d.mpambiente || "PRODUCAO",
        });
      } else {
        setErro("Erro ao buscar configurações.");
      }
    } catch {
      setErro("Erro ao buscar configurações.");
    }
  }

  async function trocarAmbiente(amb) {
    try {
      await fetch(`${API}/configuracao`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...credAtual, mpambiente: amb }),
      });
      setCredAtual((c) => ({ ...c, mpambiente: amb }));
    } catch {
      setErro("Erro ao atualizar ambiente.");
    }
  }

  async function salvarCampo(key) {
    if (!credentials[key].trim()) return;
    setSalvando(key);
    try {
      const payload = { ...credAtual, [key]: credentials[key] };
      const res = await fetch(`${API}/configuracao`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setCredAtual(payload);
        setCredentials((c) => ({ ...c, [key]: "" }));
        setStatusSalvo({ key, ok: true });
      } else {
        setStatusSalvo({ key, ok: false });
      }
    } catch {
      setStatusSalvo({ key, ok: false });
    } finally {
      setSalvando(null);
      setTimeout(() => setStatusSalvo(null), 3000);
    }
  }

  return (
    <>
      <p style={S.sectionTitle}>Credenciais Mercado Pago</p>
      {erro && <div style={S.erro}>{erro}</div>}

      <div style={{ ...S.tokenBox, marginBottom: 24, display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontSize: 13, color: "#888" }}>Ambiente ativo:</span>
        {["PRODUCAO", "TESTE"].map((amb) => (
          <button
            key={amb}
            style={{
              ...S.btnGhost,
              ...(credAtual.mpambiente === amb
                ? { borderColor: "#e8b44c", color: "#e8b44c", background: "#e8b44c18" }
                : {}),
            }}
            onClick={() => trocarAmbiente(amb)}
          >
            {amb}
          </button>
        ))}
        <span style={{ fontSize: 11, color: "#555" }}>
          {credAtual.mpambiente === "TESTE"
            ? "⚠ usando credenciais de teste — pagamentos não são reais"
            : "✓ usando credenciais de produção"}
        </span>
      </div>

      {CAMPOS.map(({ key, label }) => (
        <div key={key} style={{ ...S.tokenBox, marginBottom: 16 }}>
          <span style={S.tokenLabel}>{label}</span>
          <div
            style={{
              ...S.tokenInput, color: "#555", marginBottom: 12,
              letterSpacing: "0.03em", padding: "10px 14px", fontSize: 11,
            }}
          >
            {credAtual[key] ? credAtual[key].slice(0, 12) + "••••••••••••" + credAtual[key].slice(-4) : "—"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...S.tokenInput, marginBottom: 0, flex: 1 }}
              type="password"
              placeholder={`Novo valor para ${label.toLowerCase()}...`}
              value={credentials[key]}
              onChange={(e) => setCredentials((c) => ({ ...c, [key]: e.target.value }))}
              autoComplete="off"
            />
            <button style={S.btnPrimary} onClick={() => salvarCampo(key)} disabled={salvando === key}>
              {salvando === key ? "Salvando…" : "Salvar"}
            </button>
          </div>
          {statusSalvo?.key === key && (
            <div style={S.tokenStatus(statusSalvo.ok)}>
              {statusSalvo.ok ? "✓ Salvo com sucesso." : "✗ Erro ao salvar."}
            </div>
          )}
        </div>
      ))}
    </>
  );
}