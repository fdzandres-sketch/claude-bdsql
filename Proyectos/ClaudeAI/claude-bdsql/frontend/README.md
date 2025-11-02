# VendoRaiz - Frontend

Portal inmobiliario desarrollado con React, Vite, TypeScript y Tailwind CSS.

## Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y dev server ultrarrápido
- **TypeScript** - Superset de JavaScript con tipado estático
- **React Router DOM** - Navegación entre páginas
- **Axios** - Cliente HTTP para consumir APIs
- **Tailwind CSS** - Framework de CSS utility-first
- **React Icons** - Biblioteca de iconos

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PropertyCard.tsx
│   │   └── SearchBar.tsx
│   ├── pages/          # Páginas principales
│   │   ├── Home.tsx
│   │   ├── Properties.tsx
│   │   ├── PropertyDetail.tsx
│   │   └── Contact.tsx
│   ├── services/       # Servicios API
│   │   └── apiService.ts
│   ├── types/          # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Punto de entrada
├── public/             # Archivos estáticos
└── package.json
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Ajustar la URL del API en `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Desarrollo

Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Construcción

Construir para producción:
```bash
npm run build
```

Vista previa de la versión de producción:
```bash
npm run preview
```

## Características

### Componentes

- **Header**: Navegación principal con logo y menú
- **Footer**: Información de contacto y redes sociales
- **PropertyCard**: Tarjeta de propiedad con información resumida
- **SearchBar**: Barra de búsqueda con filtros avanzados

### Páginas

- **Home**: Landing page con propiedades destacadas
- **Properties**: Listado de propiedades con búsqueda y filtros
- **PropertyDetail**: Detalle completo de una propiedad
- **Contact**: Formulario de contacto

### Servicios API

El archivo `src/services/apiService.ts` incluye funciones para:
- `getProperties()` - Obtener listado de propiedades con filtros
- `getPropertyById(id)` - Obtener detalle de una propiedad
- `getZones()` - Obtener catálogo de zonas
- `getBrokers()` - Obtener catálogo de brokers
- `sendContactForm()` - Enviar formulario de contacto

## Configuración del Proxy

El archivo `vite.config.ts` está configurado con un proxy para desarrollo:
- Todas las peticiones a `/api/*` se redirigen a `http://localhost:5000`
- Esto evita problemas de CORS durante el desarrollo

## Estilos

El proyecto usa Tailwind CSS con clases de utilidad. Los estilos personalizados están definidos en:
- `src/index.css` - Configuración de Tailwind y estilos globales
- `tailwind.config.js` - Configuración del tema

### Clases Personalizadas

- `.btn-primary` - Botón principal
- `.btn-secondary` - Botón secundario

## Consideraciones

- El frontend está configurado para funcionar con el backend en `http://localhost:5000`
- Las rutas están protegidas y manejan estados de carga y error
- El diseño es completamente responsive
- Se incluyen placeholders para imágenes faltantes
- Los formularios incluyen validación básica

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Vista previa de producción
- `npm run lint` - Ejecuta el linter
