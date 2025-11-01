# Resumen de Cambios Realizados en el Backend

## Fecha: 2025-10-30

### Problema Identificado
El backend estaba buscando tablas que no existen en la base de datos real:
- Buscaba tabla **"propiedades"** → La tabla correcta es **"inmuebles"**
- Buscaba tabla **"brokers"** → Los brokers están en **"personas"** con filtro `clasif_persona = 'Broker'`
- Buscaba tabla **"usuarios"** → Los usuarios son **"personas"**

### Archivos Actualizados

#### 1. **backend/src/models/propertyModel.js** ✅
**Cambios principales:**
- `propiedades` → `inmuebles`
- `p.id` → `i.id_propiedad`
- `broker_id` → `id_broker_encargado`
- `estatus` → `status_promocion`
  - `'activo'` → `'promo_activa'`
  - `'pausado'` → `'promo_pausada'`
  - `'inactivo'` → `'promo_concluida'`
- `usuarios` → `personas` con filtro `clasif_persona = 'Broker'`
- `tipo_propiedad` → `tipo_inmueble`
- `tipo_transaccion` → `tipo_operacion`
- `precio` → `precio_venta_mn` / `precio_renta_mn`
- `superficie_terreno` → `m2_terreno` / `medida_terreno`
- `superficie_construccion` → `medida_construccion`
- `antiguedad` → `ano_construccion`
- `fecha_creacion` → `fecha_alta`
- Campos de zona: `z.id` → `z.id_zona`, `z.nombre` → `z.zona`
- Campos de desarrollo: `d.id` → `d.id_desarrollo`, `d.nombre` → `d.nombre_desarrollo`

**Campos de personas (brokers):**
- `nombre_completo` → `CONCAT(nombre, ' ', apellido_paterno, ' ', COALESCE(apellido_materno, ''))`
- `telefono` → `mobil`

#### 2. **backend/src/models/zoneModel.js** ✅
**Cambios principales:**
- `propiedades` → `inmuebles`
- `z.id` → `z.id_zona`
- `p.id` → `i.id_propiedad`
- `p.estatus = 'activo'` → `i.status_promocion = 'promo_activa'`
- `z.nombre` → `z.zona`
- Mapeo de campos: `nombre` → `zona`, `codigo_postal` → `cp`, `descripcion` → `nota`

#### 3. **backend/src/models/developmentModel.js** ✅
**Cambios principales:**
- `propiedades` → `inmuebles`
- `d.id` → `d.id_desarrollo`
- `d.nombre` → `d.nombre_desarrollo`
- `d.zona_id` → `d.id_zona`
- `p.id` → `i.id_propiedad`
- `p.estatus = 'activo'` → `i.status_promocion = 'promo_activa'`
- Las amenidades ahora son un campo JSON en lugar de tabla separada
- Mapeo de campos: `nombre` → `nombre_desarrollo`, `zona_id` → `id_zona`, `descripcion` → `nota`

#### 4. **backend/src/models/userModel.js** ✅
**Cambios principales:**
- `usuarios` → `personas` con `clasif_persona = 'Broker'`
- `u.id` → `p.id_persona`
- `nombre_completo` → concatenación de `nombre`, `apellido_paterno`, `apellido_materno`
- `telefono` → `mobil`
- `propiedades` → `inmuebles`
- `interacciones` → `interacciones_propiedades`
- `rol` → `clasif_persona`
- `biografia` → `nota_persona`
- `fecha_registro` → `created_at`

**Nota importante:** La tabla `personas` no tiene campo `password`. Necesitarás:
- Agregar un campo `password` a la tabla `personas`, o
- Crear una tabla separada para autenticación

#### 5. **backend/src/models/interactionModel.js** ✅
**Cambios principales:**
- `interacciones` → `interacciones_propiedades`
- `propiedades` → `inmuebles`
- `usuarios` → `personas`
- `propiedad_id` → `id_propiedad`
- `broker_id` → `id_broker_dueno`
- `usuario_id` → `id_persona_visitante`
- `tipo` → `tipo_interaccion`
- `fecha` → `fecha_interaccion`
- `detalles` → `datos_adicionales` (JSON)
- Campos de personas: igual que en userModel

#### 6. **backend/src/models/messageModel.js** ⚠️
**Cambios principales:**
- `propiedades` → `inmuebles`
- `usuarios` → `personas`
- Actualizadas las referencias a campos

