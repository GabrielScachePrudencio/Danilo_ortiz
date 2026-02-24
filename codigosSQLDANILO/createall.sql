DROP DATABASE IF EXISTS DBDaniloOrtiz;
CREATE DATABASE DBDaniloOrtiz;
USE DBDaniloOrtiz;

-- 1. TABELA DE CONFIGURAÇÕES (Para o seu primo editar fácil)
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    nome_site VARCHAR(255) DEFAULT 'SisRun Elite',
    sobre_voce TEXT,
    texto_informativo TEXT,
    whatsapp_suporte VARCHAR(20),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE PLANOS
CREATE TABLE planos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100), -- Ex: Mensal, Trimestral, Anual
    valor DECIMAL(10,2),
    duracao_meses INTEGER,
    ativo BOOLEAN DEFAULT TRUE
);

-- 3. TABELA DE ALUNOS
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    tipo_usuario VARCHAR(50) DEFAULT 'ALUNO', -- 'ALUNO' ou 'ADMIN'
    criou_conta_sisrun BOOLEAN DEFAULT FALSE,
    plano_atual_id INTEGER REFERENCES planos(id),
    status_assinatura VARCHAR(50) DEFAULT 'INATIVO', -- 'ATIVO', 'INATIVO', 'PENDENTE'
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE PAGAMENTOS (Histórico de tentativas e Webhook)
CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    aluno_id int REFERENCES alunos(id),
    mp_payment_id VARCHAR(100) UNIQUE, -- ID que vem do Mercado Pago
    forma_pagamento VARCHAR(50), -- pix, card, etc.
    codigo_venda VARCHAR(100), -- Seu controle interno
    valor_pago DECIMAL(10,2),
    pago BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE MENSALIDADES (Controle de acesso)
CREATE TABLE mensalidades (
    id SERIAL PRIMARY KEY,
    aluno_id int REFERENCES alunos(id),
    plano_id INTEGER REFERENCES planos(id),
    data_inicio DATE,
    data_fim DATE,
    valor_mensalidade DECIMAL(10,2),
    status_liberacao VARCHAR(50) -- 'LIBERADO', 'EXPIRADO'
);