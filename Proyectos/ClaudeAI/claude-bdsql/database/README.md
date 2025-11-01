# Base de Datos Inmobiliaria - Documentación

## Información General

- **Versión**: 2.0
- **Motor**: MySQL 8.0+
- **Charset**: utf8mb4 (soporte completo Unicode)
- **Collation**: utf8mb4_unicode_ci
- **Base de datos**: `inmobiliaria_db`

## Características Principales

### Sistema de Soft Delete
- Las propiedades NUNCA se borran físicamente
- Sistema de estados para gestión del ciclo de vida
- Historial completo preservado para análisis

### Tracking Automático
- Cambios de precios registrados automáticamente via triggers
- Seguimiento completo de visitas y búsquedas
- Sistema de sesiones anónimas que se vinculan al registrarse

### Sistema CRM Integrado
- Seguimiento de interacciones por propiedad
- Analytics para brokers sobre rendimiento de sus propiedades
- Clasificación y priorización de prospectos

### Campos Calculados Automáticos
- Conversión automática hectáreas a m²
- Conversión automática USD a MXN
- Cálculo de precio por m² (terreno y construcción)
- Cálculo automático de edad de inmuebles

## Estructura de Tablas

### 1. ZONAS (Base Geográfica)
**Propósito**: Almacenar información geográfica jerárquica

```sql
Campos principales:
- estado, municipio, cp, zona, asentamiento
- ciudad, tipo_zona (Urbano/Rural)
- latitud, longitud (geolocalización)
- calif_zona, nivel_socioeconomico, indice_seguridad
- plusvalia_anual (proyección)
```

**Características**:
- Índices en CP, estado, municipio, ciudad
- Soporte para múltiples códigos postales
- Calificaciones opcionales (Fase 2)

**Relaciones**:
- Una zona puede tener muchas empresas
- Una zona puede tener muchos desarrollos
- Una zona puede tener muchos inmuebles

---

### 2. EMPRESAS (Inmobiliarias y Relacionadas)
**Propósito**: Gestionar empresas del sector inmobiliario

```sql
Campos principales:
- nombre_sociedad, marca_inmobiliaria, marca_franquicia
- giro: Notaria, Desarrolladora, Constructora, Inmobiliaria, etc.
- Dirección completa vinculada a zona
```

**Tipos de empresas soportados**:
- Notaria
- Desarrolladora
- Constructora
- Despacho Arquitectura
- Portal Inmobiliario
- Valuador
- Proveedor Servicios RE
- Inmobiliaria

**Relaciones**:
- Una empresa puede tener muchas personas vinculadas
- Una empresa pertenece a una zona (ubicación física)

---

### 3. PERSONAS (Tabla Unificada)
**Propósito**: Gestionar todos los contactos del sistema

```sql
Campos principales:
- Datos personales: nombre completo, contacto
- clasif_persona: Broker, Prospecto Comprador/Arrendatario/Oferente, Visitante
- prioridad: A, B, C, D, E (clasificación CRM)
- hookup_profiles: JSON con perfiles de redes sociales
- busquedas_recientes: JSON con historial de búsquedas
- proxy_1_venta, proxy_1_renta: Rango de precios calculado
```

**Clasificaciones**:
- **Broker**: Agente inmobiliario
- **Prospecto Comprador**: Interesado en comprar
- **Prospecto Arrendatario**: Interesado en rentar
- **Prospecto Oferente**: Propietario que quiere vender/rentar
- **Visitante sin identificar**: Navegación anónima
- **Otro identificado**: Otros contactos

**Sistema de Priorización**:
- A: Alta prioridad (cliente hot)
- B: Prioridad media-alta
- C: Prioridad media
- D: Prioridad baja
- E: Sin priorizar (default)

**Relaciones**:
- Una persona puede vincularse a una empresa
- Una persona puede tener múltiples relaciones con otras personas
- Una persona (broker) puede gestionar múltiples inmuebles

---

### 4. RELACIONES_PERSONAS (Vínculos)
**Propósito**: Modelar relaciones entre personas

```sql
Campos principales:
- id_persona_1, id_persona_2
- tipo_relacion: principales_empresa, asociados_empresa, familia, socio, referencia
```

