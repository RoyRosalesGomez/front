'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, MessageCircle, History, BookOpen, Sparkles, User, Leaf, X, Plus, Search, Filter, Clock, Star, ChevronRight, Lightbulb, TrendingUp, Shield, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { aiService, suggestedQuestions } from '@/lib/ai-service';
import { toast } from 'sonner';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  isError?: boolean;
  timestamp: string;
}

interface Consultation {
  id: number;
  title: string;
  date: string;
  category: string;
  status: 'resolved' | 'pending';
  preview: string;
}

interface Resource {
  id: number;
  title: string;
  category: string;
  type: 'guide' | 'video' | 'article';
  description: string;
}

export function AIAssistant() {
  const [activeSection, setActiveSection] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy AgroBot, tu Asistente Agrícola de AgroGlobal 🌱. Estoy aquí para ayudarte con cualquier consulta sobre cultivos, plagas, fertilización, riego y más. ¿En qué puedo asistirte hoy?',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático a nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Datos de ejemplo para historial
  const consultations: Consultation[] = [
    {
      id: 1,
      title: 'Control de plagas en tomate',
      date: '2025-01-15',
      category: 'Plagas',
      status: 'resolved',
      preview: 'Consulta sobre mosca blanca en cultivo de tomate...'
    },
    {
      id: 2,
      title: 'Fertilización de chayote',
      date: '2025-01-14',
      category: 'Fertilización',
      status: 'resolved',
      preview: 'Recomendaciones para fertilización orgánica...'
    },
    {
      id: 3,
      title: 'Rotación de cultivos',
      date: '2025-01-13',
      category: 'Planificación',
      status: 'pending',
      preview: 'Estrategias para rotación en 2 hectáreas...'
    }
  ];

  // Recursos de ejemplo
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Guía Completa de Cultivo de Chayote',
      category: 'Cultivos',
      type: 'guide',
      description: 'Manual completo para el cultivo exitoso de chayote en Costa Rica'
    },
    {
      id: 2,
      title: 'Control Biológico de Plagas',
      category: 'Plagas',
      type: 'video',
      description: 'Técnicas modernas para control natural de plagas'
    },
    {
      id: 3,
      title: 'Fertilización Orgánica Avanzada',
      category: 'Fertilización',
      type: 'article',
      description: 'Métodos innovadores de fertilización orgánica'
    }
  ];

  const menuItems = [
    {
      id: 'chat',
      name: 'Nueva Consulta',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'Inicia una nueva conversación'
    },
  ];

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, newMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const response = await aiService.sendMessage(conversationHistory);
      
      // Verificar si la respuesta es un error
      const isError = response.startsWith('Error:');
      
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: response,
        isError: isError,
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: 'Lo siento, hubo un problema de conexión. Verifica tu internet e intenta nuevamente. Si el problema persiste, puede ser un límite temporal de la API gratuita.',
        isError: true,
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Error al conectar con AgroBot');
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Header del Chat */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AgroBot</h3>
            <p className="text-sm text-green-600 dark:text-green-400">En línea • Especialista Agrícola</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <Sparkles className="h-3 w-3 mr-1" />
          IA Especializada
        </Badge>
      </div>

      {/* Preguntas Sugeridas (solo si no hay conversación) */}
      {messages.length <= 1 && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preguntas sugeridas para empezar:
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-2 px-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => handleSuggestedQuestion(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : message.isError 
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}>
                {message.isError && (
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Error</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' 
                    ? 'text-blue-100' 
                    : message.isError
                      ? 'text-red-500'
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Indicador de escritura */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    AgroBot está pensando...
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu consulta agrícola aquí..."
              className="resize-none border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              rows={2}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'chat': return renderChat();
      default: return renderChat();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AgroBot</h2>
              <p className="text-green-100">Asistente Agrícola Inteligente</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Especializada
            </Badge>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500 bg-white dark:bg-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-white dark:hover:bg-gray-900'
              }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}