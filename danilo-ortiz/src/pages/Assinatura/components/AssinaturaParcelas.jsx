import { useNavigate } from "react-router-dom";

function formatarData(dataStr) {
  if (!dataStr) return "—";
  return new Date(dataStr).toLocaleDateString("pt-BR");
}

function formatarValor(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AssinaturaParcelas({ parcelas, planoId }) {
  const navigate = useNavigate();

  if (!parcelas || parcelas.length === 0) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      <p className="assin-section-label">Parcelas</p>

      <div className="assin-parcelas-list">
        {parcelas.map((p) => {
          const finalizado = p.status === "FINALIZADO";
          const pendente   = p.status === "PENDENTE";

          return (
            <div
              key={p.id}
              className={`assin-parcela-row ${finalizado ? "finalizado" : ""}`}
              onClick={() => pendente && navigate(`/home/telapagamento/${planoId}`)}
              style={{ cursor: pendente ? "pointer" : "default" }}
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
                {pendente && (
                  <span style={{ fontSize: ".62rem", color: "var(--gold)", letterSpacing: ".08em" }}>
                    Clique para pagar →
                  </span>
                )}
              </div>

              <div className="assin-parcela-valor">
                {formatarValor(p.valor)}
              </div>

              <div className={`assin-parcela-status ${finalizado ? "finalizado" : "pendente"}`}>
                {finalizado ? "✓ Pago" : "Pendente"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}