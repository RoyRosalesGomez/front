
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Store, Package, BookOpen, Sprout, Home,
  LogOut, Bell, Plus, Search, Star, MapPin, Phone, Mail,
  Trash2, Save, X, Leaf, Edit, ToggleLeft, ToggleRight, LeafyGreen
} from 'lucide-react';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProductService } from '@/services/product.service';
import { BitacoraService } from '@/services/bitacora.service';
import { CultivoService } from '@/services/cultivo.service';
import { PropiedadService } from '@/services/propiedad.service';
import { AuthService } from '@/services/auth.service';
import { ProductCategory, ProductStatus } from '@/app/types/product';

// ==== Interfaces ====
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  category: ProductCategory;
  status: ProductStatus;
  active: boolean;
  rating: number;
  createdAt: string;
}
interface Order {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  notes?: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  createdAt: string;
}
interface VetShop {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  image?: string;
  active: boolean;
}
interface BitacoraEntry {
  id: number;
  tipoActividad: string;
  tipoCultivo: string;
  fechaInicio: string;
  fechaFin: string;
  detalle: string;
  lote: string;
  observaciones?: string;
  cantidad: string;
  createdAt: string;
}
interface Cultivo {
  id: number;
  name: string;
  variedad: string;
  comentario?: string;
  image?: string;
  active: boolean;
  createdAt: string;
}
interface Propiedad {
  id: number;
  nombre: string;
  localizacion: string;
  tamano: string;
  comentario?: string;
  active: boolean;
  createdAt: string;
}

// Helper para formatear colones como "₡1000" (sin decimales)
// Cambia useGrouping a true si quieres "₡1.000"
const formatCRC = (v: number | string) =>
  `₡${Number(v).toLocaleString('es-CR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: false,
  })}`;

export default function FarmerDashboard() {
  const [activeSection, setActiveSection] = useState('marketplace');
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const currentUser = AuthService.getCurrentUser(); // { id, email, role, ... }

  // Modales
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddBitacora, setShowAddBitacora] = useState(false);
  const [showAddCultivo, setShowAddCultivo] = useState(false);
  const [showAddPropiedad, setShowAddPropiedad] = useState(false);

  // Datos
  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vetShops, setVetShops] = useState<VetShop[]>([]);
  const [bitacoraEntries, setBitacoraEntries] = useState<BitacoraEntry[]>([]);
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);

  // NUEVO — para editar propiedad
const [showEditPropiedad, setShowEditPropiedad] = useState<Propiedad | null>(null);
const [propiedadEditForm, setPropiedadEditForm] = useState({
  nombre: '', localizacion: '', tamano: '', comentario: ''
});

  // Formularios
  const [productForm, setProductForm] = useState<{
  name: string;
  description: string;
  price: string;
  unit: string;
  stock: string;
  image: string;
  category: ProductCategory;
}>({
  name: '',
  description: '',
  price: '',
  unit: '',
  stock: '',
  image: '',
  category: 'otros',
});

  const [bitacoraForm, setBitacoraForm] = useState({
    tipoActividad: '', tipoCultivo: '', fechaInicio: '', fechaFin: '',
    detalle: '', lote: '', observaciones: '', cantidad: ''
  });
  const [cultivoForm, setCultivoForm] = useState({
    name: '', variedad: '', comentario: '', image: ''
  });
  const [propiedadForm, setPropiedadForm] = useState({
    nombre: '', localizacion: '', tamano: '', comentario: ''
  });

  // Estado de edición para bitácora (usa el MISMO modal de crear)
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);

   // === Mis Ofertas (productos) ===
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

   // === Cultivos ===
  const [editingCultivoId, setEditingCultivoId] = useState<number | null>(null);

  // ====== Carga de Bitácora ======
  const loadBitacora = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await BitacoraService.getAllEntries({ farmerId: currentUser.id });
      setBitacoraEntries(Array.isArray(data) ? data : data?.items ?? []);
    } catch (e) {
      console.error(e);
      toast.error('No se pudieron cargar las entradas de la bitácora');
    } finally {
      setLoading(false);
    }
  };

// Cargar cultivos del backend
const loadCultivos = async () => {
  setLoading(true);
  try {
    // si tu API ya filtra por el usuario autenticado, no mandes nada;
    // si no, puedes pasar { farmerId: currentUser?.id }
    const data = await CultivoService.getAllCultivos();
    setCultivos(Array.isArray(data) ? data : data?.items ?? []);
  } catch (e) {
    console.error(e);
    toast.error('No se pudieron cargar los cultivos');
  } finally {
    setLoading(false);
  }
};

