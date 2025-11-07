
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, Package, ShoppingCart, Store, Camera, Building2, TrendingUp, UserCheck, UserX, Eye, CreditCard as Edit, Trash2, Plus, Search, Filter, MoveHorizontal as MoreHorizontal, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ChartBar as BarChart3, ChartPie as PieChart, DollarSign, Leaf, LogOut, Settings, Bell, RefreshCw, Download, Upload, Mail, Phone, MapPin, Calendar, Clock, Star, Award, Target, Zap, X, Save, Check, Key, Edit3, Square, Edit2, LucideEdit3, Edit3Icon, Activity as ActivityIcon, Sun, Moon, SquarePen as SquareEdit  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserService } from '@/services/user.service';
import { ProductService } from '@/services/product.service';
import { OrderService } from '@/services/order.service';
import { VetShopService } from '@/services/vetshop.service';
import { AuthService } from '@/services/auth.service';
import { User, Product, Order, VetShop } from '@/lib/api';
import { toast } from 'sonner';
import { createLucideIcon } from "lucide-react";
import AmbientBackground from '@/components/ui/AmbientBackground';
import { ActivityService, Activity } from '@/services/activity.service'; // si usas la opción A

import React from 'react';


interface Statistics {
  users: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
  };
  products: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
  };
  vetShops: {
    total: number;
    active: number;
    inactive: number;
  };
}


type Theme = { g1: string; g2: string; g3: string; g4: string };

type StatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  theme: Theme;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  theme,
  onHoverIn,
  onHoverOut,
}: StatCardProps) {
  return (
    <Card
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      className="relative overflow-hidden rounded-2xl ring-1 ring-black/5 card-glass transition-transform duration-300 will-change-transform hover:scale-[1.03]"
    >
      {/* aurora */}
      <div
        className="aurora-card aurora-boreal"
        style={{
          ['--g1' as any]: theme.g1,
          ['--g2' as any]: theme.g2,
          ['--g3' as any]: theme.g3,
          ['--g4' as any]: theme.g4,
        }}
      />
      {/* sheen */}
      <span className="sheen sheen--soft absolute inset-y-0 -inset-x-1/3 z-10" />

      {/* contenido */}
      <CardContent className="relative z-20 p-6 text-white drop-strong">


        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/95 text-sm font-medium">{title}</p>
            <p className="text-4xl font-extrabold leading-tight mt-2">{value}</p>
          </div>
          <Icon className="h-12 w-12 text-white/90" />
        </div>

        {subtitle && (
          <div className="mt-4 text-sm text-white/95 space-x-6">
            {subtitle.split(/\s{2,}/).map((chunk: string, i: number) => (
              <span key={i}>{chunk}</span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


const THEMES = {
  users: { g1: '#60a5fa', g2: '#38bdf8', g3: '#818cf8', g4: '#22d3ee', tint: 'rgba(56,189,248,0.12)' },
  products: { g1: '#34d399', g2: '#10b981', g3: '#6ee7b7', g4: '#22c55e', tint: 'rgba(16,185,129,0.12)' },
  vets: { g1: '#c084fc', g2: '#a78bfa', g3: '#f472b6', g4: '#22d3ee', tint: 'rgba(167,139,250,0.12)' },
};


const DEFAULT_STATS: Statistics = {
  users: { total: 0, active: 0, pending: 0, inactive: 0 },
  products: { total: 0, approved: 0, rejected: 0, pending: 0 },
  orders: { total: 0, pending: 0, processing: 0, delivered: 0 },
  vetShops: { total: 0, active: 0, inactive: 0 },
};



// tickless: forza 1 re-render por segundo sin logs ni duplicados en StrictMode
// quita cualquier startedRef / flags
// function useNowMs(step = 1000) {
//   const [, force] = React.useReducer((n) => n + 1, 0);
//   const nowRef = React.useRef(Date.now());

//   React.useEffect(() => {
//     const tick = () => {
//       nowRef.current = Date.now();
//       force();
//     };

//     const pick = () => (document.hidden ? Math.max(step, 10000) : step);

//     let id = window.setInterval(tick, pick());
//     const onVis = () => {
//       clearInterval(id);
//       id = window.setInterval(tick, pick());
//     };
//     document.addEventListener('visibilitychange', onVis);

//     return () => {
//       clearInterval(id);
//       document.removeEventListener('visibilitychange', onVis);
//     };
//   }, [step]);

//   return nowRef.current;
// }

export default function AdminDashboard() {

  
  const [ambient, setAmbient] = useState<{ g1: string; g2: string; g3: string; g4: string; tint?: string } | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vetShops, setVetShops] = useState<VetShop[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVetShop, setSelectedVetShop] = useState<VetShop | null>(null);
  const [showAddVetShop, setShowAddVetShop] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null);
  const [showProductDetails, setShowProductDetails] = useState<Product | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [darkSidebar, setDarkSidebar] = useState(false);


  const [vetShopForm, setVetShopForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    image: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    residence: '',
  });

  // reloj global para forzar re-render
// const [now, setNow] = useState(() => Date.now());
// useEffect(() => {
//   const id = setInterval(() => setNow(Date.now()), 1000); // 1s
//   return () => clearInterval(id);
// }, []);


  // Filtros / búsqueda sólo para agro vet
  const [vetTab, setVetTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [vetSearch, setVetSearch] = useState('');

  // Modales específicos
  const [viewVetShop, setViewVetShop] = useState<VetShop | null>(null);
  const [editVetShop, setEditVetShop] = useState<VetShop | null>(null);

  // Form de edición
  const [editVetForm, setEditVetForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    image: '',
  });

  // Usa statistics con fallback seguro
  const s = statistics ?? DEFAULT_STATS;

  // Totales
  const usersCount = s.users.total;
  const productsCount = s.products.total;
  const vetsCount = s.vetShops.total;

  // Subtítulos
  const subtUsers =
    `Activos: ${s.users.active}  ` +
    `Inactivos: ${s.users.inactive}  ` +
    `Pendientes: ${s.users.pending}`;

  const subtProducts =
    `Aprobados: ${s.products.approved}  ` +
    `Rechazados: ${s.products.rejected}  ` +
    `Pendientes: ${s.products.pending}`;

  const subtVets =
    `Activas: ${s.vetShops.active}  ` +
    `Inactivas: ${s.vetShops.inactive}`;

  useEffect(() => {
    if (editVetShop) {
      setEditVetForm({
        name: editVetShop.name ?? '',
        email: editVetShop.email ?? '',
        phone: editVetShop.phone ?? '',
        location: editVetShop.location ?? '',
        address: editVetShop.address ?? '',
        image: editVetShop.image ?? '', // en tus entidades la propiedad es image
      });
    }
  }, [editVetShop]);

  const SquareEdit = createLucideIcon("SquareEdit", [
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }],
    ["path", { d: "M9 15l6-6 2 2-6 6H9v-2z" }],
    ["path", { d: "M15 9l2-2 2 2-2 2-2-2z" }]
  ]);

  useEffect(() => {
    if (showUserDetails) {
      setEditForm({
        name: showUserDetails.name ?? '',
        lastName: showUserDetails.lastName ?? '',
        email: showUserDetails.email ?? '',
        phone: showUserDetails.phone ?? '',
        location: showUserDetails.location ?? '',
        residence: showUserDetails.residence ?? '',
      });
    }
  }, [showUserDetails]);

  useEffect(() => {
    if (!backendConnected) return;
    loadUsers();
  }, [searchTerm, statusFilter, backendConnected]);

  // Si tienes una búsqueda/filtros para productos también:
  useEffect(() => {
    if (!backendConnected) return;
    loadProducts();
  }, [statusFilter, searchTerm, backendConnected]);

  // 1) Dispara SOLO la comprobación
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // 2) Cuando backendConnected cambie a true, carga TODO
  useEffect(() => {
    if (backendConnected) {
      loadAllData();
    }
  }, [backendConnected]);

  const checkBackendConnection = async () => {
    try {
      const connected = await AuthService.checkBackendConnection();
      setBackendConnected(connected);
      if (!connected) {
        toast.error('No se puede conectar al backend. Asegúrate de que esté ejecutándose en http://localhost:3002');
      }
    } catch (error) {
      console.error('Error checking backend connection:', error);
      setBackendConnected(false);
      toast.error('Error de conexión al backend');
    }
  };


  async function handleSaveUser() {
    if (!showUserDetails) return;
    try {
      await UserService.updateUser(showUserDetails.id, {
        name: editForm.name,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        location: editForm.location,
        residence: editForm.residence,
      });
      toast.success('Usuario actualizado');
      setShowUserDetails(null);
      setIsEditingUser(false);
      await loadUsers();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo actualizar');
    }
  }
  //const [editableUser, setEditableUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  
useEffect(() => {
  if (!backendConnected) return;
  loadActivities();                         // primera carga
  const id = setInterval(loadActivities, 60_000); // refresco cada 60s
  return () => clearInterval(id);
}, [backendConnected]);


  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStatistics(),
        loadUsers(),
        loadProducts(),
        loadOrders(),
        loadVetShops(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos del sistema');
    } finally {
      setLoading(false);
    }
  };


  const loadStatistics = async () => {
    try {
      const [userStats, productStats, orderStats, vetShopStats] = await Promise.all([
        UserService.getStatistics(),
        ProductService.getStatistics(),
        OrderService.getStatistics(),
        VetShopService.getStatistics()
      ]);

      setStatistics({
        users: userStats,
        products: productStats,
        orders: orderStats,
        vetShops: vetShopStats
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await UserService.getAllUsers({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined
      });
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar usuarios');
    }
  };

  const loadProducts = async () => {
    try {
      const data = await ProductService.getAllProducts({
        status: statusFilter === 'all' ? undefined : statusFilter as any,
        search: searchTerm || undefined
      });
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    }
  };

  const loadOrders = async () => {
    try {
      const data = await OrderService.getAllOrders({
        status: statusFilter === 'all' ? undefined : statusFilter as any
      });
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error al cargar órdenes');
    }
  };

  // const loadVetShops = async () => {
  //   try {
  //     const data = await VetShopService.getAllVetShops();
  //     setVetShops(data);
  //   } catch (error) {
  //     console.error('Error loading vet shops:', error);
  //     toast.error('Error al cargar agro veterinarias');
  //   }
  // };

  const loadVetShops = async () => {
    try {
      const data = await VetShopService.getAllVetShops(); // todas
      const normalized = (data || []).map((v: any) => ({
        ...v,
        active: typeof v.active === 'boolean' ? v.active : !!Number(v.active),
      }));
      setVetShops(normalized);
      console.log('[vetShops] cargadas:', normalized.length);
    } catch (error) {
      console.error('Error loading vet shops:', error);
      toast.error('Error al cargar agro veterinarias');
    }
  };
 
// ✅ mantener simple
const loadActivities = async () => {
  try {
    const data = await ActivityService.getRecent(5, 25);
    setActivities(data);
  } catch (e) {
    console.error('Error loading activities', e);
  }
};

  // cuando ya está backendConnected === true, cargamos
  useEffect(() => {
    if (!backendConnected) return;
    loadActivities();
    const id = setInterval(loadActivities, 60000); // refresco 60s reales
    return () => clearInterval(id);
  }, [backendConnected]);


  // Función para activar usuario
  const handleActivateUser = async (userId: number) => {
    try {
      await UserService.activateUser(userId);
      toast.success('Usuario activado exitosamente');
      await loadUsers();
      await loadStatistics();
      await loadActivities();
    } catch (error: any) {
      console.error('Error activating user:', error);
      toast.error('Error al activar usuario');
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      await UserService.deactivateUser(userId);
      toast.success('Usuario desactivado exitosamente');
      await loadUsers();
      await loadStatistics();
      await loadActivities();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Error al desactivar usuario');
    }
  };

  const handleChangePassword = async () => {
    if (!showChangePassword || !newPassword) return;

    try {
      await UserService.changePassword(showChangePassword.id, newPassword);
      toast.success('Contraseña cambiada exitosamente');
      setShowChangePassword(null);
      setNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error al cambiar contraseña');
    }
  };

  // Funciones de gestión de productos
  const handleApproveProduct = async (productId: number) => {
    try {
      await ProductService.approveProduct(productId);
      toast.success('Producto aprobado exitosamente');
      await loadProducts();
      await loadStatistics();
      await loadActivities();
    } catch (error) {
      console.error('Error approving product:', error);
      toast.error('Error al aprobar producto');
    }
  };

  const handleRejectProduct = async (productId: number) => {
    try {
      await ProductService.rejectProduct(productId);
      toast.success('Producto rechazado exitosamente');
      await loadProducts();
      await loadStatistics();
      await loadActivities();
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast.error('Error al rechazar producto');
    }
  };

  // Funciones de gestión de agro veterinarias
  const handleToggleVetShop = async (vetShopId: number) => {
    try {
      await VetShopService.toggleActiveVetShop(vetShopId);
      toast.success('Estado de agro veterinaria actualizado');
      await loadVetShops();
      await loadStatistics();
      await loadActivities();
    } catch (error) {
      console.error('Error toggling vet shop:', error);
      toast.error('Error al actualizar agro veterinaria');
    }
  };

  const handleAddVetShop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await VetShopService.createVetShop(vetShopForm);

      // normaliza el campo active (por si viene como 0/1)
      const normalized = {
        ...created,
        active: typeof created.active === 'boolean' ? created.active : !!Number(created.active),
      };

      // 1) Actualiza la tabla al instante (optimista)
      setVetShops(prev => [normalized, ...prev]);

      // 2) Actualiza también las estadísticas (optimista)
      setStatistics(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          vetShops: {
            total: prev.vetShops.total + 1,
            active: prev.vetShops.active + (normalized.active ? 1 : 0),
            inactive: prev.vetShops.inactive + (normalized.active ? 0 : 1),
          },
        };
      });
      await loadActivities();
      toast.success('Agro veterinaria creada exitosamente');
      setShowAddVetShop(false);
      setVetShopForm({ name: '', email: '', phone: '', location: '', address: '', image: '' });

      // 3) Re-sincroniza desde backend para dejar todo consistente
      await Promise.all([loadVetShops(), loadStatistics()]);
    } catch (error) {
      console.error('Error creating vet shop:', error);
      toast.error('Error al crear agro veterinaria');
    }
  };


  //   async function handleAdminChangePassword(userId: number, newPassword: string) {
  //   try {
  //     await UserService.changePassword(userId, newPassword);

  //     const me = AuthService.getCurrentUser(); // { id, role, ... }
  //     if (me && me.id === userId) {
  //       toast.success('Contraseña actualizada. Vuelve a iniciar sesión.');
  //       AuthService.logout(); // esto limpia token y redirige
  //       return;
  //     }

  //     toast.success('Contraseña actualizada');
  //     // refresca la lista si quieres
  //     // await loadUsers();
  //   } catch (e: any) {
  //     const msg = e?.message || 'No se pudo cambiar la contraseña';
  //     toast.error(msg);
  //   }
  // }

  const handleLogout = () => {
    AuthService.logout();
  };


  const activityVisual: Record<string, { color: string; Icon: any }> = {
    USER_CREATED: { color: 'bg-blue-500', Icon: UserCheck },
    USER_STATUS_CHANGED: { color: 'bg-cyan-500', Icon: UserCheck },
    PRODUCT_SUBMITTED: { color: 'bg-yellow-500', Icon: AlertCircle },
    PRODUCT_APPROVED: { color: 'bg-green-500', Icon: Package },
    PRODUCT_REJECTED: { color: 'bg-red-500', Icon: Package },
    VETSHOP_CREATED: { color: 'bg-purple-500', Icon: Building2 },
    VETSHOP_TOGGLED: { color: 'bg-indigo-500', Icon: Building2 },
  };


  // Filtrar usuarios según búsqueda y estado
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredVetShopsTable = vetShops
    .filter(v =>
      vetTab === 'all' ? true : vetTab === 'active' ? v.active : !v.active
    )
    .filter(v =>
      vetSearch.trim() === ''
        ? true
        : (v.name + ' ' + v.email + ' ' + v.location)
          .toLowerCase()
          .includes(vetSearch.toLowerCase())
    );


  const sidebarItems = [
    { id: 'dashboard', name: 'Panel', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'users', name: 'Usuarios', icon: <Users className="h-5 w-5" /> },
    { id: 'products', name: 'Productos', icon: <Package className="h-5 w-5" /> },
    //{ id: 'orders', name: 'Órdenes', icon: <ShoppingCart className="h-5 w-5" /> },
    { id: 'vetshops', name: 'Agro Veterinarias', icon: <Store className="h-5 w-5" /> }
  ];

  

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Panel administrativo 👑</h2>
      </div>

      <div className="relative z-10"> {/* z-10 para estar sobre el fondo ambiental */}
        {/* Fondo ambiental dinámico */}
        <AmbientBackground theme={ambient} visible={!!ambient} />

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">

          <StatCard
            title="Total Usuarios"
            value={usersCount}
            subtitle={subtUsers}
            icon={Users}
            theme={THEMES.users}
            onHoverIn={() => setAmbient(THEMES.users)}
            onHoverOut={() => setAmbient(null)}
          />
          <StatCard
            title="Total Productos"
            value={productsCount}
            subtitle={subtProducts}
            icon={Package}
            theme={THEMES.products}
            onHoverIn={() => setAmbient(THEMES.products)}
            onHoverOut={() => setAmbient(null)}
          />
          <StatCard
            title="Agro Veterinarias"
            value={vetsCount}
            subtitle={subtVets}
            icon={Store}
            theme={THEMES.vets}
            onHoverIn={() => setAmbient(THEMES.vets)}
            onHoverOut={() => setAmbient(null)}
          />

          <div className="col-span-full">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4">
  Actividad Reciente... 🕒
