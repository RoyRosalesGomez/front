import { api, Propiedad } from '@/lib/api';

export class PropiedadService {
  // Crear nueva propiedad
  // services/propiedad.service.ts
// Antes: farmerId: number;
static async createPropiedad(propiedadData: {
  nombre: string;
  localizacion: string;
  tamano: string;
  comentario?: string;
  farmerId?: number;   // <-- opcional aquí
}) {
  try {
    return await api.propiedades.create(propiedadData);
  } catch (error) {
    console.error('Error en PropiedadService.createPropiedad:', error);
    throw error;
  }
}

  // Obtener todas las propiedades con filtros
  static async getAllPropiedades(filters?: { farmerId?: number; active?: boolean }) {
    try {
      return await api.propiedades.getAll(filters);
    } catch (error) {
      console.error('Error en PropiedadService.getAllPropiedades:', error);
      throw error;
    }
  }

  // Actualizar propiedad
  static async updatePropiedad(id: number, propiedadData: Partial<Propiedad>) {
    try {
      return await api.propiedades.update(id, propiedadData);
    } catch (error) {
      console.error('Error en PropiedadService.updatePropiedad:', error);
      throw error;
    }
  }

  // Activar/Desactivar propiedad
  static async toggleActivePropiedad(id: number) {
    try {
      return await api.propiedades.toggleActive(id);
    } catch (error) {
      console.error('Error en PropiedadService.toggleActivePropiedad:', error);
      throw error;
    }
  }

  // Eliminar propiedad
  static async deletePropiedad(id: number) {
    try {
      return await api.propiedades.delete(id);
    } catch (error) {
      console.error('Error en PropiedadService.deletePropiedad:', error);
      throw error;
    }
  }

  // Obtener propiedades por agricultor
  static async getPropiedadesByFarmer(farmerId: number, activeOnly: boolean = true) {
    return this.getAllPropiedades({ farmerId, active: activeOnly });
  }

  // Obtener solo propiedades activas
  static async getActivePropiedades(farmerId?: number) {
    return this.getAllPropiedades({ farmerId, active: true });
  }
}