**Advertencia:** La tabla `mensajes` no existe en el schema actual. Necesitarás crear esta tabla o adaptar el código.

#### 7. **backend/src/models/visitModel.js** ⚠️
**Cambios principales:**
- `propiedades` → `inmuebles`
- `usuarios` → `personas`
- `broker_id` → `id_broker_encargado`
- Actualizadas las referencias a campos

**Advertencia:** La tabla `solicitudes_visita` no existe en el schema actual. Considera usar la tabla `visitas_busquedas` o crear esta tabla.

#### 8. **backend/src/models/prospectModel.js** ⚠️
**Cambios principales:**
- `propiedades` → `inmuebles`
- Actualizadas las referencias a campos de inmuebles

**Advertencia:** La tabla `prospectos` no existe en el schema actual. Considera usar la tabla `personas` con `clasif_persona = 'Prospecto Comprador'` o crear tablas adicionales.

### Tablas que Faltan en el Schema

Las siguientes tablas son usadas por el código pero NO existen en el schema actual:

1. **mensajes** - Para sistema de mensajería
2. **solicitudes_visita** - Para solicitudes de visitas a propiedades
3. **prospectos** - Para gestión de prospectos
4. **interacciones_prospecto** - Para seguimiento de interacciones con prospectos

### Campos que Faltan en la Tabla personas

La tabla `personas` en el schema actual no tiene:
- `password` - Necesario para autenticación
- `ultimo_acceso` - Para tracking de último acceso
- `verificado` - Para verificación de usuarios
- `activo` - Para activar/desactivar usuarios

**Recomendación:** Agregar estos campos a la tabla `personas` o crear una tabla separada de autenticación.

### Mapping Completo de Nombres

| Código Antiguo | Schema Real | Notas |
|----------------|-------------|-------|
| propiedades | inmuebles | Tabla principal |
| propiedades.id | inmuebles.id_propiedad | ID de propiedad |
| propiedades.broker_id | inmuebles.id_broker_encargado | Broker encargado |
| propiedades.estatus | inmuebles.status_promocion | Estado de promoción |
| usuarios | personas (WHERE clasif_persona='Broker') | Brokers en personas |
| brokers | personas (WHERE clasif_persona='Broker') | Brokers en personas |
| zonas.id | zonas.id_zona | ID de zona |
| zonas.nombre | zonas.zona | Nombre de zona |
| desarrollos.id | desarrollos.id_desarrollo | ID de desarrollo |
| desarrollos.nombre | desarrollos.nombre_desarrollo | Nombre de desarrollo |
| interacciones | interacciones_propiedades | Tabla de interacciones |

### Valores de Status

| Valor Antiguo | Valor Nuevo | Uso |
|---------------|-------------|-----|
| activo | promo_activa | Propiedad activa |
| pausado | promo_pausada | Propiedad pausada |
| inactivo | promo_concluida | Propiedad concluida |

### Próximos Pasos Recomendados

1. **Crear las tablas faltantes** en la base de datos:
   - `mensajes`
   - `solicitudes_visita`
   - `prospectos`
   - `interacciones_prospecto`

2. **Agregar campos faltantes** a la tabla `personas`:
   - `password VARCHAR(255)`
   - `ultimo_acceso TIMESTAMP`
   - `verificado BOOLEAN DEFAULT FALSE`
   - `activo BOOLEAN DEFAULT TRUE`

3. **Probar las queries** actualizadas con datos reales

4. **Actualizar los controllers** si hacen referencia directa a nombres de tablas o campos

5. **Actualizar el frontend** si usa nombres de campos antiguos

### Archivos de Respaldo

Los archivos originales fueron respaldados con extensión `.bak`:
- `propertyModel.js.bak`

### Verificación

Para verificar que todo funciona correctamente:

```bash
# Iniciar el servidor
npm start

# Probar los endpoints principales:
# GET /api/properties - Listar propiedades
# GET /api/properties/:id - Ver una propiedad
# GET /api/zones - Listar zonas
# GET /api/developments - Listar desarrollos
```

---

**Importante:** Estos cambios actualizan las queries SQL para que coincidan con el schema real de la base de datos. Sin embargo, algunos features pueden requerir tablas adicionales que aún no existen en el schema.
