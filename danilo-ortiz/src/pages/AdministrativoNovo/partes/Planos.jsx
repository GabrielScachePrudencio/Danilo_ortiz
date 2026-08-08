import React, { useEffect, useState } from "react";
import { S, InfoMini, fmtMoeda } from "./estilos";
import { FormularioPlano } from "./FormularioPlano";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function Planos() {
  const token =
    localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [planos, setPlanos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [status, setStatus] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    try {
      const res = await fetch(`${API}/planos/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPlanos(await res.json());
      } else {
        setErro("Erro ao carregar planos.");
      }
    } catch {
      setErro("Falha na conexão ao buscar planos.");
    }
  }

  function abrirEdicao(plano) {
    setEditando({
      id: plano.id,
      nome: plano.nome || "",
      valor: plano.valor ?? "",
      duracaomeses: plano.duracaomeses ?? 1,
      frequenciaSemanal: plano.frequenciaSemanal ?? "",
      ativo: plano.ativo ?? true,
      grupo: plano.grupo || "",
      periodo: plano.periodo || "MENSAL",
    });
  }

  function novoPlano() {
    setEditando({
      id: null,
      nome: "",
      valor: "",
      duracaomeses: 1,
      frequenciaSemanal: "",
      ativo: true,
      grupo: "",
      periodo: "MENSAL",
    });
  }

  async function salvarPlano() {
    if (!editando) return;

    if (!editando.nome.trim()) {
      setStatus({ id: editando.id, ok: false });
      return;
    }

    setSalvando(true);
    setStatus(null);

    try {
      const payload = {
        nome: editando.nome,
        valor: parseFloat(editando.valor),
        duracaomeses: parseInt(editando.duracaomeses),
        frequenciaSemanal:
          editando.frequenciaSemanal === ""
            ? null
            : parseInt(editando.frequenciaSemanal),
        ativo: editando.ativo,
        grupo: editando.grupo,
        periodo: editando.periodo,
      };

      const url = editando.id
        ? `${API}/planos/${editando.id}`
        : `${API}/planos`;

      const res = await fetch(url, {
        method: editando.id ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const atualizado = await res.json();

        if (editando.id) {
          setPlanos((prev) =>
            prev.map((p) => (p.id === atualizado.id ? atualizado : p))
          );
        } else {
          setPlanos((prev) => [...prev, atualizado]);
        }

        setStatus({ id: atualizado.id, ok: true });
        setEditando(null);
      } else {
        setStatus({ id: editando.id, ok: false });
      }
    } catch {
      setStatus({ id: editando?.id, ok: false });
    } finally {
      setSalvando(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  async function alternarStatus(plano) {
    try {
      const res = await fetch(`${API}/planos/${plano.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: plano.nome,
          valor: parseFloat(plano.valor),
          duracaomeses: parseInt(plano.duracaomeses),
          frequenciaSemanal: plano.frequenciaSemanal ?? null,
          ativo: !plano.ativo,
          grupo: plano.grupo,
          periodo: plano.periodo,
        }),
      });

      if (res.ok) {
        const atualizado = await res.json();
        setPlanos((prev) =>
          prev.map((p) => (p.id === atualizado.id ? atualizado : p))
        );
      } else {
        setErro("Não foi possível alterar o status do plano.");
      }
    } catch {
      setErro("Falha ao alterar o status do plano.");
    }
  }

  const criandoNovo = editando && editando.id === null;

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>
      {/* CABEÇALHO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#666",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Administração
          </div>

          <h2 style={{ margin: 0, color: "#e8e6e1", fontSize: 24 }}>
            Planos
          </h2>

          <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
            Gerencie preços, duração, frequência e disponibilidade.
          </div>
        </div>

        <button
          style={{ ...S.btnPrimary, padding: "11px 18px", whiteSpace: "nowrap" }}
          onClick={novoPlano}
        >
          ＋ Adicionar plano
        </button>
      </div>

      {/* AVISO */}
      <div
        style={{
          background: "#0d0d0f",
          border: "1px solid #1e2a1e",
          borderRadius: 5,
          padding: "12px 16px",
          marginBottom: 24,
          fontSize: 11,
          color: "#4cde8c",
          letterSpacing: "0.03em",
        }}
      >
        ⚠ Alterações afetam apenas <strong>novas assinaturas</strong>.
        Assinaturas existentes mantêm o valor e as parcelas originais.
      </div>

      {erro && (
        <div
          style={{
            background: "#2a1010",
            border: "1px solid #542020",
            color: "#ff7777",
            padding: "12px 16px",
            borderRadius: 5,
            marginBottom: 20,
            fontSize: 12,
          }}
        >
          {erro}
        </div>
      )}

      {/* FORMULÁRIO DE CRIAÇÃO — só aparece quando editando.id === null */}
      {criandoNovo && (
        <FormularioPlano
          editando={editando}
          setEditando={setEditando}
          salvarPlano={salvarPlano}
          salvando={salvando}
        />
      )}

      {/* LISTA DE PLANOS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {planos.map((plano) => {
          const emEdicao = editando?.id === plano.id;
          const ok = status?.id === plano.id && status?.ok;
          const err = status?.id === plano.id && !status?.ok;

          return (
            <div
              key={plano.id}
              style={{
                ...S.tokenBox,
                margin: 0,
                padding: 20,
                borderColor: emEdicao ? "#4cde8c66" : "#1e1e22",
                opacity: plano.ativo ? 1 : 0.65,
                transition: "all .2s",
              }}
            >
              {!emEdicao ? (
                <>
                  {/* CABEÇALHO DO PLANO */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{ fontSize: 10, letterSpacing: "0.15em", color: "#444" }}
                      >
                        #{plano.id}
                      </span>

                      <span style={{ fontSize: 17, color: "#e8e6e1", fontWeight: 700 }}>
                        {plano.nome}
                      </span>

                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "5px 9px",
                          borderRadius: 3,
                          background: plano.ativo ? "#153522" : "#2a2020",
                          color: plano.ativo ? "#4cde8c" : "#e47777",
                          border: `1px solid ${plano.ativo ? "#285b3c" : "#4a2b2b"}`,
                        }}
                      >
                        {plano.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        style={{
                          ...S.btnGhost,
                          color: plano.ativo ? "#e47777" : "#4cde8c",
                        }}
                        onClick={() => alternarStatus(plano)}
                      >
                        {plano.ativo ? "Desativar" : "Ativar"}
                      </button>

                      <button style={S.btnGhost} onClick={() => abrirEdicao(plano)}>
                        ✏ Editar
                      </button>
                    </div>
                  </div>

                  {/* INFORMAÇÕES */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                      gap: 12,
                    }}
                  >
                    <InfoMini label="Grupo" value={plano.grupo || "-"} />
                    <InfoMini label="Período" value={plano.periodo || "-"} />
                    <InfoMini
                      label="Valor mensal"
                      value={fmtMoeda(plano.valor)}
                      color="#e8b44c"
                    />
                    <InfoMini
                      label="Duração"
                      value={`${plano.duracaomeses} ${
                        plano.duracaomeses === 1 ? "mês" : "meses"
                      }`}
                    />
                    <InfoMini
                      label="Frequência"
                      value={
                        plano.frequenciaSemanal != null
                          ? `${plano.frequenciaSemanal}x por semana`
                          : "Não informada"
                      }
                      color={plano.frequenciaSemanal != null ? "#4cde8c" : "#666"}
                    />
                    <InfoMini
                      label="Parcelas"
                      value={`${plano.duracaomeses}x`}
                      color="#4cde8c"
                    />
                  </div>
                </>
              ) : (
                <FormularioPlano
                  editando={editando}
                  setEditando={setEditando}
                  salvarPlano={salvarPlano}
                  salvando={salvando}
                />
              )}

              {ok && (
                <div style={{ ...S.tokenStatus(true), marginTop: 14 }}>
                  ✓ Plano atualizado com sucesso.
                </div>
              )}

              {err && (
                <div style={{ ...S.tokenStatus(false), marginTop: 14 }}>
                  ✗ Erro ao salvar. Tente novamente.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {planos.length === 0 && !erro && (
        <div
          style={{
            textAlign: "center",
            padding: 50,
            color: "#555",
            border: "1px dashed #252529",
            borderRadius: 5,
          }}
        >
          Nenhum plano cadastrado.
        </div>
      )}
    </div>
  );
}