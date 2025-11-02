import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchBar, { type SearchFilters } from '../components/SearchBar';
import { getProperties } from '../services/apiService';
import type { Property } from '../types';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialFilters: SearchFilters = {
      tipo_propiedad: searchParams.get('tipo_propiedad') || undefined,
      tipo_transaccion: searchParams.get('tipo_transaccion') || undefined,
      zona_id: searchParams.get('zona_id') ? Number(searchParams.get('zona_id')) : undefined,
      precio_min: searchParams.get('precio_min') ? Number(searchParams.get('precio_min')) : undefined,
      precio_max: searchParams.get('precio_max') ? Number(searchParams.get('precio_max')) : undefined,
      habitaciones: searchParams.get('habitaciones') ? Number(searchParams.get('habitaciones')) : undefined,
    };
    loadProperties(initialFilters);
  }, [searchParams]);

  const loadProperties = async (searchFilters: SearchFilters) => {
    try {
      setLoading(true);
      const data = await getProperties(searchFilters);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters: SearchFilters) => {
    loadProperties(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Propiedades Disponibles</h1>
          <p className="text-xl text-primary-100">
            Explora nuestra selección de propiedades
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Cargando...' : `${properties.length} propiedades encontradas`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron propiedades
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