**Tipos de relaciones**:
- **principales_empresa**: Dueños/socios principales
- **asociados_empresa**: Empleados/asociados
- **familia**: Vínculos familiares
- **socio**: Socios de negocio
- **referencia**: Referencias profesionales
- **otro**: Otros tipos

**Uso**: Network mapping, identificación de influencers, cadenas de referidos

---

### 5. DESARROLLOS (Fraccionamientos/Condominios)
**Propósito**: Gestionar complejos habitacionales o comerciales

```sql
Campos principales:
- nombre_desarrollo
- tipo_desarrollo: Fraccionamiento privado, Condominio, Plaza comercial, etc.
- calif_desarrollo (1-10)
- amenidades: JSON (alberca, gym, áreas verdes, etc.)
```

**Tipos soportados**:
- Fraccionamiento privado
- Condominio
- Plaza comercial
- Parque industrial
- Edificio
- Otro

**Relaciones**:
- Un desarrollo pertenece a una zona
- Un desarrollo puede tener múltiples inmuebles

---

### 6. INMUEBLES (Propiedades) - Tabla Central
**Propósito**: Registro completo de propiedades en promoción

#### Clasificación
```sql
- tipo_operacion: venta, renta, venta_renta
- tipo_inmueble: 13 tipos (departamento, casa, terreno, etc.)
- caracterizacion: ubicación específica (solo, en privada, en fraccionamiento, etc.)
- vocacion: residencial, comercial, oficina, industrial, vacacional, etc.
```

#### Ubicación
```sql
- id_zona (requerido)
- id_desarrollo (opcional)
- calle, no_exterior, no_interior
- liga_a_desarrollo
```

#### Descripción
```sql
- titulo (300 chars)
- a_destacar (500 chars) - Hook de ventas
- descripcion (TEXT) - Descripción completa
```

#### Superficies
```sql
- unidad_terreno: m2 o has
- medida_terreno, medida_construccion
- m2_terreno: CALCULADO automáticamente (has * 10000)
- medida_jardin, medida_terrazas
- porcentaje_indiviso, m2_indiviso, no_unidades_indiviso
```

#### Sistema de Precios
**Venta**:
```sql
- moneda_venta: MXN o USD
- importe_venta
- tipo_de_cambio (default 1.0000)
- precio_venta_mn: CALCULADO automáticamente
- precio_m2_terrn_mn: CALCULADO
- precio_m2_constr_mn: CALCULADO
```

**Renta**:
```sql
- moneda_renta: MXN o USD
- importe_renta
- precio_renta_mn: CALCULADO automáticamente
```

**Costos adicionales**:
```sql
- mantenimiento_mensual_mn
- predial_bimestral_mn
```

#### Parámetros Físicos
```sql
- recamaras, banos, medios_banos, estacionamientos
- otros_espacios_resid: JSON (estudio, cuarto servicio, etc.)
- otros_espacios_no_resid: JSON (bodega, almacén, etc.)
- areas_comunes: JSON
- servicios_resid: JSON (agua, gas, internet, etc.)
- servicios_no_resid: JSON
```

#### Edad del Inmueble
```sql
- ano_construccion (YEAR)
- ano_ultima_remodelacion (YEAR)
- edad: CALCULADO automáticamente (años desde construcción o última remodelación)
```

#### Información del Broker
```sql
- marca_inmobiliaria, logo_inmobiliaria
- id_broker_encargado (requerido)
- mobil_broker_enc, mail_broker_enc
- mobil_inmobiliaria
```

#### Calificaciones del Broker
El broker puede calificar:
- **calif_overall**: lo mejor, muy bueno, bueno, regular, para remodelar, como terreno
- **calif_terreno_brk**: plano, irregular, descendente, uso de suelo, etc.
- **calif_construccion_brk**: nuevo, muy bueno, estilo moderno, finos acabados, etc.
- **calif_entorno_brk**: exclusivo, excelente ubicación, zona segura, etc.

#### Multimedia
```sql
- fotos: JSON (array de URLs)
- videos: JSON (array de URLs)
- recorrido_3D: URL
- plano: URL
- otras_ligas: JSON
- calidad_fotos: excelente, buena, regular, mejorable
```