const handleToggleCultivo = async (id: number, currentActive?: boolean) => {
  // optimista: refleja el cambio al instante
  setCultivos(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  try {
    await CultivoService.toggleActiveCultivo(id);
  } catch (err) {
    // revierte si falla
    setCultivos(prev => prev.map(c => c.id === id ? { ...c, active: currentActive ?? c.active } : c));
    console.error(err);
    toast.error('No se pudo cambiar el estado');
  }
};


// ===== Propiedades =====
// NUEVO
const loadPropiedades = async () => {
  if (!currentUser?.id) return;
  setLoading(true);
  try {
    const data = await PropiedadService.getAllPropiedades({ farmerId: currentUser.id });
    // normaliza active => boolean
    const normalized = (Array.isArray(data) ? data : data?.items ?? []).map((p: any) => ({
      ...p,
      active: typeof p.active === 'boolean' ? p.active : !!Number(p.active),
    }));
    setPropiedades(normalized);
  } catch (e) {
    console.error(e);
    toast.error('No se pudieron cargar las propiedades');
  } finally {
    setLoading(false);
  }
};


// Carga cuando entres a la pestaña y al montar si quieres
useEffect(() => {
  if (activeSection === 'propiedades') loadPropiedades();
}, [activeSection, currentUser?.id]);


// Después de crear, recarga (o inserta optimista)
// UPDATE — crear propiedad: añade al estado o recarga
const handleAddPropiedad = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!propiedadForm.nombre || !propiedadForm.localizacion || !propiedadForm.tamano) {
    toast.error('Por favor completa los campos requeridos');
    return;
  }
  try {
    const created = await PropiedadService.createPropiedad({
      nombre: propiedadForm.nombre,
      localizacion: propiedadForm.localizacion,
      tamano: propiedadForm.tamano,
      comentario: propiedadForm.comentario || undefined,
      farmerId: currentUser?.id ?? 1
    });

    // Normaliza y agrega optimista
    const normalized = {
      ...created,
      active: typeof created.active === 'boolean' ? created.active : !!Number(created.active),
    };
    setPropiedades(prev => [normalized, ...prev]);

    toast.success('Propiedad agregada exitosamente');
    setShowAddPropiedad(false);
    setPropiedadForm({ nombre: '', localizacion: '', tamano: '', comentario: '' });

    // Re-sync (por si el backend ajusta algo)
    await loadPropiedades();
  } catch (error) {
    console.error('Error adding propiedad:', error);
    toast.error('Error al agregar propiedad');
  }
};

// NUEVO — abrir modal de edición
const handleOpenEditPropiedad = (p: Propiedad) => {
  setShowEditPropiedad(p);
  setPropiedadEditForm({
    nombre: p.nombre || '',
    localizacion: p.localizacion || '',
    tamano: p.tamano || '',
    comentario: p.comentario || '',
  });
};

// NUEVO — guardar cambios de edición
const handleSavePropiedad = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!showEditPropiedad) return;

  try {
    await PropiedadService.updatePropiedad(showEditPropiedad.id, {
      nombre: propiedadEditForm.nombre,
      localizacion: propiedadEditForm.localizacion,
      tamano: propiedadEditForm.tamano,
      comentario: propiedadEditForm.comentario || undefined,
    });

    toast.success('Propiedad actualizada');
    setShowEditPropiedad(null);
    await loadPropiedades();
  } catch (e) {
    console.error(e);
    toast.error('No se pudo actualizar la propiedad');
  }
};

// NUEVO — activar/desactivar
const handleTogglePropiedad = async (id: number, currentActive?: boolean) => {
  // optimista
  setPropiedades(prev => prev.map(p => p.id === id ? ({ ...p, active: !p.active }) : p));
  try {
    await PropiedadService.toggleActivePropiedad(id);
  } catch (e) {
    // revertir si falla
    setPropiedades(prev => prev.map(p => p.id === id ? ({ ...p, active: currentActive ?? p.active }) : p));
    console.error(e);
    toast.error('No se pudo cambiar el estado');
  }
};

  useEffect(() => {
    if (activeSection === 'bitacora') loadBitacora();
  }, [activeSection, currentUser?.id]);

  useEffect(() => {
    loadBitacora();
  }, [currentUser?.id]);

  useEffect(() => {
  if (activeSection === 'ofertas') {
    loadMyProducts();
  }
}, [activeSection, currentUser?.id]);

