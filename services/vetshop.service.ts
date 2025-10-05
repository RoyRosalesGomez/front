import { api, VetShop } from '@/lib/api';

export class VetShopService {
  // Obtener agro veterinarias activas (público)
  static async getActiveVetShops() {
    try {
      return await api.vetShops.getActive();
    } catch (error) {
      console.error('Error en VetShopService.getActiveVetShops:', error);
      throw error;
    }
  }

  // Obtener todas las agro veterinarias con filtros (Admin)
  static async getAllVetShops(filters?: { active?: boolean }) {
    try {
      return await api.vetShops.getAll(filters);
    } catch (error) {
      console.error('Error en VetShopService.getAllVetShops:', error);
      throw error;
    }
  }

  // Crear nueva agro veterinaria (Admin)
  static async createVetShop(shopData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    address: string;
    image?: string;
  }) {
    try {
      return await api.vetShops.create(shopData);
    } catch (error) {
      console.error('Error en VetShopService.createVetShop:', error);
      throw error;
    }
  }

  // Actualizar agro veterinaria (Admin)
  static async updateVetShop(id: number, shopData: Partial<VetShop>) {
    try {
      return await api.vetShops.update(id, shopData);
    } catch (error) {
      console.error('Error en VetShopService.updateVetShop:', error);
      throw error;
    }
  }

  // Activar/Desactivar agro veterinaria (Admin)
  static async toggleActiveVetShop(id: number) {
    try {
      return await api.vetShops.toggleActive(id);
    } catch (error) {
      console.error('Error en VetShopService.toggleActiveVetShop:', error);
      throw error;
    }
  }

  // Eliminar agro veterinaria (Admin)
  static async deleteVetShop(id: number) {
    try {
      return await api.vetShops.delete(id);
    } catch (error) {
      console.error('Error en VetShopService.deleteVetShop:', error);
      throw error;
    }
  }

  // Obtener estadísticas (Admin)
  static async getStatistics() {
    try {
      return await api.vetShops.getStatistics();
    } catch (error) {
      console.error('Error en VetShopService.getStatistics:', error);
      throw error;
    }
  }
}