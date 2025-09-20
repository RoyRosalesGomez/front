'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Search,
  Filter,
  Plus,
  Minus,
  X,
  User,
  LogOut,
  Bell,
  Heart,
  Star,
  Leaf,
  Package,
  Trash2,
  ArrowLeft,
  Edit,
  Eye,
  Save,
  ShoppingCart,
  Store,
  ClipboardList,
  BookOpen,
  Home,
  Sprout,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Camera,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Users,
  BarChart3,
  Shield,
  Key,
  Check,
  AlertTriangle,
  UserCheck,
  UserX,
  Building2,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  residence: string;
  status: 'active' | 'inactive';
  role: 'client' | 'farmer' | 'admin';
  permissions: 'view' | 'edit' | 'admin';
  createdAt: string;
}

interface Product {
  id: number;
  farmerName: string;
  productName: string;
  location: string;
  price: number;
  quantity: number;
  unit: string;
  status: 'pending' | 'approved' | 'rejected';
  image: string;
  description: string;
  createdAt: string;
}

interface VetShop {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  logo: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVetShop, setSelectedVetShop] = useState<VetShop | null>(null);
  const [showAddVetShop, setShowAddVetShop] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState<User | null>(null);
  const [userFilter, setUserFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [vetShopFilter, setVetShopFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo - Usuarios
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Ana',
      lastName: 'Jiménez',
      email: 'ana.jimenez@email.com',
      phone: '+506 8765-4321',
      location: 'San José',
      residence: 'Escazú, San José',
      status: 'inactive',
      role: 'client',
      permissions: 'view',
      createdAt: '2025-01-10'
    },
    {
      id: 2,
      name: 'Carlos',
      lastName: 'Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+506 7654-3210',
      location: 'Cartago',
      residence: 'Paraíso, Cartago',
      status: 'active',
      role: 'farmer',
      permissions: 'edit',
      createdAt: '2025-01-08'
    },
    {
      id: 3,
      name: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@email.com',
      phone: '+506 6543-2109',
      location: 'Alajuela',
      residence: 'Centro, Alajuela',
      status: 'inactive',
      role: 'client',
      permissions: 'view',
      createdAt: '2025-01-12'
    }
  ]);

  // Datos de ejemplo - Productos
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      farmerName: 'Carlos Rodríguez',
      productName: 'Chayotes Frescos',
      location: 'Cartago',
      price: 1000,
      quantity: 50,
      unit: 'unidad',
      status: 'pending',
      image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      description: 'Chayotes frescos cultivados orgánicamente',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      farmerName: 'María González',
      productName: 'Aguacates Hass',
      location: 'Alajuela',
      price: 1500,
      quantity: 30,
      unit: 'unidad',
      status: 'approved',
      image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg',
      description: 'Aguacates Hass de primera calidad',
      createdAt: '2025-01-14'
    },
    {
      id: 3,
      farmerName: 'Luis Morales',
      productName: 'Tomates Cherry',
      location: 'San José',
      price: 1200,
      quantity: 25,
      unit: 'bandeja',
      status: 'rejected',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
      description: 'Tomates cherry dulces y jugosos',
      createdAt: '2025-01-13'
    }
  ]);

  // Datos de ejemplo - Agro Veterinarias
  const [vetShops, setVetShops] = useState<VetShop[]>([
    {
      id: 1,
      name: 'AgroVet Central',
      email: 'info@agrovetcentral.com',
      phone: '+506 2234-5678',
      location: 'San José Centro',
      address: 'Avenida Central, Calle 5, San José',
      logo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
      status: 'active',
      createdAt: '2025-01-01'
    },
    {
      id: 2,
      name: 'Veterinaria El Campo',
      email: 'contacto@elcampo.cr',
      phone: '+506 2591-3456',
      location: 'Cartago',
      address: 'Centro de Cartago, 200m sur del parque',
      logo: 'https://images.pexels.com/photos/6235234/pexels-photo-6235234.jpeg',
      status: 'inactive',
      createdAt: '2025-01-05'
    }
  ]);

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'users', name: 'Usuarios', icon: <Users className="h-5 w-5" /> },
    { id: 'products', name: 'Productos', icon: <Package className="h-5 w-5" /> },
    { id: 'vetshops', name: 'Agro Veterinarias', icon: <Building2 className="h-5 w-5" /> }
  ];

  const updateUserStatus = (userId: number, newStatus: 'active' | 'inactive') => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const updateProductStatus = (productId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, status: newStatus } : product
      )
    );
  };

  const updateVetShopStatus = (vetShopId: number, newStatus: 'active' | 'inactive') => {
    setVetShops(prevVetShops =>
      prevVetShops.map(vetShop =>
        vetShop.id === vetShopId ? { ...vetShop, status: newStatus } : vetShop
      )
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || user.status === userFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredProducts = products.filter(product => {
    const matchesFilter = productFilter === 'all' || product.status === productFilter;
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredVetShops = vetShops.filter(vetShop => {
    const matchesFilter = vetShopFilter === 'all' || vetShop.status === vetShopFilter;
    const matchesSearch = vetShop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vetShop.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Administrativo 👑</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Usuarios</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Productos</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Agro Veterinarias</p>
                  <p className="text-3xl font-bold">{vetShops.length}</p>
                </div>
                <Building2 className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pendientes</p>
                  <p className="text-3xl font-bold">{products.filter(p => p.status === 'pending').length}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-500 p-2 rounded-full">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
                <p className="text-xs text-gray-500">María González se registró como cliente</p>
              </div>
              <span className="text-xs text-gray-400">Hace 2 horas</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-500 p-2 rounded-full">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Producto aprobado</p>
                <p className="text-xs text-gray-500">Aguacates Hass de María González</p>
              </div>
              <span className="text-xs text-gray-400">Hace 1 día</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios 👥</h2>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={userFilter === 'all' ? "default" : "outline"}
            onClick={() => setUserFilter('all')}
            className={userFilter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          >
            Todos
          </Button>
          <Button
            variant={userFilter === 'active' ? "default" : "outline"}
            onClick={() => setUserFilter('active')}
            className={userFilter === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Activos
          </Button>
          <Button
            variant={userFilter === 'inactive' ? "default" : "outline"}
            onClick={() => setUserFilter('inactive')}
            className={userFilter === 'inactive' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Inactivos
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.name.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name} {user.lastName}
                          </div>
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
                      <Badge className={`${
                        user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${
                        user.role === 'admin' ? 'bg-purple-500' :
                        user.role === 'farmer' ? 'bg-green-500' : 'bg-blue-500'
                      } text-white`}>
                        {user.role === 'admin' ? 'Admin' :
                         user.role === 'farmer' ? 'Agricultor' : 'Cliente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={productFilter === 'all' ? "default" : "outline"}
            onClick={() => setProductFilter('all')}
            className={productFilter === 'all' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Todos
          </Button>
          <Button
            variant={productFilter === 'pending' ? "default" : "outline"}
            onClick={() => setProductFilter('pending')}
            className={productFilter === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          >
            Pendientes
          </Button>
          <Button
            variant={productFilter === 'approved' ? "default" : "outline"}
            onClick={() => setProductFilter('approved')}
            className={productFilter === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Aprobados
          </Button>
          <Button
            variant={productFilter === 'rejected' ? "default" : "outline"}
            onClick={() => setProductFilter('rejected')}
            className={productFilter === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Rechazados
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agricultor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.farmerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={product.image} 
                          alt={product.productName}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₡{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity} {product.unit}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${
                        product.status === 'approved' ? 'bg-green-500' :
                        product.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {product.status === 'approved' ? 'Aprobado' :
                         product.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Agro Veterinarias 🏪</h2>
        <Button 
          onClick={() => setShowAddVetShop(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nuevo
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar agro veterinarias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={vetShopFilter === 'all' ? "default" : "outline"}
            onClick={() => setVetShopFilter('all')}
            className={vetShopFilter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          >
            Todas
          </Button>
          <Button
            variant={vetShopFilter === 'active' ? "default" : "outline"}
            onClick={() => setVetShopFilter('active')}
            className={vetShopFilter === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Activas
          </Button>
          <Button
            variant={vetShopFilter === 'inactive' ? "default" : "outline"}
            onClick={() => setVetShopFilter('inactive')}
            className={vetShopFilter === 'inactive' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Inactivas
          </Button>
        </div>
      </div>

      {/* VetShops Table */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agro Veterinaria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVetShops.map((vetShop) => (
                  <tr key={vetShop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={vetShop.logo} 
                          alt={vetShop.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vetShop.name}
                          </div>
                          <div className="text-sm text-gray-500">{vetShop.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vetShop.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vetShop.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${
                        vetShop.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}>
                        {vetShop.status === 'active' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVetShop(vetShop)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVetShop(vetShop)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'users': return renderUsers();
      case 'products': return renderProducts();
      case 'vetshops': return renderVetShops();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
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
                <p className="text-sm text-gray-500">Dashboard Administrador</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AD</AvatarFallback>
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
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-20">
          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>

      {/* User Details/Edit Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Detalles del Usuario
                  </h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Nombre</Label>
                      <Input
                        value={selectedUser.name}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Apellido</Label>
                      <Input
                        value={selectedUser.lastName}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Email</Label>
                      <Input
                        value={selectedUser.email}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Teléfono</Label>
                      <Input
                        value={selectedUser.phone}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Ubicación</Label>
                      <Input
                        value={selectedUser.location}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Residencia</Label>
                      <Input
                        value={selectedUser.residence}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Estado</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={selectedUser.status === 'active' ? "default" : "outline"}
                          onClick={() => updateUserStatus(selectedUser.id, 'active')}
                          className={selectedUser.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activar
                        </Button>
                        <Button
                          variant={selectedUser.status === 'inactive' ? "default" : "outline"}
                          onClick={() => updateUserStatus(selectedUser.id, 'inactive')}
                          className={selectedUser.status === 'inactive' ? 'bg-red-500 hover:bg-red-600' : ''}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Desactivar
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Permisos</Label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Ver</Button>
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Admin</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      Guardar Cambios
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedUser(null)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-orange-200 hover:bg-orange-50 text-orange-700"
                      onClick={() => setShowChangePassword(selectedUser)}
                    >
                      <Key className="mr-2 h-5 w-5" />
                      Cambiar Contraseña
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.productName}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedProduct.productName}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <p><strong>Agricultor:</strong> {selectedProduct.farmerName}</p>
                    <p><strong>Ubicación:</strong> {selectedProduct.location}</p>
                    <p><strong>Precio:</strong> ₡{selectedProduct.price.toLocaleString()}</p>
                    <p><strong>Cantidad:</strong> {selectedProduct.quantity} {selectedProduct.unit}s</p>
                    <p><strong>Unidad:</strong> {selectedProduct.unit}</p>
                    <p><strong>Fecha:</strong> {selectedProduct.createdAt}</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    onClick={() => updateProductStatus(selectedProduct.id, 'approved')}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Aprobar Producto
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-red-200 hover:bg-red-50 text-red-700"
                    onClick={() => updateProductStatus(selectedProduct.id, 'rejected')}
                  >
                    <X className="mr-2 h-5 w-5" />
                    Rechazar Producto
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VetShop Details/Edit Modal */}
      <AnimatePresence>
        {selectedVetShop && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVetShop(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Detalles de Agro Veterinaria
                  </h2>
                  <button
                    onClick={() => setSelectedVetShop(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={selectedVetShop.logo} 
                      alt={selectedVetShop.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedVetShop.name}</h3>
                      <p className="text-gray-600">{selectedVetShop.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Nombre</Label>
                      <Input
                        value={selectedVetShop.name}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Email</Label>
                      <Input
                        value={selectedVetShop.email}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Teléfono</Label>
                      <Input
                        value={selectedVetShop.phone}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Ubicación</Label>
                      <Input
                        value={selectedVetShop.location}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Dirección Exacta</Label>
                    <Textarea
                      value={selectedVetShop.address}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Estado</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={selectedVetShop.status === 'active' ? "default" : "outline"}
                        onClick={() => updateVetShopStatus(selectedVetShop.id, 'active')}
                        className={selectedVetShop.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activar
                      </Button>
                      <Button
                        variant={selectedVetShop.status === 'inactive' ? "default" : "outline"}
                        onClick={() => updateVetShopStatus(selectedVetShop.id, 'inactive')}
                        className={selectedVetShop.status === 'inactive' ? 'bg-red-500 hover:bg-red-600' : ''}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Desactivar
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      Guardar Cambios
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedVetShop(null)}
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

      {/* Add VetShop Modal */}
      <AnimatePresence>
        {showAddVetShop && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddVetShop(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Agregar Nueva Agro Veterinaria
                  </h2>
                  <button
                    onClick={() => setShowAddVetShop(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Nombre del Local</Label>
                      <Input
                        placeholder="Ingresa el nombre"
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Email</Label>
                      <Input
                        type="email"
                        placeholder="Ingresa el email"
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Teléfono</Label>
                      <Input
                        placeholder="Ingresa el teléfono"
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Localización</Label>
                      <Input
                        placeholder="Ingresa la localización"
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Dirección Exacta</Label>
                    <Textarea
                      placeholder="Ingresa la dirección exacta"
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Logo de la Agro Veterinaria</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Haz clic para subir el logo</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                      onClick={() => {
                        // Lógica para agregar nueva agro veterinaria
                        setShowAddVetShop(false);
                      }}
                    >
                      <Save className="mr-2 h-5 w-5" />
                      Guardar Agro Veterinaria
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddVetShop(false)}
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
    </div>
  );
}