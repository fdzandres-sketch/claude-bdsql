# API Endpoints - Guía Rápida

## Base URL
```
http://localhost:3000/api
```

## Autenticación y Usuarios

### Registrar Broker
```http
POST /auth/register/broker
Content-Type: application/json

{
  "email": "broker@example.com",
  "password": "123456",
  "nombre_completo": "Juan Pérez",
  "telefono": "5551234567",
  "cedula_profesional": "ABC123"
}
```

### Registrar Visitante
```http
POST /auth/register/visitor
Content-Type: application/json

{
  "email": "visitante@example.com",
  "password": "123456",
  "nombre_completo": "María González",
  "telefono": "5559876543"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "broker@example.com",
  "password": "123456"
}
```

### Obtener Perfil
```http
GET /auth/profile
Authorization: Bearer {token}
```

### Actualizar Perfil
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_completo": "Juan Pérez Actualizado",
  "telefono": "5551234567",
  "biografia": "Broker profesional..."
}
```

### Cambiar Contraseña
```http
POST /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

### Directorio de Brokers
```http
GET /auth/brokers?verificado=1&search=Juan
```

### Perfil Público de Broker
```http
GET /auth/brokers/{id}
```

## Propiedades (Públicas)

### Listar Propiedades con Filtros
```http
GET /properties?tipo_propiedad=casa&tipo_transaccion=venta&precio_min=1000000&precio_max=5000000&recamaras=3&zona_id=1&page=1&limit=12
```

### Detalle de Propiedad
```http
GET /properties/{id}
```

### Propiedades Destacadas
```http
GET /properties/featured?limit=6
```

### Propiedades Similares
```http
GET /properties/{id}/similar
```

### Listar Zonas
```http
GET /properties/zones
```

### Detalle de Zona
```http
GET /properties/zones/{id}
```

### Listar Desarrollos
```http
GET /properties/developments
```

### Detalle de Desarrollo
```http
GET /properties/developments/{id}
```

## Gestión de Propiedades (Broker)

### Mis Propiedades
```http
GET /broker/properties?estatus=activo
Authorization: Bearer {broker_token}
```

### Crear Propiedad
```http
POST /broker/properties
Authorization: Bearer {broker_token}
Content-Type: application/json

{
  "tipo_propiedad": "casa",
  "tipo_transaccion": "venta",
  "titulo": "Casa hermosa en venta",
  "descripcion": "Descripción detallada...",
  "precio": 3500000,
  "recamaras": 3,
  "banos": 2,
  "medios_banos": 1,
  "estacionamientos": 2,
  "superficie_terreno": 200,
  "superficie_construccion": 150,
  "zona_id": 1,
  "direccion": "Calle Principal 123",
  "ciudad": "Ciudad de México",
  "estado": "CDMX",
  "codigo_postal": "01000",
  "imagenes": [
    {
      "imagen_url": "https://example.com/imagen1.jpg",
      "descripcion": "Fachada",
      "orden": 1
    }
  ],
  "amenidades": [1, 2, 3]
}
```

### Actualizar Propiedad
```http
PUT /broker/properties/{id}
Authorization: Bearer {broker_token}
Content-Type: application/json

{
  "titulo": "Casa hermosa actualizada",
  "precio": 3600000
}
```

### Pausar Propiedad
```http
PATCH /broker/properties/{id}/pause
Authorization: Bearer {broker_token}
```

### Activar Propiedad
```http
PATCH /broker/properties/{id}/activate
Authorization: Bearer {broker_token}
```

### Inactivar Propiedad
```http
PATCH /broker/properties/{id}/inactivate
Authorization: Bearer {broker_token}
```

### Clonar Propiedad
```http
POST /broker/properties/{id}/clone
Authorization: Bearer {broker_token}
```

### Eliminar Propiedad
```http
DELETE /broker/properties/{id}
Authorization: Bearer {broker_token}
```

### Agregar Imagen a Propiedad
```http
POST /broker/properties/{id}/images
Authorization: Bearer {broker_token}
Content-Type: application/json

{
  "imagen_url": "https://example.com/nueva-imagen.jpg",
  "descripcion": "Interior",
  "orden": 2
}
```

## Comunicación

### Contactar Broker
```http
POST /communication/contact
Content-Type: application/json

{
  "propiedad_id": 1,
  "nombre": "María González",
  "email": "maria@example.com",
  "telefono": "5559876543",
  "mensaje": "Me interesa esta propiedad"
}
```

