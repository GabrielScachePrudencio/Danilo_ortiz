import React, { useEffect, useState, useRef, useLayoutEffect } from "react";

import "./ContextMenuAluno.css";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const API = BASE_URL;

const DIAS_AVISO_FIM_MENSALIDADE = 7;

function diasRestantes(dataFimIso) {
  if (!dataFimIso) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const fim = new Date(dataFimIso);
  fim.setHours(0, 0, 0, 0);
  const diffMs = fim.getTime() - hoje.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export default function ContextMenuAluno({
  contextMenu,
  setContextMenu,
  navigate,
  admin,
  onAtualizado, // callback opcional pro pai recarregar a lista de alunos
}) {
  const [planos, setPlanos] = useState([]);
  const [mostrarPlanos, setMostrarPlanos] = useState(false);
  const [processando, setProcessando] = useState(false); // trava geral (atribuir/cancelar/enviar msg)

  // { tipo, titulo, descricao, params } | null — controla o modal de confirmação de envio
  const [confirmacaoMsg, setConfirmacaoMsg] = useState(null);

  // ── posicionamento do menu, ajustado para não estourar a viewport ──────
  const menuRef = useRef(null);
  const [posicao, setPosicao] = useState({ top: 0, left: 0 });

  const token =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API}/planos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setPlanos(data);
      })
      .catch(console.error);
  }, [token]);

  useLayoutEffect(() => {
    if (!contextMenu || !menuRef.current) return;

    const { innerWidth, innerHeight } = window;
    const rect = menuRef.current.getBoundingClientRect();

    let top = contextMenu.y;
    let left = contextMenu.x;

    if (top + rect.height > innerHeight) {
      top = Math.max(8, innerHeight - rect.height - 8);
    }
    if (left + rect.width > innerWidth) {
      left = Math.max(8, innerWidth - rect.width - 8);
    }

    setPosicao({ top, left });
    // recalcula também quando o submenu de planos abre/fecha ou quando o
    // modal de confirmação some (o menu volta a aparecer)
  }, [contextMenu, mostrarPlanos, confirmacaoMsg]);

  if (!contextMenu) return null;

  const aluno = contextMenu.aluno;

  const temMensalidadeEmVigor =
    aluno.statusMensalidade === "ATIVADO" || aluno.statusMensalidade === "DESATIVADO";

  const acessoDesativadoComMensalidadeAtiva =
    aluno.statusAssinatura !== "ATIVADO" && aluno.statusMensalidade === "ATIVADO";

  // ── regras de visibilidade dos botões de mensagem ──────────────────────
  const podeEnviarCobranca = aluno.statusMensalidade === "DESATIVADO";

  const diasParaFim = diasRestantes(aluno.dataFimMensalidade);
  const podeEnviarFimMensalidade =
    aluno.statusMensalidade === "ATIVADO" &&
    diasParaFim !== null &&
    diasParaFim >= 0 &&
    diasParaFim <= DIAS_AVISO_FIM_MENSALIDADE;

  const podeEnviarIncentivo = aluno.statusAssinatura !== "ATIVADO";

  // Requisitos específicos para os 2 novos modelos
  // Só aparece se houver indicação de conta criada no banco (ex: ID de quem criou ou se tem senha)
  const temContaCriadaNoBanco = Boolean(aluno.idCriadoPor || aluno.senha || aluno.password);

  // Só aparece se estiver com mensalidade em vigor E possuir o ID de quem atribuiu
  const temMensalidadeComAtribuidoPor = Boolean(temMensalidadeEmVigor && aluno.atribuidoPorId);

  const atribuirPlano = async (planoId) => {
    if (processando) return;
    setProcessando(true);
    try {
      const response = await fetch(
        `${API}/pagamentos/admin/atribuir-plano?idplano=${planoId}&idaluno=${aluno.id}&idadmin=${admin.id}&nomeAdmin=${encodeURIComponent(
          admin.nome
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Erro ao atribuir plano.");
        return;
      }

      alert("Plano atribuído com sucesso!");
      setContextMenu(null);
      onAtualizado?.();
    } catch {
      alert("Erro de conexão ao atribuir plano.");
    } finally {
      setProcessando(false);
    }
  };

  const enviarMensagem = async (tipo, paramsExtra = {}) => {
    if (processando) return;
    if (!tipo) return;

    setProcessando(true);
    try {
      const response = await fetch(`${API}/v1/mensagens/enviar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alunoId: aluno.id,
          tipo,
          params: paramsExtra,
        }),
      });

      if (!response.ok) {
        const texto = await response.text().catch(() => "");
        alert(`Erro ao enviar mensagem.${texto ? ` ${texto}` : ""}`);
        return;
      }

      alert("Mensagem enviada com sucesso!");
      setContextMenu(null);
      onAtualizado?.();
    } catch {
      alert("Erro de conexão ao enviar mensagem.");
    } finally {
      setProcessando(false);
      setConfirmacaoMsg(null);
    }
  };

  const cancelarAssinatura = async () => {
    if (processando) return;

    const confirmou = window.confirm(
      `Tem certeza que deseja cancelar a assinatura de ${aluno.nome}? O acesso dele será desativado imediatamente.`
    );
    if (!confirmou) return;

    setProcessando(true);
    try {
      const response = await fetch(
        `${API}/mensalidades/cancelar-mensalidade/${aluno.id}?idQuemCancelou=${admin.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Erro ao cancelar assinatura.");
        return;
      }

      alert("Assinatura cancelada com sucesso!");
      setContextMenu(null);
      onAtualizado?.();
    } catch {
      alert("Erro de conexão ao cancelar.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <>
      {/* menu principal só aparece quando não há confirmação pendente */}
      {!confirmacaoMsg && (
        <div
          className="ctx-menu"
          ref={menuRef}
          style={{
            top: posicao.top,
            left: posicao.left,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ctx-header">
            <div className="ctx-nome">{aluno.nome}</div>
            <div className="ctx-email">{aluno.email}</div>
            {acessoDesativadoComMensalidadeAtiva && (
              <div style={{ color: "#c4a064", fontSize: "0.68rem", marginTop: 4 }}>
                ⚠ acesso desativado, mas há mensalidade ativa cobrando
              </div>
            )}
          </div>

          <div className="ctx-divider"></div>

          <div
            className="ctx-item"
            onClick={() => {
              navigate(`/home/conta/${aluno.id}?admin=true`);
              setContextMenu(null);
            }}
          >
            👤 Ver detalhes
          </div>

          {!temMensalidadeEmVigor && (
            <div
              className="ctx-item submenu"
              onMouseEnter={() => setMostrarPlanos(true)}
              onMouseLeave={() => setMostrarPlanos(false)}
            >
              <span>➕ Escolher plano</span>
              <span>▶</span>

              {mostrarPlanos && (
                <div
                  className="ctx-submenu"
                  onMouseEnter={() => setMostrarPlanos(true)}
                  onMouseLeave={() => setMostrarPlanos(false)}
                >
                  {planos.map((plano) => (
                    <div
                      key={plano.id}
                      className="ctx-item"
                      onClick={processando ? undefined : () => atribuirPlano(plano.id)}
                      style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                    >
                      <div>{plano.nome}</div>
                      <small>
                        R$
                        {Number(plano.valor).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {temMensalidadeEmVigor && (
            <div
              className="ctx-item"
              onClick={processando ? undefined : cancelarAssinatura}
              style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
            >
              {processando ? "Cancelando..." : "Cancelar assinatura"}
            </div>
          )}

          {/* ── mensagens condicionais antigas ── */}
          {(podeEnviarCobranca || podeEnviarFimMensalidade || podeEnviarIncentivo || temContaCriadaNoBanco || temMensalidadeComAtribuidoPor) && (
            <>
              <div className="ctx-divider"></div>

              {podeEnviarCobranca && (
                <div
                  className="ctx-item"
                  onClick={
                    processando
                      ? undefined
                      : () =>
                          setConfirmacaoMsg({
                            tipo: "COBRANCA",
                            titulo: "Enviar cobrança",
                            descricao: `Isso vai enviar uma mensagem de cobrança para ${aluno.nome} no WhatsApp cadastrado.`,
                            params: {
                              linkPagamento: `https://2dassessoria.com.br/`,
                            },
                          })
                  }
                  style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                >
                  💰 Enviar Cobrança
                </div>
              )}

              {podeEnviarFimMensalidade && (
                <div
                  className="ctx-item"
                  onClick={
                    processando
                      ? undefined
                      : () =>
                          setConfirmacaoMsg({
                            tipo: "MENSALIDADE_FINAL",
                            titulo: "Enviar aviso de fim de mensalidade",
                            descricao: `A mensalidade de ${aluno.nome} vence em ${diasParaFim} dia${
                              diasParaFim !== 1 ? "s" : ""
                            }. Enviar aviso de renovação por WhatsApp?`,
                            params: {
                              dataVencimento: aluno.dataFimMensalidade,
                            },
                          })
                  }
                  style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                >
                  ⏰ Enviar aviso de final de Mensalidade
                </div>
              )}

              {podeEnviarIncentivo && (
                <div
                  className="ctx-item"
                  onClick={
                    processando
                      ? undefined
                      : () =>
                          setConfirmacaoMsg({
                            tipo: "INCENTIVO_VOLTAR_TREINAR",
                            titulo: "Enviar incentivo",
                            descricao: `Isso vai enviar uma mensagem incentivando ${aluno.nome} a voltar a treinar.`,
                            params: {},
                          })
                  }
                  style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                >
                  Incentivo para voltar a treinar
                </div>
              )}

              {/* ── 1. NOVO MODELO: Criação de Conta (Apenas se aluno tiver conta criada no banco) ── */}
              {temContaCriadaNoBanco && (
                <div
                  className="ctx-item"
                  onClick={
                    processando
                      ? undefined
                      : () =>
                          setConfirmacaoMsg({
                            tipo: "CRIACAO_CONTA",
                            titulo: "Enviar dados de conta criada",
                            descricao: `Isso enviará uma mensagem para ${aluno.nome} informando a criação da conta por ${admin?.nome || "Admin"} e instruindo a definir a senha.`,
                            params: {
                              adminNome: admin?.nome || "Administrador",
                              linkLogin: `https://2dassessoria.com.br`,
                            },
                          })
                  }
                  style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                >
                  Enviar mensagem de conta criada e denifir sua senha
                </div>
              )}

              {/* ── 2. NOVO MODELO: Plano Anexado / Pagamento (Apenas se tiver mensalidade com atribuido_por_id) ── */}
              {temMensalidadeComAtribuidoPor && (
                <div
                  className="ctx-item"
                  onClick={
                    processando
                      ? undefined
                      : () =>
                          setConfirmacaoMsg({
                            tipo: "PLANO_ANEXADO",
                            titulo: "Enviar aviso de plano anexado",
                            descricao: `Isso enviará uma mensagem para ${aluno.nome} informando que ${admin?.nome || "Admin"} anexou um plano e fornecendo o link para pagamento.`,
                            params: {
                              adminNome: admin?.nome || "Administrador",
                              linkPagamento: `https://2dassessoria.com.br`,
                            },
                          })
                  }
                  style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                >
                  Enviar aviso de plano anexado
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── modal de confirmação — impede envio acidental ── */}
      {confirmacaoMsg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 900,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => e.target === e.currentTarget && !processando && setConfirmacaoMsg(null)}
        >
          <div
            style={{
              background: "#161616",
              border: "1px solid rgba(196,160,100,0.2)",
              borderRadius: 4,
              padding: 24,
              width: "100%",
              maxWidth: 380,
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: "0.95rem", color: "#f0ece4", fontWeight: 600, marginBottom: 10 }}>
              {confirmacaoMsg.titulo}
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(240,236,228,0.6)", lineHeight: 1.5, marginBottom: 20 }}>
              {confirmacaoMsg.descricao}
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setConfirmacaoMsg(null)}
                disabled={processando}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.75rem",
                  background: "transparent",
                  color: "rgba(240,236,228,0.6)",
                  border: "1px solid rgba(240,236,228,0.15)",
                  cursor: processando ? "not-allowed" : "pointer",
                  borderRadius: 3,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => enviarMensagem(confirmacaoMsg.tipo, confirmacaoMsg.params || {})}
                disabled={processando}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: processando ? "rgba(196,160,100,0.3)" : "#c4a064",
                  color: "#161616",
                  border: "none",
                  cursor: processando ? "not-allowed" : "pointer",
                  borderRadius: 3,
                }}
              >
                {processando ? "Enviando..." : "Confirmar envio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}