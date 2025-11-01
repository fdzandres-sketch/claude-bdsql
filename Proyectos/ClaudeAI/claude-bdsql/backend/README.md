# API Backend - Plataforma Inmobiliaria

Backend completo desarrollado con Node.js y Express para una plataforma inmobiliaria con sistema de autenticación JWT, CRM, tracking y comunicación.

## Características

- ✅ Autenticación JWT con roles (broker, visitante_registrado, anónimo)
- ✅ CRUD completo de propiedades con filtros avanzados
- ✅ Sistema de mensajería y solicitudes de visita
- ✅ CRM para gestión de prospectos
- ✅ Tracking de interacciones y analytics
- ✅ Gestión de zonas y desarrollos
- ✅ Directorio de brokers
- ✅ Validaciones con express-validator
- ✅ Seguridad con helmet y cors
- ✅ Manejo centralizado de errores

## Tecnologías

- Node.js
- Express.js
- MySQL2
- JWT (jsonwebtoken)
- Bcrypt
- Express Validator
- Helmet
- CORS
- Compression
- Morgan

## Instalación

1. **Clonar el repositorio**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inmobiliaria_db
JWT_SECRET=tu_secreto_jwt_muy_seguro
```

4. **Crear base de datos**
```bash
# Ejecuta el script SQL que creaste anteriormente
mysql -u root -p < ../database/schema.sql
```

5. **Iniciar servidor**

Desarrollo:
```bash
npm run dev
```

Producción:
```bash
npm start
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Configuración MySQL
│   │   └── constants.js        # Constantes de la aplicación
│   ├── controllers/
│   │   ├── authController.js   # Autenticación y usuarios
│   │   ├── propertyController.js   # Propiedades públicas
│   │   ├── brokerController.js     # Gestión de propiedades broker
│   │   ├── communicationController.js  # Mensajes y visitas
│   │   ├── crmController.js        # CRM y prospectos
│   │   └── trackingController.js   # Tracking de interacciones
│   ├── models/
│   │   ├── userModel.js
│   │   ├── propertyModel.js
│   │   ├── zoneModel.js
│   │   ├── developmentModel.js
│   │   ├── messageModel.js
│   │   ├── visitModel.js
│   │   ├── prospectModel.js
│   │   └── interactionModel.js
│   ├── middlewares/
│   │   ├── auth.js              # Autenticación JWT
│   │   ├── errorHandler.js     # Manejo de errores
│   │   ├── validate.js         # Validación de requests
│   │   └── validators.js       # Reglas de validación
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── brokerRoutes.js
│   │   ├── communicationRoutes.js
│   │   ├── crmRoutes.js
│   │   └── trackingRoutes.js
│   ├── utils/
│   │   ├── jwt.js              # Utilidades JWT
│   │   └── helpers.js          # Funciones auxiliares
│   └── server.js               # Punto de entrada
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register/broker` | Registrar broker | No |
| POST | `/register/visitor` | Registrar visitante | No |
| POST | `/login` | Iniciar sesión | No |
| GET | `/profile` | Obtener perfil | Sí |
| PUT | `/profile` | Actualizar perfil | Sí |
| POST | `/change-password` | Cambiar contraseña | Sí |
| GET | `/brokers` | Directorio de brokers | No |
| GET | `/brokers/:id` | Perfil público broker | No |

### Propiedades Públicas (`/api/properties`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar propiedades con filtros | Opcional |
| GET | `/:id` | Detalle de propiedad | Opcional |
| GET | `/featured` | Propiedades destacadas | Opcional |
| GET | `/:id/similar` | Propiedades similares | No |
| GET | `/zones` | Listar zonas | No |
| GET | `/zones/:id` | Detalle de zona | No |
| GET | `/developments` | Listar desarrollos | No |
| GET | `/developments/:id` | Detalle de desarrollo | No |

**Filtros disponibles:**
- `tipo_propiedad`: casa, departamento, terreno, etc.
- `tipo_transaccion`: venta, renta
- `zona_id`: ID de la zona
- `desarrollo_id`: ID del desarrollo
- `precio_min`, `precio_max`: Rango de precio
- `recamaras`, `banos`, `estacionamientos`: Cantidad mínima
- `terreno_min`, `construccion_min`: Superficie mínima
- `search`: Búsqueda por texto
- `orden`: campo para ordenar (precio, fecha_creacion, vistas)
- `direccion`: ASC o DESC
- `page`, `limit`: Paginación

### Gestión Broker (`/api/broker`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/properties` | Mis propiedades | Broker |
| POST | `/properties` | Crear propiedad | Broker |
| PUT | `/properties/:id` | Actualizar propiedad | Broker |
| PATCH | `/properties/:id/pause` | Pausar propiedad | Broker |
| PATCH | `/properties/:id/activate` | Activar propiedad | Broker |
| PATCH | `/properties/:id/inactivate` | Inactivar propiedad | Broker |
| POST | `/properties/:id/clone` | Clonar propiedad | Broker |
| DELETE | `/properties/:id` | Eliminar propiedad | Broker |
| POST | `/properties/:id/images` | Agregar imagen | Broker |

### Comunicación (`/api/communication`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/contact` | Contactar broker | Opcional |
| POST | `/visit-requests` | Solicitar visita | Opcional |
| GET | `/conversations` | Mis conversaciones | Sí |
| GET | `/conversations/:propertyId/:otherUserId` | Mensajes | Sí |
| POST | `/conversations/:propertyId/:otherUserId` | Enviar mensaje | Sí |
| GET | `/unread-count` | Mensajes no leídos | Sí |
| GET | `/my-visit-requests` | Mis solicitudes | Sí |
| GET | `/broker/visit-requests` | Solicitudes recibidas | Broker |
| PATCH | `/broker/visit-requests/:id` | Actualizar solicitud | Broker |

