import React, { useEffect, useState } from "react";
import { S, Campo, fmtData, fmtMoeda } from "./estilos";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function Canceladas() {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [canceladas, setCanceladas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    buscarCanceladas();
  }, []);

  async function buscarCanceladas() {
    setCarregando(true);
    try {
      const res = await fetch(`${API}/mensalidades/canceladas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCanceladas(await res.json());
      } else {
        setErro("Erro ao buscar cancelamentos. Verifique se o endpoint /mensalidades/canceladas existe no backend.");
      }
    } catch {
      setErro("Falha na conexão ao buscar cancelamentos.");
    } finally {
      setCarregando(false);
    }
  }

  const filtradas = busca.trim()
    ? canceladas.filter(
        (c) =>
          c.nomeAluno?.toLowerCase().includes(busca.toLowerCase()) ||
          c.emailAluno?.toLowerCase().includes(busca.toLowerCase()) ||
          c.nomePlano?.toLowerCase().includes(busca.toLowerCase())
      )
    : canceladas;

  const totalCancelados = canceladas.length;
  const totalParcelasPagas = canceladas.reduce((s, c) => s + (c.parcelasPagas || 0), 0);
  const receitaRealizada = canceladas.reduce((s, c) => {
    return s + Number(c.valorParcela || 0) * (c.parcelasPagas || 0);
  }, 0);

  return (
    <>
      <p style={S.sectionTitle}>Assinaturas Canceladas</p>
      {erro && <div style={S.erro}>{erro}</div>}

      <div style={S.cardGrid}>
        <div style={S.card}>
          <div style={S.cardLabel}>Total Cancelados</div>
          <div style={S.cardValue}>{totalCancelados}</div>
          <div style={S.cardSub}>assinaturas encerradas</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Parcelas Pagas (total)</div>
          <div style={S.cardValue}>{totalParcelasPagas}</div>
          <div style={S.cardSub}>antes do cancelamento</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Receita Realizada</div>
          <div style={{ ...S.cardValue, fontSize: 20 }}>{fmtMoeda(receitaRealizada)}</div>
          <div style={S.cardSub}>de assinaturas canceladas</div>
        </div>
      </div>

      <div style={S.searchRow}>
        <input
          style={S.input}
          placeholder="Pesquise por nome, e-mail ou plano..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button style={S.btnGhost} onClick={() => setBusca("")}>
            Limpar
          </button>
        )}
        <button style={S.btnPrimary} onClick={buscarCanceladas}>↻ Atualizar</button>
      </div>

      {carregando && (
        <p style={{ color: "#555", fontSize: 12, textAlign: "center", padding: "32px 0" }}>carregando…</p>
      )}

      {!carregando && filtradas.length === 0 && !erro && (
        <p style={{ color: "#555", fontSize: 13, textAlign: "center", padding: "32px 0" }}>
          {busca ? "nenhum resultado para a busca" : "nenhum cancelamento registrado"}
        </p>
      )}

      {!carregando &&
        filtradas.map((c) => {
          const aberto = expandido === c.id;
          const pct = c.totalParcelasContratadas > 0
            ? Math.round((c.parcelasPagas / c.totalParcelasContratadas) * 100)
            : 0;

          return (
            <div key={c.id} style={S.canceladaCard}>
              <div style={{ ...S.canceladaHeader, cursor: "pointer" }} onClick={() => setExpandido(aberto ? null : c.id)}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, color: "#e8e6e1", fontWeight: 600 }}>{c.nomeAluno}</span>
                    <span
                      style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 3,
                        fontSize: 10, letterSpacing: "0.12em", fontWeight: 700,
                        background: "#2e1a1a", color: "#de4c4c",
                      }}
                    >
                      {c.motivoCancelamento || "CANCELADO"}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "#555" }}>{c.emailAluno}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 11, color: "#666" }}>
                    Cancelado em: <span style={{ color: "#e8b44c" }}>{fmtData(c.dataCancelamento)}</span>
                  </span>
                  <span style={{ fontSize: 16, color: "#555" }}>{aberto ? "▲" : "▼"}</span>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4 }}>
                  <span>{c.nomePlano || "—"}</span>
                  <span>
                    <span style={{ color: "#4cde8c" }}>{c.parcelasPagas}</span>
                    <span style={{ color: "#555" }}> pagas / </span>
                    <span style={{ color: "#e8e6e1" }}>{c.totalParcelasContratadas} contratadas</span>
                  </span>
                </div>
                <div style={S.progressBar()}>
                  <div style={S.progressFill(pct, "#4cde8c")} />
                </div>
              </div>

              {aberto && (
                <div style={{ marginTop: 16, borderTop: "1px solid #1e1e22", paddingTop: 16 }}>
                  <div style={S.canceladaGrid}>
                    <Campo label="Plano" value={c.nomePlano} />
                    <Campo label="Valor mensal" value={fmtMoeda(c.valorMensalidade)} color="#e8b44c" />
                    <Campo label="Valor por parcela" value={fmtMoeda(c.valorParcela)} color="#e8b44c" />
                    <Campo label="Início da assinatura" value={fmtData(c.dataInicio)} />
                    <Campo label="Fim original previsto" value={fmtData(c.dataFim)} />
                    <Campo label="Último mês pago até" value={fmtData(c.dataFimEfetiva)} color="#4ca8de" />
                    <Campo label="Parcelas pagas" value={`${c.parcelasPagas} de ${c.totalParcelasContratadas}`} color="#4cde8c" />
                    <Campo label="Parcelas canceladas" value={c.parcelasRestantesNoCancelamento} color="#de4c4c" />
                    <Campo label="Cancelado por" value={c.canceladoPorNome} />
                    <Campo label="Motivo" value={c.motivoCancelamento} />
                  </div>

                  {c.parcelasPagasIds && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 6 }}>
                        IDs das parcelas pagas
                      </div>
                      <div
                        style={{
                          background: "#0d0d0f", border: "1px solid #1e1e22", borderRadius: 4,
                          padding: "8px 12px", fontSize: 11, color: "#4cde8c",
                          letterSpacing: "0.05em", fontFamily: "monospace",
                        }}
                      >
                        {c.parcelasPagasIds}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}