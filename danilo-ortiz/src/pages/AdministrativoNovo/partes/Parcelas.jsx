import React, { useEffect, useState } from "react";
import { S, Badge, InfoMini, fmtData, fmtMoeda } from "./estilos";
import { ModalParcela } from "../../HomeAluno/home-aluno/partes/ModalParcela";
// ⚠️ Ajuste o caminho acima se o ModalParcela.jsx estiver em outra pasta
// (ex: "../aluno/ModalParcela" ou onde ele realmente estiver no seu projeto).

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function Parcelas({ navigate }) {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [allAlunos, setAllAlunos] = useState([]);
  const [busca, setBusca] = useState("");
  const [expandido, setExpandido] = useState(null);
  const [dadosAluno, setDadosAluno] = useState({}); // { idAluno: { mensalidade, historico } }
  const [carregando, setCarregando] = useState({});
  const [erroLocal, setErroLocal] = useState("");

  // histórico: qual mensalidade antiga está aberta, por aluno
  const [historicoAberto, setHistoricoAberto] = useState({}); // { idAluno: bool }
  const [mensalidadeExpandidaHist, setMensalidadeExpandidaHist] = useState({}); // { idAluno: idMensalidade }

  // modal de detalhes da parcela (compartilhado, controla qual parcela está aberta)
  const [modalParcela, setModalParcela] = useState(null); // { parcela, nomePlano } | null

  useEffect(() => {
    pegarAlunos();
  }, []);

  async function pegarAlunos() {
    try {
      const res = await fetch(`${API}/alunos`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setAllAlunos(await res.json());
      else setErroLocal("Erro ao pegar usuários.");
    } catch {
      setErroLocal("Falha na conexão ao buscar alunos.");
    }
  }

  const alunosFiltrados = busca.trim()
    ? allAlunos.filter(
        (a) =>
          a.nome.toLowerCase().includes(busca.toLowerCase()) ||
          a.email.toLowerCase().includes(busca.toLowerCase())
      )
    : allAlunos;

  async function toggleAluno(id) {
    if (expandido === id) {
      setExpandido(null);
      return;
    }
    setExpandido(id);
    if (dadosAluno[id]) return; // já carregou

    setCarregando((c) => ({ ...c, [id]: true }));
    try {
      const [resMensalidade, resHistorico] = await Promise.all([
        fetch(`${API}/mensalidades/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/mensalidades/historico/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      // mensalidade ativa: 404 é normal (aluno sem plano ativo), não é erro
      const mensalidade =
        resMensalidade.status === 404
          ? null
          : resMensalidade.ok
          ? await resMensalidade.json()
          : null;

      const historico = resHistorico.ok ? await resHistorico.json() : null;

      setDadosAluno((p) => ({ ...p, [id]: { mensalidade, historico } }));
    } catch {
      setErroLocal("Erro ao buscar parcelas.");
    } finally {
      setCarregando((c) => ({ ...c, [id]: false }));
    }
  }

  function abrirModalParcela(parcela, nomePlano) {
    setModalParcela({ parcela, nomePlano: nomePlano || "—" });
  }

  function badgeHistorico(status) {
    switch (status) {
      case "CANCELADO":
        return { cor: "#e05555", bg: "rgba(224,85,85,0.08)", border: "rgba(224,85,85,0.25)" };
      case "DESATIVADO":
        return { cor: "#e0a055", bg: "rgba(224,160,85,0.08)", border: "rgba(224,160,85,0.25)" };
      default:
        return { cor: "#c4a064", bg: "rgba(196,160,100,0.08)", border: "rgba(196,160,100,0.25)" };
    }
  }

  return (
    <>
      <p style={S.sectionTitle}>Parcelas por Aluno</p>
      {erroLocal && <div style={S.erro}>{erroLocal}</div>}

      {/* modal de detalhes — somente leitura no admin (sem botão "Ir para Pagamento") */}
      {modalParcela && (
        <ModalParcela
          parcela={modalParcela.parcela}
          nomePlano={modalParcela.nomePlano}
          urlMensalidade={`${API}/mensalidades`}
          token={token}
          onClose={() => setModalParcela(null)}
          onConfirmado={async () => {
            // se o admin usar "Já paguei" e confirmar, recarrega os dados desse aluno
            if (expandido) {
              setDadosAluno((p) => {
                const novo = { ...p };
                delete novo[expandido];
                return novo;
              });
              await toggleAluno(expandido);
              setExpandido(expandido);
            }
          }}
          // onPagar não é passado de propósito: admin só visualiza, não paga em nome do aluno
        />
      )}

      <div style={S.searchRow}>
        <input
          style={S.input}
          placeholder="Pesquise por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button style={S.btnGhost} onClick={() => setBusca("")}>
            Limpar
          </button>
        )}
      </div>

      {alunosFiltrados.length === 0 && (
        <p style={{ color: "#555", fontSize: 13, textAlign: "center", marginTop: 32 }}>nenhum resultado</p>
      )}

      {alunosFiltrados.map((aluno) => {
        const aberto = expandido === aluno.id;
        const dados = dadosAluno[aluno.id];
        const load = carregando[aluno.id];

        const listaP = dados?.mensalidade?.parcelas ?? [];
        const pagas = listaP.filter((p) => p.status === "FINALIZADO").length;
        const total = listaP.length;
        const pct = total > 0 ? Math.round((pagas / total) * 100) : 0;

        const listaHistorico = dados?.historico?.historicoMensalidades ?? [];
        const temHistorico = listaHistorico.length > 0;
        const histAberto = !!historicoAberto[aluno.id];

        return (
          <div key={aluno.id} style={S.alunoCard}>
            <div
              style={S.alunoCardHeader}
              onClick={() => toggleAluno(aluno.id)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#18181b")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 13, color: "#e8e6e1" }}>{aluno.nome}</span>
                <span style={{ fontSize: 11, color: "#555" }}>{aluno.email}</span>
                {dados?.mensalidade && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 3 }}>
                      <span>{dados.mensalidade.nomePlano || "—"}</span>
                      <span style={{ color: "#4cde8c" }}>{pagas}/{total} pagas</span>
                    </div>
                    <div style={S.progressBar()}>
                      <div style={S.progressFill(pct, "#4cde8c")} />
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Badge status={aluno.statusAssinatura} />
                <span style={{ color: "#555", fontSize: 16 }}>{aberto ? "▲" : "▼"}</span>
              </div>
            </div>

            {aberto && (
              <div style={S.parcelasContainer}>
                {load && (
                  <p style={{ color: "#555", fontSize: 12, padding: "16px 20px", textAlign: "center" }}>
                    carregando parcelas…
                  </p>
                )}

                {/* nem mensalidade ativa, nem histórico */}
                {!load && !dados?.mensalidade && !temHistorico && (
                  <p style={{ color: "#555", fontSize: 12, padding: "16px 20px", textAlign: "center" }}>
                    nenhuma mensalidade encontrada para este aluno
                  </p>
                )}

                {/* ── mensalidade ativa ── */}
                {!load && dados?.mensalidade && (
                  <>
                    <div
                      style={{
                        display: "flex", gap: 24, padding: "12px 20px 12px 32px",
                        background: "#0d0d0f", borderBottom: "1px solid #1e1e22",
                        flexWrap: "wrap",
                      }}
                    >
                      <InfoMini label="Plano" value={dados.mensalidade.nomePlano} />
                      <InfoMini label="Valor mensal" value={fmtMoeda(dados.mensalidade.valorMensalidade)} color="#e8b44c" />
                      <InfoMini label="Início" value={fmtData(dados.mensalidade.dataInicio)} />
                      <InfoMini label="Fim" value={fmtData(dados.mensalidade.dataFim)} />
                      <InfoMini
                        label="Status"
                        value={dados.mensalidade.statusLiberacao}
                        color={dados.mensalidade.statusLiberacao === "ATIVADO" ? "#4cde8c" : "#de4c4c"}
                      />
                      <InfoMini label="Pagas" value={`${pagas} / ${total}`} color="#4cde8c" />
                    </div>

                    <div
                      style={{
                        display: "grid", gridTemplateColumns: "40px 1fr 1fr 140px",
                        padding: "8px 20px 8px 32px", borderBottom: "1px solid #1e1e22",
                      }}
                    >
                      {["#", "Vencimento", "Valor", "Status"].map((h) => (
                        <span key={h} style={{ fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    {listaP.length === 0 && (
                      <p style={{ color: "#555", fontSize: 12, padding: "16px 32px" }}>sem parcelas registradas</p>
                    )}

                    {listaP.map((p, i) => (
                      <div
                        key={p.id}
                        style={{ ...S.parcelaRow(p.status), cursor: "pointer" }}
                        onClick={() => abrirModalParcela({ ...p, _index: i }, dados.mensalidade.nomePlano)}
                      >
                        <span style={{ color: "#444", fontSize: 11 }}>#{i + 1}</span>
                        <span style={{ color: "#aaa" }}>{fmtData(p.dataVencimento)}</span>
                        <span style={{ color: "#e8b44c" }}>{fmtMoeda(p.valor)}</span>
                        <Badge status={p.status} />
                      </div>
                    ))}

                    <div style={{ padding: "10px 20px", display: "flex", justifyContent: "flex-end" }}>
                      <button style={S.btnLink} onClick={() => navigate(`/home/conta/${aluno.id}?admin=true`)}>
                        Ver perfil completo →
                      </button>
                    </div>
                  </>
                )}

                {/* ── histórico de mensalidades anteriores ── */}
                {!load && temHistorico && (
                  <div style={{ borderTop: dados?.mensalidade ? "1px solid #1e1e22" : "none" }}>
                    <button
                      onClick={() =>
                        setHistoricoAberto((h) => ({ ...h, [aluno.id]: !h[aluno.id] }))
                      }
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 20px 12px 32px",
                        background: "#0d0d0f",
                        border: "none",
                        borderBottom: "1px solid #1e1e22",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <span style={{ fontSize: 11, letterSpacing: "0.15em", color: "#888", textTransform: "uppercase" }}>
                        {histAberto ? "Ocultar histórico" : "Ver histórico"} · {listaHistorico.length} mensalidade
                        {listaHistorico.length !== 1 ? "s" : ""} anterior{listaHistorico.length !== 1 ? "es" : ""}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#555",
                          transform: histAberto ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          display: "inline-block",
                        }}
                      >
                        ›
                      </span>
                    </button>

                    {histAberto &&
                      listaHistorico.map((m) => {
                        const badge = badgeHistorico(m.statusLiberacao);
                        const mAberta = mensalidadeExpandidaHist[aluno.id] === m.id;

                        return (
                          <div key={m.id}>
                            <div
                              onClick={() =>
                                setMensalidadeExpandidaHist((s) => ({
                                  ...s,
                                  [aluno.id]: mAberta ? null : m.id,
                                }))
                              }
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr auto auto 24px",
                                alignItems: "center",
                                gap: 16,
                                padding: "12px 20px 12px 40px",
                                background: "#0a0a0c",
                                borderBottom: "1px solid #1e1e22",
                                cursor: "pointer",
                                opacity: 0.85,
                              }}
                            >
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ fontSize: 12, color: "#e8e6e1" }}>
                                  Mensalidade #{m.id}
                                  {m.nomePlano && (
                                    <span style={{ fontSize: 10, color: "#666", marginLeft: 8 }}>{m.nomePlano}</span>
                                  )}
                                </span>
                                <span style={{ fontSize: 10, color: "#555" }}>
                                  {fmtData(m.dataInicio)} → {fmtData(m.dataFim)}
                                </span>
                              </div>
                              <span style={{ fontSize: 12, color: "#e8b44c", fontWeight: 600 }}>
                                {fmtMoeda(m.valorMensalidade)}
                              </span>
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  letterSpacing: "0.08em",
                                  padding: "3px 8px",
                                  textTransform: "uppercase",
                                  background: badge.bg,
                                  color: badge.cor,
                                  border: `1px solid ${badge.border}`,
                                }}
                              >
                                {m.statusLiberacao}
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#555",
                                  transform: mAberta ? "rotate(90deg)" : "rotate(0deg)",
                                  transition: "transform 0.2s",
                                  textAlign: "right",
                                }}
                              >
                                ›
                              </span>
                            </div>

                            {mAberta && (
                              <>
                                {m.parcelas?.length ? (
                                  m.parcelas.map((p, idx) => (
                                    <div
                                      key={p.id}
                                      style={{ ...S.parcelaRow(p.status), paddingLeft: 48, cursor: "pointer" }}
                                      onClick={() => abrirModalParcela({ ...p, _index: idx }, m.nomePlano)}
                                    >
                                      <span style={{ color: "#444", fontSize: 11 }}>#{idx + 1}</span>
                                      <span style={{ color: "#aaa" }}>{fmtData(p.dataVencimento)}</span>
                                      <span style={{ color: "#e8b44c" }}>{fmtMoeda(p.valor)}</span>
                                      <Badge status={p.status} />
                                    </div>
                                  ))
                                ) : (
                                  <p style={{ color: "#555", fontSize: 11, padding: "12px 20px 12px 48px" }}>
                                    sem parcelas registradas
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}