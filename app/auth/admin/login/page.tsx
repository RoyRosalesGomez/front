
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 IMPORTANTE
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Leaf, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import { alert } from '@/lib/alert';


export default function AdminAuth() {
  const router = useRouter(); // 👈 AHORA SÍ EXISTE

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 👇 Usa un SOLO estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    residence: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (isLogin) {
      // ------- LOGIN -------
      const res = await AuthService.login(
        formData.email.trim(),
        formData.password
      );
      // si llega aquí, hay token y user en localStorage
  alert.success('Bienvenido', 'Accediendo al panel de administración');
  router.push('/dashboard/admin');
      return;
    }

    // ------- REGISTRO (primer admin si no existe) -------
    // validaciones básicas
    if (formData.password.length < 6) {
      alert.error('Contraseña inválida', 'Debe tener al menos 6 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert.error('Error de validación', 'Las contraseñas no coinciden.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      residence: formData.residence.trim(),
      password: formData.password,
      // 👇 si no hay admins, el backend/cliente forzará 'admin'
      role: 'admin' as const,
    };

    const res = await AuthService.register(payload);
    // Si el backend activó al PRIMER admin, devuelve token y quedas logueado
    if (res?.access_token || res?.token) {
      router.push('/dashboard/admin');
      return;
    }

    // En cualquier otro caso, queda PENDING (sin token)
  alert.info('Registro realizado', 'Quedará PENDIENTE hasta que un admin lo active.');
    setIsLogin(true);    // o al mismo admin auth con isLogin=true
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (msg.includes('Credenciales inválidas') || msg.includes('401')) {
      alert.error('Credenciales inválidas', 'Correo o contraseña incorrectos.');
    } else {
      alert.error('Error', msg || 'No se pudo contactar el servidor.');
    }
  } finally {
    setIsLoading(false);
  }
}

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      residence: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
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
                className="border-purple-200 hover:bg-purple-50 text-purple-700"
                onClick={() => router.push('/dashboard-select')}
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
                className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Crown className="h-8 w-8 text-white" />
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
  {/* ⬇️ Wrapper con el borde morado/indigo */}
  <div className="ag-flow ag-flow--purple rounded-[28px]">
    {/* capa interior (contenido) */}
    <div className="relative z-[1] rounded-[26px] bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
      {/* tu Card queda transparente (solo para espaciar/padding si lo necesitas) */}
      <Card className="bg-transparent border-0 shadow-none">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {/* ⬇️ A partir de aquí pega TODO lo que ya tenías (sin cambiar nada). 
                Es decir, desde el <motion.div key=...> hasta el cierre correspondiente. */}
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
                        {isLogin ? '🔐 Iniciar Sesión' : '🔑 Crear Cuenta'}
                      </h3>
                      <p className="text-gray-600">
                        {isLogin 
                          ? 'Ingresa tus credenciales para acceder' 
                          : 'Completa los datos para registrarte'}
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
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="Ingresa tu nombre completo"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-gray-700 font-medium">
                              Apellidos
                            </Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="Ingresa tus apellidos"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium">
                              Número de Teléfono
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="Ingresa tu número de teléfono"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="residence" className="text-gray-700 font-medium">
                              Dirección Completa
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="residence"
                                name="residence"
                                type="text"
                                required
                                value={formData.residence}
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="Ingresa tu dirección completa"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-gray-700 font-medium">
                              Lugar de Residencia
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                className="pl-10"
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
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Ingresa tu correo electrónico"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-10"
                            placeholder="Ingresa tu contraseña"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="pl-10 pr-10"
                              placeholder="Confirma tu contraseña"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isLoading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>

                      {/* ❌ Elimina el acceso demo directo (saltaba auth) */}
                      {/* 
                      {isLogin && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-purple-200 hover:bg-purple-50 text-purple-700 py-3"
                          onClick={() => router.push('/dashboard/admin')}
                        >
                          Acceso Demo (Sin Backend)
                        </Button>
                      )} 
                      */}
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-gray-600">
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                      </p>
                      <Button
                        variant="ghost"
                        onClick={toggleAuthMode}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 mt-2"
                      >
                        {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
