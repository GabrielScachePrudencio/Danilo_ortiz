import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

function formatarData(dataStr) {
  if (!dataStr) return "—";
  return new Date(dataStr).toLocaleDateString("pt-BR");
}

function formatarValor(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AssinaturaParcelas({ parcelas, planoId, onAtualizar }) {
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");

  // qual parcela está sendo verificada agora
  const [verificandoId,   setVerificandoId]   = useState(null);
  const [resultados,      setResultados]      = useState({}); // { [parcelaId]: { status, mensagem } }

  async function verificarPagamento(parcelaId) {
    setVerificandoId(parcelaId);
    try {
      const res = await fetch(`${API}/mensalidades/verificar-pagamento/${parcelaId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setResultados((prev) => ({ ...prev, [parcelaId]: data }));

      // se confirmou, avisa o pai para recarregar a mensalidade
      if (data.status === "FINALIZADO") {
        await onAtualizar?.();
      }
    } catch {
      setResultados((prev) => ({
        ...prev,
        [parcelaId]: { status: "ERRO", mensagem: "Erro de conexão. Tente novamente." },
      }));
    } finally {
      setVerificandoId(null);
    }
  }

  if (!parcelas || parcelas.length === 0) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      <p className="assin-section-label">Parcelas</p>

      <div className="assin-parcelas-list">
        {parcelas.map((p) => {
          const finalizado  = p.status === "FINALIZADO";
          const pendente    = p.status === "PENDENTE";
          const verificando = verificandoId === p.id;
          const resultado   = resultados[p.id];

          return (
            
            <div
  key={p.id}
  className={`assin-parcela-row ${finalizado ? "finalizado" : ""}`}
  style={{
    cursor: "default",
    gridTemplateRows: pendente ? "auto auto" : "auto", // ← abre linha extra se pendente
  }}
>
  <div className="assin-parcela-num">
    {String(p.numeroParcela ?? "—").padStart(2, "0")}
  </div>

  <div className="assin-parcela-info">
    <span className="assin-parcela-data">
      Vencimento: {formatarData(p.dataVencimento)}
    </span>
    {p.dataPagamento && (
      <span className="assin-parcela-sub">
        Pago em: {formatarData(p.dataPagamento)}
      </span>
    )}
  </div>

  <div className="assin-parcela-valor">
    {formatarValor(p.valor)}
  </div>

  <div className={`assin-parcela-status ${finalizado ? "finalizado" : "pendente"}`}>
    {finalizado ? "✓ Pago" : "Pendente"}
  </div>

  {/* botões — linha 2, ocupa todas as colunas */}
  {pendente && (
    <div style={{
      gridColumn: "1 / -1",
      display: "flex", gap: 8, flexWrap: "wrap",
      paddingTop: 12,
      borderTop: "1px solid rgba(169,236,49,0.08)",
    }}>
      <button
        onClick={() => navigate(`/home/telapagamento/${planoId}?parcelaId=${p.id}`)}
        style={{
          fontFamily: "inherit", fontSize: "0.65rem", fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "6px 16px", background: "var(--gold)",
          color: "#0a0a0a", border: "none", cursor: "pointer",
        }}
      >
        Pagar →
      </button>

      <button
        onClick={() => verificarPagamento(p.id)}
        disabled={verificando}
        style={{
          fontFamily: "inherit", fontSize: "0.65rem", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "6px 16px", background: "transparent",
          color: verificando ? "rgba(169,236,49,0.3)" : "var(--gold)",
          border: `1px solid ${verificando ? "rgba(169,236,49,0.15)" : "rgba(169,236,49,0.35)"}`,
          cursor: verificando ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {verificando ? "Verificando..." : "✓ Já paguei"}
      </button>
    </div>
  )}

  {/* resultado da verificação */}
  {resultado && (
    <div style={{
      gridColumn: "1 / -1",
      padding: "8px 12px", fontSize: "0.68rem",
      letterSpacing: "0.04em", lineHeight: 1.5,
      background: resultado.status === "FINALIZADO" ? "rgba(111,207,122,0.08)"
                : resultado.status === "PENDENTE"   ? "rgba(224,160,85,0.08)"
                : "rgba(224,85,85,0.08)",
      border: `1px solid ${
        resultado.status === "FINALIZADO" ? "rgba(111,207,122,0.3)"
        : resultado.status === "PENDENTE" ? "rgba(224,160,85,0.3)"
        : "rgba(224,85,85,0.3)"
      }`,
      color: resultado.status === "FINALIZADO" ? "#6fcf7a"
           : resultado.status === "PENDENTE"   ? "#e0a055"
           : "#e05555",
    }}>
      {resultado.mensagem}
    </div>
  )}
</div>

          );
        })}
      </div>
    </div>
  );
}