</h3>

{activities.length === 0 ? (
  <div className="text-center py-10 text-gray-500">
    No hay actividad en los últimos 5 días.
  </div>
) : (
  <div className="space-y-4">
    {activities.map((a) => {
      // Usa un key estable. Idealmente el id del activity
      const key = (a as any).id ?? (a as any)._id ?? `${a.type}:${a.title}:${a.createdAt}`;
      const visual = activityVisual[a.type] || { color: 'bg-gray-400', Icon: Building2 };
      const Icon = visual.Icon;

      return (
        <div
          key={key}
          className="w-full flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-4">
            <div className={`${visual.color} p-2 rounded-full`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{a.title}</p>
              <p className="text-xs text-gray-500">{a.description}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}



              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>


  );



  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios 👥</h2>
      </div>

      {/* Buscador + chips de filtro */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
            className={statusFilter === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Activos
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('inactive')}
            className={statusFilter === 'inactive' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Inactivos
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            className={statusFilter === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}>
            Pendientes
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.name[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.location}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone}
                    </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                        className={
                        user.status === 'active'
                        ? 'bg-green-500 text-white'
                        : user.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                      }
                      >
                     {user.status === 'active' ? 'Activo' : user.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                    </Badge>

                  </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${user.role === 'admin' ? 'bg-purple-500' : user.role === 'farmer' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'farmer' ? 'Agricultor' : 'Cliente'}
                      </Badge>
                    </td>

                    {/* ACCIONES (como en tu mock) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* Ver */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setShowUserDetails(user); setIsEditingUser(false); }}
                          title="Ver"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Editar */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setShowUserDetails(user); setIsEditingUser(true); }}
                          title="Editar"
                        >
                          <SquareEdit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );


  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos 📦</h2>
      </div>

      {/* Buscador + chips de filtro */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            className={statusFilter === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          >
            Pendientes
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
            className={statusFilter === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Aprobados
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('rejected')}
            className={statusFilter === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Rechazados
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agricultor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.farmer?.name || product.farmerId}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.farmer?.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock} {product.unit}s</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${product.status === 'approved' ? 'bg-green-500' : product.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                        {product.status === 'approved' ? 'Aprobado' : product.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                      </Badge>
                    </td>

                    {/* solo botón Ver */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setShowProductDetails(product)}
                        className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:shadow-sm"
                        title="Ver"
                      >
                        <Eye className="h-5 w-5 text-gray-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );


  const renderVetShops = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Gestión de Agro Veterinarias 🏪</h2>
        <Button
          onClick={() => setShowAddVetShop(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Nuevo
        </Button>
      </div>

      {/* Buscador + Tabs */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar agro veterinarias..."
            value={vetSearch}
            onChange={(e) => setVetSearch(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={vetTab === 'all' ? 'default' : 'outline'}
            onClick={() => setVetTab('all')}
            className={vetTab === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          >
            Todas
          </Button>
          <Button
            variant={vetTab === 'active' ? 'default' : 'outline'}
            onClick={() => setVetTab('active')}
            className={vetTab === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Activas
          </Button>
          <Button
            variant={vetTab === 'inactive' ? 'default' : 'outline'}
            onClick={() => setVetTab('inactive')}
            className={vetTab === 'inactive' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Inactivas
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredVetShopsTable.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No hay agro veterinarias para mostrar.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVetShopsTable.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={shop.image || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'}
                            alt={shop.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                            <div className="text-sm text-gray-500">{shop.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shop.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shop.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shop.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={shop.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                          {shop.active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setViewVetShop(shop)} title="Ver">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditVetShop(shop)} title="Editar">
                            <SquareEdit className="h-4 w-4" />
                          </Button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

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
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  AgroGlobal
                </h1>
                <p className="text-sm text-black-500">Panel Administrativo 🎉</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Crown className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="absolute top-20 right-6 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">Administrador</p>
              <p className="text-sm text-gray-500">admin@agroglobal.com</p>
            </div>
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
  {/* Sidebar fijo */}
 <aside
  className={`w-60 flex flex-col justify-between fixed left-0 top-[84px] h-[calc(100vh-84px)] transition-colors duration-300 z-40 ${
    darkSidebar
      ? 'bg-[#0f172a] text-white shadow-[inset_-4px_0_8px_rgba(0,0,0,0.2)]'
      : 'bg-white text-black shadow-[4px_0_8px_rgba(0,0,0,0.05)]'
  }`}
>

    {/* Navegación */}
    <div className="p-6 flex-1">
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={`w-full justify-start transition-colors ${
              activeSection === item.id
                ? darkSidebar
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : darkSidebar
                  ? 'hover:bg-[#1e293b] hover:text-white'
                  : 'hover:bg-purple-50'
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Button>
        ))}
      </nav>
    </div>

    {/* Footer: modo claro/oscuro */}
    <div
      className={`p-4 border-t ${
        darkSidebar ? 'border-gray-700' : 'border-gray-200'
      } flex items-center justify-between`}
    >
      <span className={`text-sm ${darkSidebar ? 'text-gray-300' : 'text-gray-600'}`}>
        {darkSidebar ? 'Modo Claro' : 'Modo Oscuro'}
      </span>
      <button
        onClick={() => setDarkSidebar(!darkSidebar)}
        className="focus:outline-none hover:text-yellow-400 transition-colors"
        title="Cambiar modo"
      >
        {darkSidebar ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-500" />
        )}
      </button>
    </div>
  </aside>

  {/* Contenido principal */}
  <main className="flex-1 ml-60 p-8 overflow-y-auto">
    {activeSection === 'dashboard' && renderDashboard()}
    {activeSection === 'users' && renderUsers()}
    {activeSection === 'products' && renderProducts()}
    {activeSection === 'vetshops' && renderVetShops()}
  </main>
</div>

      {/* Modales */}
      {/* Modal de detalles de usuario */}
      <AnimatePresence>
        {showUserDetails && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowUserDetails(null); setIsEditingUser(false); }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditingUser ? 'Editar Usuario' : 'Detalles del Usuario'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => { setShowUserDetails(null); setIsEditingUser(false); }}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={editForm.name}
                        readOnly={!isEditingUser}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Apellido</Label>
                      <Input
                        value={editForm.lastName}
                        readOnly={!isEditingUser}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editForm.email}
                        readOnly={!isEditingUser}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        value={editForm.phone}
                        readOnly={!isEditingUser}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Ubicación</Label>
                      <Input
                        value={editForm.location}
                        readOnly={!isEditingUser}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Residencia</Label>
                      <Input
                        value={editForm.residence}
                        readOnly={!isEditingUser}
                        onChange={(e) => setEditForm({ ...editForm, residence: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Activar / Desactivar solo en modo edición */}
                  {isEditingUser && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Estado</Label>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant={showUserDetails.status === 'active' ? 'default' : 'outline'}
                            className={showUserDetails.status === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                            onClick={async () => {
                              await handleActivateUser(showUserDetails.id);
                              // refrescamos showUserDetails para reflejar el estado
                              const refreshed = users.find(u => u.id === showUserDetails.id);
                              if (refreshed) setShowUserDetails(refreshed);
                            }}
                          >
                            <UserCheck className="mr-2 h-4 w-4" /> Activar
                          </Button>
                          <Button
                            variant={showUserDetails.status === 'inactive' ? 'default' : 'outline'}
                            className={showUserDetails.status === 'active' ? 'bg-red-600 hover:bg-red-700' : ''}
                            onClick={async () => {
                              await handleDeactivateUser(showUserDetails.id);
                              const refreshed = users.find(u => u.id === showUserDetails.id);
                              if (refreshed) setShowUserDetails(refreshed);
                            }}
                          >
                            <UserX className="mr-2 h-4 w-4" /> Desactivar
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Permisos</Label>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{showUserDetails.role}</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {isEditingUser ? (
                      <>
                        <Button className="flex-1" onClick={handleSaveUser}>
                          <Save className="h-4 w-4 mr-2" /> Guardar Cambios
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => { setIsEditingUser(false); }}>
                          Cancelar
                        </Button>
                        <Button
                          variant="outline"
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                          onClick={() => setShowChangePassword(showUserDetails)}
                        >
                          <Key className="mr-2 h-5 w-5" />
                          Cambiar Contraseña
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setIsEditingUser(true)}>
                        <Edit3 className="h-4 w-4 mr-2" /> Editar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showProductDetails && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProductDetails(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={showProductDetails.image}
                  alt={showProductDetails.name}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={() => setShowProductDetails(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{showProductDetails.name}</h2>
                <p className="text-gray-600 mb-6">{showProductDetails.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-8">
                  <p><strong>Agricultor:</strong> {showProductDetails.farmer?.name}</p>
                  <p><strong>Ubicación:</strong> {showProductDetails.farmer?.location}</p>
                  <p><strong>Precio:</strong> ₡{showProductDetails.price.toLocaleString()}</p>
                  <p><strong>Cantidad:</strong> {showProductDetails.stock} {showProductDetails.unit}s</p>
                  <p><strong>Unidad:</strong> {showProductDetails.unit}</p>
                  <p><strong>Fecha:</strong> {new Date(showProductDetails.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      handleApproveProduct(showProductDetails.id);
                      setShowProductDetails(null);
                    }}
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Aprobar Producto
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 hover:bg-red-50 text-red-700"
                    onClick={() => {
                      handleRejectProduct(showProductDetails.id);
                      setShowProductDetails(null);
                    }}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Rechazar Producto
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Modal de cambio de contraseña */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowChangePassword(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Cambiar Contraseña</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChangePassword(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Usuario</Label>
                    <p className="text-gray-600">
                      {showChangePassword.name} {showChangePassword.lastName}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ingresa la nueva contraseña"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleChangePassword}
                      disabled={!newPassword}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowChangePassword(null)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para agregar agro veterinaria */}
      <AnimatePresence>
        {showAddVetShop && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAddVetShop(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Agregar Nueva Agro Veterinaria</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddVetShop(false)}><X className="h-5 w-5" /></Button>
                </div>

                <form onSubmit={handleAddVetShop} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Nombre del Local</Label>
                      <Input
                        placeholder="Ingresa el nombre"
                        value={vetShopForm.name}
                        onChange={(e) => setVetShopForm({ ...vetShopForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Ingresa el email"
                        value={vetShopForm.email}
                        onChange={(e) => setVetShopForm({ ...vetShopForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        placeholder="Ingresa el teléfono"
                        value={vetShopForm.phone}
                        onChange={(e) => setVetShopForm({ ...vetShopForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Localización</Label>
                      <Input
                        placeholder="Ingresa la localización"
                        value={vetShopForm.location}
                        onChange={(e) => setVetShopForm({ ...vetShopForm, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Dirección Exacta</Label>
                    <Textarea
                      placeholder="Ingresa la dirección exacta"
                      value={vetShopForm.address}
                      onChange={(e) => setVetShopForm({ ...vetShopForm, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">URL de Imagen</Label>
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://ejemplo.com/logo.jpg"
                      value={vetShopForm.image}
                      onChange={(e) => setVetShopForm({ ...vetShopForm, image: e.target.value })}
                      className="border-gray-200"
                    />
                  </div>


                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
                      <Save className="h-5 w-5 mr-2" />
                      Guardar Agro Veterinaria
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddVetShop(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewVetShop && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setViewVetShop(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Detalles de Agro Veterinaria</h2>
                  <Button variant="ghost" size="sm" onClick={() => setViewVetShop(null)}><X className="h-5 w-5" /></Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <img src={viewVetShop.image || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'}
                    className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewVetShop.name}</h3>
                    <p className="text-gray-600">{viewVetShop.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label>Nombre</Label><Input value={viewVetShop.name} readOnly className="bg-gray-50" /></div>
                  <div><Label>Email</Label><Input value={viewVetShop.email} readOnly className="bg-gray-50" /></div>
                  <div><Label>Teléfono</Label><Input value={viewVetShop.phone} readOnly className="bg-gray-50" /></div>
                  <div><Label>Ubicación</Label><Input value={viewVetShop.location} readOnly className="bg-gray-50" /></div>
                </div>

                <div className="mt-6">
                  <Label>Dirección Exacta</Label>
                  <Textarea value={viewVetShop.address || ''} readOnly className="bg-gray-50" />
                </div>

                <div className="mt-6">
                  <Label>Estado</Label>
                  <div className="mt-2">
                    <Badge className={viewVetShop.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                      {viewVetShop.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button variant="outline" onClick={() => setViewVetShop(null)}>Cerrar</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editVetShop && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEditVetShop(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Detalles de Agro Veterinaria</h2>
                  <Button variant="ghost" size="sm" onClick={() => setEditVetShop(null)}><X className="h-5 w-5" /></Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nombre</Label>
                    <Input value={editVetForm.name} onChange={(e) => setEditVetForm({ ...editVetForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={editVetForm.email} onChange={(e) => setEditVetForm({ ...editVetForm, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={editVetForm.phone} onChange={(e) => setEditVetForm({ ...editVetForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Ubicación</Label>
                    <Input value={editVetForm.location} onChange={(e) => setEditVetForm({ ...editVetForm, location: e.target.value })} />
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Dirección Exacta</Label>
                  <Textarea value={editVetForm.address} onChange={(e) => setEditVetForm({ ...editVetForm, address: e.target.value })} />
                </div>

                <div className="mt-6">
                  <Label>Estado</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={editVetShop.active ? 'default' : 'outline'}
                      className={editVetShop.active ? 'bg-green-600 hover:bg-green-700' : ''}
                      onClick={async () => {
                        if (!editVetShop.active) {
                          await handleToggleVetShop(editVetShop.id);
                          setEditVetShop({ ...editVetShop, active: true });
                        }
                      }}
                    >
                      <UserCheck className="h-4 w-4 mr-2" /> Activar
                    </Button>
                    <Button
                      variant={!editVetShop.active ? 'default' : 'outline'}
                      className={!editVetShop.active ? 'bg-red-600 hover:bg-red-700' : ''}
                      onClick={async () => {
                        if (editVetShop.active) {
                          await handleToggleVetShop(editVetShop.id);
                          setEditVetShop({ ...editVetShop, active: false });
                        }
                      }}
                    >
                      <UserX className="h-4 w-4 mr-2" /> Desactivar
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                    onClick={async () => {
                      try {
                        // si tu servicio se llama distinto, cambia esta línea:
                        await VetShopService.updateVetShop(editVetShop.id, {
                          name: editVetForm.name,
                          email: editVetForm.email,
                          phone: editVetForm.phone,
                          location: editVetForm.location,
                          address: editVetForm.address,
                          image: editVetForm.image || undefined,
                        });
                        toast.success('Agro veterinaria actualizada');
                        setEditVetShop(null);
                        await loadVetShops();
                      } catch (e: any) {
                        toast.error(e?.message || 'No se pudo actualizar');
                      }
                    }}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setEditVetShop(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}