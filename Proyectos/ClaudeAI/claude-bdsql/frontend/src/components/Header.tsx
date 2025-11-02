import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <FaHome className="text-primary-600 text-3xl" />
            <span className="text-2xl font-bold text-gray-800">VendoRaiz</span>
          </Link>

          <ul className="hidden md:flex space-x-8">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/properties"
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                Propiedades
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                Contacto
              </Link>
            </li>
          </ul>

          <div className="hidden md:block">
            <Link
              to="/contact"
              className="btn-primary"
            >
              Contáctanos
            </Link>
          </div>

          <button className="md:hidden text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
