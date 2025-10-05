import { api, Order } from '@/lib/api';

export class OrderService {
  // Crear nueva orden
  static async createOrder(orderData: {
    productId: number;
    customerId: number;
    quantity: number;
    notes?: string;
  }) {
    try {
      return await api.orders.create(orderData);
    } catch (error) {
      console.error('Error en OrderService.createOrder:', error);
      throw error;
    }
  }

  // Obtener todas las órdenes con filtros
  static async getAllOrders(filters?: { 
    status?: string; 
    customerId?: number; 
    farmerId?: number 
  }) {
    try {
      return await api.orders.getAll(filters);
    } catch (error) {
      console.error('Error en OrderService.getAllOrders:', error);
      throw error;
    }
  }

  // Obtener orden por ID
  static async getOrderById(id: number) {
    try {
      return await api.orders.getById(id);
    } catch (error) {
      console.error('Error en OrderService.getOrderById:', error);
      throw error;
    }
  }

  // Actualizar estado de orden
  static async updateOrderStatus(id: number, status: 'pending' | 'processing' | 'delivered' | 'cancelled') {
    try {
      return await api.orders.updateStatus(id, status);
    } catch (error) {
      console.error('Error en OrderService.updateOrderStatus:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  static async getStatistics() {
    try {
      return await api.orders.getStatistics();
    } catch (error) {
      console.error('Error en OrderService.getStatistics:', error);
      throw error;
    }
  }

  // Métodos de conveniencia para cambiar estados
  static async markAsProcessing(id: number) {
    return this.updateOrderStatus(id, 'processing');
  }

  static async markAsDelivered(id: number) {
    return this.updateOrderStatus(id, 'delivered');
  }

  static async markAsCancelled(id: number) {
    return this.updateOrderStatus(id, 'cancelled');
  }
}