'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Leaf,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ClientAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Lógica de login - redirigir al dashboard del cliente
      console.log('Login attempt:', { email: formData.email, password: formData.password });
      // window.location.href = '/dashboard/client';
    } else {
      // Lógica de registro - redirigir al login después del registro
      console.log('Register attempt:', formData);
      setIsLogin(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
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
                className="border-blue-200 hover:bg-blue-50 text-blue-700"
                onClick={() => window.location.href = '/auth/client'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          {/* Title Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <ShoppingCart className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">
                Sistema de AgroGlobal
              </h2>
            </div>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? 'login' : 'register'}
                    initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 50 : -50 }}
                    transition={{ duration: 0.5 }}
                    className="p-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                      </h3>
                      <p className="text-gray-600">
                        {isLogin 
                          ? 'Ingresa tus credenciales para acceder' 
                          : 'Completa los datos para registrarte'
                        }
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {!isLogin && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium">
                              Nombre Completo
                            </Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ingresa tu nombre completo"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium">
                              Número de Teléfono
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ingresa tu número de teléfono"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-gray-700 font-medium">
                              Lugar de Residencia
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ingresa tu lugar de residencia"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Correo Electrónico
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ingresa tu correo electrónico"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ingresa tu contraseña"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {!isLogin && (
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                            Confirmar Contraseña
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Confirma tu contraseña"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>

                      {/* Demo Login Button */}
                      {isLogin && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-blue-200 hover:bg-blue-50 text-blue-700 py-3"
                          onClick={() => window.location.href = '/dashboard/client'}
                        >
                          Acceso Demo (Sin Backend)
                        </Button>
                      )}
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-gray-600">
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                      </p>
                      <Button
                        variant="ghost"
                        onClick={toggleAuthMode}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-2"
                      >
                        {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}