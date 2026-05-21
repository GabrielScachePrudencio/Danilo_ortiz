import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Assinatura/Assinatura.css";

import AssinaturaHeader    from "./components/AssinaturaHeader";
import AssinaturaStatus    from "./components/AssinaturaStatus";
import AssinaturaPlano     from "./components/AssinaturaPlano";
import AssinaturaParcelas  from "./components/AssinaturaParcelas";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function Assinatura() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const [aluno,       setAluno]       = useState(null);
  const [mensalidade, setMensalidade] = useState(null);
  const [carregando,  setCarregando]  = useState(true);
  const [erro,        setErro]        = useState(null);

  /* ── 1. verifica login via /me ── */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/alunos/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("Não autenticado");
        }
        return res.json();
      })
      .then((data) => setAluno(data))
      .catch(() => setErro("Erro ao verificar sessão."))
      .finally(() => setCarregando(false));
  }, []);

  /* ── 2. busca mensalidade quando tiver o id do aluno ── */
  useEffect(() => {
    if (!aluno?.id) return;

    fetch(`${API}/mensalidades/${aluno.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 404) return null; // sem assinatura ainda
        if (!res.ok) throw new Error("Erro ao buscar mensalidade");
        return res.json();
      })
      .then((data) => setMensalidade(data))
      .catch(() => setErro("Erro ao carregar dados da assinatura."));
  }, [aluno]);

  /* ── loading ── */
  if (carregando) {
    return (
      <div className="assin-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="assin-dots">
          <span /><span /><span />
        </div>
      </div>
    );
  }

  /* ── sem assinatura ── */
  const semAssinatura = !mensalidade;

  return (
    <div className="assin-page">

      {/* NAV */}
      <nav className="assin-nav">
        <span className="assin-nav-logo">2D Assessoria</span>
        <button className="assin-nav-back" onClick={() => navigate("/")}>
          ← Voltar
        </button>
      </nav>

      <main className="assin-main">

        <AssinaturaHeader />

        {erro && (
          <p style={{ color: "var(--danger)", fontSize: ".82rem", marginBottom: 24 }}>
            {erro}
          </p>
        )}

        {semAssinatura ? (
          /* ── sem plano ── */
          <div className="assin-empty">
            <div className="assin-empty-icon">📋</div>
            <h2 className="assin-empty-title">Nenhuma assinatura ativa</h2>
            <p className="assin-empty-desc">
              Você ainda não possui um plano contratado.<br />
              Escolha um plano e comece agora.
            </p>
            <button className="assin-btn-primary" onClick={() => navigate("/")}>
              Ver planos →
            </button>
          </div>
        ) : (
          <>
            <AssinaturaPlano    mensalidade={mensalidade} />
            <AssinaturaStatus  mensalidade={mensalidade} aluno={aluno} />
            <AssinaturaParcelas parcelas={mensalidade.parcelas} planoId={mensalidade.planoId} />   
        </>
        )}

      </main>
    </div>
  );
}