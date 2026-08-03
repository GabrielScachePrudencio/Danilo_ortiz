DROP DATABASE IF EXISTS DBDaniloOrtiz;
CREATE DATABASE DBDaniloOrtiz;
USE DBDaniloOrtiz;

-- 1. TABELA DE CONFIGURAÇÕES (Para o seu primo editar fácil)
CREATE TABLE configuracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_site VARCHAR(255) DEFAULT 'SisRun Elite',
    sobre_voce TEXT,
    texto_informativo TEXT,
    whatsapp_suporte VARCHAR(20),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MP_ACCESS_TOKEN varchar(256)
);



-- 2. TABELA DE PLANOS
CREATE TABLE planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100), -- Ex: Mensal, Trimestral, Anual
    valor DECIMAL(10,2),
    duracao_meses INTEGER,
    ativo BOOLEAN DEFAULT TRUE
);

-- 3. TABELA DE ALUNOS
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha varchar(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    tipo_usuario VARCHAR(50) DEFAULT 'ALUNO', -- 'ALUNO' ou 'ADMIN'
    criou_conta_sisrun BOOLEAN DEFAULT FALSE,
    plano_atual_id INTEGER REFERENCES planos(id),
    status_assinatura VARCHAR(50) DEFAULT 'DESATIVADO', -- 'ATIVO', 'INATIVO', 'PENDENTE'
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CPF varchar(20),
    CNPJ varchar(20),
    rua varchar(254),
    número int,
    cidade varchar(30),
    estado varchar(30),
    CEP int,
    bairro varchar(255)
    );


alter table alunos add column estado varchar(255);
-- 4. TABELA DE PAGAMENTOS (Histórico de tentativas e Webhook)
CREATE TABLE pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id int REFERENCES alunos(id),
    mp_payment_id VARCHAR(100) UNIQUE, -- ID que vem do Mercado Pago
    parcela_id int references mensalidades_parcelas(id),
    forma_pagamento VARCHAR(50), -- pix, card, etc.
    codigo_venda VARCHAR(100), -- Seu controle interno
    valor_pago DECIMAL(10,2),
    pago BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statusPagamento varchar(20),
    plano_id INTEGER REFERENCES planos(id),
    
     id_mercadopago varchar(30),
     status_mercadopago varchar(30),
     metodo_pagamento_mercadopago varchar(30)
);


alter table pagamentos add column a varchar(30);


-- 5. TABELA DE MENSALIDADES (Controle de acesso)
CREATE TABLE mensalidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id int REFERENCES alunos(id),
    plano_id INTEGER REFERENCES planos(id),
    data_inicio DATE,
    data_fim DATE,
    valor_mensalidade DECIMAL(10,2),
    status_liberacao VARCHAR(50), -- 'LIBERADO', 'EXPIRADO',
    numero_parcelas_restantes int,
    valorParcela decimal(10,2)
);




CREATE TABLE mensalidades_parcelas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensalidade_id INTEGER REFERENCES mensalidades(id),
    numero_parcela INTEGER,
    valor DECIMAL(10,2),
    data_vencimento DATE,
    status VARCHAR(50) DEFAULT 'PENDENTE', -- PENDENTE, PAGO, ATRASADO
    pagamento_id INTEGER REFERENCES pagamentos(id)
);
alter table alunos add column observacao varchar(255);
CREATE TABLE mensagens_whatsapp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    tentativas INT DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_envio DATETIME,

    pagamento_id INT,
    erro_detalhe TEXT,
    CONSTRAINT fk_mensagens_whatsapp_pagamentos 
        FOREIGN KEY (pagamento_id) REFERENCES pagamentos(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
        
);


CREATE TABLE modelo_mensagem (
    id int auto_increment PRIMARY KEY,
    tipo VARCHAR(60) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    conteudo TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    atualizado_em TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE mensagens_whatsapp
    ADD COLUMN tipo VARCHAR(60);

ALTER TABLE mensalidades
ADD COLUMN atribuido_por_id BIGINT NULL,
ADD COLUMN atribuido_por_nome VARCHAR(255) NULL,
ADD COLUMN data_atribuicao DATETIME NULL;

	
alter table alunos add column id_criado_por BIGINT NULL;



ALTER TABLE pagamentos
    ADD COLUMN nome_admin_confirmou VARCHAR(255);

ALTER TABLE mensalidades_parcelas
    ADD COLUMN nome_admin_confirmou VARCHAR(255);

ALTER TABLE mensalidades
    ADD COLUMN nome_admin_confirmou VARCHAR(255);

-- Tabela de pagamentos
ALTER TABLE pagamentos
    ADD COLUMN confirmado_manualmente BOOLEAN DEFAULT FALSE,
    ADD COLUMN id_admin_confirmou BIGINT,
    ADD COLUMN observacao_confirmacao VARCHAR(500),
    ADD COLUMN data_confirmacao_manual TIMESTAMP;

-- Tabela de parcelas
ALTER TABLE mensalidades_parcelas
    ADD COLUMN confirmado_manualmente BOOLEAN DEFAULT FALSE,
    ADD COLUMN id_admin_confirmou BIGINT,
    ADD COLUMN observacao_confirmacao VARCHAR(500),
    ADD COLUMN data_confirmacao_manual TIMESTAMP;

-- Tabela de mensalidade
ALTER TABLE mensalidades
    ADD COLUMN confirmado_manualmente BOOLEAN DEFAULT FALSE,
    ADD COLUMN id_admin_confirmou BIGINT,
    ADD COLUMN observacao_confirmacao VARCHAR(500),
    ADD COLUMN data_confirmacao_manual TIMESTAMP;