-- ============================================
-- HELPER IA - DATABASE SCHEMA
-- Sistema de base de datos para asistente virtual
-- ============================================

-- Base de datos
CREATE DATABASE helper_ia_db;
GO

USE helper_ia_db;
GO

-- Tabla de conversaciones
CREATE TABLE conversations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_message NVARCHAR(MAX) NOT NULL,
    ai_response NVARCHAR(MAX) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    confidence_score DECIMAL(3,2),
    category VARCHAR(50),
    escalated BIT DEFAULT 0,
    INDEX idx_session (session_id),
    INDEX idx_timestamp (timestamp)
);

-- Tabla de interacciones
CREATE TABLE interactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    conversation_id INT,
    user_id VARCHAR(100),
    message NVARCHAR(MAX) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'user', 'ai', 'system'
    timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    metadata NVARCHAR(MAX), -- JSON
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    INDEX idx_conversation (conversation_id),
    INDEX idx_timestamp (timestamp)
);

-- Tabla de tickets de escalación
CREATE TABLE escalation_tickets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    conversation_id INT,
    interaction_id INT,
    priority VARCHAR(20) NOT NULL, -- 'high', 'medium', 'low'
    category VARCHAR(50),
    reason NVARCHAR(MAX),
    urgency VARCHAR(20),
    complexity VARCHAR(20),
    risk_level VARCHAR(20),
    required_skills NVARCHAR(500),
    estimated_resolution_time INT, -- en minutos
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'assigned', 'in_progress', 'resolved', 'closed'
    assigned_to VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME,
    resolved_at DATETIME,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

CREATE TABLE feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    conversation_id INT NULL,
    interaction_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 3),
    comment NVARCHAR(MAX),
    metadata NVARCHAR(MAX),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (interaction_id) REFERENCES interactions(id),
    INDEX idx_feedback_interaction (interaction_id),
    INDEX idx_feedback_created_at (created_at)
);

-- Tabla de métricas
CREATE TABLE metrics (
    id INT IDENTITY(1,1) PRIMARY KEY,
    conversation_id INT,
    response_time INT, -- en milisegundos
    category VARCHAR(50),
    intent VARCHAR(50),
    confidence DECIMAL(3,2),
    timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_category (category)
);

-- Tabla de tickets históricos (dataset de 1000 casos)
CREATE TABLE tickets_dataset (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    entities NVARCHAR(MAX),
    [date] DATETIME,
    resolution NVARCHAR(MAX),
    status VARCHAR(50),
    source NVARCHAR(100),
    embedding VARBINARY(MAX) NULL,
    INDEX idx_tickets_category (category),
    INDEX idx_tickets_subcategory (subcategory),
    INDEX idx_tickets_status (status)
);

-- Tabla de usuarios (opcional para futuro)
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name NVARCHAR(200),
    department NVARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    last_active DATETIME,
    INDEX idx_email (email)
);

GO

PRINT 'Schema created successfully!';