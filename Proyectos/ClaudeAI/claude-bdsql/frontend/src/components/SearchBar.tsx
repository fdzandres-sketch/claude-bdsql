import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getZones, getPropertyTypes, getTransactionTypes } from '../services/apiService';
import type { Zone } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  tipo_propiedad?: string;
  tipo_transaccion?: string;
  zona_id?: number;
  precio_min?: number;
  precio_max?: number;
  habitaciones?: number;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [zonesData, propTypes, transTypes] = await Promise.all([
          getZones(),
          getPropertyTypes(),
          getTransactionTypes(),
        ]);
        setZones(zonesData);
        setPropertyTypes(propTypes);
        setTransactionTypes(transTypes);
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Transacción
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.tipo_transaccion || ''}
              onChange={(e) => handleChange('tipo_transaccion', e.target.value)}
            >
              <option value="">Todos</option>
              {transactionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Propiedad
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.tipo_propiedad || ''}
              onChange={(e) => handleChange('tipo_propiedad', e.target.value)}
            >
              <option value="">Todos</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.zona_id || ''}
              onChange={(e) => handleChange('zona_id', e.target.value)}
            >
              <option value="">Todas</option>
              {zones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.nombre}, {zone.ciudad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habitaciones
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.habitaciones || ''}
              onChange={(e) => handleChange('habitaciones', e.target.value)}
            >
              <option value="">Cualquiera</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Mínimo
            </label>
            <input
              type="number"
              placeholder="$0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.precio_min || ''}
              onChange={(e) => handleChange('precio_min', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Máximo
            </label>
            <input
              type="number"
              placeholder="Sin límite"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.precio_max || ''}
              onChange={(e) => handleChange('precio_max', e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <FaSearch />
          <span>Buscar Propiedades</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
