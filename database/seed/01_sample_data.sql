-- ============================================
-- SEED DATA - Helper IA
-- Datos de ejemplo para testing
-- ============================================

USE helper_ia_db;
GO

-- Datos de ejemplo para conversaciones
INSERT INTO conversations (session_id, user_message, ai_response, timestamp, confidence_score, category, escalated)
VALUES 
('test-session-001', '¿Cómo restablezco mi contraseña?', 'Para restablecer tu contraseña, ve a portal.empresa.com/reset', GETDATE(), 0.95, 'PASSWORD_RESET', 0),
('test-session-002', '¿Cuántos días de vacaciones tengo?', 'Puedes consultar tus días de vacaciones en el portal de RH', GETDATE(), 0.90, 'VACATION_INQUIRY', 0),
('test-session-003', 'Necesito una constancia laboral', 'Puedo ayudarte con tu constancia. ¿La necesitas urgente?', GETDATE(), 0.88, 'CERTIFICATE_REQUEST', 0);

-- Feedback de ejemplo
INSERT INTO feedback (message_id, is_helpful, comment, timestamp)
VALUES 
(1, 1, 'Muy útil, gracias!', GETDATE()),
(2, 1, NULL, GETDATE()),
(3, 0, 'Necesitaba más información', GETDATE());

PRINT 'Seed data inserted successfully!';