'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
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
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
}

interface CartItem extends Product {
  quantity: number;
}

export default function ClientDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Productos de ejemplo
  const products: Product[] = [
    {
      id: 1,
      name: 'Chayotes Frescos',
      price: 1000,
      image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      category: 'verduras',
      farmer: 'Juan Pérez',
      location: 'Cartago',
      description: 'Chayotes frescos cultivados orgánicamente, perfectos para sopas y guisos tradicionales.',
      unit: 'unidad',
      stock: 50,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Aguacates Hass',
      price: 1500,
      image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg',
      category: 'frutas',
      farmer: 'María González',
      location: 'Alajuela',
      description: 'Aguacates Hass de primera calidad, cremosos y nutritivos, ideales para cualquier comida.',
      unit: 'unidad',
      stock: 30,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Plátanos Maduros',
      price: 800,
      image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
      category: 'frutas',
      farmer: 'Carlos Rodríguez',
      location: 'Limón',
      description: 'Plátanos maduros dulces y naturales, perfectos para postres y batidos.',
      unit: 'unidad',
      stock: 100,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Maíz Amarillo',
      price: 2500,
      image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',
      category: 'granos',
      farmer: 'Ana Jiménez',
      location: 'Guanacaste',
      description: 'Maíz amarillo de grano grande, ideal para tortillas y comidas tradicionales.',
      unit: 'kg',
      stock: 200,
      rating: 4.6
    },
    {
      id: 5,
      name: 'Tomates Cherry',
      price: 1200,
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
      category: 'verduras',
      farmer: 'Luis Morales',
      location: 'San José',
      description: 'Tomates cherry dulces y jugosos, perfectos para ensaladas y decoración.',
      unit: 'bandeja',
      stock: 25,
      rating: 4.8
    },
    {
      id: 6,
      name: 'Frijoles Negros',
      price: 3000,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      category: 'granos',
      farmer: 'Rosa Vargas',
      location: 'Puntarenas',
      description: 'Frijoles negros de alta calidad, ricos en proteína y perfectos para el gallo pinto.',
      unit: 'kg',
      stock: 150,
      rating: 4.9
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: '🌾' },
    { id: 'frutas', name: 'Frutas', icon: '🍎' },
    { id: 'verduras', name: 'Verduras', icon: '🥬' },
    { id: 'granos', name: 'Granos', icon: '🌽' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getIVA = () => {
    return getSubtotal() * 0.13; // 13% IVA
  };

  const getTotal = () => {
    return getSubtotal() + getIVA();
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product, productQuantity);
    setSelectedProduct(null);
    setProductQuantity(1);
    setShowCart(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, productQuantity);
    setSelectedProduct(null);
    setProductQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
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
                <p className="text-sm text-gray-500">Marketplace Cliente</p>
              </div>
            </motion.div>

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
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>CL</AvatarFallback>
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
              <p className="font-semibold text-gray-900">Cliente Usuario</p>
              <p className="text-sm text-gray-500">cliente@agroglobal.com</p>
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

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido al Marketplace! 🛒
          </h2>
          <p className="text-gray-600">
            Descubre productos agrícolas frescos y de calidad directamente de los productores
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'border-gray-200 hover:bg-blue-50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 bg-white overflow-hidden cursor-pointer transform hover:scale-105">
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
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-500 text-white">
                      {product.stock} disponibles
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Por {product.farmer} • {product.location}
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
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Comprar Ahora
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
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
                  alt={selectedProduct.name}
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
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Productor: {selectedProduct.farmer}</span>
                    <span>•</span>
                    <span>Ubicación: {selectedProduct.location}</span>
                    <span>•</span>
                    <Badge className="bg-green-100 text-green-700 flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{selectedProduct.rating}</span>
                    </Badge>
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
                      onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
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
                    <span className="text-lg font-semibold text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₡{(selectedProduct.price * productQuantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleBuyNow(selectedProduct)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Comprar Ahora
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

      {/* Shopping Cart Modal */}
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
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-4">Tu carrito está vacío</p>
                    <Button 
                      onClick={() => setShowCart(false)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
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
                          transition={{ duration: 0.3 }}
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
                              Por {item.farmer} • {item.location}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              ₡{item.price.toLocaleString()} /{item.unit}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-semibold w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
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

                    {/* Totals */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">₡{getSubtotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-600">IVA (13%):</span>
                          <span className="font-semibold">₡{getIVA().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold border-t border-gray-200 pt-3">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-green-600">₡{getTotal().toLocaleString()}</span>
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
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => {
                            alert('¡Compra realizada con éxito! El agricultor será notificado.');
                            setCart([]);
                            setShowCart(false);
                          }}
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Finalizar Compra
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
    </div>
  );
}