// Chatbot con Groq AI - Milk Box Studio
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b';

// Contexto de la página para la IA
const PAGE_CONTEXT = `
Eres Milk Box, la asistente virtual de MILK BOX Studio (también conocida cariñosamente como "cajita de leche" 🥛). 

TU PERSONALIDAD:
- Habla como una persona real, cálida y cercana
- Usa emojis con frecuencia para dar calidez 😊🎬🎙️✨🎥
- Sé conversacional y natural, como si estuvieras chateando con un amigo
- Muestra entusiasmo genuino por ayudar
- Mantén las respuestas BREVES y directas (máximo 3-4 líneas)
- Usa expresiones coloquiales del español latino
- NO uses asteriscos para énfasis, solo texto normal

INFORMACIÓN DEL NEGOCIO:
Somos MILK BOX Studio, un estudio creativo especializado en:

🎙️ Doblaje y Locución Profesional en español latino
🎬 Voice Over para publicidad y redes sociales  
✂️ Edición de video y audio profesional
🎥 Producción audiovisual completa
🤖 Videos con IA básica (cortos, personas hablando, spots publicitarios)

PRECIOS (menciónalos SOLO si te preguntan directamente por precios, costos o cotizaciones):
- Video de 40 segundos con voz y edición: desde 11 USD
- Presupuestos flexibles desde 5 USD según el proyecto
- Todo depende de la duración y complejidad
- NO menciones precios si solo preguntan por servicios o información general

CONTACTO:
- WhatsApp: +51 960906717
- Facebook: https://www.facebook.com/profile.php?id=61582077656003

REGLAS IMPORTANTES:
1. Preséntate SOLO UNA VEZ al inicio como "Milk Box"
2. Respuestas CORTAS (máximo 3-4 líneas)
3. Usa emojis en cada respuesta
4. NUNCA uses asteriscos para resaltar texto
5. Si piden cotización o contacto, menciona WhatsApp
6. Sé natural y juvenil
7. Si preguntan algo no relacionado al estudio, responde con humor que solo ayudas con temas de MILK BOX

EJEMPLOS:
❌ "Claro, con gusto te ayudo con esa información"
✅ "¡Claro! 😊 Te cuento..."

❌ "Nuestros servicios incluyen..."
✅ "Hacemos varias cosas cool 🎬..."

❌ Usar **texto** o *texto*
✅ Usar solo texto normal con emojis
`;

class MilkBoxChatbot {
    constructor() {
        this.conversationHistory = [];
        this.isFirstMessage = true;
        this.init();
    }

    init() {
        this.createChatButton();
        this.createChatWindow();
        this.setupEventListeners();
        this.startTooltipAnimation();
    }

    createChatButton() {
        const button = document.createElement('div');
        button.id = 'chatbot-button';
        const isMobile = window.innerWidth <= 768;
        const tooltipText = isMobile 
            ? '¡Habla con nuestra IA! 🥛' 
            : '¡Conversa con la IA de la cajita de leche y pregúntame lo que quieras!';
        button.innerHTML = `
            <img src="assets/images/Happy.png" alt="Chat" />
            <div class="chat-tooltip" id="chatTooltip">
                ${tooltipText}
            </div>
        `;
        document.body.appendChild(button);
    }

    createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chatbot-window';
        chatWindow.className = 'chatbot-hidden';
        chatWindow.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <img src="assets/images/Happy.png" alt="Milk Box" class="chatbot-avatar" />
                    <div>
                        <h3>Milk Box</h3>
                        <span class="chatbot-status">En línea</span>
                    </div>
                </div>
                <button id="chatbot-close" class="chatbot-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chatbot-messages" id="chatbotMessages"></div>
            <div class="chatbot-input-container">
                <input 
                    type="text" 
                    id="chatbotInput" 
                    placeholder="Escribe tu mensaje..." 
                    autocomplete="off"
                />
                <button id="chatbotSend" class="chatbot-send-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        document.body.appendChild(chatWindow);
    }

    setupEventListeners() {
        const button = document.getElementById('chatbot-button');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    startTooltipAnimation() {
        const tooltip = document.getElementById('chatTooltip');
        setInterval(() => {
            tooltip.classList.add('show');
            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 3000);
        }, 4000);
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-button');
        const isHidden = chatWindow.classList.contains('chatbot-hidden');

        if (isHidden) {
            chatWindow.classList.remove('chatbot-hidden');
            button.style.display = 'none';
            this.applyBlur(true);
            
            if (this.isFirstMessage) {
                this.addBotMessage('¡Hola! Soy Milk Box, tu asistente virtual. También puedes llamarme "cajita de leche" 😊 ¿En qué puedo ayudarte hoy?');
                this.isFirstMessage = false;
            }
        } else {
            chatWindow.classList.add('chatbot-hidden');
            button.style.display = 'flex';
            this.applyBlur(false);
        }
    }

    applyBlur(apply) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && apply) {
            document.body.classList.add('chat-blur');
        } else {
            document.body.classList.remove('chat-blur');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        this.showTypingIndicator();

        try {
            const response = await this.callGroqAPI(message);
            this.hideTypingIndicator();
            this.addBotMessage(response);
        } catch (error) {
            this.hideTypingIndicator();
            
            if (error.message === 'RATE_LIMIT') {
                this.addBotMessage('⏳ He recibido muchas consultas. Por favor espera unos segundos e intenta de nuevo, o contáctanos directamente por WhatsApp.');
            } else {
                this.addBotMessage('Lo siento, hubo un error temporal. Por favor intenta de nuevo o contáctanos por WhatsApp para ayudarte de inmediato.');
            }
            console.error('Error:', error);
        }
    }

    async callGroqAPI(userMessage) {
        // Si es el primer mensaje, incluir el contexto como mensaje del sistema
        if (this.conversationHistory.length === 0) {
            this.conversationHistory.push({
                role: 'system',
                content: PAGE_CONTEXT
            });
        }

        // Agregar el mensaje del usuario al historial
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        const requestBody = {
            model: GROQ_MODEL,
            messages: this.conversationHistory,
            temperature: 0.9,
            max_tokens: 500,
            top_p: 1,
            stream: false
        };

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error de API:', errorData);
            
            if (response.status === 429) {
                throw new Error('RATE_LIMIT');
            }
            throw new Error('Error en la API de Groq');
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Respuesta inválida de la API');
        }
        
        const botResponse = data.choices[0].message.content;

        // Agregar la respuesta del bot al historial
        this.conversationHistory.push({
            role: 'assistant',
            content: botResponse
        });

        return botResponse;
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message user-message';
        messageDiv.innerHTML = `<div class="message-content">${this.escapeHtml(message)}</div>`;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot-message';
        
        const formattedMessage = this.formatBotMessage(message);
        messageDiv.innerHTML = `
            <img src="assets/images/Happy.png" alt="Bot" class="message-avatar" />
            <div class="message-content">${formattedMessage}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatBotMessage(message) {
        let formatted = this.escapeHtml(message);
        
        // Convertir **texto** a <strong>texto</strong>
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Convertir *texto* a <em>texto</em>
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Convertir saltos de línea a <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        const keywords = ['cotización', 'cotizacion', 'precio', 'costo', 'contacto', 'whatsapp', 'número', 'numero', 'hablar', 'humano'];
        const shouldShowWhatsApp = keywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (shouldShowWhatsApp) {
            formatted += `<br><br><a href="https://wa.me/51960906717?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios" target="_blank" class="whatsapp-button">
                <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
            </a>`;
        }
        
        return formatted;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <img src="assets/images/Happy.png" alt="Bot" class="message-avatar" />
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar el chatbot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MilkBoxChatbot();
});
