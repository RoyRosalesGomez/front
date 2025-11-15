"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Store,
  Package,
  BookOpen,
  Sprout,
  Home,
  LogOut,
  Plus,
  Search,
  MapPin,
  Phone,
  Trash2,
  X,
  Leaf,
  Edit,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Clock,
  Eye,
  Minus,
  ArrowLeft,
  ChevronRight,
  Bot,
  Briefcase,
  ClipboardList,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ProductService } from "@/services/product.service";
import { BitacoraService } from "@/services/bitacora.service";
import { CultivoService } from "@/services/cultivo.service";
import { PropiedadService } from "@/services/propiedad.service";
import { AuthService } from "@/services/auth.service";
import { ProductCategory, ProductStatus } from "@/app/types/product";
import { OrderService } from "@/services/order.service";
import type { Order as OrderApi } from "@/lib/api";
import { VetShopService } from "@/services/vetshop.service";
import Swal from "sweetalert2";
import { getCultivoImageUrl, getProductImageUrl, getVetShopImageUrl } from "@/lib/image-utils";

import { AIAssistant } from "@/components/ui/ai-assistant";

// Tipo “UI” para lo que pintamos
type OrderUI = {
  id: number;
  quantity: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;

  // de product
  productName: string;
  productImage: string;

  // de customer
  customerName: string;
  customerPhone?: string;
};

type ProductUI = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
  description: string;
  rating: number;
  // farmer puede venir como string o como objeto { name, location }
  farmer?: string | { name?: string; location?: string };
  location?: string; // respaldo si farmer viene en string
  farmerId?: number;
};

type CartItem = ProductUI & { quantity: number };

// ==== Interfaces ====
interface OfferProduct {
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
  status: "pending" | "processing" | "delivered" | "cancelled";
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

export default function FarmerDashboard() {
  const [activeSection, setActiveSection] = useState("marketplace");
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "frutas" | "verduras" | "granos"
  >("all");
  const currentUser = AuthService.getCurrentUser(); // { id, email, role, ... }

  // Estado para controlar si el menú "Gestión Comercial" está desplegado o no
  const [isCommercialOpen, setIsCommercialOpen] = useState(true);

  // Modales
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddBitacora, setShowAddBitacora] = useState(false);
  const [showAddCultivo, setShowAddCultivo] = useState(false);
  const [showAddPropiedad, setShowAddPropiedad] = useState(false);

  // === Marketplace Agricultor ===
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductUI | null>(
    null
  );
  const [productQuantity, setProductQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loadingMarketplace, setLoadingMarketplace] = useState(false);
  const [myProducts, setMyProducts] = useState<OfferProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const [vetShops, setVetShops] = useState<VetShop[]>([]);
  // Modal “Ver Más”
  const [showVetModal, setShowVetModal] = useState<VetShop | null>(null);

