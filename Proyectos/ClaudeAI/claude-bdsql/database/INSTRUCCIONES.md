# Instrucciones de Configuración de Base de Datos

Esta guía te ayudará a configurar la base de datos BienesRaicesDB paso a paso.

## Prerrequisitos

Antes de comenzar, asegúrate de tener MySQL instalado en tu sistema.

## Paso 1: Instalar MySQL (si no lo tienes)

### Windows
1. Descarga MySQL Community Server desde: https://dev.mysql.com/downloads/mysql/
2. Ejecuta el instalador y sigue el asistente de instalación
3. Durante la instalación:
   - Elige "Developer Default" como tipo de instalación
   - Configura una contraseña para el usuario root (¡guárdala de forma segura!)
   - Deja el puerto por defecto (3306)
4. Completa la instalación y verifica que MySQL esté corriendo como servicio

### macOS
```bash
# Usando Homebrew
brew install mysql

# Iniciar el servicio
brew services start mysql

# Configurar contraseña de root
mysql_secure_installation
```

### Linux (Ubuntu/Debian)
```bash
# Actualizar repositorios
sudo apt update

# Instalar MySQL Server
sudo apt install mysql-server

# Iniciar el servicio
sudo systemctl start mysql

# Configurar seguridad
sudo mysql_secure_installation
```

## Paso 2: Verificar la Instalación

Abre una terminal o símbolo del sistema y ejecuta:

```bash
mysql --version
```

Deberías ver algo como: `mysql  Ver 8.0.x for ...`

## Paso 3: Acceder a MySQL

Abre una terminal y conéctate a MySQL:

```bash
mysql -u root -p
```

Te pedirá la contraseña que configuraste durante la instalación.

## Paso 4: Crear la Base de Datos

Existen dos formas de ejecutar los scripts:

### Opción A: Desde la línea de comandos de MySQL

1. Una vez dentro de MySQL, ejecuta:

```sql
source /ruta/completa/al/proyecto/database/setup.sql
```

**Ejemplo en Windows:**
```sql
source C:/Users/TuUsuario/Proyectos/ClaudeAI/claude-bdsql/database/setup.sql
```

**Ejemplo en macOS/Linux:**
```sql
source /Users/tuusuario/proyectos/claude-bdsql/database/setup.sql
```

### Opción B: Desde la terminal del sistema

Puedes ejecutar el script directamente desde la terminal sin entrar a MySQL:

```bash
mysql -u root -p < database/setup.sql
```

## Paso 5: Crear las Tablas

1. Ejecuta el script de schema para crear todas las tablas:

**Desde MySQL:**
```sql
source /ruta/completa/al/proyecto/database/schema.sql
```

**Desde terminal:**
```bash
mysql -u root -p BienesRaicesDB < database/schema.sql
```

## Paso 6: Insertar Datos de Ejemplo

1. Ejecuta el script de seed para poblar la base de datos con datos de ejemplo:

**Desde MySQL:**
```sql
source /ruta/completa/al/proyecto/database/seed.sql
```

**Desde terminal:**
```bash
mysql -u root -p BienesRaicesDB < database/seed.sql
```

## Paso 7: Cargar Catálogos de Opciones

1. Ejecuta el script de catálogos para poblar las opciones predefinidas:

**Desde MySQL:**
```sql
source /ruta/completa/al/proyecto/database/catalogos.sql
```

**Desde terminal:**
```bash
mysql -u root -p BienesRaicesDB < database/catalogos.sql
```

Este script carga todas las opciones predefinidas para campos de selección múltiple como:
- Otros espacios residenciales (30 opciones)
- Otros espacios no residenciales (12 opciones)
- Áreas comunes (17 opciones)
- Servicios residenciales (11 opciones)
- Servicios no residenciales (8 opciones)
- Calificaciones de terreno del broker (10 opciones)
- Calificaciones de construcción del broker (23 opciones)
- Calificaciones de entorno del broker (12 opciones)

## Paso 8: Verificar que Todo Está Correcto

1. Conéctate a la base de datos:

```bash
mysql -u root -p BienesRaicesDB
```