useEffect(() => {
  if (activeSection === 'cultivos') loadCultivos();
}, [activeSection, currentUser?.id]);


useEffect(() => {
  if (activeSection === 'propiedades') loadPropiedades();
}, [activeSection, currentUser?.id]);


  const handleLogout = () => {
    localStorage.removeItem('agroglobal_token');
    window.location.href = '/dashboard-select';
  };

  // ===== Productos =====
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.unit || !productForm.stock) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    try {
      await ProductService.createProduct({
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      unit: productForm.unit,
      stock: parseInt(productForm.stock),
      image: productForm.image || 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      category: productForm.category,
      status: 'pending',        // <- aquí
      farmerId: currentUser?.id ?? 1,
      });

      toast.success('Producto agregado exitosamente. Pendiente de aprobación por el administrador.');
      setShowAddProduct(false);
      setProductForm({ name: '', description: '', price: '', unit: '', stock: '', image: '', category: 'otros' });
      await loadMyProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar producto');
    }
  };

  // Cargar mis productos del backend
const loadMyProducts = async () => {
  if (!currentUser?.id) return;
  setLoading(true);
  try {
    // Ajusta si tu servicio tiene otro nombre/forma
    const data = await ProductService.getProductsByFarmerId(currentUser.id);
    // o: const { items } = await ProductService.getMyProducts({ farmerId: currentUser.id });
    setMyProducts(data);
  } catch (e) {
    console.error(e);
    toast.error('No se pudieron cargar tus ofertas');
  } finally {
    setLoading(false);
  }
};

// Abrir modal "nuevo producto"
const handleOpenNewProduct = () => {
  setEditingProductId(null);
  setProductForm({
    name: '',
    description: '',
    price: '',
    unit: '',
    stock: '',
    image: '',
    category: 'otros'
  });
  setShowAddProduct(true);
};

// Abrir modal en modo edición con valores precargados
const handleOpenEditProduct = (p: Product) => {
  setEditingProductId(p.id);
  setProductForm({
    name: p.name,
    description: p.description,
    price: String(p.price ?? ''),
    unit: p.unit,
    stock: String(p.stock ?? ''),
    image: p.image ?? '',
    category: p.category
  });
  setShowAddProduct(true);
};

// Guardar (crear o actualizar)
const handleSaveProduct = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!productForm.name || !productForm.description || !productForm.price || !productForm.unit || !productForm.stock) {
    toast.error('Por favor completa todos los campos requeridos');
    return;
  }

  try {
    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      unit: productForm.unit,
      stock: parseInt(productForm.stock),
      image: productForm.image || 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      category: productForm.category,
      farmerId: currentUser?.id ?? 1, // usa el id real
      // si tu backend no pone por defecto, envía status:
      //status: 'pending' as const
    };

    if (editingProductId == null) {
      // crear
      await ProductService.createProduct(payload);
      toast.success('Producto creado. Queda pendiente de aprobación.');
    } else {
      // actualizar
      await ProductService.updateProduct(editingProductId, payload);
      toast.success('Producto actualizado.');
    }

    setShowAddProduct(false);
    setEditingProductId(null);
    await loadMyProducts();
  } catch (error) {
    console.error(error);
    toast.error('No se pudo guardar el producto');
  }
};

