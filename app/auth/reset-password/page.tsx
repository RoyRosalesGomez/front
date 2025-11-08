'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  ArrowRight,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  useEffect(() => {
    // Obtener email de los query params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Validaciones
    if (!email) {
      toast.error('No se ha proporcionado un correo electrónico');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.resetPassword(email, password, confirmPassword);

      toast.success(response.message || 'Contraseña actualizada exitosamente');
      setPasswordReset(true);

      // Limpiar cualquier token o sesión anterior
      if (typeof window !== 'undefined') {
        localStorage.removeItem('agroglobal_token');
        localStorage.removeItem('agroglobal_user');
        sessionStorage.clear(); // Limpiar también sessionStorage
      }

      // Primero verificar el correo para obtener el rol del usuario
      const verifyResponse = await AuthService.forgotPassword(email);
      const userEmail = verifyResponse.email;

      // Intentar hacer login temporal para obtener el rol del usuario
      // (sin guardar el token, solo para saber a dónde redirigir)
      let loginRoute = '/auth/client/login'; // Por defecto cliente

      try {
        // Hacer una llamada temporal para obtener el rol
        const tempResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (tempResponse.ok) {
          const tempData = await tempResponse.json();
          const userRole = tempData.user?.role;

          // Determinar la ruta según el rol
          if (userRole === 'farmer') {
            loginRoute = '/auth/farmer/login';
          } else if (userRole === 'admin') {
            loginRoute = '/auth/admin/login';
          } else {
            loginRoute = '/auth/client/login';
          }

          // Limpiar el token temporal
          if (typeof window !== 'undefined') {
            localStorage.removeItem('agroglobal_token');
            localStorage.removeItem('agroglobal_user');
          }
        }
      } catch (err) {
        console.log('No se pudo determinar el rol, usando cliente por defecto');
      }

      // Redirigir al login correcto después de 3 segundos con recarga completa FORZADA
      setTimeout(() => {
        // Forzar recarga completa de la página (bypass cache)
        if (typeof window !== 'undefined') {
          window.location.replace(`${loginRoute}?passwordReset=true&t=` + Date.now());
        }
      }, 3000);
    } catch (error: any) {
      console.error('Error en reset password:', error);
      toast.error(error.message || 'Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
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
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
                onClick={() => router.push('/auth/farmer/login')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ir al Login
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
                className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <ShieldCheck className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">
                Nueva Contraseña
              </h2>
            </div>
          </motion.div>

          {/* Reset Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="ag-flow ag-flow--green rounded-[28px]">
              <div className="relative z-[1] rounded-[26px] bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                <Card className="bg-transparent border-0 shadow-none">
                  <CardContent className="p-8">
                    {!passwordReset ? (
                      <>
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Crear Nueva Contraseña
                          </h3>
                          <p className="text-gray-600">
                            Ingresa tu nueva contraseña para {email}
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-medium">
                              Nueva Contraseña
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
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
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                placeholder="Repite tu contraseña"
                                minLength={6}
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

                          {/* Password Requirements */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800 font-medium mb-2">
                              Requisitos de contraseña:
                            </p>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li className={password.length >= 6 ? 'text-green-600' : ''}>
                                • Mínimo 6 caracteres
                              </li>
                              <li className={password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}>
                                • Las contraseñas deben coincidir
                              </li>
                            </ul>
                          </div>

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </form>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-8"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          ¡Contraseña Actualizada!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Tu contraseña ha sido restablecida exitosamente.
                        </p>
                        <p className="text-sm text-gray-500">
                          Redirigiendo al inicio de sesión...
                        </p>
                      </motion.div>
                    )}

                    {!passwordReset && (
                      <div className="mt-8 text-center">
                        <p className="text-gray-600">
                          ¿Problemas para restablecer?
                        </p>
                        <Button
                          variant="ghost"
                          onClick={() => router.push('/auth/forgot-password')}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 mt-2"
                        >
                          Verificar correo nuevamente
                        </Button>
                      </div>
                    )}
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
