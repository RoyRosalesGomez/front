'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Leaf,
  Settings,
  ShoppingCart,
  Tractor,
  Crown,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Translations {
  [key: string]: {
    welcome: string;
    selectLanguage: string;
    selectRole: string;
    client: string;
    farmer: string;
    administrator: string;
    clientDesc: string;
    farmerDesc: string;
    adminDesc: string;
    aboutSystem: string;
    systemDescription: string;
    backToHome: string;
    continue: string;
    clientWelcome: string;
    farmerWelcome: string;
    adminWelcome: string;
    go: string;
    back: string;
  };
}

const languages: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

const translations: Translations = {
  es: {
    welcome: ' Bienvenido a AgroGlobal 🎈',
    selectLanguage: 'Seleccionar Idioma',
    selectRole: 'Selecciona tu Rol',
    client: 'Cliente',
    farmer: 'Agricultor',
    administrator: 'Administrador',
    clientDesc: 'Accede al marketplace para comprar productos agrícolas frescos y de calidad',
    farmerDesc: 'Gestiona tus cultivos, productos y conecta con compradores directamente',
    adminDesc: 'Administra el sistema, usuarios y supervisa todas las operaciones',
    aboutSystem: 'Acerca del Sistema',
    systemDescription: 'AgroGlobal es una plataforma integral que conecta agricultores, clientes y administradores en un ecosistema digital innovador. Nuestro dashboard permite gestionar cultivos, realizar compras, administrar inventarios y mantener un control completo de las operaciones agrícolas. Con herramientas avanzadas de seguimiento, bitácoras digitales y un marketplace integrado, facilitamos el comercio justo y transparente en el sector agrícola.',
    backToHome: 'Volver al Inicio',
    continue: 'Continuar',
    clientWelcome: 'Bienvenido al Sector Cliente',
    farmerWelcome: 'Bienvenido al Sector Agricultor', 
    adminWelcome: 'Bienvenido al Sector Administrador',
    go: 'Ir',
    back: 'Atrás'
  },
  en: {
    welcome: 'Welcome to AgroGlobal',
    selectLanguage: 'Select Language',
    selectRole: 'Select Your Role',
    client: 'Client',
    farmer: 'Farmer',
    administrator: 'Administrator',
    clientDesc: 'Access the marketplace to buy fresh and quality agricultural products',
    farmerDesc: 'Manage your crops, products and connect with buyers directly',
    adminDesc: 'Administer the system, users and supervise all operations',
    aboutSystem: 'About the System',
    systemDescription: 'AgroGlobal is a comprehensive platform that connects farmers, clients and administrators in an innovative digital ecosystem. Our dashboard allows you to manage crops, make purchases, manage inventories and maintain complete control of agricultural operations. With advanced tracking tools, digital logs and an integrated marketplace, we facilitate fair and transparent trade in the agricultural sector.',
    backToHome: 'Back to Home',
    continue: 'Continue',
    clientWelcome: 'Welcome to Client Sector',
    farmerWelcome: 'Welcome to Farmer Sector',
    adminWelcome: 'Welcome to Administrator Sector',
    go: 'Go',
    back: 'Back'
  },
  fr: {
    welcome: 'Bienvenue à AgroGlobal',
    selectLanguage: 'Sélectionner la Langue',
    selectRole: 'Sélectionnez votre Rôle',
    client: 'Client',
    farmer: 'Agriculteur',
    administrator: 'Administrateur',
    clientDesc: 'Accédez au marché pour acheter des produits agricoles frais et de qualité',
    farmerDesc: 'Gérez vos cultures, produits et connectez-vous directement avec les acheteurs',
    adminDesc: 'Administrez le système, les utilisateurs et supervisez toutes les opérations',
    aboutSystem: 'À propos du Système',
    systemDescription: 'AgroGlobal est une plateforme complète qui connecte agriculteurs, clients et administrateurs dans un écosystème numérique innovant. Notre tableau de bord permet de gérer les cultures, effectuer des achats, gérer les inventaires et maintenir un contrôle complet des opérations agricoles.',
    backToHome: 'Retour à l\'Accueil',
    continue: 'Continuer',
    clientWelcome: 'Bienvenue au Secteur Client',
    farmerWelcome: 'Bienvenue au Secteur Agriculteur',
    adminWelcome: 'Bienvenue au Secteur Administrateur',
    go: 'Aller',
    back: 'Retour'
  },
  pt: {
    welcome: 'Bem-vindo ao AgroGlobal',
    selectLanguage: 'Selecionar Idioma',
    selectRole: 'Selecione seu Papel',
    client: 'Cliente',
    farmer: 'Agricultor',
    administrator: 'Administrador',
    clientDesc: 'Acesse o marketplace para comprar produtos agrícolas frescos e de qualidade',
    farmerDesc: 'Gerencie suas culturas, produtos e conecte-se diretamente com compradores',
    adminDesc: 'Administre o sistema, usuários e supervisione todas as operações',
    aboutSystem: 'Sobre o Sistema',
    systemDescription: 'AgroGlobal é uma plataforma abrangente que conecta agricultores, clientes e administradores em um ecossistema digital inovador. Nosso painel permite gerenciar culturas, fazer compras, gerenciar inventários e manter controle completo das operações agrícolas.',
    backToHome: 'Voltar ao Início',
    continue: 'Continuar',
    clientWelcome: 'Bem-vindo ao Setor Cliente',
    farmerWelcome: 'Bem-vindo ao Setor Agricultor',
    adminWelcome: 'Bem-vindo ao Setor Administrador',
    go: 'Ir',
    back: 'Voltar'
  }
};

