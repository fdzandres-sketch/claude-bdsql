# Sistema de Gestión Inmobiliaria

## Descripción del Proyecto

Sistema integral de gestión inmobiliaria que permite administrar propiedades, clientes, transacciones y documentación relacionada con el negocio inmobiliario. La plataforma facilita la gestión de alquileres, ventas, mantenimiento de propiedades y seguimiento de clientes.

## Características Principales

- **Gestión de Propiedades**: Registro y administración completa de inmuebles (casas, apartamentos, locales comerciales, terrenos)
- **Gestión de Clientes**: Base de datos de propietarios, compradores, inquilinos y prospectos
- **Transacciones**: Control de ventas, alquileres, pagos y comisiones
- **Documentación**: Almacenamiento y gestión de contratos, escrituras y documentos legales
- **Reportes y Analytics**: Dashboard con métricas clave del negocio
- **Búsqueda Avanzada**: Filtros por ubicación, precio, características y disponibilidad
- **Calendario**: Gestión de citas, visitas y recordatorios

## Estructura del Proyecto

```
claude-bdsql/
├── database/           # Esquemas y scripts de base de datos
│   ├── schemas/       # Definiciones de tablas y relaciones
│   ├── migrations/    # Scripts de migración
│   ├── seeds/         # Datos iniciales
│   └── scripts/       # Scripts de utilidad
│
├── backend/           # API y lógica de negocio
│   ├── src/
│   │   ├── controllers/  # Controladores de rutas
│   │   ├── models/       # Modelos de datos
│   │   ├── routes/       # Definición de endpoints
│   │   ├── services/     # Lógica de negocio
│   │   ├── middleware/   # Middleware personalizado
│   │   ├── utils/        # Funciones auxiliares
│   │   └── config/       # Configuración
│   └── tests/         # Tests unitarios y de integración
│
└── frontend/          # Interfaz de usuario
    ├── src/
    │   ├── components/   # Componentes reutilizables
    │   ├── pages/        # Páginas de la aplicación
    │   ├── services/     # Servicios API
    │   ├── hooks/        # Custom hooks
    │   ├── context/      # Context API
    │   ├── utils/        # Utilidades frontend
    │   └── assets/       # Imágenes, iconos, estilos
    └── public/        # Archivos estáticos
```

## Tecnologías Previstas

### Base de Datos
- SQL Server / PostgreSQL / MySQL
- Sistema de respaldo automático
- Optimización de consultas

### Backend
- Node.js + Express / Python + FastAPI / .NET Core
- JWT para autenticación
- API RESTful
- Validación de datos
- Logging y monitoreo

### Frontend
- React / Vue.js / Angular
- TypeScript
- State Management (Redux/Zustand/Pinia)
- UI Component Library
- Responsive Design

## Módulos del Sistema

### 1. Módulo de Propiedades
- Registro de inmuebles con fotografías
- Características detalladas (m², habitaciones, baños, etc.)
- Ubicación geográfica
- Estado y disponibilidad
- Historial de la propiedad

### 2. Módulo de Clientes
- Información de contacto
- Historial de interacciones
- Preferencias de búsqueda
- Documentos asociados
- Segmentación de clientes

### 3. Módulo de Transacciones
- Registro de ventas y alquileres
- Control de pagos y cuotas
- Cálculo de comisiones
- Estados de transacciones
- Generación de recibos

### 4. Módulo de Documentos
- Almacenamiento seguro
- Versionado de documentos
- Firma digital
- Templates de contratos
- Cumplimiento legal

### 5. Módulo de Reportes
- Dashboard ejecutivo
- Reportes de ventas
- Análisis de mercado
- Proyecciones financieras
- Exportación a PDF/Excel

## Instalación

### Prerrequisitos
- Node.js v18+ / Python 3.10+ / .NET 8+
- Base de datos instalada
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd claude-bdsql
```

2. **Configurar Base de Datos**
```bash
cd database
# Ejecutar scripts de creación de esquema
# Ejecutar migraciones
# (Instrucciones específicas según el motor de BD)
```

3. **Configurar Backend**
```bash
cd backend
npm install  # o pip install -r requirements.txt
# Configurar variables de entorno
cp .env.example .env
# Iniciar servidor
npm run dev  # o python main.py
```

4. **Configurar Frontend**
```bash
cd frontend
npm install
# Configurar variables de entorno
cp .env.example .env
# Iniciar aplicación
npm run dev
```

## Configuración

Crear archivo `.env` en cada módulo con las siguientes variables:

### Backend
```env
DATABASE_URL=
JWT_SECRET=
PORT=
NODE_ENV=development
```

### Frontend
```env
VITE_API_URL=
VITE_APP_NAME=
```

## Desarrollo

### Comandos Útiles

**Backend:**
```bash
npm run dev      # Desarrollo
npm run build    # Compilar
npm run test     # Tests
npm run lint     # Linter
```

**Frontend:**
```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run test     # Tests
npm run preview  # Preview producción
```

## Roadmap

- [ ] Fase 1: Diseño de base de datos
- [ ] Fase 2: API Backend básica
- [ ] Fase 3: Frontend interfaz principal
- [ ] Fase 4: Autenticación y autorización
- [ ] Fase 5: Módulo de propiedades
- [ ] Fase 6: Módulo de clientes
- [ ] Fase 7: Módulo de transacciones
- [ ] Fase 8: Sistema de documentos
- [ ] Fase 9: Dashboard y reportes
- [ ] Fase 10: Testing y optimización
- [ ] Fase 11: Deploy y documentación

## Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

[Especificar licencia]

## Contacto

[Información de contacto]

---

**Nota**: Este proyecto está en desarrollo activo. La documentación se actualizará conforme avance la implementación.
