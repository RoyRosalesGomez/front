'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Leaf, 
  Users, 
  TrendingUp, 
  Shield, 
  Globe, 
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
  ArrowRight,
  Star,
  Award,
  Target,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentInfo, setCurrentInfo] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Carrusel de hero images
  const heroImages = [
    {
      url: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
      title: "Agricultura Moderna",
      subtitle: "Conectando productores con el futuro"
    },
    {
      url: "https://images.pexels.com/photos/1459862/pexels-photo-1459862.jpeg",
      title: "Tecnología Agrícola",
      subtitle: "Innovación al servicio del campo"
    },
    {
      url: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg",
      title: "Sostenibilidad",
      subtitle: "Cultivando un futuro verde"
    }
  ];

  // Servicios de AgroGlobal
  const services = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Marketplace Agrícola",
      description: "Plataforma digital para compra y venta de productos agrícolas frescos y de calidad."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Red de Agricultores",
      description: "Conectamos agricultores con compradores, creando una comunidad sólida y confiable."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Gestión de Cultivos",
      description: "Herramientas avanzadas para el seguimiento y optimización de cultivos agrícolas."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Calidad Garantizada",
      description: "Sistema de verificación y control de calidad para productos agrícolas premium."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Alcance Global",
      description: "Expandimos el alcance de productores locales hacia mercados regionales e internacionales."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Compromiso Social",
      description: "Apoyamos el desarrollo sostenible y el bienestar de las comunidades rurales."
    }
  ];

  // Información corporativa
  const companyInfo = [
    {
      icon: <History className="h-12 w-12" />,
      title: "Nuestra Historia",
      content: "AgroGlobal nació en 2020 con la visión de revolucionar el sector agrícola a través de la tecnología. Fundada por un equipo de ingenieros y agricultores experimentados, hemos crecido hasta convertirnos en la plataforma líder en conectividad agrícola de la región.",
      highlight: "Más de 5 años de experiencia"
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Quiénes Somos",
      content: "Somos una empresa tecnológica dedicada a transformar la agricultura tradicional. Nuestro equipo multidisciplinario combina expertise técnico con profundo conocimiento del sector agrícola para crear soluciones innovadoras y efectivas.",
      highlight: "Equipo de 50+ profesionales"
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Nuestra Misión",
      content: "Empoderar a agricultores y compradores mediante una plataforma tecnológica que facilite el comercio justo, transparente y eficiente de productos agrícolas, contribuyendo al desarrollo sostenible del sector.",
      highlight: "Compromiso con la excelencia"
    },
    {
      icon: <Star className="h-12 w-12" />,
      title: "Nuestra Visión",
      content: "Ser la plataforma digital líder en América Latina que conecte de manera inteligente todo el ecosistema agrícola, promoviendo la innovación, sostenibilidad y prosperidad en el campo.",
      highlight: "Visión hacia el 2030"
    }
  ];

  // Artículos
  const articles = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg",
      title: "El Futuro de la Agricultura Digital",
      summary: "Descubre cómo la tecnología está transformando las prácticas agrícolas tradicionales.",
      content: "La agricultura digital representa una revolución silenciosa que está transformando la forma en que cultivamos, cosechamos y distribuimos alimentos. Con el uso de sensores IoT, drones, inteligencia artificial y análisis de datos, los agricultores pueden tomar decisiones más informadas sobre irrigación, fertilización y control de plagas. Esta tecnología no solo aumenta la productividad, sino que también reduce el impacto ambiental y optimiza el uso de recursos naturales. En AgroGlobal, estamos comprometidos con facilitar esta transición hacia una agricultura más inteligente y sostenible.",
      author: "Dr. María González",
      date: "15 de Enero, 2025",
      readTime: "5 min"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/1459862/pexels-photo-1459862.jpeg",
      title: "Sostenibilidad en el Cultivo Moderno",
      summary: "Estrategias innovadoras para una agricultura más verde y responsable.",
      content: "La sostenibilidad agrícola es más que una tendencia; es una necesidad imperativa para el futuro de nuestro planeta. Las prácticas sostenibles incluyen la rotación de cultivos, el uso eficiente del agua, la agricultura orgánica y la implementación de energías renovables. Estos métodos no solo preservan el medio ambiente, sino que también mejoran la calidad del suelo y la biodiversidad. Los consumidores cada vez más buscan productos cultivados de manera responsable, lo que crea oportunidades de mercado para agricultores que adoptan estas prácticas.",
      author: "Ing. Carlos Mendoza",
      date: "12 de Enero, 2025",
      readTime: "7 min"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
      title: "Mercados Digitales: Nueva Era del Comercio",
      summary: "Cómo las plataformas digitales están revolucionando la venta agrícola.",
      content: "Los mercados digitales han democratizado el acceso a compradores para agricultores de todas las escalas. A través de plataformas como AgroGlobal, los productores pueden llegar directamente a consumidores finales, restaurantes y distribuidores, eliminando intermediarios y obteniendo mejores precios por sus productos. Estas plataformas ofrecen transparencia en precios, trazabilidad de productos y facilitan el cumplimiento de estándares de calidad. El futuro del comercio agrícola es digital, y quienes se adapten temprano tendrán ventajas competitivas significativas.",
      author: "Lic. Ana Rodríguez",
      date: "10 de Enero, 2025",
      readTime: "6 min"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const nextInfo = () => {
    setCurrentInfo((prev) => (prev + 1) % companyInfo.length);
  };

  const prevInfo = () => {
    setCurrentInfo((prev) => (prev - 1 + companyInfo.length) % companyInfo.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-green-600 transition-colors duration-300">Inicio</a>
              <a href="#servicios" className="text-gray-700 hover:text-green-600 transition-colors duration-300">Servicios</a>
              <a href="#nosotros" className="text-gray-700 hover:text-green-600 transition-colors duration-300">Nosotros</a>
              <a href="#articulos" className="text-gray-700 hover:text-green-600 transition-colors duration-300">Artículos</a>
              <a href="#contacto" className="text-gray-700 hover:text-green-600 transition-colors duration-300">Contacto</a>
            </nav>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/dashboard-select'}
              >
                Ingresar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section con Carrusel */}
      <section id="inicio" className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative h-full">
              <img 
                src={heroImages[currentSlide].url} 
                alt={heroImages[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center text-center z-10">
          <motion.div
            className="text-white max-w-4xl px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {heroImages[currentSlide].title}
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-green-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {heroImages[currentSlide].subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/dashboard-select'}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Sección de Servicios */}
      <section id="servicios" className="py-20 bg-gradient-to-br from-white to-green-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
              Nuestros Servicios
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lo que ofrece <span className="text-green-600">AgroGlobal</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre cómo nuestra plataforma revoluciona el sector agrícola con soluciones 
              tecnológicas innovadoras y servicios de calidad mundial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full group hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer transform hover:scale-105">
                  <CardContent className="p-8">
                    <motion.div 
                      className="text-green-600 mb-6 group-hover:text-blue-600 transition-colors duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {service.icon}
                    </motion.div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                      {service.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Acerca de Nosotros (Carrusel) */}
      <section id="nosotros" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              Conoce AgroGlobal
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestra <span className="text-blue-600">Historia</span>
            </h3>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInfo}
                  className="p-12 md:p-16"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
                    <motion.div 
                      className="text-blue-600 flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {companyInfo[currentInfo].icon}
                    </motion.div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-3xl font-bold text-gray-900 mb-4">
                        {companyInfo[currentInfo].title}
                      </h4>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {companyInfo[currentInfo].content}
                      </p>
                      <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                        {companyInfo[currentInfo].highlight}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controles del carrusel de información */}
            <button
              onClick={prevInfo}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextInfo}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicadores */}
            <div className="flex justify-center space-x-3 mt-8">
              {companyInfo.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentInfo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentInfo 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-blue-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Artículos */}
      <section id="articulos" className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
              Blog AgroGlobal
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Artículos <span className="text-green-600">Destacados</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Mantente actualizado con las últimas tendencias y noticias del mundo agrícola.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 border-0 bg-white overflow-hidden cursor-pointer transform hover:scale-105">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-700">
                        {article.readTime}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {article.summary}
                    </p>
                    <Button 
                      variant="ghost" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Leer más
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Artículo */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <span>{selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <Badge className="bg-green-100 text-green-700">
                    {selectedArticle.readTime}
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {selectedArticle.title}
                </h2>
                <div className="prose prose-lg prose-green max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer id="contacto" className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="lg:col-span-2">
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">AgroGlobal</h3>
              </motion.div>
              <motion.p 
                className="text-gray-300 text-lg leading-relaxed mb-6 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Conectamos el futuro de la agricultura a través de tecnología innovadora, 
                creando un ecosistema digital que beneficia a productores y consumidores.
              </motion.p>
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110">
                  <Linkedin className="h-5 w-5" />
                </a>
              </motion.div>
            </div>

            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-6 text-green-400">Contacto</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">+506 2234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">info@agroglobal.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">San José, Costa Rica</span>
                </div>
              </div>
            </motion.div>

            {/* Enlaces rápidos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-6 text-blue-400">Enlaces</h4>
              <div className="space-y-3">
                <a href="#inicio" className="block text-gray-300 hover:text-white transition-colors duration-300">Inicio</a>
                <a href="#servicios" className="block text-gray-300 hover:text-white transition-colors duration-300">Servicios</a>
                <a href="#nosotros" className="block text-gray-300 hover:text-white transition-colors duration-300">Nosotros</a>
                <a href="#articulos" className="block text-gray-300 hover:text-white transition-colors duration-300">Artículos</a>
                <a href="/dashboard-select" className="block text-green-400 hover:text-green-300 font-semibold transition-colors duration-300">
                  Acceder al Sistema
                </a>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div 
            className="border-t border-gray-700 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400">
              © 2025 AgroGlobal. Todos los derechos reservados. Desarrollado con 
              <span className="text-green-400 mx-1">♥</span> 
              para la comunidad agrícola.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}