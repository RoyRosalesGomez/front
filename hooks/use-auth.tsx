
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

type AuthUser = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: 'admin' | 'farmer' | 'client';
  status: 'active' | 'inactive' | 'pending';
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (cred: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

const TOKEN_KEY = 'agroglobal_token';
const USER_KEY  = 'agroglobal_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user,  setUser]  = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehidratación al cargar
  useEffect(() => {
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      const u = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY)  : null;

      if (t) {
        setToken(t);
        api.setToken(t);
      }
      if (u) {
        setUser(JSON.parse(u));
      }
    } catch {}
    setLoading(false);
  }, []);

  async function login(cred: { email: string; password: string }) {
    const res = await api.auth.login(cred);
    // res = { access_token, user: { id, name, lastName, email, role, status } }
    setToken(res.access_token);
    setUser(res.user);

    api.setToken(res.access_token);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    localStorage.setItem(USER_KEY,  JSON.stringify(res.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    api.clearToken();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