2. Verifica que las tablas fueron creadas:

```sql
SHOW TABLES;
```

Deberías ver:
```
+---------------------------+
| Tables_in_BienesRaicesDB  |
+---------------------------+
| Broker                    |
| EmpresaInmobiliaria       |
| Propiedad                 |
| Zona                      |
+---------------------------+
```

3. Verifica que hay datos en las tablas:

```sql
-- Ver todas las zonas
SELECT * FROM Zona;

-- Ver todas las empresas
SELECT * FROM EmpresaInmobiliaria;

-- Ver todos los brokers
SELECT * FROM Broker;

-- Ver todas las propiedades
SELECT * FROM Propiedad;

-- Contar registros en cada tabla
SELECT 'Zonas' as Tabla, COUNT(*) as Total FROM Zona
UNION ALL
SELECT 'Empresas', COUNT(*) FROM EmpresaInmobiliaria
UNION ALL
SELECT 'Brokers', COUNT(*) FROM Broker
UNION ALL
SELECT 'Propiedades', COUNT(*) FROM Propiedad;
```

Deberías ver:
- 5 zonas
- 2 empresas inmobiliarias
- 3 brokers
- 10 propiedades

## Paso 9: Configurar el Archivo .env

1. En el directorio raíz del proyecto, asegúrate de tener un archivo `.env` con la configuración correcta:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=BienesRaicesDB
DB_PORT=3306
```

**IMPORTANTE:** Reemplaza `tu_contraseña_aqui` con la contraseña que configuraste para MySQL.

## Resumen de Scripts

- **setup.sql**: Crea la base de datos con el character set correcto
- **schema.sql**: Define todas las tablas y relaciones
- **seed.sql**: Inserta datos de ejemplo para pruebas
- **catalogos.sql**: Carga opciones predefinidas para campos de selección múltiple

## Ejecución Completa (Todos los Scripts en Secuencia)

Si quieres ejecutar todo de una vez desde la terminal:

```bash
# Crear base de datos
mysql -u root -p < database/setup.sql

# Crear tablas
mysql -u root -p BienesRaicesDB < database/schema.sql

# Insertar datos de ejemplo
mysql -u root -p BienesRaicesDB < database/seed.sql

# Cargar catálogos de opciones
mysql -u root -p BienesRaicesDB < database/catalogos.sql
```

## Datos de Ejemplo Incluidos

### Zonas (5):
- Polanco, CDMX
- Zona Esmeralda, Estado de México
- Valle Oriente, Monterrey
- Zapopan Centro, Jalisco
- Angelópolis, Puebla

### Empresas (2):
- Inmobiliaria Premium México
- Propiedades del Norte

### Brokers (3):
- Carlos Martínez (Inmobiliaria Premium México)
- Ana García (Propiedades del Norte)
- Luis Hernández (Inmobiliaria Premium México)

### Propiedades (10):
- 4 Casas
- 3 Departamentos
- 3 Terrenos

## Solución de Problemas

### Error: "Access denied for user"
- Verifica que estás usando la contraseña correcta
- Asegúrate de que el usuario root tiene permisos

### Error: "Can't connect to MySQL server"
- Verifica que el servicio MySQL está corriendo
- Comprueba que el puerto 3306 no está bloqueado por el firewall

### Error: "Unknown database"
- Asegúrate de haber ejecutado primero el script `setup.sql`
- Verifica que la base de datos se creó correctamente con `SHOW DATABASES;`

### Error al ejecutar source en Windows
- Usa rutas absolutas con barras diagonales `/` en lugar de `\`
- Ejemplo: `C:/Users/Usuario/proyecto/database/setup.sql`

## Comandos Útiles de MySQL

```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Usar una base de datos
USE BienesRaicesDB;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE Propiedad;

-- Salir de MySQL
EXIT;
```

## Siguiente Paso

Una vez que hayas verificado que todo está correcto, puedes:
1. Conectar tu aplicación Node.js a la base de datos usando el archivo `.env`
2. Probar las consultas desde tu aplicación
3. Desarrollar las funcionalidades de tu sistema de bienes raíces

¡Tu base de datos está lista para usar! 🎉
