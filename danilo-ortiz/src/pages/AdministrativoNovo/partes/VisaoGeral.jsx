import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

function formatarData(iso) {
  if (!iso) return null;
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function badgeAcessoEMensalidade(aluno) {
  const temMensalidadeEmVigor =
    aluno.statusMensalidade === "ATIVADO" || aluno.statusMensalidade === "DESATIVADO";

  if (aluno.statusAssinatura === "ATIVADO") {
    return { texto: "ATIVO", classe: "badge-ativo" };
  }

  if (temMensalidadeEmVigor) {
    return { texto: "DESATIVADO · c/ mensalidade", classe: "badge-atencao" };
  }

  return { texto: "SEM PLANO", classe: "badge-inativo" };
}

export function VisaoGeral({
  abrirModalCadastro,
  navigate,
  abrirContexto,
}) {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [alunos, setAlunos] = useState([]);
  const [mrrTotal, setMrrTotal] = useState(0);
  const [buscaGeral, setBuscaGeral] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [resA, resT] = await Promise.all([
        fetch(`${API}/alunos`, { headers }),
        fetch(`${API}/pagamentos/ultimas-vendas`, { headers }),
      ]);

      if (resA.ok) {
        const dadosAlunos = await resA.json();
        setAlunos(dadosAlunos);
      } else {
        setErro("Erro ao carregar alunos.");
      }

      if (resT.ok) {
        const vendas = await resT.json();

        const total = vendas
          .filter((v) => v.status === "FINALIZADO")
          .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

        setMrrTotal(total);
      }
    } catch (e) {
      console.error(e);
      setErro("Erro ao conectar com o servidor.");
    }
  }

  const alunosFiltrados = buscaGeral.trim()
    ? alunos.filter(
        (a) =>
          a.nome?.toLowerCase().includes(buscaGeral.toLowerCase()) ||
          a.email?.toLowerCase().includes(buscaGeral.toLowerCase())
      )
    : [];

  const totalAtivos = alunos.filter(
    (a) => a.statusAssinatura === "ATIVADO"
  ).length;

  return (
    <div className="tab-visao-container">
      {erro && <div className="admin-erro">{erro}</div>}

      <div className="visao-search-wrap">
        <div className="pdv-search-inline">
          <span className="icon">&#9906;</span>

          <input
            type="text"
            placeholder="buscar aluno por nome ou e-mail..."
            value={buscaGeral}
            onChange={(e) => setBuscaGeral(e.target.value)}
            autoFocus
          />
        </div>

        <button
          className="btn-primary btn-nowrap"
          onClick={abrirModalCadastro}
        >
          + cadastrar aluno
        </button>
      </div>

      <div className="quick-stats-row">
        <div className="quick-stat">
          <span className="quick-stat-value">{totalAtivos}</span>
          <span className="quick-stat-label">alunos ativos</span>
        </div>


        <div className="quick-stat">
          <span className="quick-stat-value">{alunos.length}</span>
          <span className="quick-stat-label">total cadastrados</span>
        </div>
      </div>

      <div className="pdv-hint">
        digite para buscar um aluno — clique para abrir o perfil ou clique com
        o botão direito para ações rápidas
      </div>

      <div className="pdv-results">
        {buscaGeral.trim() && alunosFiltrados.length === 0 && (
          <div className="pdv-empty">
            nenhum aluno encontrado
          </div>
        )}

        {alunosFiltrados.map((aluno) => {
          const badge = badgeAcessoEMensalidade(aluno);
          const dataFimFormatada = formatarData(aluno.dataFimMensalidade);

          return (
            <div
              key={aluno.id}
              className="pdv-result-row"
              onClick={() =>
                navigate(`/home/conta/${aluno.id}?admin=true`)
              }
              onContextMenu={(e) => abrirContexto(e, aluno)}
            >
              <div>
                <div className="pdv-result-name">
                  {aluno.nome}
                </div>

                <div className="pdv-result-email">
                  {aluno.email}
                  {dataFimFormatada && ` · vigência até ${dataFimFormatada}`}
                </div>
              </div>

              <span className={`badge ${badge.classe}`}>
                {badge.texto}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}