#### Control y Estado
```sql
- status:
  - nueva (default)
  - exclusiva
  - alta
  - promocion pausada
  - promocion suspendida
  - operacion cerrada (soft delete)
- agrega_a_listados: BOOLEAN
- contacto_a_broker: BOOLEAN
```

#### Métricas de Tráfico (Calculadas)
```sql
- vistas: número de vistas de la ficha
- clicks: clicks en contacto
- muestras_de_interes: formularios enviados
- visitas: visitas físicas agendadas
- interesados: personas únicas interesadas
```

**Índices**:
- 11 índices para optimizar búsquedas por tipo, precio, zona, broker, status, etc.
- Índice FULLTEXT en titulo, descripcion, a_destacar

---

### 7. HISTORIAL_PRECIOS (Auditoría Automática)
**Propósito**: Registrar todos los cambios de precio automáticamente

```sql
Campos principales:
- id_propiedad
- fecha_cambio (timestamp automático)
- precio_venta_anterior_mn / precio_venta_nuevo_mn
- precio_renta_anterior_mn / precio_renta_nuevo_mn
- tipo_cambio_momento (TC al momento del cambio)
- id_usuario_modifico
- motivo_cambio
```

**Funcionalidad**:
- Se activa AUTOMÁTICAMENTE mediante trigger en UPDATE de inmuebles
- Registra cambios en venta Y/O renta
- Permite análisis de estrategias de pricing
- Historial completo para reportes de tendencias

---

### 8. SESIONES_ANONIMAS (Pre-CRM)
**Propósito**: Trackear visitantes antes de que se registren

```sql
Campos principales:
- fingerprint_navegador (UNIQUE)
- ip_address, user_agent
- fecha_primera_visita, fecha_ultima_visita
- id_persona (se llena al registrarse)
```

**Flujo**:
1. Visitante navega anónimamente → se crea sesión con fingerprint
2. Visitante se registra → se vincula id_persona a la sesión
3. Todo el historial anónimo ahora está vinculado al usuario

**Uso**: Análisis de comportamiento pre-conversión, remarketing

---

### 9. VISITAS_BUSQUEDAS (Analytics Detallado)
**Propósito**: Registrar cada búsqueda y navegación

```sql
Campos principales:
- id_persona / id_sesion (anónimo o identificado)
- timestamp
- landing_page, segundo_page, ... quinto_page (navegación)
- palabras_usadas: JSON
- Filtros de búsqueda: zona, tipo_inmueble, tipo_operacion
- Rangos: superficie, recámaras, baños, precio
- id_propiedad_mas_tiempo (más interesante)
- id_propiedades_abiertas: JSON (todas las vistas)
- id_propiedades_aparecidas_10: JSON (resultados mostrados)
```

**Usos**:
- Identificar patrones de búsqueda
- Calcular proxy de presupuesto del usuario
- Mejorar algoritmos de recomendación
- Identificar propiedades más atractivas

---

### 10. INTERACCIONES_PROPIEDADES (CRM para Brokers)
**Propósito**: Registrar TODAS las interacciones con cada propiedad

```sql
Campos principales:
- id_propiedad, id_broker_dueno
- id_persona_visitante / id_sesion
- tipo_interaccion: vista, click, mensaje, llamada, whatsapp, compartir, guardar_favorito
- fecha_interaccion
- tiempo_visualizacion (segundos en la ficha)
- datos_adicionales: JSON (metadata)
```

**Tipos de interacciones**:
- **vista**: Usuario vio la ficha completa
- **click**: Click en "contactar"
- **mensaje**: Mensaje enviado al broker
- **llamada**: Click en teléfono
- **whatsapp**: Click en WhatsApp
- **compartir**: Compartió la propiedad
- **guardar_favorito**: Guardó como favorito

**Uso para Brokers**:
- Dashboard personalizado con estadísticas
- Identificar leads calientes
- Análisis de rendimiento por propiedad
- Seguimiento de conversiones

---

## Sistema de Triggers

### Trigger: trg_inmuebles_historial_precios
**Activación**: AFTER UPDATE en tabla inmuebles

**Función**:
- Detecta cambios en precio_venta_mn o precio_renta_mn
- Inserta automáticamente registro en historial_precios
- Captura valores anteriores y nuevos
- Registra usuario que hizo el cambio
- Guarda tipo de cambio del momento

