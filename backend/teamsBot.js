const { TeamsActivityHandler } = require('botbuilder');
const { handleChatMessage } = require('./phi4');

/**
 * Bot de Teams que reutiliza la lógica de Phi-4
 * Este bot recibe mensajes de Teams y usa la misma función que el frontend React
 */
class HelperTeamsBot extends TeamsActivityHandler {
    constructor() {
        super();

        // ==========================================
        // Manejar mensajes del usuario
        // ==========================================
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;
            const conversationId = context.activity.conversation.id;
            const userId = context.activity.from.id;
            const userName = context.activity.from.name;

            console.log('📩 [TEAMS] Mensaje recibido de:', userName);
            console.log('📝 Contenido:', userMessage);

            // Mostrar "escribiendo..." mientras procesamos
            await context.sendActivities([{ type: 'typing' }]);

            try {
                // 🔥 REUTILIZA la misma función que React
                const response = await handleChatMessage({
                    message: userMessage,
                    conversationId,
                    userId
                });

                console.log('✅ [TEAMS] Respuesta generada por Phi-4');

                // Enviar respuesta al usuario en Teams
                await context.sendActivity(response.response);

            } catch (error) {
                console.error('❌ [TEAMS] Error:', error.message);
                
                // Mensaje de error amigable
                await context.sendActivity(
                    '😔 Disculpa, tuve un problema técnico. ¿Puedes intentar de nuevo en un momento?'
                );
            }

            await next();
        });

        // ==========================================
        // Mensaje de bienvenida
        // ==========================================
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;

            const welcomeMessage = 
                '👋 **¡Hola! Soy Helper IA**\n\n' +
                'Puedo ayudarte con:\n' +
                '✅ Restablecer contraseñas\n' +
                '✅ Soporte IT y configuraciones\n' +
                '✅ Preguntas sobre recursos humanos\n' +
                '✅ Consultas generales\n\n' +
                '💬 Escribe tu pregunta y te ayudaré de inmediato.';

            for (let member of membersAdded) {
                // No enviar mensaje al bot mismo
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(welcomeMessage);
                }
            }

            await next();
        });

        // ==========================================
        // Manejar reacciones (opcional)
        // ==========================================
        this.onReactionsAdded(async (context, next) => {
            const reactions = context.activity.reactionsAdded;
            
            for (let reaction of reactions) {
                if (reaction.type === 'like') {
                    console.log('👍 Usuario dio like a la respuesta');
                }
            }

            await next();
        });
    }
}

module.exports.HelperTeamsBot = HelperTeamsBot;
