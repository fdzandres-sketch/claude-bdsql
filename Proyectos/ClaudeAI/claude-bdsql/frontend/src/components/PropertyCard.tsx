import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaCar, FaRulerCombined } from 'react-icons/fa';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number | string | null | undefined) => {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Check if the price is valid
    if (!numPrice || isNaN(numPrice) || numPrice <= 0) {
      return 'Precio a consultar';
    }

    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const primaryPhoto = property.fotos?.find(f => f.es_principal)?.url_foto ||
                        property.fotos?.[0]?.url_foto ||
                        'https://via.placeholder.com/400x300?text=Sin+Imagen';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/propiedades/${property.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={primaryPhoto}
            alt={property.titulo}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.tipo_transaccion}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{property.tipo_propiedad}</span>
            <span className="text-sm text-gray-500">{property.zona_nombre}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
            {property.titulo}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {property.descripcion}
          </p>

          <div className="flex items-center justify-between mb-3 text-gray-600">
            <div className="flex items-center space-x-1">
              <FaBed />
              <span className="text-sm">{property.habitaciones}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaBath />
              <span className="text-sm">{property.banos}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaCar />
              <span className="text-sm">{property.estacionamientos}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaRulerCombined />
              <span className="text-sm">{property.metros_cuadrados}m²</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(property.precio)}
            </span>
            <span className="text-xs text-gray-500">
              {property.broker_nombre}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
