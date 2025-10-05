import { api, User } from '@/lib/api';

export class UserService {
  // Obtener todos los usuarios (Admin)
  static async getAllUsers(filters?: { status?: string; search?: string }) {
    try {
      return await api.users.getAll(filters);
    } catch (error) {
      console.error('Error en UserService.getAllUsers:', error);
      throw error;
    }
  }

  // Obtener usuario por ID
  static async getUserById(id: number) {
    try {
      return await api.users.getById(id);
    } catch (error) {
      console.error('Error en UserService.getUserById:', error);
      throw error;
    }
  }

  // Activar usuario (Admin)
  static async activateUser(id: number) {
    try {
      return await api.users.activate(id);
    } catch (error) {
      console.error('Error en UserService.activateUser:', error);
      throw error;
    }
  }

  // Desactivar usuario (Admin)
  static async deactivateUser(id: number) {
    try {
      return await api.users.deactivate(id);
    } catch (error) {
      console.error('Error en UserService.deactivateUser:', error);
      throw error;
    }
  }

  // Cambiar contraseña (Admin)
  static async changePassword(id: number, newPassword: string) {
    try {
      return await api.users.changePassword(id, newPassword);
    } catch (error) {
      console.error('Error en UserService.changePassword:', error);
      throw error;
    }
  }

  

  // Actualizar usuario
  static async updateUser(id: number, userData: Partial<User>) {
    try {
      return await api.users.update(id, userData);
    } catch (error) {
      console.error('Error en UserService.updateUser:', error);
      throw error;
    }
  }

  // Obtener estadísticas (Admin)
  static async getStatistics() {
    try {
      return await api.users.getStatistics();
    } catch (error) {
      console.error('Error en UserService.getStatistics:', error);
      throw error;
    }
  }
}