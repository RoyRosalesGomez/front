'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  MessageCircle, 
  History, 
  BookOpen, 
  Sparkles,
  User,
  Leaf,
  X,
  Plus,
  Search,
  Filter,
  Clock,
  Star,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
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
      content: '¡Hola! Soy tu Asistente Agrícola de AgroGlobal 🌱. Estoy aquí para ayudarte con cualquier consulta sobre cultivos, plagas, fertilización, y más. ¿En qué puedo asistirte hoy?',
      timestamp: '10:30 AM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
    {
      id: 'history',
      name: 'Historial de Consultas',
      icon: <History className="h-5 w-5" />,
      description: 'Revisa consultas anteriores'
    },
    {
      id: 'resources',
      name: 'Biblioteca de Recursos',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Accede a guías y materiales'
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      'Excelente pregunta sobre agricultura. Basándome en las mejores prácticas agrícolas, te recomiendo considerar los siguientes aspectos: el tipo de suelo, las condiciones climáticas actuales y la época del año. ¿Podrías proporcionarme más detalles sobre tu cultivo específico?',
      'Para abordar tu consulta de manera efectiva, es importante analizar varios factores. En primer lugar, el manejo integrado de cultivos es fundamental. Te sugiero implementar un enfoque holístico que incluya monitoreo regular, prácticas preventivas y tratamientos específicos según sea necesario.',
      'Tu consulta es muy relevante para la agricultura moderna. Te recomiendo seguir las siguientes pautas: 1) Realizar un análisis de suelo, 2) Considerar las condiciones meteorológicas, 3) Implementar buenas prácticas agrícolas. ¿Te gustaría que profundice en alguno de estos puntos?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
            <h3 className="font-semibold text-gray-900 dark:text-white">Asistente Agrícola</h3>
            <p className="text-sm text-green-600 dark:text-green-400">En línea • Listo para ayudar</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <Sparkles className="h-3 w-3 mr-1" />
          IA Avanzada
        </Badge>
      </div>

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
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' 
                    ? 'text-blue-100' 
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
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
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
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Historial de Consultas</h3>
          <p className="text-gray-600 dark:text-gray-400">Revisa tus consultas anteriores</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {consultations.map((consultation) => (
          <motion.div
            key={consultation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{consultation.title}</h4>
                      <Badge className={`${
                        consultation.status === 'resolved' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {consultation.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{consultation.preview}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{consultation.date}</span>
                      </div>
                      <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                        {consultation.category}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Biblioteca de Recursos</h3>
          <p className="text-gray-600 dark:text-gray-400">Guías, artículos y materiales educativos</p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Sugerir Recurso
        </Button>
      </div>

      {/* Categorías destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <Leaf className="h-8 w-8 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Cultivos</h4>
            <p className="text-sm opacity-90">Guías de cultivo</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white cursor-pointer hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Plagas</h4>
            <p className="text-sm opacity-90">Control y prevención</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Técnicas</h4>
            <p className="text-sm opacity-90">Métodos avanzados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de recursos */}
      <div className="space-y-4">
        {resources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      resource.type === 'guide' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                      resource.type === 'video' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                    }`}>
                      {resource.type === 'guide' ? <BookOpen className="h-6 w-6" /> :
                       resource.type === 'video' ? <Lightbulb className="h-6 w-6" /> :
                       <Lightbulb className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{resource.description}</p>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          {resource.category}
                        </Badge>
                        <Badge className={`${
                          resource.type === 'guide' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          resource.type === 'video' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        }`}>
                          {resource.type === 'guide' ? 'Guía' : resource.type === 'video' ? 'Video' : 'Artículo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'chat': return renderChat();
      case 'history': return renderHistory();
      case 'resources': return renderResources();
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
              <h2 className="text-2xl font-bold">Asistente Agrícola</h2>
              <p className="text-green-100">Inteligencia Artificial para el Campo</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Avanzada
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