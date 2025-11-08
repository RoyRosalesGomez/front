// src/lib/api.ts - VERSIÓN CORREGIDA

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
if (!API_BASE) {
  console.warn('⚠️ NEXT_PUBLIC_API_URL no definida. Configúrala en Vercel.');
}

const buildUrl = (endpoint: string) =>
  `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('agroglobal_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('agroglobal_token', token);
    }
  }

  getToken() {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('agroglobal_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agroglobal_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = buildUrl(endpoint);
    const token = this.getToken();

    const isAuthRoute =
      endpoint.startsWith('/auth/login') ||
      endpoint.startsWith('/auth/register');

    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!isAuthRoute && token) {
      baseHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...baseHeaders,
        ...(options.headers || {}),
      },
      credentials: 'include', // 🔥 ESTO ES CRÍTICO PARA CORS
      mode: 'cors', // 🔥 EXPLÍCITO
    };

    // ⚠️ LOGGING TEMPORAL PARA DEBUG
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      headers: config.headers,
      hasBody: !!options.body
    });

    try {
      const response = await fetch(url, config);

      // 🔍 LOGGING DE RESPUESTA
      console.log('📥 API Response:', {
        url,
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Manejo 401
      if (response.status === 401) {
        if (endpoint.startsWith('/auth/login')) {
          let message = 'Credenciales inválidas';
          try {
            const txt = await response.text();
            try {
              const j = JSON.parse(txt);
              message = j.message || message;
            } catch {
              if (txt) message = txt;
            }
          } catch {}
          console.error('❌ [LOGIN 401]:', message);
          throw new Error(message);
        }

        this.clearToken();
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('agroglobal_user');
          window.location.href = '/dashboard-select';
        }
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }

      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const txt = await response.text();
          if (txt) {
            try { 
              const parsed = JSON.parse(txt);
              message = parsed.message || parsed.error || message; 
            } catch { 
              message = txt || message; 
            }
          }
        } catch {}
        console.error('❌ API Error:', { url, status: response.status, message });
        throw new Error(message);
      }

      if (response.status === 204) return null;
      if ((options.method || 'GET').toUpperCase() === 'DELETE') return null;

      const contentType = response.headers.get('content-type') || '';
      const raw = await response.text();
      if (!raw) return null;
      if (contentType.includes('application/json')) {
        try { 
          return JSON.parse(raw); 
        } catch { 
          console.warn('⚠️ Failed to parse JSON:', raw);
          return raw; 
        }
      }
      return raw;

    } catch (error: any) {
      // 🚨 MANEJO DE ERRORES DE RED
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('❌ Network Error:', {
          url,
          error: error.message,
          hint: 'Verifica que el backend esté corriendo y sea accesible'
        });
        throw new Error('Error de conexión. Verifica que el backend esté disponible.');
      }
      throw error;
    }
  }

  // 🔐 AUTH
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: {
      name: string;
      lastName?: string;
      email: string;
      phone: string;
      location: string;
      residence: string;
      password: string;
      role: 'client' | 'farmer' | 'admin';
    }) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    forgotPassword: (email: string) =>
      this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (data: { email: string; password: string; confirmPassword: string }) =>
      this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
  
  // 👥 USERS
  users = {
    getAll: (params?: { status?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      return this.request(`/users?${queryParams}`);
    },
    getById: (id: number) => this.request(`/users/${id}`),
    activate: (id: number) => this.request(`/users/${id}/activate`, { method: 'PATCH' }),
    deactivate: (id: number) => this.request(`/users/${id}/deactivate`, { method: 'PATCH' }),
    changePassword: (id: number, newPassword: string) =>
      this.request(`/users/${id}/change-password`, {
        method: 'PATCH',
        body: JSON.stringify({ newPassword }),
      }),
    getStatistics: () => this.request('/users/statistics'),
    update: (id: number, userData: any) =>
      this.request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(userData) }),
  };

  // 📦 PRODUCTS
  products = {
    getApproved: (params?: { category?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      return this.request(`/products/approved?${queryParams}`);
    },
    getAll: (params?: { status?: string; category?: string; farmerId?: number; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      if (params?.search) queryParams.append('search', params.search);
      return this.request(`/products?${queryParams}`);
    },
    create: (productData: {
      name: string;
      description: string;
      price: number;
      unit: string;
      stock: number;
      image: string;
      category: 'frutas' | 'verduras' | 'granos' | 'otros';
      farmerId: number;
    }) => this.request('/products', { method: 'POST', body: JSON.stringify(productData) }),
    update: (id: number, productData: any) =>
      this.request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(productData) }),
    approve: (id: number) => this.request(`/products/${id}/approve`, { method: 'PATCH' }),
    reject: (id: number) => this.request(`/products/${id}/reject`, { method: 'PATCH' }),
    toggleActive: (id: number) => this.request(`/products/${id}/toggle-active`, { method: 'PATCH' }),
    getStatistics: () => this.request('/products/statistics'),
    delete: (id: number) => this.request(`/products/${id}`, { method: 'DELETE' }),
  };

  // 🛒 ORDERS
  orders = {
    create: (orderData: { productId: number; customerId: number; quantity: number; notes?: string }) =>
      this.request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    getAll: (params?: { status?: string; customerId?: number; farmerId?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.customerId) queryParams.append('customerId', params.customerId.toString());
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      return this.request(`/orders?${queryParams}`);
    },
    updateStatus: (id: number, status: 'pending' | 'processing' | 'delivered' | 'cancelled') =>
      this.request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getStatistics: () => this.request('/orders/statistics'),
    getById: (id: number) => this.request(`/orders/${id}`),
  };

  // 🏪 VET SHOPS
  vetShops = {
    getActive: () => this.request('/vet-shops/active'),
    getAll: (params?: { active?: boolean }) => {
      const queryParams = new URLSearchParams();
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      return this.request(`/vet-shops?${queryParams}`);
    },
    create: (shopData: { name: string; email: string; phone: string; location: string; address: string; image?: string }) =>
      this.request('/vet-shops', { method: 'POST', body: JSON.stringify(shopData) }),
    update: (id: number, shopData: any) =>
      this.request(`/vet-shops/${id}`, { method: 'PATCH', body: JSON.stringify(shopData) }),
    toggleActive: (id: number) => this.request(`/vet-shops/${id}/toggle-active`, { method: 'PATCH' }),
    getStatistics: () => this.request('/vet-shops/statistics'),
    delete: (id: number) => this.request(`/vet-shops/${id}`, { method: 'DELETE' }),
  };

  // 📖 BITÁCORA
  bitacora = {
    create: (entryData: {
      tipoActividad: string;
      tipoCultivo: string;
      fechaInicio: string;
      fechaFin: string;
      detalle: string;
      lote: string;
      observaciones?: string;
      cantidad: string;
    }) => this.request('/bitacora', { method: 'POST', body: JSON.stringify(entryData) }),
    getAll: (params?: { farmerId?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      return this.request(`/bitacora?${queryParams}`);
    },
    update: (id: number, entryData: any) =>
      this.request(`/bitacora/${id}`, { method: 'PATCH', body: JSON.stringify(entryData) }),
    delete: (id: number) => this.request(`/bitacora/${id}`, { method: 'DELETE' }),
    getById: (id: number) => this.request(`/bitacora/${id}`),
  };

  // 🌱 CULTIVOS (con soporte a FormData)
  cultivos = {
    create: async (cultivoData: {
      name: string;
      variedad: string;
      comentario?: string;
      image?: File | null;
      farmerId: number;
    }) => {
      const formData = new FormData();
      formData.append('name', cultivoData.name);
      formData.append('variedad', cultivoData.variedad);
      if (cultivoData.comentario) formData.append('comentario', cultivoData.comentario);
      if (cultivoData.image) formData.append('image', cultivoData.image);
      formData.append('farmerId', cultivoData.farmerId.toString());

      const token = this.getToken();
      const response = await fetch(buildUrl('/cultivos'), {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const txt = await response.text();
          if (txt) {
            try { message = JSON.parse(txt).message || message; }
            catch { message = txt || message; }
          }
        } catch {}
        throw new Error(message);
      }

      return response.json();
    },

    getAll: (params?: { farmerId?: number; active?: boolean }) => {
      const queryParams = new URLSearchParams();
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      return this.request(`/cultivos?${queryParams}`);
    },

    update: async (id: number, cultivoData: any) => {
      if (cultivoData.image instanceof File) {
        const formData = new FormData();
        formData.append('name', cultivoData.name);
        formData.append('variedad', cultivoData.variedad);
        if (cultivoData.comentario) formData.append('comentario', cultivoData.comentario);
        formData.append('image', cultivoData.image);

        const token = this.getToken();
        const response = await fetch(buildUrl(`/cultivos/${id}`), {
          method: 'PATCH',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        });

        if (!response.ok) {
          let message = `HTTP ${response.status}`;
          try {
            const txt = await response.text();
            if (txt) {
              try { message = JSON.parse(txt).message || message; }
              catch { message = txt || message; }
            }
          } catch {}
          throw new Error(message);
        }
        return response.json();
      }

      return this.request(`/cultivos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(cultivoData),
      });
    },

    toggleActive: (id: number) => this.request(`/cultivos/${id}/toggle-active`, { method: 'PATCH' }),
    delete: (id: number) => this.request(`/cultivos/${id}`, { method: 'DELETE' }),
  };

  // 🏡 PROPIEDADES
  propiedades = {
    create: (propiedadData: {
      nombre: string;
      localizacion: string;
      tamano: string;
      comentario?: string;
      farmerId?: number;
    }) => this.request('/propiedades', { method: 'POST', body: JSON.stringify(propiedadData) }),

    getAll: (params?: { farmerId?: number; active?: boolean }) => {
      const queryParams = new URLSearchParams();
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      return this.request(`/propiedades?${queryParams}`);
    },

    update: (id: number, propiedadData: any) =>
      this.request(`/propiedades/${id}`, { method: 'PATCH', body: JSON.stringify(propiedadData) }),

    toggleActive: (id: number) => this.request(`/propiedades/${id}/toggle-active`, { method: 'PATCH' }),
    delete: (id: number) => this.request(`/propiedades/${id}`, { method: 'DELETE' }),
  };

  // 🧾 ACTIVIDADES
  activities = {
    recent: (days = 5, limit = 25) =>
      this.request(`/activities?sinceDays=${days}&limit=${limit}`),
  };
}

// Instancia única
export const api = new ApiClient();

// Tipos TypeScript para mejor desarrollo
export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  residence: string;
  role: 'client' | 'farmer' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  canView: boolean;
  canEdit: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  category: 'frutas' | 'verduras' | 'granos' | 'otros';
  status: 'pending' | 'approved' | 'rejected';
  active: boolean;
  rating: number;
  farmerId: number;
  farmer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  notes?: string;
  customerId: number;
  productId: number;
  customer?: User;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface VetShop {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  image?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BitacoraEntry {
  id: number;
  tipoActividad: string;
  tipoCultivo: string;
  fechaInicio: string;
  fechaFin: string;
  detalle: string;
  lote: string;
  observaciones?: string;
  cantidad: string;
  farmerId: number;
  farmer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Cultivo {
  id: number;
  name: string;
  variedad: string;
  comentario?: string;
  image?: string;
  active: boolean;
  farmerId: number;
  farmer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Propiedad {
  id: number;
  nombre: string;
  localizacion: string;
  tamano: string;
  comentario?: string;
  active: boolean;
  farmerId: number;
  farmer?: User;
  createdAt: string;
  updatedAt: string;
}