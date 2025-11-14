-- ========================================
-- Banco de Dados: saep_db
-- ========================================

-- Criação do banco
CREATE DATABASE IF NOT EXISTS saep_db;
USE saep_db;

-- ========================================
-- Tabela: USUARIO
-- ========================================
CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

-- Inserção de registros na tabela USUARIO
INSERT INTO USUARIO (nome, email, senha_hash, cargo) VALUES
('Ana Silva', 'ana.silva@email.com', 'hash1', 'Gerente de Estoque'),
('Bruno Costa', 'bruno.costa@email.com', 'hash2', 'Auxiliar de Estoque'),
('Carla Souza', 'carla.souza@email.com', 'hash3', 'Supervisor');

-- ========================================
-- Tabela: PRODUTO
-- ========================================
CREATE TABLE PRODUTO (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    especificacoes TEXT,
    estoque_atual INT NOT NULL,
    estoque_minimo INT NOT NULL
);

-- Inserção de registros na tabela PRODUTO
INSERT INTO PRODUTO (nome, categoria, marca, modelo, especificacoes, estoque_atual, estoque_minimo) VALUES
('Smartphone X1', 'Smartphone', 'MarcaA', 'X1', '64GB, 4GB RAM, 6.5" Tela', 50, 10),
('Notebook Pro 15', 'Notebook', 'MarcaB', 'Pro15', 'Intel i7, 16GB RAM, 512GB SSD', 30, 5),
('Smart TV 55"', 'Smart TV', 'MarcaC', 'TV55', '4K, HDR10, Wi-Fi', 20, 3);

-- ========================================
-- Tabela: MOVIMENTACAO
-- ========================================
CREATE TABLE MOVIMENTACAO (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo_movimentacao ENUM('entrada','saida') NOT NULL,
    quantidade INT NOT NULL,
    data_hora DATETIME NOT NULL,
    observacao TEXT,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- Inserção de registros na tabela MOVIMENTACAO
INSERT INTO MOVIMENTACAO (id_produto, id_usuario, tipo_movimentacao, quantidade, data_hora, observacao) VALUES
(1, 1, 'entrada', 20, '2024-11-14 09:00:00', 'Entrada inicial de estoque'),
(2, 2, 'saida', 5, '2024-11-14 10:30:00', 'Venda realizada'),
(3, 3, 'entrada', 10, '2024-11-14 11:00:00', 'Reposição de estoque');

-- ========================================
-- Fim do Script
-- ========================================
