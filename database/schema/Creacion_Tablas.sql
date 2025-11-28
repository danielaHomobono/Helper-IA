-- ======================================================
-- TABLA PRINCIPAL: TICKETS
-- ======================================================

CREATE TABLE Tickets (
    ticket_id        INT             NOT NULL PRIMARY KEY,
    ticket_text      NVARCHAR(MAX)   NOT NULL,
    category         VARCHAR(100)    NULL,
    sub_category     VARCHAR(100)    NULL,
    label            VARCHAR(200)    NULL,
    status           VARCHAR(50)     NULL,           -- pending / resolved / escalated
    user_feedback    INT             NULL,           -- escala 1–5 o 0–1
    created_at       DATETIME        NOT NULL
);

-- Índice recomendado para búsqueda por categorías
CREATE INDEX idx_tickets_category
    ON Tickets(category, sub_category);

-- Índice para filtros por estado
CREATE INDEX idx_tickets_status
    ON Tickets(status);


-- ======================================================
-- TABLA SECUNDARIA: TICKET ENTITIES
-- ======================================================

CREATE TABLE TicketEntities (
    entity_id     INT IDENTITY(1,1) PRIMARY KEY,
    ticket_id     INT             NOT NULL,
    entity_label  VARCHAR(100)    NOT NULL,
    entity_start  INT             NULL,
    entity_end    INT             NULL,
    entity_text   NVARCHAR(MAX)   NULL,

    CONSTRAINT FK_TicketEntities_Tickets
        FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id)
        ON DELETE CASCADE
);

-- Índice para acelerar joins y consultas por ticket
CREATE INDEX idx_entities_ticket
    ON TicketEntities(ticket_id);

-- Índice útil para análisis por tipo de entidad
CREATE INDEX idx_entities_label
    ON TicketEntities(entity_label);

