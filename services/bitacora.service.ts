import { api, BitacoraEntry } from '@/lib/api';

export class BitacoraService {
  // Crear nueva entrada de bitácora
  static async createEntry(entryData: {
    tipoActividad: string;
    tipoCultivo: string;
    fechaInicio: string;
    fechaFin: string;
    detalle: string;
    lote: string;
    observaciones?: string;
    cantidad: string;
    //farmerId: number;
  }) {
    try {
      return await api.bitacora.create(entryData);
    } catch (error) {
      console.error('Error en BitacoraService.createEntry:', error);
      throw error;
    }
  }

  // Obtener todas las entradas con filtros
  static async getAllEntries(filters?: { farmerId?: number }) {
    try {
      return await api.bitacora.getAll(filters);
    } catch (error) {
      console.error('Error en BitacoraService.getAllEntries:', error);
      throw error;
    }
  }

  // Obtener entrada por ID
  static async getEntryById(id: number) {
    try {
      return await api.bitacora.getById(id);
    } catch (error) {
      console.error('Error en BitacoraService.getEntryById:', error);
      throw error;
    }
  }

  // Actualizar entrada
  static async updateEntry(id: number, entryData: Partial<BitacoraEntry>) {
    try {
      return await api.bitacora.update(id, entryData);
    } catch (error) {
      console.error('Error en BitacoraService.updateEntry:', error);
      throw error;
    }
  }

  // Eliminar entrada
  static async deleteEntry(id: number) {
    try {
      return await api.bitacora.delete(id);
    } catch (error) {
      console.error('Error en BitacoraService.deleteEntry:', error);
      throw error;
    }
  }

  // Obtener entradas por agricultor
  static async getEntriesByFarmer(farmerId: number) {
    return this.getAllEntries({ farmerId });
  }
}






