export default function AssinaturaPlano({ mensalidade }) {
  if (!mensalidade) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      <p className="assin-section-label">Plano contratado</p>

      <div className="assin-plano-card">
        <div>
          <div className="assin-plano-nome">{mensalidade.nomePlano}</div>
        </div>

        <div className="assin-plano-valor">
          <div className="assin-plano-valor-label">Valor mensal</div>
          <div className="assin-plano-valor-num">
            <small>R$</small>
            {Number(mensalidade.valorMensalidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}