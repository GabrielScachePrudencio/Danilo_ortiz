import React, { useEffect, useState, useMemo } from "react";
import { S } from "./estilos";
import { ModalCadastroAluno } from "./ModalCadastroAluno";
import { ModalImportarPlanilha } from "./ModalImportarPlanilha";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

function formatarData(iso) {
  if (!iso) return null;
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function statusMensalidadeLabel(statusMensalidade) {
  if (statusMensalidade === "ATIVADO") return "ATIVADO";
  if (statusMensalidade === "DESATIVADO") return "DESATIVADO";
  return "SEM PLANO";
}

export function Alunos({ navigate, abrirContexto }) {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [allAlunos, setAllAlunos] = useState([]);
  const [inputBusca, setInputBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [rowHover, setRowHover] = useState(null);
  const [modal, setModal] = useState(null);
  const [erro, setErro] = useState("");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [refreshAlunos, setRefreshAlunos] = useState(0);
  const [modalImportar, setModalImportar] = useState(false);

  // ---- novos estados: filtros e ordenação ----
  const [filtroStatus, setFiltroStatus] = useState("TODOS"); // TODOS | ATIVADO | DESATIVADO
  const [filtroDataInicio, setFiltroDataInicio] = useState(""); // yyyy-mm-dd
  const [filtroDataFim, setFiltroDataFim] = useState(""); // yyyy-mm-dd
  const [ordemId, setOrdemId] = useState("desc"); // asc | desc

  useEffect(() => {
    pegarAlunos();
  }, [refreshAlunos]);

  async function pegarAlunos() {
    setCarregando(true);
    try {
      const res = await fetch(`${API}/alunos`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setAllAlunos(await res.json());
      else setErro("Erro ao pegar usuários.");
    } catch {
      setErro("Falha na conexão ao buscar alunos.");
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarTrocaStatus() {
    const id = modal.id;
    try {
      await fetch(`${API}/alunos/atualizar-status-aluno/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllAlunos((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, statusAssinatura: u.statusAssinatura === "ATIVADO" ? "DESATIVADO" : "ATIVADO" }
            : u
        )
      );
    } catch {
      setErro("Não foi possível atualizar o status.");
    } finally {
      setModal(null);
    }
  }

  async function trocarSisrun(id) {
    try {
      await fetch(`${API}/alunos/atualizar-status-contasisrun-aluno/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllAlunos((prev) =>
        prev.map((u) => (u.id === id ? { ...u, criouContaSisrun: !u.criouContaSisrun } : u))
      );
    } catch {
      setErro("Não foi possível atualizar conta Sisrun.");
    }
  }

  function limparFiltros() {
    setInputBusca("");
    setFiltroStatus("TODOS");
    setFiltroDataInicio("");
    setFiltroDataFim("");
    setOrdemId("desc");
  }

  const alunosFiltrados = useMemo(() => {
    let lista = [...allAlunos];

    // busca por nome/email
    if (inputBusca.trim()) {
      const termo = inputBusca.toLowerCase();
      lista = lista.filter(
        (a) =>
          a.nome?.toLowerCase().includes(termo) ||
          a.email?.toLowerCase().includes(termo)
      );
    }

    // filtro por status (ativado/desativado)
    if (filtroStatus !== "TODOS") {
      lista = lista.filter((a) => a.statusAssinatura === filtroStatus);
    }

    // filtro por data de mensalidade (dataFimMensalidade dentro do intervalo)
    if (filtroDataInicio) {
      lista = lista.filter(
        (a) => a.dataFimMensalidade && a.dataFimMensalidade >= filtroDataInicio
      );
    }
    if (filtroDataFim) {
      lista = lista.filter(
        (a) => a.dataFimMensalidade && a.dataFimMensalidade <= filtroDataFim
      );
    }

    // ordenação por ID
    lista.sort((a, b) => (ordemId === "asc" ? a.id - b.id : b.id - a.id));

    return lista;
  }, [allAlunos, inputBusca, filtroStatus, filtroDataInicio, filtroDataFim, ordemId]);

  const colunas = ["ID", "Nome", "E-mail", "Status", "Mensalidade", "Sisrun", ""];

  return (
    <>
      {erro && <div style={S.erro}>{erro}</div>}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
      }}>
        <p style={{ ...S.sectionTitle, margin: 0 }}>Gerenciar Alunos</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-primary btn-nowrap"
            onClick={() => setModalCadastro(true)}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            + cadastrar aluno
          </button>
          <button
            className="btn-primary btn-nowrap"
            onClick={() => setModalImportar(true)}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            importar planilha
          </button>
        </div>
      </div>

      {/* barra de busca, igual à Visão Geral */}
      <div className="visao-search-wrap">
        <div className="pdv-search-inline">
          <span className="icon">&#9906;</span>
          <input
            type="text"
            placeholder="buscar aluno por nome ou e-mail..."
            value={inputBusca}
            onChange={(e) => setInputBusca(e.target.value)}
          />
        </div>
      </div>

      {/* filtros: status, data de mensalidade e ordenação */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "flex-end",
          margin: "12px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: 11, color: "#666" }}>Status</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={S.select || { padding: "6px 8px", fontSize: 13, borderRadius: 6 }}
          >
            <option value="TODOS">Todos</option>
            <option value="ATIVADO">Ativado</option>
            <option value="DESATIVADO">Desativado</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: 11, color: "#666" }}>Mensalidade de</label>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
            style={{ padding: "6px 8px", fontSize: 13, borderRadius: 6 }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: 11, color: "#666" }}>até</label>
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
            style={{ padding: "6px 8px", fontSize: 13, borderRadius: 6 }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: 11, color: "#666" }}>Ordenar ID</label>
          <button
            className="btn-primary btn-nowrap"
            onClick={() => setOrdemId((o) => (o === "asc" ? "desc" : "asc"))}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            {ordemId === "asc" ? "Crescente ↑" : "Decrescente ↓"}
          </button>
        </div>

        <button
          onClick={limparFiltros}
          style={{
            padding: "6px 12px",
            fontSize: "13px",
            background: "transparent",
            border: "1px solid #ccc",
            borderRadius: 6,
            cursor: "pointer",
            color: "white"
          }}
        >
          limpar filtros
        </button>
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            {colunas.map((h) => (
              <th key={h} style={S.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr><td colSpan={colunas.length} style={{ ...S.td, color: "#555", textAlign: "center" }}>carregando…</td></tr>
          ) : alunosFiltrados.length === 0 ? (
            <tr><td colSpan={colunas.length} style={{ ...S.td, color: "#555", textAlign: "center" }}>nenhum resultado</td></tr>
          ) : (
            alunosFiltrados.map((a) => {
              const dataFimFormatada = formatarData(a.dataFimMensalidade);

              return (
                <tr
                  key={a.id}
                  onContextMenu={(e) => abrirContexto(e, a)}
                  style={rowHover === a.id ? S.rowHover : {}}
                  onMouseEnter={() => setRowHover(a.id)}
                  onMouseLeave={() => setRowHover(null)}
                >
                  <td style={{ ...S.td, color: "#444", fontSize: 11 }}>{a.id}</td>
                  <td style={S.td}>{a.nome}</td>
                  <td style={{ ...S.td, color: "#888" }}>{a.email}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(a.statusAssinatura)}
                      onClick={() => setModal({ tipo: "status", id: a.id })}
                      title="Clique para alternar"
                      role="button"
                      onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
                      onMouseLeave={(e) => (e.target.style.opacity = 1)}
                    >
                      {a.statusAssinatura}
                    </span>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(a.statusMensalidade || "SEM_PLANO")}>
                      {statusMensalidadeLabel(a.statusMensalidade)}
                    </span>
                    {dataFimFormatada && (
                      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
                        até {dataFimFormatada}
                      </div>
                    )}
                  </td>
                  <td style={S.td}>
                    <span
                      style={S.badge(a.criouContaSisrun ? "TRUE" : "FALSE")}
                      onClick={() => trocarSisrun(a.id)}
                      title="Clique para alternar"
                      role="button"
                      onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
                      onMouseLeave={(e) => (e.target.style.opacity = 1)}
                    >
                      {a.criouContaSisrun ? "TRUE" : "FALSE"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <button style={S.btnLink} onClick={() => navigate(`/home/conta/${a.id}?admin=true`)}>
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {modal?.tipo === "status" && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={S.modalTitle}>Confirmar alteração</div>
            <p style={S.modalText}>Deseja realmente mudar o status da assinatura?</p>
            <div style={S.modalRow}>
              <button style={S.btnPrimary} onClick={confirmarTrocaStatus}>Sim</button>
              <button style={S.btnGhost} onClick={() => setModal(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <ModalCadastroAluno
        aberto={modalCadastro}
        aoFechar={() => setModalCadastro(false)}
        aoCadastrar={() => setRefreshAlunos((n) => n + 1)}
      />

      <ModalImportarPlanilha
        aberto={modalImportar}
        aoFechar={() => setModalImportar(false)}
        aoImportar={() => setRefreshAlunos((n) => n + 1)}
      />
    </>
  );
}