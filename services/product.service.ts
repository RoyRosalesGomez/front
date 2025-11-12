
// src/services/product.service.ts
import { ProductCategory, ProductStatus } from '@/app/types/product';
import { api, Product } from '@/lib/api';

export class ProductService {
  // Obtener productos aprobados (Marketplace)
  static async getApprovedProducts(filters?: { category?: string; search?: string }) {
    return api.products.getApproved(filters);
  }

  // Obtener todos los productos con filtros
  static async getAllProducts(filters?: {
    status?: string;
    category?: string;
    farmerId?: number;
    search?: string;
  }) {
    return api.products.getAll(filters);
  }

  // 🔧 Obtener productos por agricultor (lo que usa tu dashboard)
  static async getProductsByFarmerId(farmerId: number) {
    // Si tu backend expone /products?farmerId=...
    return api.products.getAll({ farmerId });
  }

  // Crear nuevo producto
  static async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    unit: string;
    stock: number;
    image?: File | null;
    category: ProductCategory;
    status?: ProductStatus;
    farmerId: number;
  }) {
    return api.products.create(productData);
  }

  // Actualizar producto
  static async updateProduct(id: number, productData: Partial<Product> & { image?: File | string }) {
    return api.products.update(id, productData);
  }

  // Eliminar producto
  static async deleteProduct(id: number) {
    return api.products.delete(id);
  }

  // (Opcionales, por si ya los tienes en backend)
  static async approveProduct(id: number) {
    return api.products.approve(id);
  }
  static async rejectProduct(id: number) {
    return api.products.reject(id);
  }
  static async toggleActiveProduct(id: number) {
    return api.products.toggleActive(id);
  }
  static async getStatistics() {
    return api.products.getStatistics();
  }
}
