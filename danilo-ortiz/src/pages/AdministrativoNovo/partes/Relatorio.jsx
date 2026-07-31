import React, { useEffect, useState } from "react";
import { S } from "./estilos";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function Relatorio() {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [relatorio, setRelatorio] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    pegarRelatorio();
  }, []);

  async function pegarRelatorio() {
    try {
      const res = await fetch(`${API}/alunos/qtdd-aluno-por-plano`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setRelatorio(await res.json());
      else setErro("Erro ao carregar relatório.");
    } catch {
      setErro("Erro ao carregar relatório.");
    }
  }

  const totalAlunos = relatorio.reduce((s, r) => s + r.quantidade, 0);
  const totalReceita = relatorio.reduce((s, r) => s + r.receita, 0);
  const maxQtd = Math.max(...relatorio.map((r) => r.quantidade), 1);

  return (
    <>
      <p style={S.sectionTitle}>Alunos por Plano</p>
      {erro && <div style={S.erro}>{erro}</div>}

      <div style={S.cardGrid}>
        <div style={S.card}>
          <div style={S.cardLabel}>Total de Alunos</div>
          <div style={S.cardValue}>{totalAlunos}</div>
          <div style={S.cardSub}>ativos + inativos</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Receita Estimada</div>
          <div style={S.cardValue}>R$ {totalReceita.toLocaleString("pt-BR")}</div>
          <div style={S.cardSub}>soma de todos os planos</div>
        </div>
        <div style={S.card}>
          <div style={S.cardLabel}>Planos Ativos</div>
          <div style={S.cardValue}>{relatorio.length}</div>
          <div style={S.cardSub}>tipos de plano</div>
        </div>
      </div>

      <p style={{ ...S.sectionTitle, marginTop: 8 }}>Distribuição</p>
      {relatorio.map((r) => (
        <div key={r.plano} style={S.barRow}>
          <div style={S.barLabel}>
            <span>{r.plano}</span>
            <span>{r.quantidade} alunos — R$ {r.receita.toLocaleString("pt-BR")}</span>
          </div>
          <div style={S.barTrack}>
            <div style={S.barFill(Math.round((r.quantidade / maxQtd) * 100))} />
          </div>
        </div>
      ))}
    </>
  );
}