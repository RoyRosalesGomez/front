

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Cargar token del localStorage al inicializar
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
  const url = `${API_BASE_URL}${endpoint}`;
  const token = this.getToken();

  const isAuthRoute =
    endpoint.startsWith('/auth/login') ||
    endpoint.startsWith('/auth/register');

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // ✅ Solo agrega Authorization si NO es ruta de auth y hay token
  if (!isAuthRoute && token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...baseHeaders,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);

  // ---- manejo 401 (igual que ya lo tenías) ----
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
      console.error('[LOGIN 401] server says:', message);
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
        try { message = JSON.parse(txt).message || message; }
        catch { message = txt || message; }
      }
    } catch {}
    console.error('API non-OK:', { url, status: response.status, message });
    throw new Error(message);
  }

  // ✅ casos sin cuerpo
  if (response.status === 204) return null;
  if ((options.method || 'GET').toUpperCase() === 'DELETE') return null;

  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();          // puede venir vacío

  const isGet = (options.method || 'GET').toUpperCase() === 'GET';
   const finalUrl = isGet ? `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}` : url;


  if (!raw) return null;                      // ⬅️ evita json() con vacío
  if (contentType.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return raw; }
  }

  return raw;
}


  // 🔐 SERVICIOS DE AUTENTICACIÓN
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

  // 👥 SERVICIOS DE USUARIOS
  users = {
    getAll: (params?: { status?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      return this.request(`/users?${queryParams}`);
    },
    
    getById: (id: number) => this.request(`/users/${id}`),
    
    activate: (id: number) => 
      this.request(`/users/${id}/activate`, { method: 'PATCH' }),
    
    deactivate: (id: number) => 
      this.request(`/users/${id}/deactivate`, { method: 'PATCH' }),
    
    changePassword: (id: number, newPassword: string) =>
      this.request(`/users/${id}/change-password`, {
        method: 'PATCH',
        body: JSON.stringify({ newPassword }),
      }),
    
    getStatistics: () => this.request('/users/statistics'),
    
    update: (id: number, userData: any) =>
      this.request(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
      }),
  };

  // 📦 SERVICIOS DE PRODUCTOS
  products = {
    getApproved: (params?: { category?: string; search?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      return this.request(`/products/approved?${queryParams}`);
    },

    getAll: (params?: {
      status?: string;
      category?: string;
      farmerId?: number;
      search?: string
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      if (params?.search) queryParams.append('search', params.search);
      return this.request(`/products?${queryParams}`);
    },

    create: async (productData: {
      name: string;
      description: string;
      price: number;
      unit: string;
      stock: number;
      image?: File | null;
      category: 'frutas' | 'verduras' | 'granos' | 'otros';
      farmerId: number;
    }) => {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('unit', productData.unit);
      formData.append('stock', productData.stock.toString());
      formData.append('category', productData.category);
      formData.append('farmerId', productData.farmerId.toString());
      if (productData.image) formData.append('image', productData.image);

      const token = this.getToken();
      const url = `${API_BASE_URL}/products`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
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

      const result = await response.json();
      console.log('🔍 Respuesta de crear producto:', result);
      console.log('🖼️ Imagen devuelta por backend:', result?.image);
      return result;
    },

    update: async (id: number, productData: any) => {
      // Si hay un archivo, usar FormData
      if (productData.image instanceof File) {
        const formData = new FormData();
        if (productData.name) formData.append('name', productData.name);
        if (productData.description) formData.append('description', productData.description);
        if (productData.price !== undefined) formData.append('price', productData.price.toString());
        if (productData.unit) formData.append('unit', productData.unit);
        if (productData.stock !== undefined) formData.append('stock', productData.stock.toString());
        if (productData.category) formData.append('category', productData.category);
        formData.append('image', productData.image);

        const token = this.getToken();
        const url = `${API_BASE_URL}/products/${id}`;

        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
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

      // Si no hay archivo, usar JSON normal
      return this.request(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(productData),
      });
    },

    approve: (id: number) =>
      this.request(`/products/${id}/approve`, { method: 'PATCH' }),

    reject: (id: number) =>
      this.request(`/products/${id}/reject`, { method: 'PATCH' }),

    toggleActive: (id: number) =>
      this.request(`/products/${id}/toggle-active`, { method: 'PATCH' }),

    getStatistics: () => this.request('/products/statistics'),

    delete: (id: number) =>
      this.request(`/products/${id}`, { method: 'DELETE' }),
  };

  // 🛒 SERVICIOS DE ÓRDENES
  orders = {
    create: (orderData: {
      productId: number;
      customerId: number;
      quantity: number;
      notes?: string;
    }) => this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
    
    getAll: (params?: { 
      status?: string; 
      customerId?: number; 
      farmerId?: number 
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.customerId) queryParams.append('customerId', params.customerId.toString());
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      return this.request(`/orders?${queryParams}`);
    },
    
    updateStatus: (id: number, status: 'pending' | 'processing' | 'delivered' | 'cancelled') =>
      this.request(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    
    getStatistics: () => this.request('/orders/statistics'),
    
    getById: (id: number) => this.request(`/orders/${id}`),
  };

  // 🏪 SERVICIOS DE AGRO VETERINARIAS
  vetShops = {
    getActive: () => this.request('/vet-shops/active'),

    getAll: (params?: { active?: boolean }) => {
      const queryParams = new URLSearchParams();
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      return this.request(`/vet-shops?${queryParams}`);
    },

    create: async (shopData: {
      name: string;
      email: string;
      phone: string;
      location: string;
      address: string;
      image?: File | null;
    }) => {
      const formData = new FormData();
      formData.append('name', shopData.name);
      formData.append('email', shopData.email);
      formData.append('phone', shopData.phone);
      formData.append('location', shopData.location);
      formData.append('address', shopData.address);
      if (shopData.image) {
        formData.append('image', shopData.image);
      }

      const token = this.getToken();
      const url = `${API_BASE_URL}/vet-shops`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
          const txt = await response.text();
          if (txt) {
            try { message = JSON.parse(txt).message || message; }
            catch { message = txt || message; }
          }
        } catch {}
        throw new Error(message);
      }

      const result = await response.json();
      console.log('🔍 Respuesta de crear vet-shop:', result);
      console.log('🖼️ Imagen devuelta por backend:', result?.image);
      return result;
    },
    
    update: (id: number, shopData: any) =>
      this.request(`/vet-shops/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(shopData),
      }),
    
    toggleActive: (id: number) => 
      this.request(`/vet-shops/${id}/toggle-active`, { method: 'PATCH' }),
    
    getStatistics: () => this.request('/vet-shops/statistics'),
    
    delete: (id: number) => 
      this.request(`/vet-shops/${id}`, { method: 'DELETE' }),
  };

  // 📖 SERVICIOS DE BITÁCORA
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
      //farmerId: number;
    }) => this.request('/bitacora', {
      method: 'POST',
      body: JSON.stringify(entryData),
    }),
    
    getAll: (params?: { farmerId?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      return this.request(`/bitacora?${queryParams}`);
    },
    
    update: (id: number, entryData: any) => 
      this.request(`/bitacora/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(entryData),
      }),
    
    delete: (id: number) => 
      this.request(`/bitacora/${id}`, { method: 'DELETE' }),
    
    getById: (id: number) => this.request(`/bitacora/${id}`),
  };

  // 🌱 SERVICIOS DE CULTIVOS
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
      const url = `${API_BASE_URL}/cultivos`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
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
      // Si hay un archivo, usar FormData
      if (cultivoData.image instanceof File) {
        const formData = new FormData();
        formData.append('name', cultivoData.name);
        formData.append('variedad', cultivoData.variedad);
        if (cultivoData.comentario) formData.append('comentario', cultivoData.comentario);
        formData.append('image', cultivoData.image);

        const token = this.getToken();
        const url = `${API_BASE_URL}/cultivos/${id}`;

        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
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

      // Si no hay archivo, usar JSON normal
      return this.request(`/cultivos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(cultivoData),
      });
    },

    toggleActive: (id: number) =>
      this.request(`/cultivos/${id}/toggle-active`, { method: 'PATCH' }),

    delete: (id: number) =>
      this.request(`/cultivos/${id}`, { method: 'DELETE' }),
  };

  // 🏡 SERVICIOS DE PROPIEDADES
  propiedades = {
    create: (propiedadData: {
      nombre: string;
      localizacion: string;
      tamano: string;
      comentario?: string;
      farmerId: number;
    }) => this.request('/propiedades', {
      method: 'POST',
      body: JSON.stringify(propiedadData),
    }),
    
    getAll: (params?: { farmerId?: number; active?: boolean }) => {
      const queryParams = new URLSearchParams();
      if (params?.farmerId) queryParams.append('farmerId', params.farmerId.toString());
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      return this.request(`/propiedades?${queryParams}`);
    },
    
    update: (id: number, propiedadData: any) =>
      this.request(`/propiedades/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(propiedadData),
      }),
    
    toggleActive: (id: number) => 
      this.request(`/propiedades/${id}/toggle-active`, { method: 'PATCH' }),
    
    delete: (id: number) => 
      this.request(`/propiedades/${id}`, { method: 'DELETE' }),
  };

  // al final de la clase ApiClient, antes de cerrar la clase:
activities = {
  recent: (days = 5, limit = 25) =>
    this.request(`/activities?sinceDays=${days}&limit=${limit}`),
};

}

// Instancia singleton del cliente API
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