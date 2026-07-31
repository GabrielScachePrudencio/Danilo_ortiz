import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useDadosAluno } from "./useDadosAluno";
import { S } from "./partes/estilosAluno";

import { PerfilHeader } from "./partes/PerfilHeader";
import { Inicio } from "./partes/Inicio";
import { AssinaturaTab } from "./partes/AssinaturaTab";
import { ParcelasTab } from "./partes/ParcelasTab";
import { MeusDados } from "./partes/MeusDados";
import { ModalTrocarSenha } from "./partes/ModalTrocarSenha";
import "./homealuno.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function HomeAluno() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // esse é o mesmo param name que o Conta.js antigo usava — a rota precisa
  // continuar definida como "/home/conta/:idAlunoE" pra isso funcionar.
  const { idAlunoE: idParam } = useParams();
  const [searchParams] = useSearchParams();
  const isAdminView = searchParams.get("admin") === "true";

  // ── quem está autenticado (pode ser diferente de quem está sendo visto) ──
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [idAluno, setIdAluno] = useState(null);
  const [modoAdmin, setModoAdmin] = useState(false);

  const [verificando, setVerificando] = useState(true);
  const [erroSessao, setErroSessao] = useState(null);

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
          throw new Error();
        }
        return res.json();
      })
      .then((data) => {
        setUsuarioLogado(data);

        // tentou ver a conta de outra pessoa sem ser admin → nega e manda pra própria home
        if (isAdminView && data.tipoUsuario !== "ADMIN") {
          navigate("/home");
          return;
        }

        const ehModoAdmin = isAdminView && data.tipoUsuario === "ADMIN" && !!idParam;
        const idFinal = ehModoAdmin ? Number(idParam) : data.id;

        setModoAdmin(ehModoAdmin);
        setIdAluno(idFinal);
      })
      .catch(() => setErroSessao("Erro ao verificar sessão."))
      .finally(() => setVerificando(false));
  }, []);

  // ── dados de quem está sendo exibido (aluno próprio OU o aluno que o admin escolheu) ──
  const {
    aluno,
    editado,
    mensalidade,
    historico,
    carregando,
    erro,
    salvando,
    toast,
    atualizarCampo,
    salvarAlteracoes,
    descartarAlteracoes,
    cancelarPlano,
    renovarMensalidade,
    trocarDePlano,
    confirmarCriouSisrun,
    recarregarTudo,
    mostrarToast,
    urlMensalidade,
  } = useDadosAluno(idAluno, token);

  // ── navegação ──
  const [abaAtiva, setAbaAtiva] = useState("inicio");
  const [menuAberto, setMenuAberto] = useState({
    inicio: true,
    assinatura: false,
    conta: false,
  });

  const [modalSenha, setModalSenha] = useState(false);

  function tituloTela() {
    switch (abaAtiva) {
      case "inicio":
        return "Início";
      case "assinatura":
        return "Assinatura";
      case "parcelas":
        return "Parcelas";
      case "dados":
        return "Meus Dados";
      default:
        return "";
    }
  }

  function deslogar() {
    localStorage.clear();
    navigate("/");
  }

  // ── loading da sessão ──
  if (verificando || (idAluno && carregando)) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,228,0.25)" }}>
          Carregando...
        </p>
      </div>
    );
  }

  if (erroSessao) {
    return (
      <div style={{ ...S.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <p style={{ color: "#e05555" }}>{erroSessao}</p>
        <button style={S.btnPrimary} onClick={() => navigate("/login")}>
          Fazer Login
        </button>
      </div>
    );
  }

  // usuarioLogado é quem tá autenticado (decide permissões);
  // aluno é de quem estamos mostrando os dados (pode ser outra pessoa, se modoAdmin)
  const ehAdminLogado = usuarioLogado?.tipoUsuario === "ADMIN";

  return (
    <div className="aluno-shell" style={S.page}>
      {/* ===================== BANNER MODO ADMIN ===================== */}
      {modoAdmin && (
        <div style={S.bannerModoAdmin}>
          <span>
            👁 Você está vendo a conta de <strong>{aluno?.nome ?? "..."}</strong> como administrador.
          </span>
          <button
            onClick={() => navigate("/home/administrativonovo")}
            style={{
              background: "transparent",
              border: "1px solid rgba(76,168,222,0.4)",
              color: "#4ca8de",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            ← Voltar ao painel
          </button>
        </div>
      )}

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* ===================== MENU ===================== */}
        <aside className="aluno-sidebar" style={{ display: "flex", flexDirection: "column" }}>
          <a href="/" className="hero-link">
            <h1 className="hero-h1">
              <em>2D ASSESSORIA</em>
            </h1>
          </a>

          <br />

          {/* Início */}
          <div
            className="aluno-nav-group"
            onClick={() => setMenuAberto({ ...menuAberto, inicio: !menuAberto.inicio })}
          >
            Início
          </div>
          {menuAberto.inicio && (
            <div
              className={`aluno-nav-subitem ${abaAtiva === "inicio" ? "active" : ""}`}
              onClick={() => setAbaAtiva("inicio")}
            >
              Resumo
            </div>
          )}

          {/* Assinatura */}
          <div
            className="aluno-nav-group"
            onClick={() => setMenuAberto({ ...menuAberto, assinatura: !menuAberto.assinatura })}
          >
            Assinatura
          </div>
          {menuAberto.assinatura && (
            <>
              <div
                className={`aluno-nav-subitem ${abaAtiva === "assinatura" ? "active" : ""}`}
                onClick={() => setAbaAtiva("assinatura")}
              >
                Meu Plano
              </div>
              <div
                className={`aluno-nav-subitem ${abaAtiva === "parcelas" ? "active" : ""}`}
                onClick={() => setAbaAtiva("parcelas")}
              >
                Parcelas
              </div>
            </>
          )}

          {/* Minha Conta */}
          <div
            className="aluno-nav-group"
            onClick={() => setMenuAberto({ ...menuAberto, conta: !menuAberto.conta })}
          >
            Minha Conta
          </div>
          {menuAberto.conta && (
            <div
              className={`aluno-nav-subitem ${abaAtiva === "dados" ? "active" : ""}`}
              onClick={() => setAbaAtiva("dados")}
            >
              Meus Dados
            </div>
          )}

          {/* Segurança — só faz sentido pro próprio dono da conta */}
          {!modoAdmin && (
            <div className="aluno-nav-group" onClick={() => setModalSenha(true)}>
              🔒 Segurança
            </div>
          )}

          <div style={{ marginTop: "auto" }}>
            {/* checa o usuário LOGADO, não o aluno sendo visualizado */}
            {ehAdminLogado && (
              <div
                className="aluno-nav-group voltar-admin"
                onClick={() => navigate("/home/administrativonovo")}
              >
                {modoAdmin ? "← Painel Administrativo" : "Administrativo"}
              </div>
            )}
            <div className="aluno-nav-group" onClick={deslogar}>
              Sair
            </div>
          </div>
        </aside>

        {/* ===================== CONTEÚDO ===================== */}
        <main className="aluno-main" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <PerfilHeader aluno={aluno} mensalidade={mensalidade} />

          <header
            style={{
              padding: "20px 48px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(196,160,100,0.4)",
              }}
            >
              {tituloTela()}
            </div>
          </header>

          <div className="aluno-content" style={S.content}>
            {erro && (
              <p style={{ color: "#e05555", marginBottom: 16, fontSize: "0.82rem" }}>{erro}</p>
            )}

            {abaAtiva === "inicio" && (
              <Inicio
                aluno={aluno}
                mensalidade={mensalidade}
                modoAdmin={modoAdmin}
                onIrParaAssinatura={() => setAbaAtiva("assinatura")}
                onIrParaParcelas={() => setAbaAtiva("parcelas")}
                onIrParaDados={() => setAbaAtiva("dados")}
                onConfirmarSisrun={confirmarCriouSisrun}
              />
            )}

            {abaAtiva === "assinatura" && (
              <AssinaturaTab
                mensalidade={mensalidade}
                idAluno={idAluno}
                modoAdmin={modoAdmin}
                onCancelar={cancelarPlano}
                onRenovar={renovarMensalidade}
                onTrocarDePlano={trocarDePlano}
              />
            )}

            {abaAtiva === "parcelas" && (
              <ParcelasTab
                mensalidade={mensalidade}
                historico={historico}
                urlMensalidade={urlMensalidade}
                token={token}
                onAtualizar={recarregarTudo}
              />
            )}

            {abaAtiva === "dados" && (
              <MeusDados
                editado={editado}
                atualizarCampo={atualizarCampo}
                salvarAlteracoes={salvarAlteracoes}
                descartarAlteracoes={descartarAlteracoes}
                salvando={salvando}
                onAbrirSenha={modoAdmin ? undefined : () => setModalSenha(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* ===================== MODAL SEGURANÇA ===================== */}
      {modalSenha && !modoAdmin && (
        <ModalTrocarSenha
          onClose={() => setModalSenha(false)}
          idAluno={idAluno}
          token={token}
          API={API}
          mostrarToast={mostrarToast}
        />
      )}

      {/* ===================== TOAST ===================== */}
      {toast && <div style={S.toast(toast.ok)}>{toast.ok ? "✓" : "✕"} &nbsp; {toast.msg}</div>}

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translate(-50%,20px)} to{opacity:1;transform:translate(-50%,0)} }
      `}</style>
    </div>
  );
}
