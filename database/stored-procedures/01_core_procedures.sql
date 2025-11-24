-- ============================================
-- STORED PROCEDURES - Helper IA
-- ============================================

USE helper_ia_db;
GO

-- SP: Registrar interacción
CREATE PROCEDURE sp_log_interaction
    @conversationId INT = NULL,
    @userId VARCHAR(100) = NULL,
    @message NVARCHAR(MAX),
    @timestamp DATETIME,
    @type VARCHAR(20),
    @metadata NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO interactions (conversation_id, user_id, message, type, timestamp, metadata)
    VALUES (@conversationId, @userId, @message, @type, @timestamp, @metadata);
    
    SELECT SCOPE_IDENTITY() AS interactionId;
END;
GO

-- SP: Crear ticket de escalación
CREATE PROCEDURE sp_create_ticket
    @conversationId INT,
    @interactionId INT,
    @priority VARCHAR(20),
    @category VARCHAR(50),
    @reason NVARCHAR(MAX),
    @urgency VARCHAR(20) = NULL,
    @complexity VARCHAR(20) = NULL,
    @riskLevel VARCHAR(20) = NULL,
    @requiredSkills NVARCHAR(500) = NULL,
    @estimatedResolutionTime INT = NULL,
    @status VARCHAR(20) = 'open',
    @createdAt DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO escalation_tickets (
        conversation_id, interaction_id, priority, category, reason,
        urgency, complexity, risk_level, required_skills,
        estimated_resolution_time, status, created_at
    )
    VALUES (
        @conversationId, @interactionId, @priority, @category, @reason,
        @urgency, @complexity, @riskLevel, @requiredSkills,
        @estimatedResolutionTime, @status, @createdAt
    );
    
    SELECT SCOPE_IDENTITY() AS ticketId;
END;
GO

-- SP: Guardar feedback
CREATE PROCEDURE sp_save_feedback
    @messageId INT,
    @isHelpful BIT,
    @comment NVARCHAR(MAX) = NULL,
    @timestamp DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO feedback (message_id, is_helpful, comment, timestamp)
    VALUES (@messageId, @isHelpful, @comment, @timestamp);
    
    SELECT SCOPE_IDENTITY() AS feedbackId;
END;
GO

-- SP: Actualizar métricas
CREATE PROCEDURE sp_update_metrics
    @conversationId INT,
    @responseTime INT,
    @category VARCHAR(50),
    @intent VARCHAR(50),
    @confidence DECIMAL(3,2),
    @timestamp DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO metrics (conversation_id, response_time, category, intent, confidence, timestamp)
    VALUES (@conversationId, @responseTime, @category, @intent, @confidence, @timestamp);
END;
GO

-- SP: Obtener métricas del dashboard
CREATE PROCEDURE sp_get_metrics
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        -- Conversaciones hoy
        (SELECT COUNT(*) FROM conversations 
         WHERE CAST(timestamp AS DATE) = CAST(GETDATE() AS DATE)) AS conversationsToday,
        
        -- Tasa de satisfacción
        (SELECT 
            CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE CAST(SUM(CASE WHEN is_helpful = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) 
            END
         FROM feedback
         WHERE CAST(timestamp AS DATE) = CAST(GETDATE() AS DATE)) AS satisfactionRate,
        
        -- Tiempo promedio de respuesta
        (SELECT AVG(response_time) FROM metrics 
         WHERE CAST(timestamp AS DATE) = CAST(GETDATE() AS DATE)) AS avgResponseTime,
        
        -- Casos escalados
        (SELECT COUNT(*) FROM escalation_tickets 
         WHERE CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)) AS escalatedCases,
        
        -- Usuarios activos
        (SELECT COUNT(DISTINCT session_id) FROM conversations 
         WHERE CAST(timestamp AS DATE) = CAST(GETDATE() AS DATE)) AS activeUsers,
        
        -- Tasa de resolución automática
        (SELECT 
            CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE 1.0 - (CAST((SELECT COUNT(*) FROM escalation_tickets 
                                  WHERE CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)) AS FLOAT) 
                           / COUNT(*))
            END
         FROM conversations 
         WHERE CAST(timestamp AS DATE) = CAST(GETDATE() AS DATE)) AS autoResolutionRate;
END;
GO

PRINT 'Stored procedures created successfully!';