### CRM (`/api/crm`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/prospects` | Mis prospectos | Broker |
| GET | `/prospects/stats` | Estadísticas prospectos | Broker |
| GET | `/prospects/:id` | Detalle prospecto | Broker |
| POST | `/prospects` | Crear prospecto | Broker |
| PUT | `/prospects/:id` | Actualizar prospecto | Broker |
| DELETE | `/prospects/:id` | Eliminar prospecto | Broker |
| POST | `/prospects/:id/interactions` | Agregar interacción | Broker |
| GET | `/interactions` | Todas las interacciones | Broker |
| GET | `/stats` | Estadísticas generales | Broker |
| GET | `/properties/:id/interactions` | Interacciones propiedad | Broker |
| GET | `/properties/:id/stats` | Stats propiedad | Broker |

### Tracking (`/api/tracking`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/view/:propertyId` | Registrar vista | Opcional |
| POST | `/contact/:propertyId` | Registrar contacto | Opcional |
| POST | `/phone-reveal/:propertyId` | Registrar teléfono revelado | Opcional |
| POST | `/share/:propertyId` | Registrar compartido | Opcional |
| POST | `/favorite/:propertyId` | Registrar favorito | Opcional |
| POST | `/search` | Registrar búsqueda | Opcional |

## Autenticación

El API utiliza JWT (JSON Web Tokens) para autenticación.

### Registro
```bash
POST /api/auth/register/broker
Content-Type: application/json

{
  "email": "broker@example.com",
  "password": "password123",
  "nombre_completo": "Juan Pérez",
  "telefono": "5551234567",
  "cedula_profesional": "12345"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "broker@example.com",
  "password": "password123"
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Usar el token
```bash
GET /api/broker/properties
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Roles de Usuario

1. **broker**: Puede crear, editar y gestionar propiedades. Acceso a CRM y estadísticas.
2. **visitante_registrado**: Usuario registrado que puede guardar favoritos y enviar mensajes.
3. **anonimo**: Usuario no autenticado con acceso limitado a endpoints públicos.

## Ejemplos de Uso

### Crear Propiedad
```bash
POST /api/broker/properties
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "tipo_propiedad": "casa",
  "tipo_transaccion": "venta",
  "titulo": "Casa en venta en zona residencial",
  "descripcion": "Hermosa casa con jardín...",
  "precio": 3500000,
  "recamaras": 3,
  "banos": 2,
  "estacionamientos": 2,
  "superficie_terreno": 200,
  "superficie_construccion": 150,
  "zona_id": 1,
  "ciudad": "Ciudad de México",
  "estado": "CDMX",
  "imagenes": [
    {
      "imagen_url": "https://...",
      "orden": 1
    }
  ],
  "amenidades": [1, 2, 3]
}
```

### Buscar Propiedades
```bash
GET /api/properties?tipo_propiedad=casa&tipo_transaccion=venta&precio_min=1000000&precio_max=5000000&recamaras=3&page=1&limit=12
```

### Contactar Broker
```bash
POST /api/communication/contact
Content-Type: application/json

{
  "propiedad_id": 1,
  "nombre": "María González",
  "email": "maria@example.com",
  "telefono": "5559876543",
  "mensaje": "Me interesa conocer más sobre esta propiedad"
}
```

### Crear Prospecto (CRM)
```bash
POST /api/crm/prospects
Authorization: Bearer BROKER_TOKEN
Content-Type: application/json

{
  "nombre": "Carlos Ruiz",
  "email": "carlos@example.com",
  "telefono": "5551112233",
  "propiedad_id": 5,
  "origen": "sitio_web",
  "notas": "Interesado en propiedades en la zona norte"
}
```

## Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **Bcrypt**: Encriptación de contraseñas con salt rounds
- **JWT**: Tokens firmados con secreto seguro
- **Express Validator**: Validación de entrada de datos
- **SQL Injection**: Uso de prepared statements con mysql2
- **Rate Limiting**: (Recomendado implementar en producción)

## Manejo de Errores

Todos los errores son manejados centralizadamente y devuelven el siguiente formato:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

Códigos HTTP utilizados:
- `200`: Éxito
- `201`: Recurso creado
- `400`: Error de validación
- `401`: No autenticado
- `403`: No autorizado
- `404`: No encontrado
- `500`: Error del servidor

## Variables de Entorno

Ver archivo `.env.example` para todas las variables disponibles.

Principales:
- `PORT`: Puerto del servidor (default: 3000)
- `DB_*`: Configuración de MySQL
- `JWT_SECRET`: Secreto para firmar tokens
- `JWT_EXPIRES_IN`: Tiempo de expiración del token
- `CORS_ORIGIN`: Origen permitido para CORS

## Deployment

### Producción

1. Configurar variables de entorno en producción
2. Asegurar que `NODE_ENV=production`
3. Usar un proceso manager como PM2:

```bash
npm install -g pm2
pm2 start src/server.js --name inmobiliaria-api
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Testing

Para probar los endpoints puedes usar:
- Postman
- Insomnia
- cURL
- Thunder Client (VSCode extension)

## Próximas Mejoras

- [ ] Tests unitarios y de integración
- [ ] Rate limiting por IP
- [ ] Sistema de notificaciones por email
- [ ] Upload de imágenes a cloud storage
- [ ] Paginación con cursor
- [ ] WebSockets para chat en tiempo real
- [ ] Exportación de reportes en PDF/Excel
- [ ] API de geolocalización
- [ ] Sistema de favoritos mejorado
- [ ] Recomendaciones con ML

## Soporte

Para reportar bugs o solicitar features, por favor crea un issue en el repositorio.

## Licencia

ISC
