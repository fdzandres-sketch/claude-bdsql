export interface Property {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number | string | null;
  tipo_propiedad: string;
  tipo_transaccion: string;
  estado?: string;
  direccion?: string;
  zona_id?: number;
  zona_nombre?: string;
  metros_cuadrados?: number;
  habitaciones?: number;
  banos?: number;
  estacionamientos?: number;
  amenidades?: string;
  broker_id?: number;
  broker_nombre?: string;
  fecha_publicacion?: string;
  fotos?: PropertyPhoto[];
}

export interface PropertyPhoto {
  id: number;
  propiedad_id: number;
  url_foto: string;
  es_principal: boolean;
  orden: number;
}

export interface Zone {
  id: number;
  nombre: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigo_postal?: string;
}

export interface Broker {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  telefono_oficina?: string;
  licencia?: string;
  foto_perfil?: string;
  bio?: string;
  especialidad?: string;
}

export interface Contact {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  propiedad_id?: number;
  tipo_contacto?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
