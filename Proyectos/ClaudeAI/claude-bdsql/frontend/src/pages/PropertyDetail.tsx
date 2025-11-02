import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBed, FaBath, FaCar, FaRulerCombined, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { getPropertyById } from '../services/apiService';
import type { Property } from '../types';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getPropertyById(Number(id));
        setProperty(data);
      } catch (error) {
        console.error('Error loading property:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Propiedad no encontrada
          </h2>
          <Link to="/propiedades" className="text-primary-600 hover:text-primary-700">
            Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const images = property.fotos && property.fotos.length > 0
    ? property.fotos.sort((a, b) => a.orden - b.orden).map(f => f.url_foto)
    : ['https://via.placeholder.com/800x600?text=Sin+Imagen'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/propiedades"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <FaArrowLeft />
          <span>Volver a propiedades</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <img
                src={images[selectedImage]}
                alt={property.titulo}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${property.titulo} ${idx + 1}`}
                    className={`h-20 object-cover rounded cursor-pointer ${
                      selectedImage === idx ? 'ring-2 ring-primary-600' : ''
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property.tipo_transaccion}
                </span>
                <span className="text-sm text-gray-500">{property.tipo_propiedad}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {property.titulo}
              </h1>

              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <FaMapMarkerAlt />
                <span>{property.direccion}, {property.zona_nombre}</span>
              </div>

              <div className="text-4xl font-bold text-primary-600 mb-6">
                {formatPrice(property.precio)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FaBed className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Habitaciones</p>
                    <p className="font-semibold">{property.habitaciones}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBath className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Baños</p>
                    <p className="font-semibold">{property.banos}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCar className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Estacionamientos</p>
                    <p className="font-semibold">{property.estacionamientos}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRulerCombined className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Tamaño</p>
                    <p className="font-semibold">{property.metros_cuadrados}m²</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Agente Inmobiliario
                </h3>
                <p className="text-gray-700">{property.broker_nombre}</p>
                <Link
                  to="/contacto"
                  className="mt-4 w-full btn-primary block text-center"
                >
                  Contactar Agente
                </Link>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">{property.descripcion}</p>
          </div>

          {/* Amenities */}
          {property.amenidades && (
            <div className="border-t p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenidades.split(',').map((amenidad, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{amenidad.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