  const [bitacoraEntries, setBitacoraEntries] = useState<BitacoraEntry[]>([]);
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);

  // NUEVO — para editar propiedad
  const [showEditPropiedad, setShowEditPropiedad] = useState<Propiedad | null>(
    null
  );
  const [propiedadEditForm, setPropiedadEditForm] = useState({
    nombre: "",
    localizacion: "",
    tamano: "",
    comentario: "",
  });

  // estado
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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
    name: "",
    description: "",
    price: "",
    unit: "",
    stock: "",
    image: "",
    category: "otros",
  });

  const [bitacoraForm, setBitacoraForm] = useState({
    tipoActividad: "",
    tipoCultivo: "",
    fechaInicio: "",
    fechaFin: "",
    detalle: "",
    lote: "",
    observaciones: "",
    cantidad: "",
  });
  const [cultivoForm, setCultivoForm] = useState({
    name: "",
    variedad: "",
    comentario: "",
    image: "",
  });
  const [cultivoImageFile, setCultivoImageFile] = useState<File | null>(null);
  const [propiedadForm, setPropiedadForm] = useState({
    nombre: "",
    localizacion: "",
    tamano: "",
    comentario: "",
  });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  // Estado de edición para bitácora (usa el MISMO modal de crear)
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);

  // === Mis Ofertas (productos) ===
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // === Cultivos ===
  const [editingCultivoId, setEditingCultivoId] = useState<number | null>(null);

  const farmerNameOf = (p?: { farmer?: any } | null): string => {
    if (!p || p.farmer == null) return "";
    return typeof p.farmer === "string" ? p.farmer : (p.farmer?.name ?? "");
  };

  const farmerLocationOf = (
    p?: { farmer?: any; location?: string } | null
  ): string => {
    if (!p) return "";
    if (typeof p.farmer === "string") return p.location ?? "";
    return p.farmer?.location ?? p.location ?? "";
  };

  // ====== Carga de Bitácora ======
  const loadBitacora = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await BitacoraService.getAllEntries({
        farmerId: currentUser.id,
      });
      setBitacoraEntries(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar las entradas de la bitácora");
    } finally {
      setLoading(false);
    }
  };

  // carga (se llama al abrir la pestaña “ordenes”)
  const loadOrders = async () => {
    if (!currentUser?.id) return;
    setLoadingOrders(true);
    try {
      const data: OrderApi[] = await OrderService.getAllOrders({
        farmerId: currentUser.id,
      });

      // ⬇️ no muestres entregadas ni canceladas
      const mapped: OrderUI[] = (data ?? [])
        .filter((o) => o.status !== "delivered" && o.status !== "cancelled")
        .map((o) => ({
          id: o.id,
          quantity: o.quantity,
          status: o.status,
          createdAt: o.createdAt,
          productName: o.product?.name ?? "Producto",
          productImage: o.product?.image || "",
          customerName:
            [o.customer?.name, o.customer?.lastName]
              .filter(Boolean)
              .join(" ") ||
            o.customer?.email ||
            "Cliente",
          customerPhone: o.customer?.phone || "",
        }));

      setOrders(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeSection === "marketplace") {
      loadMarketplaceProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, categoryFilter, searchTerm]);

  const loadMarketplaceProducts = async () => {
    setLoadingMarketplace(true);
    try {
      const data = await ProductService.getApprovedProducts({
        category:
          categoryFilter === "all" ? undefined : (categoryFilter as any),
        search: searchTerm || undefined,
      });
      setProducts(data as ProductUI[]);
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar productos del marketplace");
    } finally {
      setLoadingMarketplace(false);
    }
  };

  // Cargar cultivos del backend
  const loadCultivos = async () => {
    setLoading(true);
    try {
      // si tu API ya filtra por el usuario autenticado, no mandes nada;
      // si no, puedes pasar { farmerId: currentUser?.id }
      const data = await CultivoService.getAllCultivos();
      setCultivos(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar los cultivos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCultivo = async (id: number, currentActive?: boolean) => {
    const cultivo = cultivos.find((c) => c.id === id);
    const action = currentActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} cultivo?`,
      text: `El cultivo "${cultivo?.name ?? ""}" será ${action === "activar" ? "activado" : "desactivado"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentActive ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // optimista: refleja el cambio al instante
    setCultivos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    try {
      await CultivoService.toggleActiveCultivo(id);
      toast.success(
        `Cultivo ${action === "activar" ? "activado" : "desactivado"}`
      );
    } catch (err) {
      // revierte si falla
      setCultivos((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, active: currentActive ?? c.active } : c
        )
      );
      console.error(err);
      toast.error("No se pudo cambiar el estado");
    }
  };

  // ===== Propiedades =====
  // NUEVO
  const loadPropiedades = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await PropiedadService.getAllPropiedades({
        farmerId: currentUser.id,
      });
      // normaliza active => boolean
      const normalized = (Array.isArray(data) ? data : (data?.items ?? [])).map(
        (p: any) => ({
          ...p,
          active: typeof p.active === "boolean" ? p.active : !!Number(p.active),
        })
      );
      setPropiedades(normalized);
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };

  // ===== Agro veterinarias =====
  const loadActiveVetShops = async () => {
    try {
      const data = await VetShopService.getActiveVetShops();
      console.log('🏪 [Farmer] VetShops cargadas desde backend:', data);
      if (data && data.length > 0) {
        console.log('🖼️ [Farmer] Primera imagen recibida:', data[0].image);
        console.log('🔗 [Farmer] URL construida:', getVetShopImageUrl(data[0].image));
      }
      // normaliza active por si viene 0/1
      const normalized = (data || []).map((v: any) => ({
        ...v,
        active: typeof v.active === "boolean" ? v.active : !!Number(v.active),
      }));
      setVetShops(normalized);
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar las agro veterinarias");
    }
  };

  useEffect(() => {
    if (activeSection === "marketplace") {
      loadApprovedProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, categoryFilter, searchTerm]);

  const loadApprovedProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getApprovedProducts({
        category:
          categoryFilter === "all" ? undefined : (categoryFilter as any),
        search: searchTerm || undefined,
      });

      const lista = (data as ProductUI[]).filter(
        (p) => p.farmerId !== currentUser?.id
      );
      setProducts(lista); // o setProducts(data as ProductUI[]);
    } catch {
      toast.error("Error al cargar productos del marketplace");
    } finally {
      setLoading(false);
    }
  };

  // Carga cuando entres a la pestaña y al montar si quieres
  useEffect(() => {
    if (activeSection === "propiedades") loadPropiedades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentUser?.id]);

  // Después de crear, recarga (o inserta optimista)
  // UPDATE — crear propiedad: añade al estado o recarga
  const handleAddPropiedad = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !propiedadForm.nombre ||
      !propiedadForm.localizacion ||
      !propiedadForm.tamano
    ) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    try {
      // ✅ toma el id del token (payload.sub)
      const me = AuthService.getCurrentUser();
      const farmerId = Number(me?.id);

      // Construye el payload. Si hay farmerId numérico, lo mandamos; si no, lo omitimos.
      const created = await PropiedadService.createPropiedad({
        nombre: propiedadForm.nombre,
        localizacion: propiedadForm.localizacion,
        tamano: propiedadForm.tamano,
        comentario: propiedadForm.comentario || undefined,
        farmerId: farmerId,
      });

      const normalized = {
        ...created,
        active:
          typeof created.active === "boolean"
            ? created.active
            : !!Number(created.active),
      };
      setPropiedades((prev) => [normalized, ...prev]);

      // ✅ Confirmación de creación
      await Swal.fire({
        title: "¡Propiedad creada!",
        text: "La propiedad ha sido agregada exitosamente",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setShowAddPropiedad(false);
      setPropiedadForm({
        nombre: "",
        localizacion: "",
        tamano: "",
        comentario: "",
      });

      await loadPropiedades();
    } catch (error) {
      console.error("Error adding propiedad:", error);
      await Swal.fire({
        title: "Error al crear",
        text: "No se pudo agregar la propiedad",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };
  // NUEVO — abrir modal de edición
  const handleOpenEditPropiedad = (p: Propiedad) => {
    setShowEditPropiedad(p);
    setPropiedadEditForm({
      nombre: p.nombre || "",
      localizacion: p.localizacion || "",
      tamano: p.tamano || "",
      comentario: p.comentario || "",
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

      // ✅ Confirmación de guardado exitoso
      await Swal.fire({
        title: "¡Cambios guardados!",
        text: "La propiedad ha sido actualizada correctamente",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setShowEditPropiedad(null);
      await loadPropiedades();
    } catch (e) {
      console.error(e);
      await Swal.fire({
        title: "Error al guardar",
        text: "No se pudo actualizar la propiedad",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // NUEVO — activar/desactivar
  const handleTogglePropiedad = async (id: number, currentActive?: boolean) => {
    const propiedad = propiedades.find((p) => p.id === id);
    const action = currentActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} propiedad?`,
      text: `La propiedad "${propiedad?.nombre ?? ""}" será ${action === "activar" ? "activada" : "desactivada"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentActive ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // optimista
    setPropiedades((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    try {
      await PropiedadService.toggleActivePropiedad(id);
      toast.success(
        `Propiedad ${action === "activar" ? "activada" : "desactivada"}`
      );
    } catch (e) {
      // revertir si falla
      setPropiedades((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, active: currentActive ?? p.active } : p
        )
      );
      console.error(e);
      toast.error("No se pudo cambiar el estado");
    }
  };

  useEffect(() => {
    if (activeSection === "bitacora") loadBitacora();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentUser?.id]);

  useEffect(() => {
    loadBitacora();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  useEffect(() => {
    if (activeSection === "ofertas") {
      loadMyProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentUser?.id]);

  useEffect(() => {
    if (activeSection === "cultivos") loadCultivos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentUser?.id]);

  useEffect(() => {
    if (activeSection === "propiedades") loadPropiedades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentUser?.id]);

  useEffect(() => {
    if (activeSection === "ordenes") loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, currentUser?.id]);

  useEffect(() => {
    if (activeSection === "tienda") {
      loadActiveVetShops();
    }
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem("agroglobal_token");
    window.location.href = "/dashboard-select";
  };

  // ===== Productos =====
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !productForm.name ||
      !productForm.description ||
      !productForm.price ||
      !productForm.unit ||
      !productForm.stock
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (!currentUser?.id) {
      toast.error("No se pudo obtener el ID del usuario");
      return;
    }

    try {
      await ProductService.createProduct({
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        unit: productForm.unit,
        stock: parseInt(productForm.stock),
        image: productImageFile,
        category: productForm.category,
        status: "pending",
        farmerId: currentUser.id,
      });

      toast.success(
        "Producto agregado exitosamente. Pendiente de aprobación por el administrador."
      );
      setShowAddProduct(false);
      setProductForm({
        name: "",
        description: "",
        price: "",
        unit: "",
        stock: "",
        image: "",
        category: "otros",
      });
      setProductImageFile(null);
      await loadMyProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error al agregar producto");
    }
  };

  // Cargar mis productos del backend
  const loadMyProducts = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      // Ajusta si tu servicio tiene otro nombre/forma
      const data = await ProductService.getProductsByFarmerId(currentUser.id);
      console.log('📦 Productos cargados desde backend:', data);
      if (data && data.length > 0) {
        console.log('🖼️ Primera imagen recibida:', data[0].image);
        console.log('🔗 URL construida:', getProductImageUrl(data[0].image));
      }
      // o: const { items } = await ProductService.getMyProducts({ farmerId: currentUser.id });
      setMyProducts(data);
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar tus ofertas");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal "nuevo producto"
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      unit: "",
      stock: "",
      image: "",
      category: "otros",
    });
    setShowAddProduct(true);
  };

  // Abrir modal en modo edición con valores precargados
  const handleOpenEditProduct = (p: OfferProduct) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      description: p.description,
      price: String(p.price ?? ""),
      unit: p.unit,
      stock: String(p.stock ?? ""),
      image: p.image ?? "",
      category: p.category,
    });
    setShowAddProduct(true);
  };

  // Guardar (crear o actualizar)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !productForm.name ||
      !productForm.description ||
      !productForm.price ||
      !productForm.unit ||
      !productForm.stock
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (!currentUser?.id) {
      toast.error("No se pudo obtener el ID del usuario");
      return;
    }

    try {
      if (editingProductId == null) {
        // Crear nuevo producto
        const createdProduct = await ProductService.createProduct({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          unit: productForm.unit,
          stock: parseInt(productForm.stock),
          image: productImageFile,
          category: productForm.category,
          status: "pending",
          farmerId: currentUser.id,
        });
        console.log('✅ Producto creado, respuesta del backend:', createdProduct);
        console.log('🖼️ Imagen devuelta por backend:', createdProduct?.image);
        await Swal.fire({
          title: "¡Producto creado!",
          html: '<p>Tu producto ha sido creado exitosamente</p><p class="text-sm text-gray-600 mt-2">Queda pendiente de aprobación por el administrador</p>',
          icon: "success",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        // Actualizar producto existente
        const payload: any = {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          unit: productForm.unit,
          stock: parseInt(productForm.stock),
          category: productForm.category,
        };

        // Solo incluir la imagen si se seleccionó un nuevo archivo
        if (productImageFile) {
          payload.image = productImageFile;
        }

        await ProductService.updateProduct(editingProductId, payload);
        await Swal.fire({
          title: "¡Cambios guardados!",
          text: "El producto ha sido actualizado correctamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }

      setShowAddProduct(false);
      setEditingProductId(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        unit: "",
        stock: "",
        image: "",
        category: "otros",
      });
      setProductImageFile(null);
      await loadMyProducts();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error al guardar",
        text: "No se pudo guardar el producto",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Eliminar (solo para productos PENDING)
  const handleDeleteProduct = async (id: number, name?: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el producto "${name ?? "este producto"}" permanentemente`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // 1) Estado previo para revertir si falla
    const prev = myProducts;
    // 2) Optimista: desaparece YA de la UI
    setMyProducts((p) => p.filter((item) => item.id !== id));

    try {
      await ProductService.deleteProduct(id);
      toast.success("Producto eliminado");
      //await loadMyProducts();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el producto");
      // Revertimos si el backend falló
      setMyProducts(prev);
    }
  };

  // Toggle active (solo para productos APPROVED)
  const handleToggleProduct = async (id: number, currentActive?: boolean) => {
    const product = myProducts.find((p) => p.id === id);
    const action = currentActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} producto?`,
      text: `El producto "${product?.name ?? ""}" será ${action === "activar" ? "activado" : "desactivado"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentActive ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // Optimista: refleja el cambio al instante
    setMyProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    try {
      await ProductService.toggleActiveProduct(id);
      toast.success(
        `Producto ${action === "activar" ? "activado" : "desactivado"}`
      );
    } catch (err) {
      // Revierte si falla
      setMyProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, active: currentActive ?? p.active } : p
        )
      );
      console.error(err);
      toast.error("No se pudo cambiar el estado");
    }
  };

  // ===== Bitácora: Crear / Editar (mismo modal) =====
  const handleAddBitacora = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !bitacoraForm.tipoActividad ||
      !bitacoraForm.tipoCultivo ||
      !bitacoraForm.fechaInicio ||
      !bitacoraForm.fechaFin ||
      !bitacoraForm.detalle ||
      !bitacoraForm.lote ||
      !bitacoraForm.cantidad
    ) {
      toast.error("Por favor completa todos los campos requeridos");
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

        // ✅ Confirmación de edición
        await Swal.fire({
          title: "¡Cambios guardados!",
          text: "La entrada de bitácora ha sido actualizada",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
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

        // ✅ Confirmación de creación
        await Swal.fire({
          title: "¡Entrada creada!",
          text: "La entrada de bitácora ha sido agregada exitosamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }

      setShowAddBitacora(false);
      setEditingEntryId(null);
      setBitacoraForm({
        tipoActividad: "",
        tipoCultivo: "",
        fechaInicio: "",
        fechaFin: "",
        detalle: "",
        lote: "",
        observaciones: "",
        cantidad: "",
      });
      await loadBitacora();
    } catch (error) {
      console.error("Error guardando entrada de bitácora:", error);
      toast.error("Ocurrió un error guardando la entrada");
    }
  };

  // Abre el modal en modo edición precargando el formulario
  const handleOpenEdit = (entry: BitacoraEntry) => {
    setBitacoraForm({
      tipoActividad: entry.tipoActividad,
      tipoCultivo: entry.tipoCultivo,
      fechaInicio: entry.fechaInicio?.slice(0, 10) ?? "",
      fechaFin: entry.fechaFin?.slice(0, 10) ?? "",
      detalle: entry.detalle,
      lote: entry.lote,
      observaciones: entry.observaciones ?? "",
      cantidad: entry.cantidad,
    });
    setEditingEntryId(entry.id);
    setShowAddBitacora(true);
  };

  // Elimina por id (una sola función)
  const handleDeleteBitacora = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar entrada?",
      text: "Esta entrada de la bitácora se eliminará permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const prev = bitacoraEntries;
    setBitacoraEntries((list) => list.filter((e) => e.id !== id)); // optimista

    try {
      await BitacoraService.deleteEntry(id);
      setBitacoraEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Entrada eliminada");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar la entrada");
      setBitacoraEntries(prev); // revertir
    }
  };

  // ===== Cultivos =====
  const handleAddCultivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cultivoForm.name || !cultivoForm.variedad) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    if (!currentUser?.id) {
      toast.error("No se pudo obtener el ID del usuario");
      return;
    }

    try {
      const created = await CultivoService.createCultivo({
        name: cultivoForm.name,
        variedad: cultivoForm.variedad,
        comentario: cultivoForm.comentario || undefined,
        image: cultivoImageFile,
        farmerId: currentUser.id,
      });

      toast.success("Cultivo agregado exitosamente");
      setShowAddCultivo(false);
      setCultivoForm({ name: "", variedad: "", comentario: "", image: "" });
      setCultivoImageFile(null);

      // Si el backend devuelve el objeto creado:
      if (created && created.id) {
        setCultivos((prev) => [created, ...prev]);
      } else {
        // si no, recarga la lista desde el backend
        await loadCultivos();
      }
    } catch (error) {
      console.error("Error adding cultivo:", error);
      toast.error("Error al agregar cultivo");
    }
  };

  // Abrir modal "nuevo cultivo"
  const handleOpenNewCultivo = () => {
    setEditingCultivoId(null);
    setCultivoForm({ name: "", variedad: "", comentario: "", image: "" });
    setShowAddCultivo(true);
  };

  // Abrir modal en modo edición con valores precargados
  const handleOpenEditCultivo = (c: Cultivo) => {
    setEditingCultivoId(c.id);
    setCultivoForm({
      name: c.name ?? "",
      variedad: c.variedad ?? "",
      comentario: c.comentario ?? "",
      image: c.image ?? "",
    });
    setShowAddCultivo(true);
  };

  // Guardar (crear o actualizar)
  const handleSaveCultivo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cultivoForm.name || !cultivoForm.variedad) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    if (!currentUser?.id) {
      toast.error("No se pudo obtener el ID del usuario");
      return;
    }

    try {
      if (editingCultivoId == null) {
        // Crear nuevo cultivo
        await CultivoService.createCultivo({
          name: cultivoForm.name,
          variedad: cultivoForm.variedad,
          comentario: cultivoForm.comentario || undefined,
          image: cultivoImageFile,
          farmerId: currentUser.id,
        });

        await Swal.fire({
          title: "¡Cultivo creado!",
          text: "El cultivo ha sido agregado exitosamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        // Actualizar cultivo existente
        const payload: any = {
          name: cultivoForm.name,
          variedad: cultivoForm.variedad,
          comentario: cultivoForm.comentario || undefined,
        };

        // Solo incluir la imagen si se seleccionó un nuevo archivo
        if (cultivoImageFile) {
          payload.image = cultivoImageFile;
        }

        await CultivoService.updateCultivo(editingCultivoId, payload);

        await Swal.fire({
          title: "¡Cambios guardados!",
          text: "El cultivo ha sido actualizado correctamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }

      setShowAddCultivo(false);
      setEditingCultivoId(null);
      setCultivoForm({ name: "", variedad: "", comentario: "", image: "" });
      setCultivoImageFile(null);
      await loadCultivos();
    } catch (err) {
      console.error("Error guardando cultivo:", err);
      await Swal.fire({
        title: "Error al guardar",
        text: "No se pudo guardar el cultivo",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Eliminar
  const handleDeleteCultivo = async (id: number, name?: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar cultivo?",
      text: `El cultivo "${name ?? "este cultivo"}" se eliminará permanentemente`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await CultivoService.deleteCultivo(id);
      toast.success("Cultivo eliminado");
      await loadCultivos();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el cultivo");
    }
  };

  // ===== Sidebar / Filtros / Render secciones =====
  const sidebarItems = [
    {
      id: "marketplace",
      name: "Marketplace",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      id: "ofertas",
      name: "Mis Ofertas",
      icon: <Package className="h-5 w-5" />,
    },
    { id: "tienda", name: "Tienda", icon: <Store className="h-5 w-5" /> },
    { id: "ordenes", name: "Órdenes", icon: <BookOpen className="h-5 w-5" /> },
    {
      id: "bitacora",
      name: "Bitácora",
      icon: <BookOpen className="h-5 w-5" />,
    },
    { id: "cultivos", name: "Cultivos", icon: <Sprout className="h-5 w-5" /> },
    {
      id: "propiedades",
      name: "Propiedades",
      icon: <Home className="h-5 w-5" />,
    },
  ];
  const categories = [
    { id: "all", name: "Todos", icon: "🌾" },
    { id: "frutas", name: "Frutas", icon: "🍎" },
    { id: "verduras", name: "Verduras", icon: "🥬" },
    { id: "granos", name: "Granos", icon: "🌽" },
  ];

  const filteredProducts = products.filter((p) => {
    const byCat = categoryFilter === "all" || p.category === categoryFilter;
    const byText = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasStock = p.stock > 0; // Ocultar productos sin stock para agricultores
    return byCat && byText && hasStock;
  });

  const addToCart = (product: ProductUI, quantity: number): void => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId: number, newQty: number): void => {
    if (newQty <= 0) {
      // Eliminar sin confirmación cuando se reduce a 0 con los botones
      setCart((prev) => prev.filter((i) => i.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity: newQty } : i))
    );
  };

  const removeFromCart = async (productId: number): Promise<void> => {
    const product = cart.find((i) => i.id === productId);
    if (!product) return;

    // ⚠️ Confirmación antes de eliminar del carrito (solo desde botón eliminar)
    const result = await Swal.fire({
      title: "¿Eliminar del carrito?",
      html: `<p class="text-gray-700">Se eliminará <strong>${product.name}</strong> del carrito</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setCart((prev) => prev.filter((i) => i.id !== productId));

    // ✅ Confirmación de eliminación
    toast.success(`${product.name} eliminado del carrito`, {
      duration: 2000,
    });
  };
  const getTotalItems = (): number => cart.reduce((t, i) => t + i.quantity, 0);
  const getSubtotal = (): number =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const getIVA = (): number => getSubtotal() * 0.13;
  const getTotal = (): number => getSubtotal() + getIVA();

  const handleBuyNow = (product: ProductUI): void => {
    if (adding) return;
    setAdding(true);
    try {
      addToCart(product, productQuantity); // solo agrega al carrito

      // ✅ Confirmación de producto agregado
      toast.success(`${product.name} agregado al carrito`, {
        position: "top-right",
        duration: 2000,
      });

      setSelectedProduct(null);
      setProductQuantity(1);
      setShowCart(true); // abre carrito
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = (product: ProductUI): void => {
    addToCart(product, productQuantity);

    // ✅ Confirmación de producto agregado al carrito
    toast.success(`${product.name} agregado al carrito`, {
      position: "top-right",
      duration: 2000,
    });

    setSelectedProduct(null);
    setProductQuantity(1);
  };

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          Mercado agrícola 🛒
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((c) => (
          <Button
            key={c.id}
            variant={categoryFilter === c.id ? "default" : "outline"}
            onClick={() => setCategoryFilter(c.id as any)}
            className={categoryFilter === c.id ? "bg-green-500 text-white" : ""}
          >
            <span className="mr-2">{c.icon}</span>
            {c.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
        {loadingMarketplace ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            Cargando productos…
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getProductImageUrl(product.image) || "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white">
                    {product.stock} disponibles
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Por: {farmerNameOf(product)} • {farmerLocationOf(product)}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      ₡{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      /{product.unit}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    setSelectedProduct(product);
                    setProductQuantity(1);
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Comprar Ahora
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderAsistenteIA = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          Asistente Agrícola 🤖
        </h2>
        <AIAssistant />
      </div>
    </div>
  );

  const toProcessing = async (id: number) => {
    // optimista
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "processing" } : o))
    );
    try {
      await OrderService.markAsProcessing(id);
    } catch (e) {
      // revertir
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "pending" } : o))
      );
    }
  };

  const toDelivered = async (id: number) => {
    // ⬇️ optimista: lo quitamos YA de la lista
    const prev = orders;
    setOrders(prev.filter((o) => o.id !== id));
    try {
      await OrderService.markAsDelivered(id);
    } catch (e) {
      // si falla, lo devolvemos
      setOrders(prev);
      console.error(e);
    }
  };

  const renderOfertas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Mis Ofertas 📦</h2>
        <Button
          onClick={handleOpenNewProduct}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Cargando productos…</div>
      )}

      {!loading && myProducts.length === 0 && (
        <div className="text-center text-gray-500">
          Aún no tienes ofertas publicadas.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProducts.map((product) => {
          const imageUrl = getProductImageUrl(product.image);
          console.log(`🖼️ Producto: ${product.name}, Imagen original: ${product.image}, URL construida: ${imageUrl}`);
          return (
          <Card
            key={product.id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-56 w-full">
              <img
                src={imageUrl || "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg"}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error(`❌ Error cargando imagen: ${e.currentTarget.src}`);
                  e.currentTarget.src = "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg";
                }}
              />
              <div className="absolute top-3 right-3">
                <Badge
                  className={
                    product.status === "approved"
                      ? "bg-green-500"
                      : product.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }
                >
                  {product.status}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 grow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  Precio: ₡{product.price.toLocaleString()}/{product.unit}
                </p>
                <p className="text-sm text-gray-600">
                  Reserva: {product.stock} {product.unit}s
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-white p-4 flex justify-end gap-2">
              {/* Editar: siempre disponible */}
              <Button
                variant="outline"
                onClick={() => handleOpenEditProduct(product)}
                className="px-4"
              >
                <Edit className="h-4 w-4 mr-2" />
              </Button>

              {/* Eliminar: solo si está PENDING */}
              {product.status === "pending" && (
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              )}

              {/* Toggle Active: solo si está APPROVED */}
              {product.status === "approved" && (
                <Button
                  variant={product.active ? "default" : "outline"}
                  onClick={() => handleToggleProduct(product.id, product.active)}
                  className={product.active ? "bg-green-500 hover:bg-green-600 text-white" : "border-gray-300"}
                >
                  {product.active ? (
                    <>
                      <ToggleRight className="h-4 w-4 mr-1" />
                      Activo
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 mr-1" />
                      Inactivo
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          );
        })}
      </div>
    </div>
  );

  const renderTienda = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          Agro Veterinarias 🏪
        </h2>
      </div>

      {vetShops.length === 0 ? (
        <div className="text-gray-500">
          No hay agro veterinarias activas por ahora.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vetShops.map((shop) => {
            const imageUrl = getVetShopImageUrl(shop.image);
            console.log(`🏪 [Farmer VetShop] Local: ${shop.name}, Imagen original: ${shop.image}, URL construida: ${imageUrl}`);
            return (
            <Card
              key={shop.id}
              className="
    group relative overflow-hidden rounded-2xl border
    transform-gpu will-change-transform
    transition-all duration-300
    hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl
  "
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={
                    imageUrl ||
                    "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"
                  }
                  alt={shop.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`❌ [Farmer VetShop] Error cargando imagen: ${e.currentTarget.src}`);
                    e.currentTarget.src = "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg";
                  }}
                />
              </div>

              <CardContent className="p-5">
                <h3 className="text-xl font-bold text-gray-900">{shop.name}</h3>
                <div className="mt-2 flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {shop.location}
                </div>

                <Button
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                  onClick={() => setShowVetModal(shop)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Más
                </Button>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderOrdenes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          Órdenes de Pedidos 📋
        </h2>
      </div>

      {loadingOrders && <div className="text-gray-500">Cargando órdenes…</div>}

      {!loadingOrders && orders.length === 0 && (
        <div className="text-gray-500">No hay órdenes por ahora.</div>
      )}

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
          >
            {/* Izquierda: imagen + info */}
            <div className="flex items-center gap-4">
              <img
                src={getProductImageUrl(o.productImage) || "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg"}
                alt={o.productName}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg";
                }}
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {o.productName}
                </h3>
                <div className="text-sm text-gray-600">
                  <div>Cliente: {o.customerName}</div>
                  {o.customerPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {o.customerPhone}
                    </div>
                  )}
                  <div>Cantidad: {o.quantity}</div>
                </div>
              </div>
            </div>

            {/* Derecha: estado (píldora) + botón de acción debajo */}
            <div className="flex flex-col items-end gap-2 min-w-[126px]">
              <span
                className={[
                  "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm",
                  o.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : o.status === "processing"
                      ? "bg-blue-500 text-white"
                      : "bg-green-600 text-white",
                ].join(" ")}
              >
                {o.status === "pending"
                  ? "Pendiente"
                  : o.status === "processing"
                    ? "En Proceso"
                    : "Entregado"}
              </span>

              {o.status === "pending" && (
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => toProcessing(o.id)}
                  title="Pasar a En Proceso"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              )}

              {o.status === "processing" && (
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => toDelivered(o.id)}
                  title="Marcar como Entregado"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBitacora = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              Bitácora Agrícola 📖
            </h2>
            <Button
              onClick={() => {
                setEditingEntryId(null);
                setShowAddBitacora(true);
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Entrada
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
            <h2 className="text-3xl font-bold text-gray-900">
              Bitácora Agrícola 📖
            </h2>
            <Button
              onClick={() => {
                setEditingEntryId(null);
                setShowAddBitacora(true);
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Entrada
            </Button>
          </div>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">
              No hay entradas en la bitácora
            </p>
            <Button
              onClick={() => {
                setEditingEntryId(null);
                setShowAddBitacora(true);
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Entrada
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            Bitácora Agrícola 📖
          </h2>
          <Button
            onClick={() => {
              setEditingEntryId(null);
              setShowAddBitacora(true);
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Entrada
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bitacoraEntries.map((entry) => (
            <Card
              key={entry.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-semibold">
                    {entry.tipoActividad}
                  </span>
                  <Badge className="bg-green-500">{entry.tipoCultivo}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Lote:</strong> {entry.lote}
                  </div>
                  <div>
                    <strong>Cantidad:</strong> {entry.cantidad}
                  </div>
                  <div>
                    <strong>Inicio:</strong>{" "}
                    {new Date(entry.fechaInicio).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Fin:</strong>{" "}
                    {new Date(entry.fechaFin).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Detalle:</strong> {entry.detalle}
                  </div>
                  {entry.observaciones && (
                    <div>
                      <strong>Observaciones:</strong> {entry.observaciones}
                    </div>
                  )}
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
        <h2 className="text-3xl font-bold text-gray-900">
          Gestión de Cultivos 🌱
        </h2>
        <Button
          onClick={handleOpenNewCultivo}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" /> Agregar Cultivo
        </Button>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Cargando cultivos…</div>
      )}

      {!loading && cultivos.length === 0 && (
        <div className="text-center py-12">
          <Sprout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-4">
            No hay cultivos registrados
          </p>
          <Button
            onClick={handleOpenNewCultivo}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" /> Agregar Primer Cultivo
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cultivos.map((c) => (
          <Card
            key={c.id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-56 w-full">
              <img
                src={
                  getCultivoImageUrl(c.image) ||
                  "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg"
                }
                alt={c.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg";
                }}
              />
              <div className="absolute top-3 right-3">
                <Badge
                  className={`${c.active ? "bg-green-500" : "bg-red-500"} text-white`}
                >
                  {c.active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 grow">
              <h3 className="text-xl font-semibold text-gray-900">{c.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Variedad: {c.variedad}
              </p>
              {c.comentario && (
                <p className="text-sm text-gray-500 mt-1">{c.comentario}</p>
              )}
            </CardContent>

            {/* ⬇️ Footer con toggle a la IZQUIERDA y editar a la DERECHA */}
            <CardFooter className="border-t bg-white p-4 flex items-center justify-between">
              {/* Toggle (ghost, rojo cuando está activo, verde cuando está inactivo) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleCultivo(c.id, c.active)}
                className={
                  c.active
                    ? "text-red-600 hover:text-red-700"
                    : "text-green-600 hover:text-green-700"
                }
                title={c.active ? "Desactivar" : "Activar"}
              >
                {c.active ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
              </Button>

              {/* Acciones a la derecha */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditCultivo(c)}
                  title="Editar"
                >
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
        <Button
          onClick={() => setShowAddPropiedad(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4 mr-2" /> Agregar Propiedad
        </Button>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Cargando propiedades…</div>
      )}

      {!loading && propiedades.length === 0 ? (
        <div className="text-center py-12">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-4">
            No hay propiedades registradas
          </p>
          <Button
            onClick={() => setShowAddPropiedad(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primera Propiedad
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
                  <div>
                    <strong>Tamaño:</strong> {p.tamano}
                  </div>
                  {p.comentario && (
                    <div className="text-gray-600">{p.comentario}</div>
                  )}
                </div>
              </div>

              {/* Derecha: estado + acciones */}
              <div className="flex items-center gap-3">
                <Badge className={p.active ? "bg-green-600" : "bg-red-500"}>
                  {p.active ? "Activa" : "Inactiva"}
                </Badge>

                {/* Editar */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenEditPropiedad(p)}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                {/* Toggle */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleTogglePropiedad(p.id, p.active)}
                  title={p.active ? "Desactivar" : "Activar"}
                >
                  {p.active ? (
                    <ToggleRight className="h-5 w-5 text-red-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-green-600" />
                  )}
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
      case "marketplace":
        return renderMarketplace();
      case "ofertas":
        return renderOfertas();
      case "tienda":
        return renderTienda();
      case "ordenes":
        return renderOrdenes();
      case "bitacora":
        return renderBitacora();
      case "cultivos":
        return renderCultivos();
      case "propiedades":
        return renderPropiedades();
      case "ia":
        return renderAsistenteIA(); // 👈 agregado
      default:
        return renderMarketplace();
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 text-gray-900"
    >
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
                <p className="text-sm text-black-500">
                  Mercado de agricultor 🎑
                </p>
              </div>
            </motion.div>
            <div className="flex items-center space-x-4">
              {/*<Button variant="ghost" size="sm"><Bell className="h-5 w-5" /></Button>*/}
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

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Leaf className="h-5 w-5 text-green-700" />
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

      <div className="flex min-h-screen  pt-[0px]">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 flex-shrink-0 h-screen sticky top-0">
          <div className="p-6 space-y-2">
            {/* --- ASISTENTE IA --- */}
            <Button
              onClick={() => {
                setActiveSection("ia");
                setIsCommercialOpen(false); // cierra gestión comercial
              }}
              className={`w-full justify-start text-base font-semibold py-4 transition-all duration-200 rounded-lg ${
                activeSection === "ia"
                  ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md"
                  : "bg-white hover:bg-green-50 text-gray-800"
              }`}
            >
              <Bot className="h-5 w-5 mr-2" />
              Asistente IA
            </Button>

            {/* --- GESTIÓN COMERCIAL (con dropdown) --- */}
            <Button
              onClick={() => {
                const next = !isCommercialOpen;
                setIsCommercialOpen(next);
                setActiveSection("commercial");
                if (!next) setActiveSection(""); // si se cierra, desmarca el botón
              }}
              className={`w-full justify-between text-base font-semibold py-4 transition-all duration-200 rounded-lg ${
                activeSection === "commercial" && isCommercialOpen
                  ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md"
                  : "bg-white hover:bg-green-50 text-gray-800"
              }`}
            >
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Gestión Comercial
              </div>
              <motion.div
                animate={{ rotate: isCommercialOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>

            {/* --- SUBMENÚ --- */}
            <AnimatePresence>
              {isCommercialOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-6 mt-2 space-y-1 overflow-hidden"
                >
                  {[
                    {
                      id: "marketplace",
                      name: "Mercado",
                      icon: <ShoppingCart className="h-5 w-5" />,
                    },
                    {
                      id: "ofertas",
                      name: "Mis Ofertas",
                      icon: <Package className="h-5 w-5" />,
                    },
                    {
                      id: "tienda",
                      name: "Tienda",
                      icon: <Store className="h-5 w-5" />,
                    },
                    {
                      id: "ordenes",
                      name: "Órdenes",
                      icon: <ClipboardList className="h-5 w-5" />,
                    },
                    {
                      id: "bitacora",
                      name: "Bitácora",
                      icon: <BookOpen className="h-5 w-5" />,
                    },
                    {
                      id: "propiedades",
                      name: "Propiedades",
                      icon: <Home className="h-5 w-5" />,
                    },
                    {
                      id: "cultivos",
                      name: "Cultivos",
                      icon: <Sprout className="h-5 w-5" />,
                    },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      size="sm"
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full justify-start transition-all duration-200 rounded-md ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow"
                          : "bg-white hover:bg-green-50 text-gray-700 "
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Contenido principal */}
        <div
          className={`flex-1 overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50 p-8 ${
            activeSection === "ia" ? "col-span-2" : ""
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Agregar/Editar Producto */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddProduct(false)}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProductId == null
                      ? "Agregar Nuevo Producto"
                      : "Editar Producto"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddProduct(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoría *</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value: ProductCategory) =>
                          setProductForm({ ...productForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
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
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="price">Precio *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unidad *</Label>
                      <Input
                        id="unit"
                        value={productForm.unit}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            unit: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Reserva *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            stock: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">Imagen del Producto</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProductImageFile(file);
                        }
                      }}
                    />
                    {productImageFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Archivo seleccionado: {productImageFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddProduct(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingProductId == null
                        ? "Guardar Producto"
                        : "Guardar Cambios"}
                    </Button>
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
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddBitacora(false)}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingEntryId != null
                      ? "Editar Bitácora"
                      : "Nueva Entrada de Bitácora"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddBitacora(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <form onSubmit={handleAddBitacora} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="tipoActividad">Tipo de Actividad *</Label>
                      <Input
                        id="tipoActividad"
                        value={bitacoraForm.tipoActividad}
                        onChange={(e) =>
                          setBitacoraForm({
                            ...bitacoraForm,
                            tipoActividad: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipoCultivo">Tipo de Cultivo *</Label>
                      <Input
                        id="tipoCultivo"
                        value={bitacoraForm.tipoCultivo}
                        onChange={(e) =>
                          setBitacoraForm({
                            ...bitacoraForm,
                            tipoCultivo: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                      <Input
                        id="fechaInicio"
                        type="date"
                        value={bitacoraForm.fechaInicio}
                        onChange={(e) =>
                          setBitacoraForm({
                            ...bitacoraForm,
                            fechaInicio: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                      <Input
                        id="fechaFin"
                        type="date"
                        value={bitacoraForm.fechaFin}
                        onChange={(e) =>
                          setBitacoraForm({
                            ...bitacoraForm,
                            fechaFin: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="lote">Lote *</Label>
                      <Input
                        id="lote"
                        value={bitacoraForm.lote}
                        onChange={(e) =>
                          setBitacoraForm({
                            ...bitacoraForm,
                            lote: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cantidad">Cantidad *</Label>
                      <Input
                        id="cantidad"
                        value={bitacoraForm.cantidad}
                        onChange={(e) =>
                          setBitacoraForm({
                            ...bitacoraForm,
                            cantidad: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="detalle">Detalle de la Actividad *</Label>
                    <Textarea
                      id="detalle"
                      value={bitacoraForm.detalle}
                      onChange={(e) =>
                        setBitacoraForm({
                          ...bitacoraForm,
                          detalle: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      value={bitacoraForm.observaciones}
                      onChange={(e) =>
                        setBitacoraForm({
                          ...bitacoraForm,
                          observaciones: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddBitacora(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingEntryId != null
                        ? "Guardar Cambios"
                        : "Guardar Entrada"}
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
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddCultivo(false)}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCultivoId == null
                      ? "Agregar Nuevo Cultivo"
                      : "Editar Cultivo"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddCultivo(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <form onSubmit={handleSaveCultivo} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="cultivoName">Nombre del Cultivo *</Label>
                      <Input
                        id="cultivoName"
                        value={cultivoForm.name}
                        onChange={(e) =>
                          setCultivoForm({
                            ...cultivoForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="variedad">Variedad *</Label>
                      <Input
                        id="variedad"
                        value={cultivoForm.variedad}
                        onChange={(e) =>
                          setCultivoForm({
                            ...cultivoForm,
                            variedad: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cultivoComentario">Comentario</Label>
                    <Textarea
                      id="cultivoComentario"
                      value={cultivoForm.comentario}
                      onChange={(e) =>
                        setCultivoForm({
                          ...cultivoForm,
                          comentario: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cultivoImage">Imagen del Cultivo</Label>
                    <Input
                      id="cultivoImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCultivoImageFile(file);
                        }
                      }}
                    />
                    {cultivoImageFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Archivo seleccionado: {cultivoImageFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddCultivo(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingCultivoId == null
                        ? "Guardar Cultivo"
                        : "Guardar Cambios"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal que muestra las agro veterinarias */}
      <AnimatePresence>
        {showVetModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVetModal(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Agro Veterinaria
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVetModal(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={
                      getVetShopImageUrl(showVetModal.image) ||
                      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"
                    }
                    className="w-20 h-20 rounded-lg object-cover"
                    alt={showVetModal.name}
                    onError={(e) => {
                      console.error(`❌ [Farmer VetShop Modal] Error cargando imagen: ${e.currentTarget.src}`);
                      e.currentTarget.src = "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg";
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {showVetModal.name}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={showVetModal.name}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={showVetModal.email}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={showVetModal.phone}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label>Ubicación</Label>
                    <Input
                      value={showVetModal.location}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Dirección Exacta</Label>
                  <Textarea
                    value={showVetModal.address || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*Modal que me muestra los productos en el marketplace, igual que en el dashboard del cliente*/}
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
                  src={getProductImageUrl(selectedProduct.image) || "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg"}
                  alt={selectedProduct.name}
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg";
                  }}
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
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Productor: {farmerNameOf(selectedProduct)}</span>
                    <span>•</span>
                    <span>Ubicación: {farmerLocationOf(selectedProduct)}</span>
                    <span>•</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-green-600">
                      ₡{selectedProduct.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{selectedProduct.unit}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setProductQuantity(Math.max(1, productQuantity - 1))
                      }
                      disabled={productQuantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {productQuantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProductQuantity(productQuantity + 1)}
                      disabled={productQuantity >= selectedProduct.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ₡
                      {(
                        selectedProduct.price * productQuantity
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    onClick={() => handleBuyNow(selectedProduct)}
                    disabled={adding}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {adding ? "Agregando…" : "Comprar Ahora"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-700 py-3"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Agregar al Carrito
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Carrito de Compras 🛒
                  </h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-4">
                      Tu carrito está vacío
                    </p>
                    <Button
                      onClick={() => setShowCart(false)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Continuar Comprando
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Por: {farmerNameOf(item)} •{" "}
                              {farmerLocationOf(item)}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              ₡{item.price.toLocaleString()} /{item.unit}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-semibold w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ₡{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">
                            ₡{getSubtotal().toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-600">IVA (13%):</span>
                          <span className="font-semibold">
                            ₡{getIVA().toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold border-t border-gray-200 pt-3">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-green-600">
                            ₡{getTotal().toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 hover:bg-gray-50"
                          onClick={() => setShowCart(false)}
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Continuar Comprando
                        </Button>
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                          disabled={finalizing || cart.length === 0}
                          onClick={async () => {
                            if (finalizing) return;

                            // ⚠️ Confirmación antes de finalizar compra
                            const result = await Swal.fire({
                              title: "¿Finalizar compra?",
                              html: `
                                <div class="text-left">
                                  <p class="text-gray-700 mb-3">Vas a comprar ${cart.length} producto(s)</p>
                                  <p class="text-lg font-bold text-green-600">Total: ₡${getTotal().toFixed(2)}</p>
                                </div>
                              `,
                              icon: "question",
                              showCancelButton: true,
                              confirmButtonColor: "#16a34a",
                              cancelButtonColor: "#6b7280",
                              confirmButtonText: "Sí, comprar",
                              cancelButtonText: "Cancelar",
                            });

                            if (!result.isConfirmed) return;

                            setFinalizing(true);
                            try {
                              const me = AuthService.getCurrentUser();
                              if (!me?.id) {
                                await Swal.fire({
                                  title: "Error",
                                  text: "Debes iniciar sesión para comprar",
                                  icon: "error",
                                  confirmButtonColor: "#ef4444",
                                });
                                setFinalizing(false);
                                return;
                              }
                              for (const item of cart) {
                                await OrderService.createOrder({
                                  productId: item.id,
                                  customerId: me.id,
                                  quantity: item.quantity,
                                  notes:
                                    "Compra finalizada desde carrito (agricultor)",
                                });
                              }

                              // ✅ Confirmación de compra exitosa
                              await Swal.fire({
                                title: "¡Compra realizada!",
                                html: `
                                  <p class="text-gray-700">Tu pedido ha sido procesado exitosamente</p>
                                  <p class="text-sm text-gray-600 mt-2">Puedes ver el estado en la sección de Órdenes</p>
                                `,
                                icon: "success",
                                timer: 2500,
                                timerProgressBar: true,
                                showConfirmButton: false,
                              });

                              setCart([]);
                              setShowCart(false);

                              // 🔄 Recargar productos para actualizar el stock
                              await loadApprovedProducts();
                            } catch (err) {
                              console.error(err);

                              // ❌ Error en la compra
                              await Swal.fire({
                                title: "Error al procesar compra",
                                text: "No se pudo completar la compra. Intenta nuevamente",
                                icon: "error",
                                confirmButtonColor: "#ef4444",
                              });
                            } finally {
                              setFinalizing(false);
                            }
                          }}
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          {finalizing ? "Procesando…" : "Finalizar Compra"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Agregar, Editar Propiedad */}
      <AnimatePresence>
        {showAddPropiedad && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddPropiedad(false)}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Agregar Nueva Propiedad
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddPropiedad(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <form onSubmit={handleAddPropiedad} className="space-y-6">
                  <div>
                    <Label htmlFor="propiedadNombre">
                      Nombre de la Propiedad *
                    </Label>
                    <Input
                      id="propiedadNombre"
                      value={propiedadForm.nombre}
                      onChange={(e) =>
                        setPropiedadForm({
                          ...propiedadForm,
                          nombre: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="localizacion">Localización *</Label>
                      <Input
                        id="localizacion"
                        value={propiedadForm.localizacion}
                        onChange={(e) =>
                          setPropiedadForm({
                            ...propiedadForm,
                            localizacion: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tamano">Tamaño *</Label>
                      <Input
                        id="tamano"
                        value={propiedadForm.tamano}
                        onChange={(e) =>
                          setPropiedadForm({
                            ...propiedadForm,
                            tamano: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="propiedadComentario">Comentario</Label>
                    <Textarea
                      id="propiedadComentario"
                      value={propiedadForm.comentario}
                      onChange={(e) =>
                        setPropiedadForm({
                          ...propiedadForm,
                          comentario: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddPropiedad(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Propiedad
                    </Button>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditPropiedad(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Editar Propiedad
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditPropiedad(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSavePropiedad} className="space-y-6">
                  <div>
                    <Label>Nombre *</Label>
                    <Input
                      value={propiedadEditForm.nombre}
                      onChange={(e) =>
                        setPropiedadEditForm({
                          ...propiedadEditForm,
                          nombre: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Localización *</Label>
                      <Input
                        value={propiedadEditForm.localizacion}
                        onChange={(e) =>
                          setPropiedadEditForm({
                            ...propiedadEditForm,
                            localizacion: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Tamaño *</Label>
                      <Input
                        value={propiedadEditForm.tamano}
                        onChange={(e) =>
                          setPropiedadEditForm({
                            ...propiedadEditForm,
                            tamano: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Comentario</Label>
                    <Textarea
                      value={propiedadEditForm.comentario}
                      onChange={(e) =>
                        setPropiedadEditForm({
                          ...propiedadEditForm,
                          comentario: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowEditPropiedad(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
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