### Solicitar Visita
```http
POST /communication/visit-requests
Content-Type: application/json

{
  "propiedad_id": 1,
  "nombre": "Carlos Ruiz",
  "email": "carlos@example.com",
  "telefono": "5551112233",
  "fecha_preferida": "2024-02-15",
  "hora_preferida": "10:00",
  "mensaje": "Quisiera agendar una visita"
}
```

### Mis Conversaciones
```http
GET /communication/conversations
Authorization: Bearer {token}
```

### Mensajes de una Conversación
```http
GET /communication/conversations/{propertyId}/{otherUserId}
Authorization: Bearer {token}
```

### Enviar Mensaje
```http
POST /communication/conversations/{propertyId}/{otherUserId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "mensaje": "Hola, ¿sigue disponible?"
}
```

### Mensajes No Leídos
```http
GET /communication/unread-count
Authorization: Bearer {token}
```

### Mis Solicitudes de Visita
```http
GET /communication/my-visit-requests
Authorization: Bearer {token}
```

### Solicitudes de Visita (Broker)
```http
GET /communication/broker/visit-requests?estatus=pendiente&propiedad_id=1
Authorization: Bearer {broker_token}
```

### Actualizar Estado de Solicitud (Broker)
```http
PATCH /communication/broker/visit-requests/{id}
Authorization: Bearer {broker_token}
Content-Type: application/json

{
  "estatus": "confirmada",
  "notas_broker": "Visita confirmada para el martes a las 10am"
}
```

## CRM (Solo Broker)

### Mis Prospectos
```http
GET /crm/prospects?estatus=interesado&propiedad_id=1&search=Juan
Authorization: Bearer {broker_token}
```

### Detalle de Prospecto
```http
GET /crm/prospects/{id}
Authorization: Bearer {broker_token}
```

### Crear Prospecto
```http
POST /crm/prospects
Authorization: Bearer {broker_token}
Content-Type: application/json

{
  "nombre": "Ana Martínez",
  "email": "ana@example.com",
  "telefono": "5554445566",
  "propiedad_id": 5,
  "origen": "sitio_web",
  "estatus": "nuevo",
  "notas": "Interesada en casas en zona sur"
}
```

### Actualizar Prospecto
```http
PUT /crm/prospects/{id}
Authorization: Bearer {broker_token}
Content-Type: application/json

{
  "estatus": "negociando",
  "notas": "En proceso de negociación de precio"
}
```

### Eliminar Prospecto
```http
DELETE /crm/prospects/{id}
Authorization: Bearer {broker_token}
```

### Agregar Interacción a Prospecto
```http
POST /crm/prospects/{id}/interactions
Authorization: Bearer {broker_token}
Content-Type: application/json

{
  "tipo": "llamada",
  "descripcion": "Llamada telefónica para seguimiento",
  "fecha_seguimiento": "2024-02-20"
}
```

### Estadísticas de Prospectos
```http
GET /crm/prospects/stats
Authorization: Bearer {broker_token}
```

### Interacciones de Propiedad
```http
GET /crm/properties/{id}/interactions?tipo=vista&fecha_desde=2024-01-01&fecha_hasta=2024-02-01
Authorization: Bearer {broker_token}
```

### Estadísticas de Propiedad
```http
GET /crm/properties/{id}/stats
Authorization: Bearer {broker_token}
```

### Todas las Interacciones
```http
GET /crm/interactions?tipo=contacto&propiedad_id=1
Authorization: Bearer {broker_token}
```

### Estadísticas Generales
```http
GET /crm/stats?fecha_desde=2024-01-01&fecha_hasta=2024-02-01
Authorization: Bearer {broker_token}
```

## Tracking

### Registrar Vista
```http
POST /tracking/view/{propertyId}
```

### Registrar Contacto
```http
POST /tracking/contact/{propertyId}
Content-Type: application/json

{
  "detalles": "Formulario de contacto"
}
```

### Registrar Teléfono Revelado
```http
POST /tracking/phone-reveal/{propertyId}
```

### Registrar Compartido
```http
POST /tracking/share/{propertyId}
Content-Type: application/json

{
  "plataforma": "whatsapp"
}
```

### Registrar Favorito
```http
POST /tracking/favorite/{propertyId}
```

### Registrar Búsqueda
```http
POST /tracking/search
Content-Type: application/json

{
  "resultados": 25
}
```

## Códigos de Estado

- `200` - OK
- `201` - Creado
- `400` - Error de validación
- `401` - No autenticado
- `403` - No autorizado
- `404` - No encontrado
- `500` - Error del servidor

## Formato de Respuesta

### Éxito
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

### Con Paginación
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9,
    "hasNext": true,
    "hasPrev": false
  }
}
```
