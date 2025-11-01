// Servicio de IA usando Groq API (GRATUITA)
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: AIMessage[]): Promise<string> {
    if (!this.apiKey) {
      return 'Error: API key de Groq no configurada. Por favor verifica tu archivo .env.local';
    }

    if (this.apiKey.length < 50) {
      return 'Error: La API key parece estar incompleta. Verifica que esté completa en tu .env.local';
    }

    // Sistema de prompt especializado en agricultura
    const systemPrompt: AIMessage = {
      role: 'system',
      content: `Eres AgroBot, un asistente especializado en agricultura y agronomía para AgroGlobal.

ESPECIALIDADES:
- Cultivos tropicales y subtropicales (Costa Rica/Centroamérica)
- Control de plagas y enfermedades
- Fertilización orgánica y química
- Riego y manejo del agua
- Cosecha y postcosecha
- Agricultura sostenible
- Rotación de cultivos
- Análisis de suelos
- Clima y meteorología agrícola
- Mercadeo agrícola

INSTRUCCIONES:
1. Responde SOLO preguntas relacionadas con agricultura
2. Si preguntan algo no agrícola, responde: "Lo siento, solo puedo ayudarte con temas agrícolas. ¿Tienes alguna consulta sobre cultivos, plagas, fertilización o agricultura en general?"
3. Usa lenguaje claro y profesional
4. Proporciona consejos prácticos y específicos
5. Sugiere consultar con un agrónomo local cuando sea necesario
6. Mantén respuestas concisas pero informativas
7. Usa emojis agrícolas apropiados (🌱🚜🌾🍅🥕)

Responde siempre en español, enfocándote en agricultura tropical para Costa Rica y Centroamérica.`
    };

    // Solo incluir los últimos 5 mensajes para evitar límites
    const recentMessages = messages.slice(-5);
    const allMessages = [systemPrompt, ...recentMessages];

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Modelo más estable
          messages: allMessages,
          max_tokens: 500,
          temperature: 0.5,
          stream: false,
        }),
      });

      if (!response.ok) {
        let errorMessage = '';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || '';
          console.error('Error de Groq API:', response.status, errorData);
        } catch {
          console.error('Error de Groq API:', response.status);
        }
        
        if (response.status === 401) {
          return 'Error: API key inválida. Por favor verifica tu API key de Groq en console.groq.com';
        }
        if (response.status === 400) {
          return `Error 400: Petición inválida. ${errorMessage || 'Verifica que tu API key sea correcta y esté activa.'}`;
        }
        if (response.status === 429) {
          return 'Error: Límite de uso excedido. Espera un momento e intenta nuevamente.';
        }
        if (response.status === 500) {
          return 'Error: Problema temporal del servidor de Groq. Intenta nuevamente en unos minutos.';
        }
        
        return `Error de conexión: ${response.status}. ${errorMessage || 'Verifica tu conexión a internet.'}`;
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Intenta reformular tu pregunta.';
    } catch (error) {
      console.error('Error en AI Service:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Error de conexión: No se pudo conectar con el servicio de IA. Verifica tu conexión a internet.';
      }
      
      return 'Error inesperado. Por favor intenta nuevamente o verifica tu configuración.';
    }
  }
}

// Instancia singleton del servicio de IA
export const aiService = new AIService(GROQ_API_KEY || '');

// Preguntas sugeridas para el agricultor
export const suggestedQuestions = [
  "¿Cómo controlar la mosca blanca en tomate? 🍅",
  "¿Cuál es la mejor época para sembrar chayote? 🌱",
  "¿Qué fertilizante orgánico recomiendas para maíz? 🌽",
  "¿Cómo hacer compost casero para la finca? 🚜",
  "¿Qué plagas atacan el cultivo de frijol? 🌾",
  "¿Cómo mejorar la retención de agua en el suelo? 💧"
];