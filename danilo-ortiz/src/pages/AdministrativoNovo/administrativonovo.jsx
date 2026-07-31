import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VisaoGeral } from "./partes/VisaoGeral";
import { Alunos } from "./partes/Alunos";
import { Canceladas } from "./partes/Canceladas";
import { Planos } from "./partes/Planos";
import { Relatorio } from "./partes/Relatorio";
import { Vendas } from "./partes/Vendas";
import { Parcelas } from "./partes/Parcelas";
import { MercadoPago } from "./partes/MercadoPago";
import { ModalCadastroAluno } from "./partes/ModalCadastroAluno";
import "./administrativonovo.css";
import ContextMenuAluno from "./partes/ContextMenuAluno";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const API = BASE_URL;

export default function AdministrativoNovo() {
  const navigate = useNavigate();

  // Estados de Segurança e Permissão
  const [carregando, setCarregando] = useState(true);
  const [acessoNegado, setAcessoNegado] = useState(false);

  const [abaAtiva, setAbaAtiva] = useState("dashboard");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [refreshAlunos, setRefreshAlunos] = useState(0);
  
  const [admin, setAdmin] = useState(null);
  const [menuAberto, setMenuAberto] = useState({
    dashboard: true,
    alunos: false,
    producao: false,
    financeiro: false,
    configuracoes: false,
  });

  const token = localStorage.getItem("token");

  // Função para deslogar
  const deslogar = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 1. Verificação de permissão do usuário ao carregar a página
  useEffect(() => {
    if (!token) {
      setAcessoNegado(true);
      setCarregando(false);
      return;
    }

    fetch(`${BASE_URL}/alunos/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro na autenticação");
        return res.json();
      })
      .then((data) => {
        if (data.tipoUsuario !== "ADMIN") {
          setAcessoNegado(true);
          return;
        }
        setAdmin(data);
      })
      .catch(() => {
        setAcessoNegado(true);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  // Fechar menu de contexto no clique fora
  useEffect(() => {
    const fecharContexto = () => setContextMenu(null);
    window.addEventListener("click", fecharContexto);

    return () => window.removeEventListener("click", fecharContexto);
  }, []);

  function abrirContexto(e, aluno) {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      aluno,
    });
  }

  function tituloTela() {
    switch (abaAtiva) {
      case "dashboard": return "Visão Geral";
      case "alunos": return "Alunos";
      case "cancelados": return "Alunos Cancelados";
      case "planos": return "Planos";
      case "relatorio-planos": return "Relatório por Plano";
      case "ultimas-vendas": return "Últimas Vendas";
      case "parcelas": return "Parcelas por Aluno";
      case "receita-planos": return "Receita por Plano";
      case "mercadopago": return "Mercado Pago";
      default: return "";
    }
  }

  // 2. TELA DE CARREGAMENTO
  if (carregando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>Verificando permissões...</h2>
      </div>
    );
  }

  // 3. TELA DE ACESSO NEGADO
  if (acessoNegado) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1 style={{ color: "#d9534f" }}>🚫 Acesso Negado</h1>
        <p>Você não tem permissão para acessar o painel administrativo.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
          }}
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  // Extrai o email do admin carregado na API
  const emailLogado = admin?.email;

  // 4. CONTEÚDO PRINCIPAL (Só renderiza se for ADMIN)
  return (
    <div className="admin-shell">
      {/* ===================== MENU ===================== */}
      <aside className="sidebar">
        <a href="/" className="hero-link">
            <h1 className="hero-h1"> <em> 2D ASSESSORIA </em> </h1>
        </a>

        <br />
        {/* Dashboard */}
        <div
          className="nav-group"
          onClick={() => setMenuAberto({ ...menuAberto, dashboard: !menuAberto.dashboard })}
        >
          Dashboard
        </div>
        {menuAberto.dashboard && (
          <div
            className={`nav-subitem ${abaAtiva === "dashboard" ? "active" : ""}`}
            onClick={() => setAbaAtiva("dashboard")}
          >
            Visão Geral
          </div>
        )}

        {/* Alunos */}
        <div
          className="nav-group"
          onClick={() => setMenuAberto({ ...menuAberto, alunos: !menuAberto.alunos })}
        >
          Alunos
        </div>
        {menuAberto.alunos && (
          <>
            <div
              className={`nav-subitem ${abaAtiva === "alunos" ? "active" : ""}`}
              onClick={() => setAbaAtiva("alunos")}
            >
              Buscar alunos
            </div>
            <div
              className={`nav-subitem ${abaAtiva === "cancelados" ? "active" : ""}`}
              onClick={() => setAbaAtiva("cancelados")}
            >
              Cancelados
            </div>
          </>
        )}

        {/* Produção */}
        <div
          className="nav-group"
          onClick={() => setMenuAberto({ ...menuAberto, producao: !menuAberto.producao })}
        >
          Produção
        </div>
        {menuAberto.producao && (
          <>
            <div
              className={`nav-subitem ${abaAtiva === "planos" ? "active" : ""}`}
              onClick={() => setAbaAtiva("planos")}
            >
              Planos
            </div>
            <div
              className={`nav-subitem ${abaAtiva === "relatorio-planos" ? "active" : ""}`}
              onClick={() => setAbaAtiva("relatorio-planos")}
            >
              Relatório de alunos por plano
            </div>
          </>
        )}

        {/* Financeiro */}
        <div
          className="nav-group"
          onClick={() => setMenuAberto({ ...menuAberto, financeiro: !menuAberto.financeiro })}
        >
          Financeiro
        </div>
        {menuAberto.financeiro && (
          <>
            <div
              className={`nav-subitem ${abaAtiva === "ultimas-vendas" ? "active" : ""}`}
              onClick={() => setAbaAtiva("ultimas-vendas")}
            >
              Últimas vendas
            </div>
            <div
              className={`nav-subitem ${abaAtiva === "parcelas" ? "active" : ""}`}
              onClick={() => setAbaAtiva("parcelas")}
            >
              Parcelas por aluno
            </div>
            <div
              className={`nav-subitem ${abaAtiva === "receita-planos" ? "active" : ""}`}
              onClick={() => setAbaAtiva("receita-planos")}
            >
              Receita por plano
            </div>
          </>
        )}

        {/* Configurações */}
        <div
          className="nav-group"
          onClick={() => setMenuAberto({ ...menuAberto, configuracoes: !menuAberto.configuracoes })}
        >
          Configurações
        </div>
        {menuAberto.configuracoes && (
          <div
            className={`nav-subitem ${abaAtiva === "mercadopago" ? "active" : ""}`}
            onClick={() => setAbaAtiva("mercadopago")}
          >
            Mercado Pago
          </div>
        )}
      </aside>

      {/* ===================== CONTEÚDO ===================== */}
      <main className="admin-main">
        <header className="admin-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="serif">{tituloTela()}</h1>
            <div className="crumb">Administrativo / {tituloTela()}</div>
          </div>

          {/* Botões do usuário logado alinhados à direita do header (acima do conteúdo) */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {emailLogado ? (
              <>
                <button className="nbtn nbtn-ghost" onClick={() => navigate("/home/")}>
                  HomeAntigo: {emailLogado}
                </button>
                <button className="nbtn nbtn-ghost" onClick={() => navigate("/home/conta")}>
                  {emailLogado}
                </button>
                <button className="nbtn nbtn-ghost" onClick={deslogar}>Sair</button>
              </>
            ) : (
              <button className="nbtn nbtn-gold" onClick={() => navigate("/login")}>Entrar</button>
            )}
          </div>
        </header>

        <div className="admin-content">
          {abaAtiva === "dashboard" && (
            <VisaoGeral
              key={`visao-${refreshAlunos}`}
              navigate={navigate}
              abrirContexto={abrirContexto}
              abrirModalCadastro={() => setModalCadastro(true)}
            />
          )}

          {abaAtiva === "alunos" && <Alunos key={`alunos-${refreshAlunos}`} navigate={navigate} abrirContexto={abrirContexto} />}
          {abaAtiva === "cancelados" && <Canceladas />}
          {abaAtiva === "planos" && <Planos />}
          {abaAtiva === "relatorio-planos" && <Relatorio />}
          {abaAtiva === "ultimas-vendas" && <Vendas />}
          {abaAtiva === "parcelas" && <Parcelas navigate={navigate} />}
          {abaAtiva === "receita-planos" && <Relatorio />}
          {abaAtiva === "mercadopago" && <MercadoPago />}
        </div>
      </main>

      {/* ===================== MENU CONTEXTO ===================== */}
      {contextMenu && (
        <ContextMenuAluno
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            navigate={navigate}
            admin={admin}
            onAtualizado={() => setRefreshAlunos((n) => n + 1)}
        />
      )}

      {/* ===================== MODAL ===================== */}
      <ModalCadastroAluno
        aberto={modalCadastro}
        aoFechar={() => setModalCadastro(false)}
        aoCadastrar={() => setRefreshAlunos((n) => n + 1)}
      />
    </div>
  );
}