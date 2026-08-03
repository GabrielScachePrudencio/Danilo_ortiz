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

function formatarData(dataIso) {
  if (!dataIso) return "-";
  const d = new Date(dataIso);
  return d.toLocaleDateString("pt-BR");
}

function formatarValor(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
}

const STATUS_PARCELA_LABEL = {
  PENDENTE: "Pendente",
  AGUARDANDO: "Aguardando",
  FINALIZADO: "Pago",
  CANCELADO: "Cancelado",
};

export default function ContextMenuAluno({
  contextMenu,
  setContextMenu,
  navigate,
  admin,
  onAtualizado,
}) {
  const [planos, setPlanos] = useState([]);
  const [mostrarPlanos, setMostrarPlanos] = useState(false);
  const [processando, setProcessando] = useState(false);

  const [confirmacaoMsg, setConfirmacaoMsg] = useState(null);

  // ── submenu de parcelas ──────────────────────────────────────────────
  const [mostrarParcelas, setMostrarParcelas] = useState(false);
  const [parcelas, setParcelas] = useState([]);
  const [carregandoParcelas, setCarregandoParcelas] = useState(false);
  const parcelasCarregadasRef = useRef(false);

  // parcela selecionada para confirmar pagamento manual
  // { parcela } | null
  const [confirmarParcela, setConfirmarParcela] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [observacao, setObservacao] = useState("");

  const menuRef = useRef(null);
  const [posicao, setPosicao] = useState({ top: 0, left: 0 });

  const token =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

// novo estado
const [criarParcelas, setCriarParcelas] = useState(false); // abre o modal de criação
const [totalParcelasCriar, setTotalParcelasCriar] = useState(1);
const [duracaoPlano, setDuracaoPlano] = useState(1);

const [planoSelecionado, setPlanoSelecionado] = useState(null);


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
  }, [contextMenu, mostrarPlanos, mostrarParcelas, confirmacaoMsg, confirmarParcela]);

  if (!contextMenu) return null;

  const aluno = contextMenu.aluno;

  const temMensalidadeEmVigor =
    aluno.statusMensalidade === "ATIVADO" || aluno.statusMensalidade === "DESATIVADO";

  const acessoDesativadoComMensalidadeAtiva =
    aluno.statusAssinatura !== "ATIVADO" && aluno.statusMensalidade === "ATIVADO";

  const podeEnviarCobranca = aluno.statusMensalidade === "DESATIVADO";

  // ── mensalidade pendente de pagamento → pode confirmar parcela manual ──
  const temMensalidadePendente = aluno.statusMensalidade === "DESATIVADO";

  const diasParaFim = diasRestantes(aluno.dataFimMensalidade);
  const podeEnviarFimMensalidade =
    aluno.statusMensalidade === "ATIVADO" &&
    diasParaFim !== null &&
    diasParaFim >= 0 &&
    diasParaFim <= DIAS_AVISO_FIM_MENSALIDADE;

  const podeEnviarIncentivo = aluno.statusAssinatura !== "ATIVADO";

  const temContaCriadaNoBanco = Boolean(aluno.idCriadoPor || aluno.senha || aluno.password);

  const temMensalidadeComAtribuidoPor = Boolean(temMensalidadeEmVigor && aluno.atribuidoPorId);

  // ── busca as parcelas da mensalidade atual (lazy, uma vez só) ──────────
  const carregarParcelas = async () => {
  if (parcelasCarregadasRef.current || carregandoParcelas) return;
  parcelasCarregadasRef.current = true;
  setCarregandoParcelas(true);

  try {
    const response = await fetch(`${API}/mensalidades/completa/${aluno.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      setParcelas([]);
      return;
    }

    const data = await response.json();
    setParcelas(data?.parcelas || []);

    // duração do plano pra saber em quantas vezes pode parcelar
    const duracao =
      data?.plano?.duracaomeses ||
      data?.duracaoMeses ||
      aluno.planoAtual?.duracaomeses ||
      1;
    setDuracaoPlano(duracao);
  } catch {
    setParcelas([]);
  } finally {
    setCarregandoParcelas(false);
  }
};



  const criarParcelasEConfirmar = async () => {
  if (processando) return;
  setProcessando(true);
  try {
    const response = await fetch(`${API}/pagamentos/admin/criar-parcelas-confirmar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        alunoId: aluno.id,
        totalParcelas: totalParcelasCriar,
        formaPagamento,
        observacao,
      }),
    });

    if (!response.ok) {
      const texto = await response.text().catch(() => "");
      alert(`Erro ao criar/confirmar pagamento.${texto ? ` ${texto}` : ""}`);
      return;
    }

    alert("Pagamento confirmado com sucesso!");
    setCriarParcelas(false);
    setContextMenu(null);
    onAtualizado?.();
  } catch {
    alert("Erro de conexão ao confirmar pagamento.");
  } finally {
    setProcessando(false);
  }
};


  const atribuirPlano = async (planoId, totalParcelas) => {
      if (processando) return;
      setProcessando(true);
      try {
        const response = await fetch(
          `${API}/pagamentos/admin/atribuir-plano?idplano=${planoId}&idaluno=${aluno.id}&parcelas=${totalParcelas}`,
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
        setPlanoSelecionado(null);
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

  // ── confirma pagamento manual de uma parcela ────────────────────────────
  const confirmarPagamentoManual = async () => {
    if (!confirmarParcela || processando) return;

    setProcessando(true);
    try {
      const response = await fetch(`${API}/pagamentos/confirmar-manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parcelaId: confirmarParcela.parcela.id,
          formaPagamento,
          observacao,
        }),
      });

      if (!response.ok) {
        const texto = await response.text().catch(() => "");
        alert(`Erro ao confirmar pagamento.${texto ? ` ${texto}` : ""}`);
        return;
      }

      alert("Pagamento confirmado com sucesso!");
      setConfirmarParcela(null);
      setContextMenu(null);
      onAtualizado?.();
    } catch {
      alert("Erro de conexão ao confirmar pagamento.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <>
  {!confirmacaoMsg && !confirmarParcela && !criarParcelas && !planoSelecionado && (
  
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
              <div className="ctx-submenu" onMouseEnter={() => setMostrarPlanos(true)} onMouseLeave={() => setMostrarPlanos(false)}>
                {planos.map((plano) => (
                  <div
                    key={plano.id}
                    className="ctx-item"
                    onClick={processando ? undefined : () => setPlanoSelecionado({ plano })}
                    style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                  >
                    <div>{plano.nome}</div>
                    <small>
                      R${Number(plano.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </small>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* ── NOVO: submenu de parcelas para confirmar pagamento manual ── */}
          {temMensalidadePendente && (
            <div
              className="ctx-item submenu"
              onMouseEnter={() => {
                setMostrarParcelas(true);
                carregarParcelas();
              }}
              onMouseLeave={() => setMostrarParcelas(false)}
            >
              <span>🧾 Parcelas</span>
              <span>▶</span>

              {mostrarParcelas && (
                <div
                  className="ctx-submenu"
                  onMouseEnter={() => setMostrarParcelas(true)}
                  onMouseLeave={() => setMostrarParcelas(false)}
                >
                  {carregandoParcelas && (
                    <div className="ctx-item" style={{ opacity: 0.6, pointerEvents: "none" }}>
                      Carregando...
                    </div>
                  )}

                  {!carregandoParcelas && parcelas.length === 0 && (
                    <>
                      <div className="ctx-item" style={{ opacity: 0.6, pointerEvents: "none" }}>
                        Nenhuma parcela encontrada
                      </div>
                      <div
                          className="ctx-item"
                          onClick={
                            processando
                              ? undefined
                              : () => {
                                  setFormaPagamento("DINHEIRO");
                                  setObservacao("");
                                  setTotalParcelasCriar(1);
                                  setCriarParcelas(true);
                                }
                          }
                          style={processando ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                        >
                          ➕ Criar e confirmar pagamento
                      </div>
                   </>

                    
                  )}

                  {!carregandoParcelas &&
                    parcelas.map((parcela) => {
                      const confirmavel =
                        parcela.status === "PENDENTE" || parcela.status === "AGUARDANDO";

                      return (
                        <div
                          key={parcela.id}
                          className="ctx-item"
                          onClick={
                            confirmavel && !processando
                              ? () => {
                                  setFormaPagamento("DINHEIRO");
                                  setObservacao("");
                                  setConfirmarParcela({ parcela });
                                }
                              : undefined
                          }
                          style={
                            !confirmavel || processando
                              ? { opacity: 0.4, pointerEvents: "none" }
                              : undefined
                          }
                        >
                          <div>
                            Parcela {parcela.numeroParcela} — R$ {formatarValor(parcela.valor)}
                          </div>
                          <small>
                            {formatarData(parcela.dataVencimento)} ·{" "}
                            {STATUS_PARCELA_LABEL[parcela.status] || parcela.status}
                          </small>
                        </div>
                      );
                    })}
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

      {/* ── modal de confirmação de mensagem (antigo) ── */}
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

      {criarParcelas && (
      
  <div
    style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    onClick={(e) => e.target === e.currentTarget && !processando && setCriarParcelas(false)}
  >
    <div
      style={{ background: "#161616", border: "1px solid rgba(196,160,100,0.2)", borderRadius: 4, padding: 24, width: "100%", maxWidth: 380, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <p style={{ fontSize: "0.95rem", color: "#f0ece4", fontWeight: 600, marginBottom: 4 }}>
        Criar parcela e confirmar pagamento
      </p>
      <p style={{ fontSize: "0.78rem", color: "rgba(240,236,228,0.6)", lineHeight: 1.5, marginBottom: 16 }}>
        Essa mensalidade de {aluno.nome} ainda não tem parcelas geradas. Isso vai criar as parcelas do plano
        e já marcar a primeira como paga, com o registro de que <strong>{admin?.nome || "você"}</strong> confirmou manualmente.
      </p>

      <label style={{ fontSize: "0.72rem", color: "rgba(240,236,228,0.7)", display: "block", marginBottom: 4 }}>
        Quantidade de parcelas
      </label>
      <select
        value={totalParcelasCriar}
        onChange={(e) => setTotalParcelasCriar(Number(e.target.value))}
        disabled={processando}
        style={{ width: "100%", padding: "8px 10px", marginBottom: 14, background: "#0f0f0f", color: "#f0ece4", border: "1px solid rgba(240,236,228,0.15)", borderRadius: 3, fontSize: "0.8rem" }}
      >
        <option value={1}>À vista (1x)</option>
        {duracaoPlano > 1 &&
          Array.from({ length: duracaoPlano - 1 }, (_, i) => i + 2).map((n) => (
            <option key={n} value={n}>{n}x</option>
          ))}
      </select>

      <label style={{ fontSize: "0.72rem", color: "rgba(240,236,228,0.7)", display: "block", marginBottom: 4 }}>
        Forma de pagamento
      </label>
      <select
        value={formaPagamento}
        onChange={(e) => setFormaPagamento(e.target.value)}
        disabled={processando}
        style={{ width: "100%", padding: "8px 10px", marginBottom: 14, background: "#0f0f0f", color: "#f0ece4", border: "1px solid rgba(240,236,228,0.15)", borderRadius: 3, fontSize: "0.8rem" }}
      >
        <option value="DINHEIRO">Dinheiro</option>
        <option value="TRANSFERENCIA">Transferência / Pix</option>
        <option value="CARTAO">Cartão (fora do sistema)</option>
        <option value="OUTRO">Outro</option>
      </select>

      <label style={{ fontSize: "0.72rem", color: "rgba(240,236,228,0.7)", display: "block", marginBottom: 4 }}>
        Observação (opcional)
      </label>
      <textarea
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        disabled={processando}
        rows={3}
        placeholder="Ex: pago na recepção em dinheiro"
        style={{ width: "100%", padding: "8px 10px", marginBottom: 20, background: "#0f0f0f", color: "#f0ece4", border: "1px solid rgba(240,236,228,0.15)", borderRadius: 3, fontSize: "0.8rem", resize: "vertical" }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          onClick={() => setCriarParcelas(false)}
          disabled={processando}
          style={{ padding: "8px 16px", fontSize: "0.75rem", background: "transparent", color: "rgba(240,236,228,0.6)", border: "1px solid rgba(240,236,228,0.15)", cursor: processando ? "not-allowed" : "pointer", borderRadius: 3 }}
        >
          Cancelar
        </button>
        <button
          onClick={criarParcelasEConfirmar}
          disabled={processando}
          style={{ padding: "8px 16px", fontSize: "0.75rem", fontWeight: 600, background: processando ? "rgba(196,160,100,0.3)" : "#c4a064", color: "#161616", border: "none", cursor: processando ? "not-allowed" : "pointer", borderRadius: 3 }}
        >
          {processando ? "Confirmando..." : "Criar e confirmar"}
        </button>
      </div>
    </div>
  </div>
)}

{planoSelecionado && (
  <div
    style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    onClick={(e) => e.target === e.currentTarget && !processando && setPlanoSelecionado(null)}
  >
    <div
      style={{ background: "#161616", border: "1px solid rgba(196,160,100,0.2)", borderRadius: 4, padding: 24, width: "100%", maxWidth: 340, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <p style={{ fontSize: "0.95rem", color: "#f0ece4", fontWeight: 600, marginBottom: 16 }}>
        Como {aluno.nome} vai pagar o plano {planoSelecionado.plano.nome}?
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => atribuirPlano(planoSelecionado.plano.id, 1)}
          disabled={processando}
          style={{ padding: "10px 14px", fontSize: "0.8rem", background: "#c4a064", color: "#161616", border: "none", borderRadius: 3, cursor: "pointer", fontWeight: 600 }}
        >
          À vista (1 parcela — R$
          {Number(planoSelecionado.plano.valor * planoSelecionado.plano.duracaomeses).toLocaleString("pt-BR", { minimumFractionDigits: 2 })})
        </button>

        {planoSelecionado.plano.duracaomeses > 1 && (
          <button
            onClick={() => atribuirPlano(planoSelecionado.plano.id, planoSelecionado.plano.duracaomeses)}
            disabled={processando}
            style={{ padding: "10px 14px", fontSize: "0.8rem", background: "transparent", color: "#f0ece4", border: "1px solid rgba(240,236,228,0.2)", borderRadius: 3, cursor: "pointer" }}
          >
            Parcelado ({planoSelecionado.plano.duracaomeses}x de R$
            {Number(planoSelecionado.plano.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })})
          </button>
        )}
      </div>

      <button
        onClick={() => setPlanoSelecionado(null)}
        disabled={processando}
        style={{ marginTop: 12, width: "100%", padding: "8px", fontSize: "0.75rem", background: "transparent", color: "rgba(240,236,228,0.6)", border: "none", cursor: "pointer" }}
      >
        Cancelar
      </button>
    </div>
  </div>
)}

      {/* ── NOVO: modal de confirmação de pagamento manual ── */}
      {confirmarParcela && (
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
          onClick={(e) => e.target === e.currentTarget && !processando && setConfirmarParcela(null)}
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
            <p style={{ fontSize: "0.95rem", color: "#f0ece4", fontWeight: 600, marginBottom: 4 }}>
              Confirmar pagamento manual
            </p>
            <p style={{ fontSize: "0.78rem", color: "rgba(240,236,228,0.6)", lineHeight: 1.5, marginBottom: 16 }}>
              Parcela {confirmarParcela.parcela.numeroParcela} de {aluno.nome} — R${" "}
              {formatarValor(confirmarParcela.parcela.valor)}. Isso marca a parcela como paga e{" "}
              <strong>fica registrado que {admin?.nome || "você"} confirmou manualmente</strong>.
            </p>

            <label style={{ fontSize: "0.72rem", color: "rgba(240,236,228,0.7)", display: "block", marginBottom: 4 }}>
              Forma de pagamento
            </label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              disabled={processando}
              style={{
                width: "100%",
                padding: "8px 10px",
                marginBottom: 14,
                background: "#0f0f0f",
                color: "#f0ece4",
                border: "1px solid rgba(240,236,228,0.15)",
                borderRadius: 3,
                fontSize: "0.8rem",
              }}
            >
              <option value="DINHEIRO">Dinheiro</option>
              <option value="TRANSFERENCIA">Transferência / Pix</option>
              <option value="CARTAO">Cartão (fora do sistema)</option>
              <option value="OUTRO">Outro</option>
            </select>

            <label style={{ fontSize: "0.72rem", color: "rgba(240,236,228,0.7)", display: "block", marginBottom: 4 }}>
              Observação (opcional)
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              disabled={processando}
              rows={3}
              placeholder="Ex: pago na recepção em dinheiro"
              style={{
                width: "100%",
                padding: "8px 10px",
                marginBottom: 20,
                background: "#0f0f0f",
                color: "#f0ece4",
                border: "1px solid rgba(240,236,228,0.15)",
                borderRadius: 3,
                fontSize: "0.8rem",
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setConfirmarParcela(null)}
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
                onClick={confirmarPagamentoManual}
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
                {processando ? "Confirmando..." : "Confirmar pagamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}