**Código**: Ver líneas 538-571 en schema.sql

---

## Vistas Predefinidas

### 1. v_propiedades_activas
Propiedades en promoción con información completa joinada

**Incluye**:
- Todos los campos de inmuebles
- Datos de zona (nombre, ciudad, estado)
- Datos del broker (nombre, email, móvil)
- Marca inmobiliaria vinculada
- Nombre del desarrollo

**Filtro**: Excluye propiedades con status 'operacion cerrada' o 'promocion suspendida'

**Uso**: Vista principal para portal web

---

### 2. v_analytics_busquedas
Analytics de búsquedas de últimos 90 días

**Métricas por día**:
- Número de búsquedas
- Precio promedio buscado (venta)
- Precio promedio buscado (renta)
- Segmentado por tipo_operacion

**Uso**: Dashboard de tendencias de mercado

---

### 3. v_broker_propiedades_top
Ranking de propiedades por broker

**Incluye**:
- Broker (id y nombre)
- Propiedad (id y título)
- Métricas: vistas, clicks, muestras de interés
- Ordenado por vistas DESC

**Filtro**: Solo propiedades con status 'nueva'

**Uso**: Dashboard del broker para ver su rendimiento

---

## Campos Calculados (Generated Columns)

### En tabla INMUEBLES

1. **m2_terreno**
```sql
CASE WHEN unidad_terreno = 'has' THEN medida_terreno * 10000
     ELSE medida_terreno END
```
Convierte automáticamente hectáreas a m²

2. **precio_venta_mn**
```sql
CASE WHEN moneda_venta = 'USD' THEN importe_venta * tipo_de_cambio
     ELSE importe_venta END
```
Normaliza precios de venta a MXN

3. **precio_renta_mn**
```sql
CASE WHEN moneda_renta = 'USD' THEN importe_renta * tipo_de_cambio
     ELSE importe_renta END
```
Normaliza precios de renta a MXN

4. **precio_m2_terrn_mn**
```sql
CASE WHEN m2_terreno > 0 THEN precio_venta_mn / m2_terreno
     ELSE NULL END
```
Calcula precio por m² de terreno

5. **precio_m2_constr_mn**
```sql
CASE WHEN medida_construccion > 0 THEN precio_venta_mn / medida_construccion
     ELSE NULL END
```
Calcula precio por m² de construcción

6. **edad**
```sql
YEAR(CURRENT_DATE) - GREATEST(
    COALESCE(ano_construccion, 0),
    COALESCE(ano_ultima_remodelacion, 0)
)
```
Calcula edad del inmueble (desde construcción o última remodelación)

---

## Índices y Optimización

### Índices Simples
Creados en campos de búsqueda frecuente:
- CPs, estados, municipios (zonas)
- Emails, clasificación, prioridad (personas)
- Tipo operación, tipo inmueble, vocación, precios (inmuebles)
- Fechas (visitas, interacciones, historial)

### Índices Compuestos
- nombre + apellido_paterno (personas)
- fecha + tipo_operacion (búsquedas)

### Índice FULLTEXT
```sql
idx_inmuebles_fulltext ON inmuebles(titulo, descripcion, a_destacar)
```
Permite búsquedas de texto natural tipo Google

**Uso**:
```sql
SELECT * FROM inmuebles
WHERE MATCH(titulo, descripcion, a_destacar)
AGAINST('casa jardín privada' IN NATURAL LANGUAGE MODE);
```

---

## Modelo de Datos - Relaciones

```
zonas (1) ----< (N) inmuebles
zonas (1) ----< (N) empresas
zonas (1) ----< (N) desarrollos

empresas (1) ----< (N) personas (vinculadas)

personas (1) ----< (N) inmuebles (como broker encargado)
personas (N) ----< (N) personas (via relaciones_personas)

desarrollos (1) ----< (N) inmuebles

inmuebles (1) ----< (N) historial_precios
inmuebles (1) ----< (N) interacciones_propiedades

sesiones_anonimas (1) ----< (N) visitas_busquedas
sesiones_anonimas (N) ---- (1) personas (al identificarse)

personas (1) ----< (N) visitas_busquedas
personas (1) ----< (N) interacciones_propiedades
```

---

## Convenciones de Nomenclatura

### Tablas
- Nombres en plural
- snake_case
- Descriptivos