// Eliminar
const handleDeleteProduct = async (id: number, name?: string) => {
  const ok = window.confirm(`¿Eliminar "${name ?? 'este producto'}"?`);
  if (!ok) return;

  // 1) Estado previo para revertir si falla
 const prev = myProducts;
 // 2) Optimista: desaparece YA de la UI
  setMyProducts((p) => p.filter((item) => item.id !== id));

  try {
    await ProductService.deleteProduct(id);
    toast.success('Producto eliminado');
    //await loadMyProducts();
  } catch (error) {
    console.error(error);
    toast.error('No se pudo eliminar el producto');
    // Revertimos si el backend falló
    setMyProducts(prev);
  }
};


  // ===== Bitácora: Crear / Editar (mismo modal) =====
  const handleAddBitacora = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !bitacoraForm.tipoActividad || !bitacoraForm.tipoCultivo ||
      !bitacoraForm.fechaInicio || !bitacoraForm.fechaFin ||
      !bitacoraForm.detalle || !bitacoraForm.lote || !bitacoraForm.cantidad
    ) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      if (editingEntryId != null) {
        await BitacoraService.updateEntry(editingEntryId, {
          tipoActividad: bitacoraForm.tipoActividad,
          tipoCultivo: bitacoraForm.tipoCultivo,
          fechaInicio: bitacoraForm.fechaInicio,
          fechaFin: bitacoraForm.fechaFin,
          detalle: bitacoraForm.detalle,
          lote: bitacoraForm.lote,
          observaciones: bitacoraForm.observaciones,
          cantidad: bitacoraForm.cantidad,
        });
        toast.success('Entrada de bitácora actualizada');
      } else {
        await BitacoraService.createEntry({
          tipoActividad: bitacoraForm.tipoActividad,
          tipoCultivo: bitacoraForm.tipoCultivo,
          fechaInicio: bitacoraForm.fechaInicio,
          fechaFin: bitacoraForm.fechaFin,
          detalle: bitacoraForm.detalle,
          lote: bitacoraForm.lote,
          observaciones: bitacoraForm.observaciones,
          cantidad: bitacoraForm.cantidad,
          //farmerId: currentUser?.id ?? 1
        });
        toast.success('Entrada de bitácora agregada exitosamente');
      }

      setShowAddBitacora(false);
      setEditingEntryId(null);
      setBitacoraForm({
        tipoActividad: '', tipoCultivo: '', fechaInicio: '', fechaFin: '',
        detalle: '', lote: '', observaciones: '', cantidad: ''
      });
      await loadBitacora();
    } catch (error) {
      console.error('Error guardando entrada de bitácora:', error);
      toast.error('Ocurrió un error guardando la entrada');
    }
  };

  // Abre el modal en modo edición precargando el formulario
  const handleOpenEdit = (entry: BitacoraEntry) => {
    setBitacoraForm({
      tipoActividad: entry.tipoActividad,
      tipoCultivo: entry.tipoCultivo,
      fechaInicio: entry.fechaInicio?.slice(0, 10) ?? '',
      fechaFin: entry.fechaFin?.slice(0, 10) ?? '',
      detalle: entry.detalle,
      lote: entry.lote,
      observaciones: entry.observaciones ?? '',
      cantidad: entry.cantidad,
      
    });
    setEditingEntryId(entry.id);
    setShowAddBitacora(true);
  };

  // Elimina por id (una sola función)
  const handleDeleteBitacora = async (id: number) => {
    const ok = window.confirm('¿Eliminar esta entrada de la bitácora?');
    if (!ok) return;

    const prev = bitacoraEntries;
   setBitacoraEntries((list) => list.filter((e) => e.id !== id)); // optimista

    try {
      await BitacoraService.deleteEntry(id);
      setBitacoraEntries(prev => prev.filter(e => e.id !== id));
      toast.success('Entrada eliminada');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar la entrada');
      setBitacoraEntries(prev); // revertir
    }
  };

  // ===== Cultivos =====
  const handleAddCultivo = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!cultivoForm.name || !cultivoForm.variedad) {
    toast.error('Por favor completa los campos requeridos');
    return;
  }

  try {
    const created = await CultivoService.createCultivo({
      name: cultivoForm.name,
      variedad: cultivoForm.variedad,
      comentario: cultivoForm.comentario || undefined,
      image: cultivoForm.image || undefined,
    });

    toast.success('Cultivo agregado exitosamente');
    setShowAddCultivo(false);
    setCultivoForm({ name: '', variedad: '', comentario: '', image: '' });

    // Si el backend devuelve el objeto creado:
    if (created && created.id) {
      setCultivos(prev => [created, ...prev]);
    } else {
      // si no, recarga la lista desde el backend
      await loadCultivos();
    }
  } catch (error) {
    console.error('Error adding cultivo:', error);
    toast.error('Error al agregar cultivo');
  }
};

// Abrir modal "nuevo cultivo"
const handleOpenNewCultivo = () => {
  setEditingCultivoId(null);
  setCultivoForm({ name: '', variedad: '', comentario: '', image: '' });
  setShowAddCultivo(true);
};

// Abrir modal en modo edición con valores precargados
const handleOpenEditCultivo = (c: Cultivo) => {
  setEditingCultivoId(c.id);
  setCultivoForm({
    name: c.name ?? '',
    variedad: c.variedad ?? '',
    comentario: c.comentario ?? '',
    image: c.image ?? '',
  });
  setShowAddCultivo(true);
};

