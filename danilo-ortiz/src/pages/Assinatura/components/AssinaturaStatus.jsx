function formatarData(dataStr) {
  if (!dataStr) return "—";
  return new Date(dataStr).toLocaleDateString("pt-BR");
}

function diasRestantes(dataFim) {
  if (!dataFim) return null;
  const diff = new Date(dataFim) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function AssinaturaStatus({ mensalidade, aluno }) {
  if (!mensalidade) return null;

  const ativo      = mensalidade.statusLiberacao === "ATIVADO";
  const dias       = diasRestantes(mensalidade.dataFim);
  const pagas      = mensalidade.parcelas?.filter(p => p.status === "FINALIZADO").length ?? 0;
  const total      = mensalidade.parcelas?.length ?? 0;
  const pct        = total > 0 ? Math.round((pagas / total) * 100) : 0;

  return (
    <div style={{ marginBottom: 40 }}>
      <p className="assin-section-label">Status da assinatura</p>

      {/* card principal */}
      <div className="assin-status-card" style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: ".65rem", color: "var(--muted)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
              Status atual
            </div>
            <span className={`assin-badge ${ativo ? "ativo" : "inativo"}`}>
              {ativo ? "Ativo" : "Inativo"}
            </span>
          </div>

          {ativo && dias !== null && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: ".58rem", color: "var(--muted)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>
                Dias restantes
              </div>
              <div className="assin-info-value gold">
                {dias} <span style={{ fontSize: "1rem", color: "var(--muted)" }}>dias</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* grid de infos */}
      <div className="assin-status-grid">
        <div className="assin-info-cell">
          <span className="assin-info-label">Início</span>
          <span className="assin-info-value small">{formatarData(mensalidade.dataInicio)}</span>
        </div>
        <div className="assin-info-cell">
          <span className="assin-info-label">Término</span>
          <span className="assin-info-value small">{formatarData(mensalidade.dataFim)}</span>
        </div>
        <div className="assin-info-cell">
          <span className="assin-info-label">Parcelas pagas</span>
          <span className="assin-info-value gold">{pagas}<span style={{ fontSize: "1rem", color: "var(--muted)" }}>/{total}</span></span>
        </div>
      </div>

      {/* barra de progresso */}
      <div className="assin-progress-wrap">
        <div className="assin-progress-top">
          <span className="assin-progress-label">Progresso do plano</span>
          <span className="assin-progress-pct">{pct}%</span>
        </div>
        <div className="assin-progress-track">
          <div className="assin-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}