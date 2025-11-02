import axios from 'axios';
import type { Property, Zone, Broker, Contact, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Properties
export const getProperties = async (filters?: {
  tipo_propiedad?: string;
  tipo_transaccion?: string;
  zona_id?: number;
  precio_min?: number;
  precio_max?: number;
  habitaciones?: number;
}): Promise<Property[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  const response = await api.get<ApiResponse<Property[]>>(`/properties?${params}`);
  return response.data.data || [];
};

export const getPropertyById = async (id: number): Promise<Property | null> => {
  const response = await api.get<ApiResponse<Property>>(`/properties/${id}`);
  return response.data.data || null;
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  const response = await api.get<ApiResponse<Property[]>>('/properties?destacada=true');
  return response.data.data || [];
};

// Zones
export const getZones = async (): Promise<Zone[]> => {
  const response = await api.get<ApiResponse<Zone[]>>('/zones');
  return response.data.data || [];
};

export const getZoneById = async (id: number): Promise<Zone | null> => {
  const response = await api.get<ApiResponse<Zone>>(`/zones/${id}`);
  return response.data.data || null;
};

// Brokers
export const getBrokers = async (): Promise<Broker[]> => {
  const response = await api.get<ApiResponse<Broker[]>>('/brokers');
  return response.data.data || [];
};

export const getBrokerById = async (id: number): Promise<Broker | null> => {
  const response = await api.get<ApiResponse<Broker>>(`/brokers/${id}`);
  return response.data.data || null;
};

// Contact
export const sendContactForm = async (contact: Contact): Promise<boolean> => {
  const response = await api.post<ApiResponse<any>>('/communication/contact', contact);
  return response.data.success || false;
};

// Property types
export const getPropertyTypes = async (): Promise<string[]> => {
  return ['Casa', 'Departamento', 'Terreno', 'Local Comercial', 'Oficina', 'Bodega'];
};

// Transaction types
export const getTransactionTypes = async (): Promise<string[]> => {
  return ['Venta', 'Renta'];
};

export default api;	

