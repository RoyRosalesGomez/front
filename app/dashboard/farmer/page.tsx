'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tractor, 
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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  farmer: string;
  location: string;
  description: string;
  unit: string;
  stock: number;
  rating: number;
  active: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface VetShop {
  id: number;
  name: string;
  image: string;
  location: string;
  phone: string;
  email: string;
  address: string;
}

interface Order {
  id: number;
  productImage: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  status: 'pendiente' | 'proceso' | 'entregado';
  date: string;
}

interface BitacoraEntry {
  id: number;
  tipoActividad: string;
  tipoCultivo: string;
  fechaInicio: string;
  fechaFin: string;
  detalle: string;
  lote: string;
  observaciones: string;
  cantidad: string;
}

interface Cultivo {
  id: number;
  name: string;
  image: string;
  variedad: string;
  comentario: string;
  active: boolean;
}

interface Propiedad {
  id: number;
  nombre: string;
  localizacion: string;
  tamano: string;
  comentario: string;
  active: boolean;
}

export default function FarmerDashboard() {
  const [activeSection, setActiveSection] = useState('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedVetShop, setSelectedVetShop] = useState<VetShop | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState<Product | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [showAddBitacora, setShowAddBitacora] = useState(false);
  const [showEditBitacora, setShowEditBitacora] = useState<BitacoraEntry | null>(null);
  const [showAddCultivo, setShowAddCultivo] = useState(false);
  const [showEditCultivo, setShowEditCultivo] = useState<Cultivo | null>(null);
  const [showAddPropiedad, setShowAddPropiedad] = useState(false);
  const [showEditPropiedad, setShowEditPropiedad] = useState<Propiedad | null>(null);

  // Productos del agricultor
  const [myProducts, setMyProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Chayotes Frescos',
      price: 1000,
      image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      category: 'verduras',
      farmer: 'Mi Finca',
      location: 'Cartago',
      description: 'Chayotes frescos cultivados orgánicamente.',
      unit: 'unidad',
      stock: 50,
      rating: 4.8,
      active: true
    },
    {
      id: 2,
      name: 'Maíz Amarillo',
      price: 2500,
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
      category: 'granos',
      farmer: 'Mi Finca',
      location: 'Cartago',
      description: 'Maíz amarillo de grano grande.',
      unit: 'kg',
      stock: 200,
      rating: 4.6,
      active: false
    }
  ]);

  // Productos del marketplace
  const products: Product[] = [
    {
      id: 3,
      name: 'Aguacates Hass',
      price: 1500,
      image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg',
      category: 'frutas',
      farmer: 'María González',
      location: 'Alajuela',
      description: 'Aguacates Hass de primera calidad.',
      unit: 'unidad',
      stock: 30,
      rating: 4.9,
      active: true
    },
    {
      id: 4,
      name: 'Plátanos Maduros',
      price: 800,
      image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
      category: 'frutas',
      farmer: 'Carlos Rodríguez',
      location: 'Limón',
      description: 'Plátanos maduros dulces y naturales.',
      unit: 'unidad',
      stock: 100,
      rating: 4.7,
      active: true
    }
  ];

  // Agro veterinarias
  const vetShops: VetShop[] = [
    {
      id: 1,
      name: 'AgroVet Central',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
      location: 'San José Centro',
      phone: '+506 2234-5678',
      email: 'info@agrovetcentral.com',
      address: 'Avenida Central, Calle 5, San José'
    },
    {
      id: 2,
      name: 'Veterinaria El Campo',
      image: 'https://images.pexels.com/photos/6235234/pexels-photo-6235234.jpeg',
      location: 'Cartago',
      phone: '+506 2591-3456',
      email: 'contacto@elcampo.cr',
      address: 'Centro de Cartago, 200m sur del parque'
    }
  ];

  // Órdenes/Pedidos
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      productImage: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      productName: 'Chayotes Frescos',
      customerName: 'Ana Jiménez',
      customerPhone: '+506 8765-4321',
      quantity: 5,
      status: 'pendiente',
      date: '2025-01-15'
    },
    {
      id: 2,
      productImage: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
      productName: 'Maíz Amarillo',
      customerName: 'Luis Morales',
      customerPhone: '+506 7654-3210',
      quantity: 2,
      status: 'proceso',
      date: '2025-01-14'
    }
  ]);

  // Bitácora
  const [bitacoraEntries, setBitacoraEntries] = useState<BitacoraEntry[]>([
    {
      id: 1,
      tipoActividad: 'Siembra',
      tipoCultivo: 'Chayote',
      fechaInicio: '2025-01-10',
      fechaFin: '2025-01-12',
      detalle: 'Siembra de chayotes en lote norte',
      lote: 'Lote A-1',
      observaciones: 'Condiciones climáticas favorables',
      cantidad: '2 hectáreas'
    },
    {
      id: 2,
      tipoActividad: 'Fertilización',
      tipoCultivo: 'Maíz',
      fechaInicio: '2025-01-08',
      fechaFin: '2025-01-08',
      detalle: 'Aplicación de fertilizante orgánico',
      lote: 'Lote B-2',
      observaciones: 'Aplicado en horas de la mañana',
      cantidad: '3 hectáreas'
    }
  ]);

  // Cultivos
  const [cultivos, setCultivos] = useState<Cultivo[]>([
    {
      id: 1,
      name: 'Chayote',
      image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      variedad: 'Chayote Verde',
      comentario: 'Cultivo principal de la finca',
      active: true
    },
    {
      id: 2,
      name: 'Maíz',
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
      variedad: 'Maíz Amarillo Criollo',
      comentario: 'Variedad resistente a plagas',
      active: true
    }
  ]);

  // Propiedades
  const [propiedades, setPropiedades] = useState<Propiedad[]>([
    {
      id: 1,
      nombre: 'Finca El Progreso',
      localizacion: 'Cartago, Paraíso',
      tamano: '5 hectáreas',
      comentario: 'Finca principal con cultivos diversos',
      active: true
    },
    {
      id: 2,
      nombre: 'Lote San Miguel',
      localizacion: 'Cartago, Oreamuno',
      tamano: '2 hectáreas',
      comentario: 'Lote secundario para rotación',
      active: false
    }
  ]);

  const sidebarItems = [
    { id: 'marketplace', name: 'Marketplace', icon: <ShoppingCart className="h-5 w-5" /> },
    { id: 'ofertas', name: 'Ofertas', icon: <Package className="h-5 w-5" /> },
    { id: 'tienda', name: 'Tienda', icon: <Store className="h-5 w-5" /> },
    { id: 'ordenes', name: 'Órdenes', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'bitacora', name: 'Bitácora', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'propiedades', name: 'Propiedades', icon: <Home className="h-5 w-5" /> },
    { id: 'cultivos', name: 'Cultivos', icon: <Sprout className="h-5 w-5" /> }
  ];

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const updateOrderStatus = (orderId: number, newStatus: 'pendiente' | 'proceso' | 'entregado') => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ).filter(order => order.status !== 'entregado')
    );
    
    if (newStatus === 'entregado') {
      setNotifications(prev => Math.max(0, prev - 1));
    }
  };

  const toggleProductActive = (productId: number) => {
    setMyProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, active: !product.active } : product
      )
    );
  };

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Marketplace 🛒</h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 border-0 bg-white overflow-hidden cursor-pointer transform hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-gray-700 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Por {product.farmer} • {product.location}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ₡{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  onClick={() => setSelectedProduct(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Comprar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOfertas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mis Ofertas 📦</h2>
        <Button 
          onClick={() => setShowAddProduct(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nuevo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`${product.active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">Precio: ₡{product.price.toLocaleString()}/{product.unit}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock} {product.unit}s</p>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProductActive(product.id)}
                    className={product.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {product.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTienda = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Agro Veterinarias 🏪</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vetShops.map((shop, index) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={shop.image} 
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{shop.name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {shop.location}
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  onClick={() => setSelectedVetShop(shop)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Más
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOrdenes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Órdenes de Pedidos 📋</h2>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          {notifications > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {notifications}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={order.productImage} 
                    alt={order.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{order.productName}</h3>
                    <p className="text-sm text-gray-600">Cliente: {order.customerName}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.customerPhone}
                    </p>
                    <p className="text-sm text-gray-600">Cantidad: {order.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${
                      order.status === 'pendiente' ? 'bg-yellow-500' :
                      order.status === 'proceso' ? 'bg-blue-500' : 'bg-green-500'
                    } text-white`}>
                      {order.status === 'pendiente' ? 'Pendiente' :
                       order.status === 'proceso' ? 'En Proceso' : 'Entregado'}
                    </Badge>
                    <div className="flex space-x-2">
                      {order.status === 'pendiente' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'proceso')}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === 'proceso' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'entregado')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBitacora = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bitácora de Actividades 📖</h2>
        <Button 
          onClick={() => setShowAddBitacora(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Bitácora
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Actividad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Cultivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bitacoraEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.tipoActividad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.tipoCultivo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.fechaInicio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.fechaFin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditBitacora(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setBitacoraEntries(prev => prev.filter(e => e.id !== entry.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCultivos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Cultivos 🌱</h2>
        <Button 
          onClick={() => setShowAddCultivo(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nuevo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cultivos.map((cultivo, index) => (
          <motion.div
            key={cultivo.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={cultivo.image} 
                  alt={cultivo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`${cultivo.active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {cultivo.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cultivo.name}</h3>
                <p className="text-sm text-gray-600 mb-4">Variedad: {cultivo.variedad}</p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditCultivo(cultivo)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCultivos(prev => 
                      prev.map(c => c.id === cultivo.id ? { ...c, active: !c.active } : c)
                    )}
                    className={cultivo.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {cultivo.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPropiedades = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Propiedades 🏡</h2>
        <Button 
          onClick={() => setShowAddPropiedad(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nuevo
        </Button>
      </div>

      <div className="space-y-4">
        {propiedades.map((propiedad, index) => (
          <motion.div
            key={propiedad.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{propiedad.nombre}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {propiedad.localizacion}
                      </p>
                      <p className="text-sm text-gray-600">Tamaño: {propiedad.tamano}</p>
                      <p className="text-sm text-gray-600">{propiedad.comentario}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${propiedad.active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {propiedad.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditPropiedad(propiedad)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPropiedades(prev => 
                        prev.map(p => p.id === propiedad.id ? { ...p, active: !p.active } : p)
                      )}
                      className={propiedad.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {propiedad.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'marketplace': return renderMarketplace();
      case 'ofertas': return renderOfertas();
      case 'tienda': return renderTienda();
      case 'ordenes': return renderOrdenes();
      case 'bitacora': return renderBitacora();
      case 'cultivos': return renderCultivos();
      case 'propiedades': return renderPropiedades();
      default: return renderMarketplace();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
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
                <p className="text-sm text-gray-500">Dashboard Agricultor</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AG</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </div>
      </header>

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
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'hover:bg-green-50 text-gray-700'
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

      {/* Modals y otros componentes... */}
      {/* (Aquí irían todos los modales para agregar/editar productos, bitácora, etc.) */}
    </div>
  );
}