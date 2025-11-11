'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Leaf,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.forgotPassword(email);

      toast.success(response.message || 'Correo verificado correctamente');
      setEmailVerified(true);

      // Redirigir a la página de reset después de 2 segundos
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error: any) {
      console.error('Error en forgot password:', error);
      toast.error(error.message || 'Error al verificar el correo electrónico');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
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
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
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
                className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900">
                Restablecer Contraseña
              </h2>
            </div>
          </motion.div>

          {/* Reset Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="ag-flow ag-flow--blue rounded-[28px]">
              <div className="relative z-[1] rounded-[26px] bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                <Card className="bg-transparent border-0 shadow-none">
                  <CardContent className="p-8">
                    {!emailVerified ? (
                      <>
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Verificar Correo Electrónico
                          </h3>
                          <p className="text-gray-600">
                            Ingresa tu correo electrónico para verificar que tu cuenta existe
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ingresa tu correo electrónico"
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            {isLoading ? 'Verificando...' : 'Verificar Correo'}
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
                          ¡Correo Verificado!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Redirigiendo a la página de restablecimiento...
                        </p>
                      </motion.div>
                    )}

                    <div className="mt-8 text-center">
                      <p className="text-gray-600">
                        ¿Recordaste tu contraseña?
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-2"
                      >
                        Volver al inicio de sesión
                      </Button>
                    </div>
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
