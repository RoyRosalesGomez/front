
import { api } from '@/lib/api';

export class AuthService {

// services/auth.service.ts
static async login(email: string, password: string) {
  try {
    const emailT = (email ?? '').trim();
    const passwordT = (password ?? '').trim();

    console.log('[LOGIN] Enviando a backend:', { email: emailT, hasPassword: !!passwordT });

    const res = await api.auth.login({ email: emailT, password: passwordT });

    const token = res?.token || res?.access_token;
    if (!token) throw new Error('Respuesta de login inválida (sin token).');

    api.setToken(token);
    if (res.user) localStorage.setItem('agroglobal_user', JSON.stringify(res.user));
    return res;
  } catch (e: any) {
    throw new Error(e?.message || 'No se pudo iniciar sesión');
  }
}

  
  static async register(userData: {
    name: string;
    lastName?: string;
    email: string;
    phone: string;
    location: string;
    residence: string;
    password: string;
    role: 'client' | 'farmer' | 'admin';
  }) {
    try {
      const response = await api.auth.register(userData);
      return response;
    } catch (error) {
      console.error('Error en AuthService.register:', error);
      throw error;
    }
  }

  static logout() {
    api.clearToken();
    
    // Redirigir a la página de selección
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard-select';
    }
  }

  static getToken() {
    return api.getToken();
  }

  static isAuthenticated() {
    return !!api.getToken();
  }

  static getCurrentUser() {
    const token = api.getToken();
    if (!token) return null;
    
    try {
      // Decodificar JWT para obtener información del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        status: payload.status
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  

  // static async checkBackendConnection() {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'}/users/statistics`);
  //     return response.ok;
  //   } catch (error) {
  //     return false;
  //   }
  // }
  static async checkBackendConnection() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
}