// Guardar (crear o actualizar)
const handleSaveCultivo = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!cultivoForm.name || !cultivoForm.variedad) {
    toast.error('Por favor completa los campos requeridos');
    return;
  }

  try {
    const payload = {
      name: cultivoForm.name,
      variedad: cultivoForm.variedad,
      comentario: cultivoForm.comentario || undefined,
      image: cultivoForm.image || undefined,
    };

    if (editingCultivoId == null) {
      await CultivoService.createCultivo(payload);
      toast.success('Cultivo creado');
    } else {
      await CultivoService.updateCultivo(editingCultivoId, payload);
      toast.success('Cultivo actualizado');
    }

    setShowAddCultivo(false);
    setEditingCultivoId(null);
    await loadCultivos();
  } catch (err) {
    console.error('Error guardando cultivo:', err);
    toast.error('No se pudo guardar el cultivo');
  }
};

// Eliminar
const handleDeleteCultivo = async (id: number, name?: string) => {
  const ok = window.confirm(`¿Eliminar "${name ?? 'este cultivo'}"?`);
  if (!ok) return;
  try {
    await CultivoService.deleteCultivo(id);
    toast.success('Cultivo eliminado');
    await loadCultivos();
  } catch (err) {
    console.error(err);
    toast.error('No se pudo eliminar el cultivo');
  }
};

  // ===== Sidebar / Filtros / Render secciones =====
  const sidebarItems = [
    { id: 'marketplace', name: 'Marketplace', icon: <ShoppingCart className="h-5 w-5" /> },
    { id: 'ofertas', name: 'Mis Ofertas', icon: <Package className="h-5 w-5" /> },
    { id: 'tienda', name: 'Tienda', icon: <Store className="h-5 w-5" /> },
    { id: 'ordenes', name: 'Órdenes', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'bitacora', name: 'Bitácora', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'cultivos', name: 'Cultivos', icon: <Sprout className="h-5 w-5" /> },
    { id: 'propiedades', name: 'Propiedades', icon: <Home className="h-5 w-5" /> }
  ];
  const categories = [
    { id: 'all', name: 'Todos', icon: '🌾' },
    { id: 'frutas', name: 'Frutas', icon: '🍎' },
    { id: 'verduras', name: 'Verduras', icon: '🥬' },
    { id: 'granos', name: 'Granos', icon: '🌽' }
  ];
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Marketplace Agrícola 🛒</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={categoryFilter === category.id ? 'default' : 'outline'}
            onClick={() => setCategoryFilter(category.id)}
            className={categoryFilter === category.id ? 'bg-green-500 text-white' : ''}
          >
            <span className="mr-2">{category.icon}</span>{category.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-gray-700 flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">₡{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <ShoppingCart className="h-4 w-4 mr-1" />Comprar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOfertas = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-900">Mis Ofertas 📦</h2>
      <Button onClick={handleOpenNewProduct} className="bg-green-500 hover:bg-green-600">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Producto
      </Button>
    </div>

    {loading && <div className="text-center text-gray-500">Cargando productos…</div>}

    {!loading && myProducts.length === 0 && (
      <div className="text-center text-gray-500">Aún no tienes ofertas publicadas.</div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myProducts.map((product) => (
        <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-56 w-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge
                className={
                  product.status === 'approved'
                    ? 'bg-green-500'
                    : product.status === 'pending'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }
              >
                {product.status}
              </Badge>
            </div>
          </div>

          <CardContent className="p-5 grow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">Precio: ₡{product.price.toLocaleString()}/{product.unit}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock} {product.unit}s</p>
                </div>
          </CardContent>

          <CardFooter className="border-t bg-white p-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleOpenEditProduct(product)}
              className="px-4"
            >
              <Edit className="h-4 w-4 mr-2" />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteProduct(product.id, product.name)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

  const renderTienda = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Agro Veterinarias 🏪</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vetShops.map((shop) => (
          <Card key={shop.id} className="hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img src={shop.image || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'} alt={shop.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{shop.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{shop.email}</div>
                <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{shop.phone}</div>
                <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{shop.location}</div>
              </div>
              <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">Ver Detalles</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOrdenes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Órdenes Recibidas 📋</h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{order.productName}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{order.quantity}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">₡{order.total.toLocaleString()}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'processing' ? 'bg-blue-500' :
                            order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBitacora = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Bitácora Agrícola 📖</h2>
            <Button onClick={() => { setEditingEntryId(null); setShowAddBitacora(true); }} className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />Nueva Entrada
            </Button>
          </div>
          <div className="text-center text-gray-500">Cargando bitácora…</div>
        </div>
      );
    }

    if (!loading && bitacoraEntries.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Bitácora Agrícola 📖</h2>
            <Button onClick={() => { setEditingEntryId(null); setShowAddBitacora(true); }} className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />Nueva Entrada
            </Button>
          </div>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">No hay entradas en la bitácora</p>
            <Button onClick={() => { setEditingEntryId(null); setShowAddBitacora(true); }} className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />Agregar Primera Entrada
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Bitácora Agrícola 📖</h2>
          <Button onClick={() => { setEditingEntryId(null); setShowAddBitacora(true); }} className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-2" />Nueva Entrada
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bitacoraEntries.map((entry) => (
            <Card key={entry.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-semibold">{entry.tipoActividad}</span>
                  <Badge className="bg-green-500">{entry.tipoCultivo}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <div className="space-y-2 text-sm">
                  <div><strong>Lote:</strong> {entry.lote}</div>
                  <div><strong>Cantidad:</strong> {entry.cantidad}</div>
                  <div><strong>Inicio:</strong> {new Date(entry.fechaInicio).toLocaleDateString()}</div>
                  <div><strong>Fin:</strong> {new Date(entry.fechaFin).toLocaleDateString()}</div>
                  <div><strong>Detalle:</strong> {entry.detalle}</div>
                  {entry.observaciones && <div><strong>Observaciones:</strong> {entry.observaciones}</div>}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 mt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleOpenEdit(entry)}
                  title="Editar"
                >
                <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteBitacora(entry.id)}
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCultivos = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-900">Gestión de Cultivos 🌱</h2>
      <Button onClick={handleOpenNewCultivo} className="bg-green-500 hover:bg-green-600">
        <Plus className="h-4 w-4 mr-2" /> Agregar Cultivo
      </Button>
    </div>

    {loading && <div className="text-center text-gray-500">Cargando cultivos…</div>}

    {!loading && cultivos.length === 0 && (
      <div className="text-center py-12">
        <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-500 mb-4">No hay cultivos registrados</p>
        <Button onClick={handleOpenNewCultivo} className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" /> Agregar Primer Cultivo
        </Button>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cultivos.map((c) => (
        <Card key={c.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
  <div className="relative h-56 w-full">
    <img
      src={c.image || 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg'}
      alt={c.name}
      className="h-full w-full object-cover"
    />
    <div className="absolute top-3 right-3">
      <Badge className={`${c.active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
        {c.active ? 'Activo' : 'Inactivo'}
      </Badge>
    </div>
  </div>

  <CardContent className="p-5 grow">
    <h3 className="text-xl font-semibold text-gray-900">{c.name}</h3>
    <p className="text-sm text-gray-600 mt-1">Variedad: {c.variedad}</p>
    {c.comentario && <p className="text-sm text-gray-500 mt-1">{c.comentario}</p>}
  </CardContent>

  {/* ⬇️ Footer con toggle a la IZQUIERDA y editar a la DERECHA */}
  <CardFooter className="border-t bg-white p-4 flex items-center justify-between">
    {/* Toggle (ghost, rojo cuando está activo, verde cuando está inactivo) */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleToggleCultivo(c.id, c.active)}
      className={c.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
      title={c.active ? 'Desactivar' : 'Activar'}
    >
      {c.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
    </Button>

    {/* Acciones a la derecha */}
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => handleOpenEditCultivo(c)} title="Editar">
        <Edit className="h-4 w-4" />
      </Button>
      {/* Si quieres dejar también eliminar, descomenta: */}
      {/* <Button variant="destructive" size="sm" onClick={() => handleDeleteCultivo(c.id, c.name)}>
        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
      </Button> */}
    </div>
  </CardFooter>
</Card>

      ))}
    </div>
  </div>
);


  const renderPropiedades = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-900">Mis Propiedades 🏡</h2>
      <Button onClick={() => setShowAddPropiedad(true)} className="bg-green-500 hover:bg-green-600">
        <Plus className="h-4 w-4 mr-2" /> Agregar Propiedad
      </Button>
    </div>

    {loading && <div className="text-center text-gray-500">Cargando propiedades…</div>}

    {(!loading && propiedades.length === 0) ? (
      <div className="text-center py-12">
        <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-500 mb-4">No hay propiedades registradas</p>
        <Button onClick={() => setShowAddPropiedad(true)} className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" />Agregar Primera Propiedad
        </Button>
      </div>
    ) : (
      <div className="space-y-5">
        {propiedades.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition"
          >
            {/* Izquierda: info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{p.nombre}</h3>
              <div className="mt-2 space-y-2 text-gray-700">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{p.localizacion}</span>
                </div>
                <div><strong>Tamaño:</strong> {p.tamano}</div>
                {p.comentario && <div className="text-gray-600">{p.comentario}</div>}
              </div>
            </div>

            {/* Derecha: estado + acciones */}
            <div className="flex items-center gap-3">
              <Badge className={p.active ? 'bg-green-600' : 'bg-red-500'}>
                {p.active ? 'Activa' : 'Inactiva'}
              </Badge>

              {/* Editar */}
              <Button variant="outline" size="icon" onClick={() => handleOpenEditPropiedad(p)} title="Editar">
                <Edit className="h-4 w-4" />
              </Button>

              {/* Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTogglePropiedad(p.id, p.active)}
                title={p.active ? 'Desactivar' : 'Activar'}
              >
                {p.active ? <ToggleRight className="h-5 w-5 text-red-600" /> : <ToggleLeft className="h-5 w-5 text-green-600" />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
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
            <motion.div className="flex items-center space-x-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl"><Leaf className="h-8 w-8 text-white" /></div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">AgroGlobal</h1>
                <p className="text-sm text-black-500">Dashboard Agricultor  🎑</p>
              </div>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm"><Bell className="h-5 w-5" /></Button>
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(!showProfile)}>
                 <Avatar className="h-8 w-8">
                   <AvatarFallback>
                    <LeafyGreen className="h-5 w-5 text-green-700" />
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
              <p className="font-semibold text-gray-900">Agricultor Usuario</p>
              <p className="text-sm text-gray-500">agricultor@agroglobal.com</p>
            </div>
            <div className="p-2">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${activeSection === item.id ? 'bg-green-500 text-white hover:bg-green-600' : 'hover:bg-green-50'}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}<span className="ml-3">{item.name}</span>
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Agregar/Editar Producto */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddProduct(false)}>
            <motion.div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{editingProductId == null ? 'Agregar Nuevo Producto' : 'Editar Producto'}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddProduct(false)}><X className="h-5 w-5" /></Button>
                </div>
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nombre *</Label>
                      <Input id="name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoría *</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value: ProductCategory) =>
                        setProductForm({ ...productForm, category: value })
                      }
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="frutas">Frutas</SelectItem>
                        <SelectItem value="verduras">Verduras</SelectItem>
                        <SelectItem value="granos">Granos</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>

                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea id="description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="price">Precio *</Label>
                      <Input id="price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unidad *</Label>
                      <Input id="unit" value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock *</Label>
                      <Input id="stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">URL de Imagen</Label>
                    <Input id="image" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddProduct(false)}>Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600"><Save className="h-4 w-4 mr-2" />{editingProductId == null ? 'Guardar Producto' : 'Guardar Cambios'}</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Crear/Editar Bitácora (unico modal) */}
      <AnimatePresence>
        {showAddBitacora && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddBitacora(false)}>
            <motion.div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingEntryId != null ? 'Editar Bitácora' : 'Nueva Entrada de Bitácora'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddBitacora(false)}><X className="h-5 w-5" /></Button>
                </div>
                <form onSubmit={handleAddBitacora} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="tipoActividad">Tipo de Actividad *</Label>
                      <Input id="tipoActividad" value={bitacoraForm.tipoActividad} onChange={(e) => setBitacoraForm({ ...bitacoraForm, tipoActividad: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="tipoCultivo">Tipo de Cultivo *</Label>
                      <Input id="tipoCultivo" value={bitacoraForm.tipoCultivo} onChange={(e) => setBitacoraForm({ ...bitacoraForm, tipoCultivo: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                      <Input id="fechaInicio" type="date" value={bitacoraForm.fechaInicio} onChange={(e) => setBitacoraForm({ ...bitacoraForm, fechaInicio: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                      <Input id="fechaFin" type="date" value={bitacoraForm.fechaFin} onChange={(e) => setBitacoraForm({ ...bitacoraForm, fechaFin: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="lote">Lote *</Label>
                      <Input id="lote" value={bitacoraForm.lote} onChange={(e) => setBitacoraForm({ ...bitacoraForm, lote: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="cantidad">Cantidad *</Label>
                      <Input id="cantidad" value={bitacoraForm.cantidad} onChange={(e) => setBitacoraForm({ ...bitacoraForm, cantidad: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="detalle">Detalle de la Actividad *</Label>
                    <Textarea id="detalle" value={bitacoraForm.detalle} onChange={(e) => setBitacoraForm({ ...bitacoraForm, detalle: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea id="observaciones" value={bitacoraForm.observaciones} onChange={(e) => setBitacoraForm({ ...bitacoraForm, observaciones: e.target.value })} />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddBitacora(false)}>Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                      <Save className="h-4 w-4 mr-2" />{editingEntryId != null ? 'Guardar Cambios' : 'Guardar Entrada'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Agregar Cultivo */}
      <AnimatePresence>
        {showAddCultivo && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddCultivo(false)}>
            <motion.div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{editingCultivoId == null ? 'Agregar Nuevo Cultivo' : 'Editar Cultivo'}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddCultivo(false)}><X className="h-5 w-5" /></Button>
                </div>
                <form onSubmit={handleSaveCultivo} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="cultivoName">Nombre del Cultivo *</Label>
                      <Input id="cultivoName" value={cultivoForm.name} onChange={(e) => setCultivoForm({ ...cultivoForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="variedad">Variedad *</Label>
                      <Input id="variedad" value={cultivoForm.variedad} onChange={(e) => setCultivoForm({ ...cultivoForm, variedad: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cultivoComentario">Comentario</Label>
                    <Textarea id="cultivoComentario" value={cultivoForm.comentario} onChange={(e) => setCultivoForm({ ...cultivoForm, comentario: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="cultivoImage">URL de Imagen</Label>
                    <Input id="cultivoImage" value={cultivoForm.image} onChange={(e) => setCultivoForm({ ...cultivoForm, image: e.target.value })} />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddCultivo(false)}>Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600"><Save className="h-4 w-4 mr-2" />{editingCultivoId == null ? 'Guardar Cultivo' : 'Guardar Cambios'}</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Agregar, Editar Propiedad */}
      <AnimatePresence>
        {showAddPropiedad && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddPropiedad(false)}>
            <motion.div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Agregar Nueva Propiedad</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddPropiedad(false)}><X className="h-5 w-5" /></Button>
                </div>
                <form onSubmit={handleAddPropiedad} className="space-y-6">
                  <div>
                    <Label htmlFor="propiedadNombre">Nombre de la Propiedad *</Label>
                    <Input id="propiedadNombre" value={propiedadForm.nombre} onChange={(e) => setPropiedadForm({ ...propiedadForm, nombre: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="localizacion">Localización *</Label>
                      <Input id="localizacion" value={propiedadForm.localizacion} onChange={(e) => setPropiedadForm({ ...propiedadForm, localizacion: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="tamano">Tamaño *</Label>
                      <Input id="tamano" value={propiedadForm.tamano} onChange={(e) => setPropiedadForm({ ...propiedadForm, tamano: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="propiedadComentario">Comentario</Label>
                    <Textarea id="propiedadComentario" value={propiedadForm.comentario} onChange={(e) => setPropiedadForm({ ...propiedadForm, comentario: e.target.value })} />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddPropiedad(false)}>Cancelar</Button>
                    <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600"><Save className="h-4 w-4 mr-2" />Guardar Propiedad</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {showEditPropiedad && (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={() => setShowEditPropiedad(null)}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Editar Propiedad</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowEditPropiedad(null)}><X className="h-5 w-5" /></Button>
          </div>

          <form onSubmit={handleSavePropiedad} className="space-y-6">
            <div>
              <Label>Nombre *</Label>
              <Input
                value={propiedadEditForm.nombre}
                onChange={(e) => setPropiedadEditForm({ ...propiedadEditForm, nombre: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Localización *</Label>
                <Input
                  value={propiedadEditForm.localizacion}
                  onChange={(e) => setPropiedadEditForm({ ...propiedadEditForm, localizacion: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Tamaño *</Label>
                <Input
                  value={propiedadEditForm.tamano}
                  onChange={(e) => setPropiedadEditForm({ ...propiedadEditForm, tamano: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label>Comentario</Label>
              <Textarea
                value={propiedadEditForm.comentario}
                onChange={(e) => setPropiedadEditForm({ ...propiedadEditForm, comentario: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditPropiedad(null)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" /> Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
