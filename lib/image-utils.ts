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
  console.log('🔧 getProductImageUrl recibió:', imagePath);

  if (!imagePath) {
    console.log('❌ imagePath es null/undefined');
    return null;
  }

  // Si ya es una URL completa, retornarla
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('✅ Es URL completa, retornando tal cual');
    return imagePath;
  }

  // Si empieza con /uploads, construir URL completa
  if (imagePath.startsWith('/uploads/')) {
    const url = `${BASE_URL}${imagePath}`;
    console.log('✅ Empieza con /uploads/, URL construida:', url);
    return url;
  }

  // Si incluye "products/" ya en la ruta (ej: "products/products-123.png")
  if (imagePath.startsWith('products/')) {
    const url = `${BASE_URL}/uploads/${imagePath}`;
    console.log('✅ Empieza con products/, URL construida:', url);
    return url;
  }

  // Si incluye "product/" corregir a "products/"
  if (imagePath.startsWith('product/')) {
    const correctedPath = imagePath.replace('product/', 'products/');
    const url = `${BASE_URL}/uploads/${correctedPath}`;
    console.log('🔄 Corregido de product/ a products/, URL construida:', url);
    return url;
  }

  // Si es solo el nombre del archivo, agregar la ruta completa
  if (!imagePath.startsWith('/')) {
    const url = `${BASE_URL}/uploads/products/${imagePath}`;
    console.log('✅ Solo nombre de archivo, URL construida:', url);
    return url;
  }

  const url = `${BASE_URL}${imagePath}`;
  console.log('✅ Caso por defecto, URL construida:', url);
  return url;
}

/**
 * Construye la URL completa para una imagen de veterinaria
 * @param imagePath - Ruta de la imagen
 * @returns URL completa de la imagen
 */
export function getVetShopImageUrl(imagePath: string | null | undefined): string | null {
  console.log('🔧 getVetShopImageUrl recibió:', imagePath);

  if (!imagePath) {
    console.log('❌ imagePath es null/undefined');
    return null;
  }

  // Si ya es una URL completa, retornarla
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('✅ Es URL completa, retornando tal cual');
    return imagePath;
  }

  // Si empieza con /uploads, construir URL completa
  if (imagePath.startsWith('/uploads/')) {
    const url = `${BASE_URL}${imagePath}`;
    console.log('✅ Empieza con /uploads/, URL construida:', url);
    return url;
  }

  // Si incluye "vet-shops/" ya en la ruta
  if (imagePath.startsWith('vet-shops/')) {
    const url = `${BASE_URL}/uploads/${imagePath}`;
    console.log('✅ Empieza con vet-shops/, URL construida:', url);
    return url;
  }

  // Si es solo el nombre del archivo, agregar la ruta completa
  if (!imagePath.startsWith('/')) {
    const url = `${BASE_URL}/uploads/vet-shops/${imagePath}`;
    console.log('✅ Solo nombre de archivo, URL construida:', url);
    return url;
  }

  const url = `${BASE_URL}${imagePath}`;
  console.log('✅ Caso por defecto, URL construida:', url);
  return url;
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