### Campos
- snake_case
- Prefijos descriptivos:
  - `id_` para foreign keys
  - `fecha_` para dates/timestamps
  - `num_`, `cant_` para contadores
  - `precio_`, `importe_` para valores monetarios
  - `calif_` para calificaciones

### Enums
- Valores en español
- Lowercase con espacios cuando aplique
- Descriptivos

---

## Tipos de Datos Usados

### Numéricos
- `INT`: IDs, contadores
- `DECIMAL(15,2)`: Precios en MXN
- `DECIMAL(12,2)`: Superficies
- `DECIMAL(8,4)`: Tipos de cambio
- `DECIMAL(3,1)`: Calificaciones

### Texto
- `VARCHAR(n)`: Campos de longitud limitada
- `TEXT`: Campos largos sin límite específico
- `ENUM`: Valores predefinidos

### Fechas
- `TIMESTAMP`: Con timezone, auto-update
- `YEAR`: Año construcción

### Especiales
- `JSON`: Arrays y objetos estructurados
- `BOOLEAN`: Flags true/false

---

## Consideraciones de Seguridad

### Foreign Keys
- `ON DELETE CASCADE`: Cuando el hijo no tiene sentido sin el padre (interacciones, historial)
- `ON DELETE SET NULL`: Cuando queremos mantener registro pero perder la relación (zona de empresa)
- `ON DELETE RESTRICT`: Cuando no permitimos borrar si hay dependencias (zona de inmueble, broker de inmueble)

### Soft Delete
- NO se usa campo `deleted_at`
- Se usa campo `status` con valores específicos
- Ventaja: Más semántico y permite estados intermedios

### Validaciones
- `NOT NULL` en campos críticos
- `UNIQUE` en fingerprints, emails si aplica
- `DEFAULT` values para evitar NULLs

---

## Flujos de Datos Principales

### 1. Alta de Propiedad
1. Broker se registra → tabla `personas`
2. Broker vincula a inmobiliaria → tabla `empresas`
3. Se registra zona si no existe → tabla `zonas`
4. Se crea desarrollo si aplica → tabla `desarrollos`
5. Se crea inmueble → tabla `inmuebles`
6. Status inicial: 'nueva'

### 2. Navegación de Usuario Anónimo
1. Primera visita → se crea `sesiones_anonimas` con fingerprint
2. Navega y busca → se registra en `visitas_busquedas`
3. Ve propiedades → se registra en `interacciones_propiedades`
4. Usuario se registra → se vincula id_persona a sesión
5. Historial completo ahora atribuido a persona

### 3. Cambio de Precio
1. Broker modifica precio en `inmuebles`
2. **TRIGGER se activa automáticamente**
3. Se inserta registro en `historial_precios`
4. Precio anterior y nuevo quedan registrados

### 4. Lead Caliente
1. Usuario busca repetidamente (múltiples `visitas_busquedas`)
2. Usuario ve misma propiedad varias veces (`interacciones_propiedades`)
3. Usuario pasa mucho tiempo en ficha (campo `tiempo_visualizacion`)
4. Usuario hace click en contactar (`tipo_interaccion = 'click'`)
5. Sistema calcula score de interés
6. Broker recibe notificación de lead caliente

---

## Queries Comunes

### Buscar propiedades en venta en zona específica
```sql
SELECT * FROM v_propiedades_activas
WHERE tipo_operacion IN ('venta', 'venta_renta')
  AND id_zona = 123
  AND precio_venta_mn BETWEEN 2000000 AND 5000000
ORDER BY precio_venta_mn;
```

### Historial de precios de una propiedad
```sql
SELECT
    fecha_cambio,
    precio_venta_anterior_mn,
    precio_venta_nuevo_mn,
    (precio_venta_nuevo_mn - precio_venta_anterior_mn) as diferencia,
    ROUND((precio_venta_nuevo_mn - precio_venta_anterior_mn) / precio_venta_anterior_mn * 100, 2) as porcentaje_cambio
FROM historial_precios
WHERE id_propiedad = 456
ORDER BY fecha_cambio DESC;
```

