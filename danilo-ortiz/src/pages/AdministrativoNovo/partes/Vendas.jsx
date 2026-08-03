import React, { useEffect, useState } from "react";
import { S, Badge } from "./estilos";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function Vendas() {
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    pegarUltimasVendas();
  }, []);

  async function pegarUltimasVendas() {
    setCarregando(true);
    try {
      const res = await fetch(`${API}/pagamentos/ultimas-vendas`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setVendas(await res.json());
      else setErro("Erro ao buscar últimas vendas.");
    } catch {
      setErro("Falha na conexão ao buscar vendas.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <p style={S.sectionTitle}>Histórico de Pagamentos</p>
      {erro && <div style={S.erro}>{erro}</div>}

      <table style={S.table}>
        <thead>
          <tr>
            {["Data", "Aluno", "Plano", "Valor", "Status", "ID Mercado Pago", "Método / Obs"].map((h) => (
              <th key={h} style={S.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr><td colSpan={7} style={{ ...S.td, color: "#555", textAlign: "center" }}>carregando…</td></tr>
          ) : vendas.length === 0 ? (
            <tr><td colSpan={7} style={{ ...S.td, color: "#555", textAlign: "center" }}>nenhuma venda encontrada</td></tr>
          ) : (
            vendas.map((v, idx) => (
              <tr key={v.idPagamento || idx}>
                <td style={S.td}>{v.data ? new Date(v.data).toLocaleDateString("pt-BR") : "—"}</td>
                <td style={S.td}>{v.nomeAluno}</td>
                <td style={{ ...S.td, color: "#e8b44c" }}>{v.nomePlano || "—"}</td>
                <td style={S.td}>
                  R$ {v.valor ? v.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"}
                </td>
                <td style={S.td}>
                  <Badge 
                    status={
                      v.statusLiberacao === "approved" || v.statusLiberacao === "FINALIZADO" || v.confirmadoManualmente 
                        ? "ATIVADO" 
                        : "DESATIVADO"
                    } 
                  />
                </td>
                <td style={{ ...S.td, fontSize: 10, color: "#666" }}>{v.mpPaymentId || "—"}</td>
                <td style={S.td}>
                  {v.confirmadoManualmente ? (
                    <span style={{ color: "#c4a064", fontSize: "0.85rem" }} title={`Confirmado por: ${v.nomeAdminConfirmou || 'Admin'}`}>
                      {v.formaPagamento ? `${v.formaPagamento}` : "Manual"} {v.observacaoConfirmacao ? `- ${v.observacaoConfirmacao}` : ""}
                    </span>
                  ) : (
                    v.formaPagamento === "account_money" ? "Saldo MP" :
                    v.formaPagamento === "pix" ? "PIX" :
                    v.formaPagamento || "—"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}