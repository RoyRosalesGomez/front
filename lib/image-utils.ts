const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
const BASE_URL = API_BASE_URL.replace('/api', ''); // http://localhost:3002

/**
 * Construye la URL completa para una imagen de cultivo
 * @param imagePath - Ruta de la imagen (puede ser relativa o completa)
 * @returns URL completa de la imagen
 */
export function getCultivoImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;

  // Si ya es una URL completa, retornarla
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Si empieza con /uploads, construir URL completa
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }

  // Si es solo el nombre del archivo, agregar la ruta completa
  if (!imagePath.startsWith('/')) {
    return `${BASE_URL}/uploads/cultivos/${imagePath}`;
  }

  return `${BASE_URL}${imagePath}`;
}

/**
 * Construye la URL completa para una imagen de producto
 * @param imagePath - Ruta de la imagen
 * @returns URL completa de la imagen
 */
export function getProductImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }

  if (!imagePath.startsWith('/')) {
    return `${BASE_URL}/uploads/products/${imagePath}`;
  }

  return `${BASE_URL}${imagePath}`;
}

/**
 * Construye la URL completa para cualquier imagen de uploads
 * @param imagePath - Ruta de la imagen
 * @returns URL completa de la imagen
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }

  return `${BASE_URL}${imagePath}`;
}
