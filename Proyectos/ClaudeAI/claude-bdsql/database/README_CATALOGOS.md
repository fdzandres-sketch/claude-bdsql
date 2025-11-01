# Sistema de Catálogos de Opciones

## Índice

1. [¿Qué son los Catálogos?](#qué-son-los-catálogos)
2. [Estructura de la Tabla](#estructura-de-la-tabla)
3. [Catálogos Disponibles](#catálogos-disponibles)
4. [Cómo Agregar Nuevas Opciones](#cómo-agregar-nuevas-opciones)
5. [Consumo desde el Frontend](#consumo-desde-el-frontend)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Mejores Prácticas](#mejores-prácticas)

---

## ¿Qué son los Catálogos?

Los catálogos son listas de opciones predefinidas para campos de selección múltiple en el sistema inmobiliario. En lugar de almacenar estas opciones directamente en el código del frontend o en archivos de configuración, se centralizan en la base de datos para:

- **Consistencia**: Todos los componentes usan las mismas opciones
- **Mantenibilidad**: Fácil actualización sin cambiar código
- **Escalabilidad**: Agregar nuevos campos y opciones sin deploy
- **Multiidioma**: Preparado para traducciones futuras
- **Auditoría**: Control sobre qué opciones están activas

---

## Estructura de la Tabla

```sql
CREATE TABLE catalogos_opciones (
    id_catalogo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_campo VARCHAR(100) NOT NULL,        -- Identificador del campo
    valor_opcion VARCHAR(200) NOT NULL,        -- Valor de la opción
    orden INT DEFAULT 0,                       -- Orden de visualización
    activo BOOLEAN DEFAULT TRUE,               -- Si está disponible
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre_campo (nombre_campo),
    INDEX idx_activo (activo),
    UNIQUE KEY unique_campo_valor (nombre_campo, valor_opcion)
)
```

### Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_catalogo` | INT | Identificador único (auto-incremental) |
| `nombre_campo` | VARCHAR(100) | Nombre del campo al que pertenece la opción |
| `valor_opcion` | VARCHAR(200) | Texto de la opción que se mostrará al usuario |
| `orden` | INT | Número que define el orden de presentación |
| `activo` | BOOLEAN | Si la opción está activa (TRUE) o deshabilitada (FALSE) |
| `created_at` | TIMESTAMP | Fecha de creación del registro |

---

## Catálogos Disponibles

### 1. `otros_espacios_resid` (30 opciones)
Espacios adicionales en propiedades residenciales.

**Ejemplos**: sala, comedor, estudio, cocina, lavandería, cuarto de servicio, terraza, alberca privada, panic room

**Uso en**: Campo JSON `otros_espacios_resid` de la tabla `inmuebles`

---

### 2. `otros_espacios_no_resid` (12 opciones)
Espacios adicionales en propiedades no residenciales (comerciales, industriales, rurales).

**Ejemplos**: cubículos, andén de carga, espuela de tren, bodega, helipuerto, corrales

**Uso en**: Campo JSON `otros_espacios_no_resid` de la tabla `inmuebles`

---

### 3. `areas_comunes` (17 opciones)
Áreas comunes en desarrollos, condominios y edificios.

**Ejemplos**: alberca, gimnasio, jardines, salón de fiestas, paddle tennis, business center

**Uso en**: Campo JSON `areas_comunes` de la tabla `inmuebles` y `desarrollos`

---

### 4. `servicios_resid` (11 opciones)
Servicios y características de propiedades residenciales.

**Ejemplos**: cisterna, paneles solares, vigilancia 24 horas, sistema de alarma, pozo

**Uso en**: Campo JSON `servicios_resid` de la tabla `inmuebles`

---

### 5. `servicios_no_resid` (8 opciones)
Servicios para propiedades no residenciales.

**Ejemplos**: planta de tratamiento, acceso a carretera federal, elevador de carga

**Uso en**: Campo JSON `servicios_no_resid` de la tabla `inmuebles`

---

### 6. `calif_terreno_brk` (10 opciones)
Calificaciones del terreno hechas por el broker.

**Ejemplos**: plano, irregular, ascendente, uso de suelo comercial

**Uso en**: Campo JSON `calif_terreno_brk` de la tabla `inmuebles`

---

### 7. `calif_construccion_brk` (23 opciones)
Calificaciones de la construcción hechas por el broker.

**Ejemplos**: nuevo, recién remodelado, finos acabados, techos altos, buena vista

**Uso en**: Campo JSON `calif_construccion_brk` de la tabla `inmuebles`

---

### 8. `calif_entorno_brk` (12 opciones)
Calificaciones del entorno por el broker.

**Ejemplos**: exclusivo fraccionamiento, zona segura, excelente ubicación

**Uso en**: Campo JSON `calif_entorno_brk` de la tabla `inmuebles`

---

## Cómo Agregar Nuevas Opciones

### Opción A: Mediante INSERT directo

```sql
-- Conectar a la base de datos
USE bienesraicesdb;

-- Agregar una nueva opción al final de un catálogo existente
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden)
VALUES ('otros_espacios_resid', 'sauna', 31);

-- Agregar múltiples opciones
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('servicios_resid', 'sistema de riego automatizado', 12),
('servicios_resid', 'calentador solar', 13),
('servicios_resid', 'planta electrica', 14);
```

### Opción B: Actualizar el archivo catalogos.sql

1. Edita el archivo `database/catalogos.sql`
2. Agrega las nuevas opciones en la sección correspondiente
3. Re-ejecuta el script (ten cuidado con duplicados)

```sql
mysql -u root -p BienesRaicesDB < database/catalogos.sql
```

### Crear un Nuevo Catálogo

```sql
-- Ejemplo: Crear catálogo de tipos de acabados
INSERT INTO catalogos_opciones (nombre_campo, valor_opcion, orden) VALUES
('acabados_pisos', 'marmol', 1),
('acabados_pisos', 'madera', 2),
('acabados_pisos', 'porcelanato', 3),
('acabados_pisos', 'concreto pulido', 4),
('acabados_pisos', 'alfombra', 5);
```

---

## Consumo desde el Frontend

### 1. Endpoint de API (Backend Node.js)

```javascript
// routes/catalogos.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todas las opciones de un catálogo específico
router.get('/catalogos/:nombreCampo', async (req, res) => {
  try {
    const { nombreCampo } = req.params;

    const [opciones] = await db.query(
      'SELECT id_catalogo, valor_opcion, orden FROM catalogos_opciones WHERE nombre_campo = ? AND activo = TRUE ORDER BY orden',
      [nombreCampo]
    );

    res.json(opciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los catálogos (para carga inicial)
router.get('/catalogos', async (req, res) => {
  try {
    const [catalogos] = await db.query(
      'SELECT nombre_campo, valor_opcion, orden FROM catalogos_opciones WHERE activo = TRUE ORDER BY nombre_campo, orden'
    );

    // Agrupar por nombre_campo
    const resultado = catalogos.reduce((acc, item) => {
      if (!acc[item.nombre_campo]) {
        acc[item.nombre_campo] = [];
      }
      acc[item.nombre_campo].push({
        valor: item.valor_opcion,
        orden: item.orden
      });
      return acc;
    }, {});

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 2. Consumo en React/Vue/Angular

#### React Example

```javascript
// hooks/useCatalogos.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCatalogos = (nombreCampo) => {
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await axios.get(`/api/catalogos/${nombreCampo}`);
        setOpciones(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpciones();
  }, [nombreCampo]);

  return { opciones, loading, error };
};

// Componente de ejemplo
import React from 'react';
import { useCatalogos } from './hooks/useCatalogos';

const EspaciosResidencialesSelector = () => {
  const { opciones, loading, error } = useCatalogos('otros_espacios_resid');
  const [seleccionados, setSeleccionados] = useState([]);

  if (loading) return <div>Cargando opciones...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleToggle = (valor) => {
    setSeleccionados(prev =>
      prev.includes(valor)
        ? prev.filter(v => v !== valor)
        : [...prev, valor]
    );
  };

  return (
    <div>
      <h3>Otros Espacios</h3>
      {opciones.map(opcion => (
        <label key={opcion.id_catalogo}>
          <input
            type="checkbox"
            checked={seleccionados.includes(opcion.valor_opcion)}
            onChange={() => handleToggle(opcion.valor_opcion)}
          />
          {opcion.valor_opcion}
        </label>
      ))}
    </div>
  );
};
```

#### Vue 3 Example

```javascript
// composables/useCatalogos.js
import { ref, onMounted } from 'vue';
import axios from 'axios';

export function useCatalogos(nombreCampo) {
  const opciones = ref([]);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      const response = await axios.get(`/api/catalogos/${nombreCampo}`);
      opciones.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  return { opciones, loading, error };
}
```

### 3. Carga de Todos los Catálogos (Optimización)

Para evitar múltiples peticiones HTTP, carga todos los catálogos al inicio:

```javascript
// store/catalogos.js (Redux/Vuex/Zustand)
import axios from 'axios';

const catalogosStore = {
  state: {
    catalogos: {},
    loaded: false
  },

  actions: {
    async loadAllCatalogos({ commit }) {
      try {
        const response = await axios.get('/api/catalogos');
        commit('SET_CATALOGOS', response.data);
        commit('SET_LOADED', true);
      } catch (error) {
        console.error('Error cargando catálogos:', error);
      }
    }
  },

  mutations: {
    SET_CATALOGOS(state, catalogos) {
      state.catalogos = catalogos;
    },
    SET_LOADED(state, loaded) {
      state.loaded = loaded;
    }
  },

  getters: {
    getCatalogo: (state) => (nombreCampo) => {
      return state.catalogos[nombreCampo] || [];
    }
  }
};
```

---

## Ejemplos de Uso

### Ejemplo 1: Guardar Opciones Seleccionadas

```javascript
// Al guardar una propiedad
const propiedadData = {
  titulo: "Casa en Polanco",
  tipo_inmueble: "casa",
  // Los campos JSON almacenan arrays de strings
  otros_espacios_resid: ["sala", "comedor", "terraza", "alberca (privada)"],
  servicios_resid: ["cisterna", "paneles solares", "vigilancia 24 horas"],
  areas_comunes: ["alberca", "gimnasio", "salon de fiestas"],
  // ... otros campos
};

// Backend - Inserción en MySQL
const query = `
  INSERT INTO inmuebles (
    titulo, tipo_inmueble, otros_espacios_resid, servicios_resid, areas_comunes
  ) VALUES (?, ?, ?, ?, ?)
`;

await db.query(query, [
  propiedadData.titulo,
  propiedadData.tipo_inmueble,
  JSON.stringify(propiedadData.otros_espacios_resid),
  JSON.stringify(propiedadData.servicios_resid),
  JSON.stringify(propiedadData.areas_comunes)
]);
```

### Ejemplo 2: Búsqueda por Opciones

```javascript
// Buscar propiedades que tengan alberca
const query = `
  SELECT * FROM inmuebles
  WHERE JSON_CONTAINS(otros_espacios_resid, '"alberca (privada)"')
     OR JSON_CONTAINS(areas_comunes, '"alberca"')
`;

// O más genérico usando LIKE (menos eficiente)
const query2 = `
  SELECT * FROM inmuebles
  WHERE otros_espacios_resid LIKE '%alberca%'
     OR areas_comunes LIKE '%alberca%'
`;
```

### Ejemplo 3: Validación de Opciones

```javascript
// Backend - Validar que las opciones enviadas existen en el catálogo
async function validarOpciones(nombreCampo, opcionesSeleccionadas) {
  const [opcionesValidas] = await db.query(
    'SELECT valor_opcion FROM catalogos_opciones WHERE nombre_campo = ? AND activo = TRUE',
    [nombreCampo]
  );

  const valoresValidos = opcionesValidas.map(o => o.valor_opcion);
  const opcionesInvalidas = opcionesSeleccionadas.filter(
    op => !valoresValidos.includes(op)
  );

  if (opcionesInvalidas.length > 0) {
    throw new Error(`Opciones inválidas: ${opcionesInvalidas.join(', ')}`);
  }

  return true;
}
```

---

## Mejores Prácticas

### 1. Caché en el Frontend

Los catálogos cambian raramente. Implementa caché:

```javascript
// LocalStorage con expiración
const CACHE_KEY = 'catalogos_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

function getCachedCatalogos() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return data;
}

function setCachedCatalogos(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}
```

### 2. Desactivar en Lugar de Eliminar

Nunca elimines opciones que puedan estar en uso. Márcalas como inactivas:

```sql
-- En lugar de DELETE
UPDATE catalogos_opciones
SET activo = FALSE
WHERE nombre_campo = 'otros_espacios_resid'
  AND valor_opcion = 'opcion_obsoleta';
```

### 3. Orden Lógico

Usa el campo `orden` para agrupar opciones relacionadas:

```sql
-- Agrupar opciones de baños
UPDATE catalogos_opciones SET orden = 10 WHERE valor_opcion = 'bano de servicio';
UPDATE catalogos_opciones SET orden = 11 WHERE valor_opcion = 'banos de servicio (2)';
UPDATE catalogos_opciones SET orden = 12 WHERE valor_opcion = 'banos de servicio (3)';
```

### 4. Normalización de Texto

Al comparar opciones, normaliza el texto:

```javascript
function normalizar(texto) {
  return texto.toLowerCase().trim();
}

// Al buscar
const opcionNormalizada = normalizar(valorIngresado);
```

### 5. Multiidioma (Preparación Futura)

Estructura preparada para agregar traducciones:

```sql
-- Tabla futura (no implementada aún)
CREATE TABLE catalogos_opciones_i18n (
    id_traduccion INT PRIMARY KEY AUTO_INCREMENT,
    id_catalogo INT NOT NULL,
    idioma VARCHAR(5) NOT NULL,  -- 'es', 'en', 'fr'
    valor_traducido VARCHAR(200) NOT NULL,
    FOREIGN KEY (id_catalogo) REFERENCES catalogos_opciones(id_catalogo),
    UNIQUE KEY (id_catalogo, idioma)
);
```

---

## Mantenimiento

### Ver Todos los Catálogos

```sql
SELECT nombre_campo, COUNT(*) as total_opciones
FROM catalogos_opciones
WHERE activo = TRUE
GROUP BY nombre_campo
ORDER BY nombre_campo;
```

### Buscar Opciones Duplicadas

```sql
SELECT nombre_campo, valor_opcion, COUNT(*) as duplicados
FROM catalogos_opciones
GROUP BY nombre_campo, valor_opcion
HAVING COUNT(*) > 1;
```

### Reordenar Opciones

```sql
-- Renumerar el orden alfabéticamente
SET @orden = 0;
UPDATE catalogos_opciones
SET orden = (@orden := @orden + 1)
WHERE nombre_campo = 'areas_comunes'
ORDER BY valor_opcion;
```

---

## Soporte

Para preguntas o mejoras al sistema de catálogos:
1. Consulta este README
2. Revisa los ejemplos en `database/catalogos.sql`
3. Verifica la estructura en `database/schema.sql`

Fecha de última actualización: 2025-10-30