### Prospectos calientes (múltiples búsquedas recientes)
```sql
SELECT
    p.id_persona,
    CONCAT(p.nombre, ' ', p.apellido_paterno) as nombre_completo,
    p.email,
    p.mobil,
    COUNT(vb.id_visita) as num_busquedas,
    MAX(vb.timestamp) as ultima_busqueda
FROM personas p
JOIN visitas_busquedas vb ON p.id_persona = vb.id_persona
WHERE vb.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY p.id_persona
HAVING num_busquedas >= 3
ORDER BY num_busquedas DESC, ultima_busqueda DESC;
```

### Dashboard de broker
```sql
SELECT
    i.id_propiedad,
    i.titulo,
    i.precio_venta_mn,
    COUNT(DISTINCT ip.id_persona_visitante) as personas_interesadas,
    SUM(CASE WHEN ip.tipo_interaccion = 'vista' THEN 1 ELSE 0 END) as vistas,
    SUM(CASE WHEN ip.tipo_interaccion = 'click' THEN 1 ELSE 0 END) as clicks,
    SUM(CASE WHEN ip.tipo_interaccion IN ('mensaje', 'llamada', 'whatsapp') THEN 1 ELSE 0 END) as contactos
FROM inmuebles i
LEFT JOIN interacciones_propiedades ip ON i.id_propiedad = ip.id_propiedad
WHERE i.id_broker_encargado = 789
  AND i.status NOT IN ('operacion cerrada', 'promocion suspendida')
GROUP BY i.id_propiedad
ORDER BY contactos DESC, vistas DESC;
```

---

## Mantenimiento y Backups

### Tablas de Alto Volumen
- `visitas_busquedas`: Crece constantemente
- `interacciones_propiedades`: Crece constantemente
- `historial_precios`: Crece con cada cambio de precio

**Recomendaciones**:
- Backup diario automático
- Particionamiento por fecha (mensual o trimestral)
- Archivado de datos antiguos (>2 años) a tablas históricas

### Integridad Referencial
Verificar periódicamente:
```sql
-- Inmuebles sin broker válido
SELECT COUNT(*) FROM inmuebles i
LEFT JOIN personas p ON i.id_broker_encargado = p.id_persona
WHERE p.id_persona IS NULL;

-- Inmuebles sin zona válida
SELECT COUNT(*) FROM inmuebles i
LEFT JOIN zonas z ON i.id_zona = z.id_zona
WHERE z.id_zona IS NULL;
```

---

## Próximas Fases

### Fase 2 (Pendiente)
- [ ] Implementar calificaciones de zona completas
- [ ] Sistema de reviews de propiedades
- [ ] Módulo de documentos (contratos, escrituras)
- [ ] Sistema de citas y visitas agendadas

### Fase 3 (Pendiente)
- [ ] Algoritmo de calificación interna automatizado
- [ ] Sistema de recomendaciones ML
- [ ] Chatbot integrado
- [ ] Notificaciones push

### Fase 4 (Pendiente)
- [ ] Integración con portales (Inmuebles24, Vivanuncios)
- [ ] API pública para third-parties
- [ ] Módulo financiero (créditos hipotecarios)
- [ ] Módulo de reportes avanzados

---

## Archivos en este directorio

```
database/
├── schema.sql          # Schema completo (este archivo documentado)
├── migrations/         # Scripts de migración entre versiones
├── seeds/             # Datos de prueba y catálogos iniciales
├── scripts/           # Scripts de utilidad (backups, mantenimiento)
└── README.md          # Este archivo
```

---

## Notas Técnicas

### Encoding
- **utf8mb4**: Soporte completo para emojis y caracteres especiales
- **utf8mb4_unicode_ci**: Case-insensitive, ordenamiento Unicode correcto

### Motor InnoDB
- Soporte transaccional (ACID)
- Foreign keys nativas
- Row-level locking
- Crash recovery

### MySQL 8.0+ Features Usadas
- Generated columns (campos calculados)
- JSON data type con indexing
- CTEs (Common Table Expressions) compatibles
- Window functions disponibles

---

## Soporte

Para preguntas sobre la estructura de la base de datos:
1. Revisar este README
2. Consultar comentarios en schema.sql
3. Revisar documentación de MySQL 8.0

---

**Documentación generada**: 2025-10-29
**Versión del schema**: 2.0
**Mantenedor**: [Tu nombre/equipo]
