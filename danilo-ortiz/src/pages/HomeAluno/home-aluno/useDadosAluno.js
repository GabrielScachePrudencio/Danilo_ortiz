import { useEffect, useState, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function useDadosAluno(idAluno, token) {
  const [aluno, setAluno] = useState(null);
  const [editado, setEditado] = useState({});
  const [mensalidade, setMensalidade] = useState(null);
  const [historico, setHistorico] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState(null);

  const url = `${API}/alunos`;
  const urlMensalidade = `${API}/mensalidades`;

  const mostrarToast = useCallback((msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const pegarAluno = useCallback(async () => {
    if (!idAluno) return;
    try {
      const res = await fetch(`${url}/${idAluno}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setAluno(d);
        setEditado(d);
      } else {
        setErro("Aluno não encontrado.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    }
  }, [idAluno, token]);

  const pegarMensalidade = useCallback(async () => {
    if (!idAluno) return;
    try {
      const res = await fetch(`${urlMensalidade}/${idAluno}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) {
        setMensalidade(null);
        return;
      }
      if (res.ok) setMensalidade(await res.json());
    } catch {
      /* silencioso */
    }
  }, [idAluno, token]);

  const pegarHistorico = useCallback(async () => {
    if (!idAluno) return;
    try {
      const res = await fetch(`${urlMensalidade}/historico/${idAluno}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setHistorico(d);
      } else {
        console.error("[useDadosAluno] falha ao buscar histórico:", res.status, await res.text());
      }
    } catch (e) {
      console.error("[useDadosAluno] erro de conexão ao buscar histórico:", e);
    }
  }, [idAluno, token]);

  const recarregarTudo = useCallback(async () => {
    await Promise.all([pegarAluno(), pegarMensalidade(), pegarHistorico()]);
  }, [pegarAluno, pegarMensalidade, pegarHistorico]);

  useEffect(() => {
    if (!idAluno) return;
    setCarregando(true);
    recarregarTudo().finally(() => setCarregando(false));
  }, [idAluno]); // eslint-disable-line react-hooks/exhaustive-deps

  function atualizarCampo(key, valor) {
    if (key === "cep" || key.endsWith(".cep")) valor = valor.replace(/\D/g, "").slice(0, 8);
    if (key === "cpf") valor = valor.replace(/\D/g, "").slice(0, 11);
    if (key === "cnpj") valor = valor.replace(/\D/g, "").slice(0, 14);
    if (key.endsWith(".numero")) valor = valor.replace(/\D/g, "");

    setEditado((prev) => {
      const keys = key.split(".");
      if (keys.length === 1) return { ...prev, [key]: valor };
      return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: valor } };
    });
  }

  async function salvarAlteracoes() {
    setSalvando(true);
    try {
      const res = await fetch(`${url}/${idAluno}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editado),
      });
      if (res.ok) {
        const updated = await res.json();
        setAluno(updated);
        setEditado(updated);
        mostrarToast("Alterações salvas com sucesso!", true);
      } else {
        mostrarToast("Erro ao salvar alterações.", false);
      }
    } catch {
      mostrarToast("Erro de conexão ao salvar.", false);
    } finally {
      setSalvando(false);
    }
  }

  function descartarAlteracoes() {
    setEditado(aluno);
  }

  async function cancelarPlano() {
    const confirmou = window.confirm(
      "Tem certeza que deseja cancelar seu plano? Seu acesso será desativado imediatamente."
    );
    if (!confirmou) return;

    try {
      const res = await fetch(
        `${urlMensalidade}/cancelar-mensalidade/${idAluno}?idQuemCancelou=${idAluno}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        mostrarToast("Plano cancelado com sucesso.", true);
        await recarregarTudo();
      } else {
        mostrarToast("Erro ao cancelar plano.", false);
      }
    } catch {
      mostrarToast("Erro de conexão ao cancelar.", false);
    }
  }

  async function renovarMensalidade() {
    const confirmou = window.confirm(
      "Deseja renovar sua mensalidade? Será criada uma nova mensalidade com o mesmo plano."
    );
    if (!confirmou) return;

    try {
      const res = await fetch(`${urlMensalidade}/renovar/${idAluno}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        mostrarToast("Mensalidade renovada com sucesso!", true);
        await recarregarTudo();
      } else {
        const msg = await res.text();
        mostrarToast(msg || "Erro ao renovar mensalidade.", false);
      }
    } catch {
      mostrarToast("Erro de conexão ao renovar.", false);
    }
  }

  async function trocarDePlano() {
    const confirmou = window.confirm(
      "Deseja cancelar e trocar de plano? Isso vai remover sua associação atual."
    );
    if (!confirmou) return;

    try {
      await fetch(`${API}/mensalidades/cancelar-sem-log/${idAluno}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      mostrarToast("Plano removido. Escolha outro plano.", true);
      await recarregarTudo();
    } catch {
      mostrarToast("Erro ao cancelar.", false);
    }
  }

  async function confirmarCriouSisrun() {
    try {
      const res = await fetch(`${url}/atualizar-status-contasisrun-aluno/${idAluno}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAluno((prev) => ({ ...prev, criouContaSisrun: true }));
        mostrarToast("Status atualizado com sucesso!", true);
      } else {
        mostrarToast("Erro ao atualizar status.", false);
      }
    } catch {
      mostrarToast("Erro de conexão.", false);
    }
  }

  return {
    // dados
    aluno,
    editado,
    mensalidade,
    historico,
    carregando,
    erro,
    salvando,
    toast,

    // ações
    atualizarCampo,
    salvarAlteracoes,
    descartarAlteracoes,
    cancelarPlano,
    renovarMensalidade,
    trocarDePlano,
    confirmarCriouSisrun,
    recarregarTudo,
    mostrarToast,

    // urls (caso alguma aba precise)
    urlMensalidade,
  };
}
