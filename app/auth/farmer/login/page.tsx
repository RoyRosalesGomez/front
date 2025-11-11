"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tractor,
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

export default function FarmerAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now()); // Key para forzar re-render del form
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

  // Detectar si viene de un reset de contraseña
  useEffect(() => {
    if (searchParams.get("passwordReset") === "true") {
      // Forzar re-render completo del formulario
      setFormKey(Date.now());

      // Limpiar completamente el formulario
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

      toast.success(
        "Contraseña actualizada exitosamente. Inicia sesión con tu nueva contraseña."
      );

      // Limpiar los parámetros de la URL sin causar re-render
      const url = new URL(window.location.href);
      url.searchParams.delete("passwordReset");
      url.searchParams.delete("t");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams]);

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
          // Normalizar email y password
          const email = formData.email.trim().toLowerCase();
          const password = formData.password;

          console.log("[FARMER LOGIN] Intentando login con:", {
            email,
            passwordLength: password.length,
            passwordPreview: password.substring(0, 3) + "...",
          });

          // Intentar login real con el backend
          const response = await AuthService.login(email, password);

          console.log("[FARMER LOGIN] Respuesta del backend:", {
            hasToken: !!response?.access_token,
            userRole: response?.user?.role,
            userStatus: response?.user?.status,
          });

          // Verificar que sea agricultor
          if (response.user.role !== "farmer") {
            await Swal.fire({
              title: "Acceso denegado",
              text: "Esta sección es solo para agricultores",
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
            text: "Acceso concedido al panel de agricultor",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
          });

          window.location.href = "/dashboard/farmer";
        } catch (error: any) {
          console.error("[FARMER LOGIN] Error completo:", error);

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
          // Registro de nuevo agricultor
          await AuthService.register({
            name: formData.name,
            lastName: formData.lastName || "Agricultor",
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            residence: formData.residence || formData.location,
            password: formData.password,
            role: "farmer",
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
      toast.error(
        "Error de conexión. Verifica que el backend esté ejecutándose."
      );
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
                onClick={() => (window.location.href = "/auth/farmer")}
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
                className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Tractor className="h-8 w-8 text-white" />
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
            {/* ⬇️ Wrapper con el borde verde/emerald */}
            <div className="ag-flow ag-flow--green rounded-[28px]">
              <div className="relative z-[1] rounded-[26px] bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                <Card className="bg-transparent border-0 shadow-none">
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

                        <form
                          key={formKey}
                          onSubmit={handleSubmit}
                          className="space-y-6"
                        >
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
                                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                    className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                autoComplete="current-password"
                                className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  required
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                                className="text-sm text-green-600 hover:text-green-700 px-0"
                              >
                                ¿Olvidaste tu contraseña?
                              </Button>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 mt-2"
                          >
                            {isLogin ? "Registrarse" : "Iniciar Sesión"}
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
