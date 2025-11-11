// services/auth.service.ts
import { api } from '@/lib/api';

export class AuthService {
  static async login(email: string, password: string) {
  try {
    const emailT = (email ?? '').trim();
    const passwordT = password ?? ''; // NO hacer trim a la password

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
  // ⬇️ aquí el fix:
  static async register(formValues: {
    name: string;
    lastName?: string;
    email: string;
    phone: string;
    location: string;
    residence: string;
    password: string;
    role: 'client' | 'farmer' | 'admin';
  }) {
    const res = await api.auth.register(formValues);  // ✅ usar el que sí existe

    // Si tu backend devuelve token tras registrarse y quieres “auto-login”:
    const token = res?.token || res?.access_token;
    if (token) {
      api.setToken(token);
      if (res.user) localStorage.setItem('agroglobal_user', JSON.stringify(res.user));
    }
    return res;
  }

  static logout() {
    api.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard-select';
    }
  }

  static getToken() { return api.getToken(); }
  static isAuthenticated() { return !!api.getToken(); }

  static getCurrentUser() {
    const token = api.getToken();
    if (!token) return null;
    try {
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

  static async checkBackendConnection() {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
    try {
      const res = await fetch(`${base.replace(/\/$/, '')}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
}

  static async forgotPassword(email: string) {
    try {
      const response = await api.auth.forgotPassword(email);
      return response;
    } catch (error) {
      console.error('Error en AuthService.forgotPassword:', error);
      throw error;
    }
  }

  static async resetPassword(email: string, password: string, confirmPassword: string) {
    try {
      const response = await api.auth.resetPassword({ email, password, confirmPassword });
      return response;
    } catch (error) {
      console.error('Error en AuthService.resetPassword:', error);
      throw error;
    }
  }
}
