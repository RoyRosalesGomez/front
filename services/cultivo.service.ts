import { api, Cultivo } from '@/lib/api';

export class CultivoService {
  // Crear nuevo cultivo
  static async createCultivo(cultivoData: {
    name: string;
    variedad: string;
    comentario?: string;
    image?: File | null;
    farmerId: number;
  }) {
    try {
      return await api.cultivos.create(cultivoData);
    } catch (error) {
      console.error('Error en CultivoService.createCultivo:', error);
      throw error;
    }
  }

  // Obtener todos los cultivos con filtros
  static async getAllCultivos(filters?: { farmerId?: number; active?: boolean }) {
    try {
      return await api.cultivos.getAll(filters);
    } catch (error) {
      console.error('Error en CultivoService.getAllCultivos:', error);
      throw error;
    }
  }

  // Actualizar cultivo
  static async updateCultivo(id: number, cultivoData: Partial<Cultivo>) {
    try {
      return await api.cultivos.update(id, cultivoData);
    } catch (error) {
      console.error('Error en CultivoService.updateCultivo:', error);
      throw error;
    }
  }

  // Activar/Desactivar cultivo
  static async toggleActiveCultivo(id: number) {
    try {
      return await api.cultivos.toggleActive(id);
    } catch (error) {
      console.error('Error en CultivoService.toggleActiveCultivo:', error);
      throw error;
    }
  }

  // Eliminar cultivo
  static async deleteCultivo(id: number) {
    try {
      return await api.cultivos.delete(id);
    } catch (error) {
      console.error('Error en CultivoService.deleteCultivo:', error);
      throw error;
    }
  }

  // Obtener cultivos por agricultor
  static async getCultivosByFarmer(farmerId: number, activeOnly: boolean = true) {
    return this.getAllCultivos({ farmerId, active: activeOnly });
  }

  // Obtener solo cultivos activos
  static async getActiveCultivos(farmerId?: number) {
    return this.getAllCultivos({ farmerId, active: true });
  }
}