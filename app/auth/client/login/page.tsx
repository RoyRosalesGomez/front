"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function ClientAuth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    residence: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        try {
          // Intentar login real con el backend
          const response = await AuthService.login(
            formData.email,
            formData.password
          );

          // Verificar que sea cliente
          if (response.user.role !== "client") {
            await Swal.fire({
              title: "Acceso denegado",
              text: "Esta sección es solo para clientes",
              icon: "error",
              confirmButtonColor: "#ef4444",
            });
            return;
          }

          // Verificar que la cuenta esté activa
          if (response.user.status !== "active") {
            await Swal.fire({
              title: "Cuenta pendiente",
              html: '<p>Tu cuenta está pendiente de activación</p><p class="text-sm text-gray-600 mt-2">Por favor espera a que un administrador active tu cuenta</p>',
              icon: "warning",
              confirmButtonColor: "#f59e0b",
            });
            return;
          }

          // ✅ Login exitoso
          await Swal.fire({
            title: `¡Bienvenido ${response.user.name}!`,
            text: "Acceso concedido a la tienda",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
          });

          window.location.href = "/dashboard/client";
        } catch (error: any) {
          console.error("Error en login:", error);

          // ❌ Credenciales incorrectas
          await Swal.fire({
            title: "Error de autenticación",
            html: `
              <p class="text-red-600 font-semibold">Correo o contraseña incorrectos</p>
              <p class="text-sm text-gray-600 mt-2">Verifica tus credenciales e intenta nuevamente</p>
            `,
            icon: "error",
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Intentar de nuevo",
          });
        }
      } else {
        // Validar contraseñas
        if (formData.password !== formData.confirmPassword) {
          await Swal.fire({
            title: "Las contraseñas no coinciden",
            text: "Por favor verifica que ambas contraseñas sean iguales",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
          return;
        }

        try {
          // Registro de nuevo cliente
          await AuthService.register({
            name: formData.name,
            lastName: formData.lastName || "Cliente",
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            residence: formData.residence || formData.location,
            password: formData.password,
            role: "client",
          });

          await Swal.fire({
            title: "¡Registro exitoso!",
            html: '<p>Tu cuenta ha sido creada</p><p class="text-sm text-gray-600 mt-2">Está pendiente de activación por el administrador</p>',
            icon: "success",
            confirmButtonColor: "#10b981",
          });
        } catch (error: any) {
          console.error("Error en registro:", error);
          await Swal.fire({
            title: "Error al registrarse",
            text:
              error.message ||
              "No se pudo crear la cuenta. Intenta nuevamente.",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }

        setIsLogin(true);
        setFormData({
          name: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          residence: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      console.error("Error en autenticación:", error);
      await Swal.fire({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor. Verifica tu conexión.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      residence: "",
      password: "",
      confirmPassword: "",
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
                onClick={() => (window.location.href = "/auth/client")}
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
            {/* WRAPPER con el borde fluido */}
            <div className="ag-flow mx-auto max-w-md">
              <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden z-[1]">
                <CardContent className="p-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLogin ? "login" : "register"}
                      initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isLogin ? 50 : -50 }}
                      transition={{ duration: 0.5 }}
                      className="p-8"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {isLogin ? "🔐 Iniciar Sesión" : "🔑 Crear Cuenta"}
                        </h3>
                        <p className="text-gray-600">
                          {isLogin
                            ? "Ingresa tus credenciales para acceder"
                            : "Completa los datos para registrarte"}
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                          <>
                            <div className="space-y-2">
                              <Label
                                htmlFor="name"
                                className="text-gray-700 font-medium"
                              >
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
                              <Label
                                htmlFor="lastName"
                                className="text-gray-700 font-medium"
                              >
                                Apellidos
                              </Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  id="lastName"
                                  name="lastName"
                                  type="text"
                                  required
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="Ingresa tus apellidos"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="phone"
                                className="text-gray-700 font-medium"
                              >
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
                              <Label
                                htmlFor="location"
                                className="text-gray-700 font-medium"
                              >
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

                            <div className="space-y-2">
                              <Label
                                htmlFor="residence"
                                className="text-gray-700 font-medium"
                              >
                                Dirección Completa
                              </Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  id="residence"
                                  name="residence"
                                  type="text"
                                  required
                                  value={formData.residence}
                                  onChange={handleInputChange}
                                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="Ingresa tu dirección completa"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-gray-700 font-medium"
                          >
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
                          <Label
                            htmlFor="password"
                            className="text-gray-700 font-medium"
                          >
                            Contraseña
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
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
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {!isLogin && (
                          <div className="space-y-2">
                            <Label
                              htmlFor="confirmPassword"
                              className="text-gray-700 font-medium"
                            >
                              Confirmar Contraseña
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Confirma tu contraseña"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {isLogin && (
                          <div className="text-right">
                            <Button
                              type="button"
                              variant="link"
                              onClick={() =>
                                router.push("/auth/forgot-password")
                              }
                              className="text-sm text-blue-600 hover:text-blue-700 px-0"
                            >
                              ¿Olvidaste tu contraseña?
                            </Button>
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          {isLoading
                            ? "Procesando..."
                            : isLogin
                              ? "Iniciar Sesión"
                              : "Crear Cuenta"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </form>

                      <div className="mt-8 text-center">
                        <p className="text-gray-600">
                          {isLogin
                            ? "¿No tienes una cuenta?"
                            : "¿Ya tienes una cuenta?"}
                        </p>
                        <Button
                          variant="ghost"
                          onClick={toggleAuthMode}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-2"
                        >
                          {isLogin ? "Registrarse" : "Iniciar Sesión"}
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
