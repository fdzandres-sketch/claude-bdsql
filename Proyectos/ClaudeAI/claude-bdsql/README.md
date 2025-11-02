# 🏠 Portal Inmobiliario - Sistema Completo
**Estado: Backend Funcional ✅ | Base de Datos Completa ✅**

## 📝 Descripción
Sistema de gestión inmobiliaria profesional con base de datos MySQL de 14 tablas, API REST completa en Node.js + Express, y sistema de catálogos dinámicos.

**✨ ACTUALMENTE FUNCIONANDO:**
- ✅ Base de datos MySQL con 14 tablas relacionales
- ✅ API REST con 5 endpoints públicos
- ✅ Sistema de autenticación JWT
- ✅ Catálogos dinámicos (140+ opciones)
- ✅ CRM para brokers
- ✅ Sistema de clones de propiedades
- ✅ Tracking de visitantes y búsquedas

## 🛠️ Stack Tecnológico (Implementado)
- **Backend:** Node.js 18+ + Express 4.x
- **Base de Datos:** MySQL 8.0 / MariaDB 10.4+
- **Autenticación:** JWT (jsonwebtoken)
- **Seguridad:** bcrypt, helmet, cors
- **Validación:** express-validator

## 📊 Base de Datos (14 Tablas)
1. zonas - Ubicaciones geográficas (15 registros)
2. empresas - Inmobiliarias (6 registros)
3. personas - Brokers y clientes (9 brokers)
4. relaciones_personas - Vínculos entre personas
5. desarrollos - Fraccionamientos y condominios
6. propiedades_fisicas - Inmuebles únicos
7. inmuebles - Promociones de propiedades (10 activas)
8. historial_precios - Cambios de precios
9. sesiones_anonimas - Visitantes sin registro
10. visitas_busquedas - Tracking de búsquedas
11. interacciones_propiedades - CRM
12. catalogos_opciones - Opciones dinámicas (140+ opciones)
13. mensajes - Comunicación broker-cliente
14. solicitudes_visita - Agendamiento de citas
15. prospectos - Pipeline de ventas

## 📡 API Endpoints (Funcionando)

### Públicos (sin autenticación)
- `GET /api/properties` - Listar propiedades con filtros
- `GET /api/properties/:id` - Detalle de propiedad
- `GET /api/zones` - Listar zonas con estadísticas
- `GET /api/developments` - Listar desarrollos
- `GET /api/brokers` - Directorio de brokers
- `GET /api/brokers/:id` - Perfil de broker
- `GET /api/catalogos` - Todos los catálogos
- `GET /api/catalogos/:campo` - Opciones de un campo

### Autenticados (requieren JWT)
- `POST /api/auth/registro-broker` - Registro de broker
- `POST /api/auth/login` - Login
- `POST /api/properties` - Crear propiedad
- `PUT /api/properties/:id` - Actualizar propiedad
- `PATCH /api/properties/:id/pausar` - Pausar promoción

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+
- MySQL 8.0+ o MariaDB 10.4+
- Git

### Paso 1: Clonar repositorio
```bash
git clone https://github.com/fdzandres-sketch/claude-bdsql.git
cd claude-bdsql
```

### Paso 2: Instalar MySQL/MariaDB
(Instrucciones según tu sistema operativo)

### Paso 3: Crear base de datos
```bash
cd database
mysql -u root -p < setup.sql
mysql -u root -p bienesraicesdb < schema.sql
mysql -u root -p bienesraicesdb < seed.sql
mysql -u root -p bienesraicesdb < catalogos.sql
mysql -u root -p bienesraicesdb < tablas_crm.sql
```

### Paso 4: Instalar dependencias del backend
```bash
cd backend
npm install
```

### Paso 5: Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

### Paso 6: Iniciar servidor
```bash
npm run dev
```

El servidor estará disponible en: http://localhost:5000

## 🧪 Probar la API
```bash
# Listar propiedades
curl http://localhost:5000/api/properties

# Listar zonas
curl http://localhost:5000/api/zones

# Ver catálogos
curl http://localhost:5000/api/catalogos
```

## 📁 Estructura del Proyecto
```
claude-bdsql/
├── database/              # Base de datos
│   ├── schema.sql        # 14 tablas (644 líneas)
│   ├── seed.sql          # Datos de ejemplo
│   ├── catalogos.sql     # 140+ opciones
│   └── tablas_crm.sql    # Tablas CRM
│
└── backend/              # API REST
    ├── src/
    │   ├── controllers/  # 8 controladores
    │   ├── models/       # 8 modelos
    │   ├── routes/       # 6 archivos de rutas
    │   ├── middlewares/  # Auth, validación, errores
    │   └── config/       # Configuración DB
    ├── .env.example
    └── package.json
```

## 🎯 Roadmap
- [x] Diseño de base de datos (14 tablas)
- [x] Implementación de schema SQL
- [x] API Backend básica (Node.js + Express)
- [x] Endpoints públicos (propiedades, zonas, brokers)
- [x] Sistema de catálogos dinámicos
- [x] Autenticación JWT
- [x] Tablas CRM (mensajes, visitas, prospectos)
- [ ] Frontend React (próximo)
- [ ] Dashboard de administración
- [ ] Sistema de carga de imágenes
- [ ] Integración con WhatsApp
- [ ] Deploy a producción

## 👤 Autor
**Andrés** - Desarrollador
- GitHub: [@fdzandres-sketch](https://github.com/fdzandres-sketch)

## 📄 Licencia
Este proyecto es privado y su uso está restringido.

---
**Estado del Proyecto:** 🟢 Backend Funcional | 🟡 Frontend en Desarrollo