export default function DashboardSelect() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const t = translations[selectedLanguage];

  const roles = [
    {
      id: 'client',
      title: t.client,
      description: t.clientDesc,
      icon: <ShoppingCart className="h-12 w-12" />,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      bgColor: 'bg-blue-50',
      route: '/auth/client'
    },
    {
      id: 'farmer',
      title: t.farmer,
      description: t.farmerDesc,
      icon: <Tractor className="h-12 w-12" />,
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      bgColor: 'bg-green-50',
      route: '/auth/farmer'
    },
    {
      id: 'administrator',
      title: t.administrator,
      description: t.adminDesc,
      icon: <Crown className="h-12 w-12" />,
      color: 'from-purple-500 to-indigo-500',
      hoverColor: 'hover:from-purple-600 hover:to-indigo-600',
      bgColor: 'bg-purple-50',
      route: '/auth/admin'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      const role = roles.find(r => r.id === selectedRole);
      if (role) {
        window.location.href = role.route;
      }
    }
  };

  // === (Habías dejado este bloque, pero no lo usas; lo mantengo) ===
  const [active, setActive] = useState(1);
  const total = roles.length;
  const radius = 380;
  const perspective = 1100;
  function relPos(index: number, active: number, total: number) {
    const d = (index - active + total) % total;
    if (d === 0) return 0;
    if (d === 1) return 1;
    if (d === total - 1) return -1;
    return 0;
  }
  const goLeft = () => { setSelectedRole(null); setActive((a) => (a - 1 + total) % total); };   // ⭐ des-selecciona
  const goRight = () => { setSelectedRole(null); setActive((a) => (a + 1) % total); };         // ⭐ des-selecciona

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goLeft();
    if (e.key === 'ArrowRight') goRight();
  };
  const decideFromDrag = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const delta = info.offset.x + info.velocity.x * 0.2;
    if (delta > 40) goLeft();
    else if (delta < -40) goRight();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgroGlobal
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                variant="outline"
                className="border-green-200 hover:bg-green-50 text-green-700"
                onClick={() => window.location.href = '/'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToHome}
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t.welcome}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Language Selector */}
        <motion.div 
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 px-6 py-3 text-lg"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              <Globe className="mr-3 h-5 w-5 text-green-600" />
              <span className="mr-2">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
              {t.selectLanguage}
              <ChevronDown className={`ml-3 h-4 w-4 transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className="w-full px-6 py-3 text-left hover:bg-green-50 transition-colors duration-200 flex items-center space-x-3"
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setIsLanguageOpen(false);
                      }}
                    >
                      <span className="text-xl">{language.flag}</span>
                      <span className="font-medium text-gray-700">{language.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Role Selection – CARRUSEL 3D */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200 text-lg px-6 py-2">
              {t.selectRole}
            </Badge>
          </div>

          {/* ======= Carrusel circular ======= */}
          {(() => {
            const order = ['client', 'farmer', 'administrator'];
            const startIndex = Math.max(0, order.indexOf('farmer'));
            const [frontIdx, setFrontIdx] = useState(startIndex);
            const [dragStartX, setDragStartX] = useState<number | null>(null);

            const toCircular = (i: number) => {
              const n = order.length;
              return (i + n) % n;
            };

            const rotateLeft = () => {                          // ⭐ des-selecciona al girar
              setSelectedRole(null);
              setFrontIdx((v) => toCircular(v + 1));
            };
            const rotateRight = () => {                         // ⭐ des-selecciona al girar
              setSelectedRole(null);
              setFrontIdx((v) => toCircular(v - 1));
            };

            const getRelPos = (i: number) => {
              const n = order.length;
              const idx = toCircular(i);
              const center = frontIdx;
              if (idx === center) return 0;
              if (idx === toCircular(center - 1)) return -1;
              return 1;
            };

            const onPointerDown = (e: React.PointerEvent) => setDragStartX(e.clientX);
            const onPointerUp = (e: React.PointerEvent) => {
              if (dragStartX == null) return;
              const delta = e.clientX - dragStartX;
              setDragStartX(null);
              if (Math.abs(delta) < 30) return;
              setSelectedRole(null);                            // ⭐ des-selecciona en drag
              if (delta < 0) rotateLeft();
              else rotateRight();
            };

            const onCardClick = (id: string) => {
              const idx = order.indexOf(id);
              if (idx === -1) return;
              if (idx !== frontIdx) {
                const left = toCircular(frontIdx + 1);
                const right = toCircular(frontIdx - 1);
                if (idx === left) rotateLeft();
                else if (idx === right) rotateRight();
                else setFrontIdx(idx);
                return;
              }
              setSelectedRole(id);
            };

            return (
              // ⭐ Contenedor relativo con padding inferior para el botón absoluto
              <section className="relative mx-auto max-w-6xl w-full flex flex-col items-center pb-28">
                <div
                  className="relative w-full h-[560px] md:h-[600px] overflow-visible z-[40]"
                  style={{ perspective: 1200 }}
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                >
                  {/* Flechas */}
                  <button
                    onClick={rotateRight}
                    className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-[60] bg-white/70 hover:bg-white rounded-full shadow p-3"
                    aria-label="Anterior"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={rotateLeft}
                    className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-[60] bg-white/70 hover:bg-white rounded-full shadow p-3"
                    aria-label="Siguiente"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-700" />
                  </button>

                  {/* Cards */}
                  {order.map((id) => {
                    const r = roles.find((x) => x.id === id)!;
                    const rel = getRelPos(order.indexOf(id));

                    const config = {
                      0:   { z: 120, x: 0,    rotY: 0,   scale: 0.96, opacity: 1,    blur: 'blur(0px)',   zIndex: 50 },
                      '-1':{ z: -80, x: -300, rotY: 18,  scale: 0.86, opacity: 0.55, blur: 'blur(1.5px)', zIndex: 30 },
                      1:   { z: -80, x: 300,  rotY: -18, scale: 0.86, opacity: 0.55, blur: 'blur(1.5px)', zIndex: 30 },
                    } as const; // ⭐ scale bajada = cards un poquito más pequeñas

                    const st = config[rel as -1 | 0 | 1];
                    const isSelected = selectedRole === id && rel === 0;

                    return (
                      <motion.div
                        key={id}
                        className="absolute left-1/2 top-1/2 origin-center"
                        style={{ transformStyle: 'preserve-3d', zIndex: st.zIndex }}
                        initial={false}
                        animate={{
                          x: st.x,
                          y: -10,
                          scale: st.scale,
                          opacity: st.opacity,
                          rotateY: st.rotY,
                          translateZ: st.z,
                          filter: st.blur as any,
                        }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      >
                        <div className="-translate-x-1/2 -translate-y-1/2">
                          <Card
                            onClick={() => onCardClick(id)}
                            className={`w-[430px] max-w-[90vw] h-[380px] md:h-[360px]  // ⭐ un toque más pequeñas
                              cursor-pointer border-0 shadow-xl bg-white/90 backdrop-blur rounded-3xl
                              overflow-hidden transition-all duration-300
                              ${rel === 0 ? 'hover:shadow-2xl' : ''}
                              ${isSelected ? 'ring-4 ring-green-400' : ''}`}
                          >
                            <CardContent className="h-full flex flex-col items-center justify-center p-10">
                              {/* ⭐ icono animado al hover */}
                              <motion.div
                                className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${r.color} text-white mb-6`}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                              >
                                {r.icon}
                              </motion.div>

                              <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
                                {r.title}
                              </h3>

                              <p className="text-gray-600 text-lg leading-relaxed text-center max-w-[460px]">
                                {r.description}
                              </p>

                              {isSelected && (
                                <motion.div
                                  className="mt-5"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                >
                                  <Badge className="bg-green-500 text-white text-sm px-3 py-1 rounded-full shadow">
                                    Seleccionado ✓
                                  </Badge>
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ⭐ Botón ~1cm arriba: absoluto dentro del contenedor */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-10 z-[80]">
                  <Button
                    size="lg"
                    className={`px-10 py-4 text-lg rounded-full shadow-2xl transition-all duration-300 ${
                      selectedRole
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!selectedRole}
                    onClick={handleContinue}
                  >
                    {t.continue}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </section>
            );
          })()}
        </motion.div>

        {/* About System Section */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 text-lg px-6 py-2">
                  {t.aboutSystem}
                </Badge>
              </div>
              
              <div className="flex items-start space-x-6">
                <motion.div 
                  className="flex-shrink-0 bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Settings className="h-12 w-12 text-white" />
                </motion.div>
                
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {t.systemDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
