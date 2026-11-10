# API Gestión Comercial

API para administrar categorías, productos, depósitos, existencias, clientes, vendedores, sucursales, usuarios y facturación. Desarrollada con **Node.js**, **Express** y **MongoDB (Mongoose)**, con una arquitectura separada en rutas, controladores y servicios.

## 1. Tecnologías

- Node.js y Express: servidor HTTP y API REST.
- MongoDB Atlas y Mongoose: persistencia, validaciones, referencias e índices.
- bcryptjs: hash de contraseñas con middleware `pre('save')`.
- jsonwebtoken: autenticación JWT.
- dotenv: configuración por variables de entorno.
- cors: habilitación de solicitudes entre orígenes.
- nodemon: reinicio automático durante el desarrollo.

## 2. Arquitectura del proyecto

```text
gestion-comercial-api/
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env                 # Solo placeholders en la entrega
├── .env.example         # Plantilla de configuración
├── .gitignore
├── README.md
├── scripts/
│   └── crearAdmin.js
└── src/
    ├── config/
    │   └── db.js
    ├── models/
    ├── services/
    ├── controllers/
    ├── routes/
    └── middlewares/
```

## 3. Esquema de la base de datos

MongoDB utiliza colecciones de documentos. Mongoose crea un identificador `_id` para cada documento y administra `createdAt` y `updatedAt` cuando el esquema tiene `timestamps: true`.

| Modelo / colección | Campos principales | Referencias |
|---|---|---|
| **Categoria** | `nombre`, `detalle` | — |
| **Producto** | `codigo`, `detalle`, `precio`, `estado`, `marca`, `categoria` | `categoria` → Categoria |
| **Deposito** | `codigo`, `nombre`, `direccion` | — |
| **Stock** | `producto`, `deposito`, `cantidad`, `stockMinimo` | `producto` → Producto; `deposito` → Deposito |
| **Cliente** | `codigo`, `razonSocial`, `domicilio`, `cuil`, `email`, `telefono`, `estado` | — |
| **Vendedor** | `codigo`, `nombre`, `apellido`, `telefono` | — |
| **Sucursal** | `codigo`, `nombre`, `direccion`, `telefono` | — |
| **Factura** | `numero`, `tipo`, `sucursal`, `cliente`, `vendedor`, `fecha`, `subtotal`, `descuento`, `totalImpuestos`, `total`, `medioPago`, `estado` | `sucursal` → Sucursal; `cliente` → Cliente; `vendedor` → Vendedor |
| **ItemFactura** | `factura`, `producto`, `cantidad`, `precio` | `factura` → Factura; `producto` → Producto |
| **Usuario** | `nombre`, `email`, `password` (hash), `rol`, `cliente`, `vendedor`, `activo` | `cliente` → Cliente (opcional); `vendedor` → Vendedor (opcional) |

**Relaciones y reglas destacadas:**

- Las consultas de productos utilizan `populate` para incluir datos de la categoría.
- El stock se administra por combinación de producto y depósito; existe un índice único compuesto para esa combinación.
- Los ítems guardan el precio unitario histórico de la venta.
- La emisión de facturas descuenta existencias mediante una transacción de MongoDB.
- Los usuarios tienen roles `ADMIN`, `VENDEDOR` y `CLIENTE`. Las contraseñas no se devuelven en las respuestas públicas.

## 4. Instalación y ejecución

### Requisitos previos

- Node.js y npm instalados.
- Una base de datos MongoDB Atlas accesible desde el equipo.
- Git para clonar el repositorio.

### Pasos

```bash
git clone https://github.com/TU_USUARIO/gestion-comercial-api.git
cd gestion-comercial-api
npm install
```

Configurá el archivo `.env` con **tus propias credenciales**, usando los nombres de variables del ejemplo:

```dotenv
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO_EJEMPLO:CLAVE_EJEMPLO@CLUSTER_EJEMPLO.mongodb.net/gestion_comercial?retryWrites=true&w=majority
JWT_SECRET=REEMPLAZAR_POR_UNA_CLAVE_ALEATORIA_LARGA
JWT_EXPIRES_IN=8h
```

> Nunca utilices credenciales reales en un archivo que vayas a publicar. Si el docente necesita ejecutar la API, deberá configurar una base de datos propia o recibir credenciales de prueba por un canal seguro.

Iniciá el proyecto:

```bash
npm run dev
```

Si el proyecto tiene configurado el script de producción, también se puede utilizar:

```bash
npm start
```

Con `PORT=3000`, la API responde en `http://localhost:3000` y las rutas comienzan con `/api`.

**Inicialización del administrador:** el proyecto incluye `scripts/crearAdmin.js` para crear el primer usuario administrador. Consultá su implementación antes de ejecutarlo y evitá introducir contraseñas reales como argumentos de línea de comandos en equipos compartidos.

## 5. Autenticación y permisos

La API utiliza tokens JWT enviados mediante la cabecera:

```http
Authorization: Bearer TU_TOKEN_JWT
```

- `ADMIN`: administra los recursos y usuarios.
- `VENDEDOR`: consulta los recursos operativos y registra facturas.
- `CLIENTE`: consulta productos, categorías y sus propias facturas.

La ruta de login es pública. El registro de usuarios está restringido a administradores. Las respuestas `401` indican ausencia o invalidez de autenticación; las respuestas `403` indican falta de permisos.

## 6. Endpoints

### Categorías

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/categorias` | Autenticado |
| GET | `/api/categorias/:id` | Autenticado |
| POST | `/api/categorias` | ADMIN |
| PUT | `/api/categorias/:id` | ADMIN |
| DELETE | `/api/categorias/:id` | ADMIN |

### Productos

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/productos` | Autenticado |
| GET | `/api/productos/:id` | Autenticado |
| POST | `/api/productos` | ADMIN |
| PUT | `/api/productos/:id` | ADMIN |
| DELETE | `/api/productos/:id` | ADMIN |

### Depósitos

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/depositos` | ADMIN, VENDEDOR |
| GET | `/api/depositos/:id` | ADMIN, VENDEDOR |
| POST | `/api/depositos` | ADMIN |
| PUT | `/api/depositos/:id` | ADMIN |
| DELETE | `/api/depositos/:id` | ADMIN |

### Stock

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/stocks` | ADMIN, VENDEDOR |
| GET | `/api/stocks/:id` | ADMIN, VENDEDOR |
| GET | `/api/stocks/producto/:productoId` | ADMIN, VENDEDOR |
| GET | `/api/stocks/deposito/:depositoId` | ADMIN, VENDEDOR |
| POST | `/api/stocks` | ADMIN |
| PUT | `/api/stocks/:id` | ADMIN |
| DELETE | `/api/stocks/:id` | ADMIN |

### Clientes

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/clientes` | ADMIN, VENDEDOR |
| GET | `/api/clientes/:id` | ADMIN, VENDEDOR |
| POST | `/api/clientes` | ADMIN |
| PUT | `/api/clientes/:id` | ADMIN |
| DELETE | `/api/clientes/:id` | ADMIN |

### Vendedores

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/vendedores` | ADMIN |
| GET | `/api/vendedores/:id` | ADMIN |
| POST | `/api/vendedores` | ADMIN |
| PUT | `/api/vendedores/:id` | ADMIN |
| DELETE | `/api/vendedores/:id` | ADMIN |

### Sucursales

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/sucursales` | ADMIN, VENDEDOR |
| GET | `/api/sucursales/:id` | ADMIN, VENDEDOR |
| POST | `/api/sucursales` | ADMIN |
| PUT | `/api/sucursales/:id` | ADMIN |
| DELETE | `/api/sucursales/:id` | ADMIN |

### Facturación

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/facturas` | ADMIN, VENDEDOR |
| GET | `/api/facturas/mis-facturas` | CLIENTE |
| GET | `/api/facturas/:id` | ADMIN, VENDEDOR; CLIENTE solo si es propia |
| POST | `/api/facturas` | ADMIN, VENDEDOR |

No se documentan `PUT` o `DELETE` de facturas porque no fueron implementados en el flujo desarrollado.

### Autenticación

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/registro` | ADMIN |

### Estado de la API

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/` | Público |

## 7. Ejemplos de solicitudes (JSON mock)

En los ejemplos, sustituí cada valor `ID_...` por un `_id` válido obtenido previamente desde la API. Para `GET` y `DELETE` no se envía cuerpo JSON; se utilizan los parámetros de la URL. Los `PUT` reciben los campos a actualizar.

### Categoría — `POST /api/categorias`

```json
{
  "nombre": "Electrónica",
  "detalle": "Accesorios y equipos electrónicos"
}
```

**Actualización — `PUT /api/categorias/:id`:**

```json
{
  "nombre": "Informática",
  "detalle": "Productos de informática"
}
```

### Producto — `POST /api/productos`

```json
{
  "codigo": "PROD001",
  "detalle": "Mouse inalámbrico",
  "precio": 15000,
  "estado": true,
  "marca": "Logitech",
  "categoria": "ID_CATEGORIA"
}
```

**Actualización — `PUT /api/productos/:id`:**

```json
{
  "precio": 16500,
  "estado": true
}
```

### Depósito — `POST /api/depositos`

```json
{
  "codigo": "DEP001",
  "nombre": "Depósito Central",
  "direccion": "Av. Corrientes 1000"
}
```

**Actualización — `PUT /api/depositos/:id`:**

```json
{
  "direccion": "Av. Corrientes 1200"
}
```

### Stock — `POST /api/stocks`

```json
{
  "producto": "ID_PRODUCTO",
  "deposito": "ID_DEPOSITO",
  "cantidad": 50,
  "stockMinimo": 10
}
```

**Actualización — `PUT /api/stocks/:id`:**

```json
{
  "cantidad": 75,
  "stockMinimo": 15
}
```

### Cliente — `POST /api/clientes`

```json
{
  "codigo": "CLI001",
  "razonSocial": "Juan Pérez",
  "domicilio": "Av. Corrientes 1500",
  "cuil": "20-12345678-6",
  "email": "juan.perez@example.com",
  "telefono": "1123456789",
  "estado": true
}
```

**Actualización — `PUT /api/clientes/:id`:**

```json
{
  "telefono": "1198765432",
  "domicilio": "Av. Corrientes 1600"
}
```

### Vendedor — `POST /api/vendedores`

```json
{
  "codigo": "VEN001",
  "nombre": "Carlos",
  "apellido": "Gómez",
  "telefono": "1123456789"
}
```

**Actualización — `PUT /api/vendedores/:id`:**

```json
{
  "telefono": "1187654321"
}
```

### Sucursal — `POST /api/sucursales`

```json
{
  "codigo": "SUC001",
  "nombre": "Sucursal Central",
  "direccion": "Av. Corrientes 2500",
  "telefono": "1145678901"
}
```

**Actualización — `PUT /api/sucursales/:id`:**

```json
{
  "nombre": "Sucursal Centro",
  "telefono": "1145678902"
}
```

### Factura — `POST /api/facturas`

```json
{
  "numero": "00000001",
  "tipo": "B",
  "sucursal": "ID_SUCURSAL",
  "cliente": "ID_CLIENTE",
  "vendedor": "ID_VENDEDOR",
  "deposito": "ID_DEPOSITO",
  "medioPago": "EFECTIVO",
  "descuento": 0,
  "totalImpuestos": 0,
  "items": [
    {
      "producto": "ID_PRODUCTO",
      "cantidad": 2
    }
  ]
}
```

El servicio calcula los importes a partir de los productos y descuenta las cantidades del depósito seleccionado. Se requiere stock suficiente.

### Registrar usuario CLIENTE — `POST /api/auth/registro`

```json
{
  "nombre": "Juan Pérez",
  "email": "juan.usuario@example.com",
  "password": "ClaveDeEjemplo123",
  "rol": "CLIENTE",
  "cliente": "ID_CLIENTE"
}
```

### Registrar usuario VENDEDOR — `POST /api/auth/registro`

```json
{
  "nombre": "Carlos Gómez",
  "email": "carlos.vendedor@example.com",
  "password": "ClaveDeEjemplo123",
  "rol": "VENDEDOR",
  "vendedor": "ID_VENDEDOR"
}
```

### Registrar usuario ADMIN — `POST /api/auth/registro`

```json
{
  "nombre": "Administrador Secundario",
  "email": "admin2@example.com",
  "password": "ClaveDeEjemplo123",
  "rol": "ADMIN"
}
```

El registro requiere un JWT de administrador. La contraseña se almacena como hash bcrypt.

### Iniciar sesión — `POST /api/auth/login`

```json
{
  "email": "carlos.vendedor@example.com",
  "password": "ClaveDeEjemplo123"
}
```

Una autenticación correcta devuelve información pública del usuario y un token JWT.

### Solicitudes sin cuerpo JSON

```http
GET /api/productos
GET /api/productos/ID_PRODUCTO
GET /api/stocks/producto/ID_PRODUCTO
GET /api/stocks/deposito/ID_DEPOSITO
GET /api/facturas/mis-facturas
GET /api/facturas/ID_FACTURA
DELETE /api/productos/ID_PRODUCTO
```

Las demás operaciones `GET` y `DELETE` siguen el mismo patrón indicado en las tablas de endpoints.

## 8. Códigos de respuesta

| Código | Significado |
|---|---|
| `200 OK` | Consulta, actualización u operación exitosa |
| `201 Created` | Recurso creado |
| `400 Bad Request` | Datos inválidos |
| `401 Unauthorized` | Falta un token válido |
| `403 Forbidden` | El usuario no tiene permisos |
| `404 Not Found` | Recurso inexistente o no accesible |
| `409 Conflict` | Conflicto de unicidad o estado |
| `500 Internal Server Error` | Error inesperado del servidor |

## 9. Funcionalidades implementadas

- CRUD de categorías, productos, depósitos, stock, clientes, vendedores y sucursales.
- Asociación de productos con categorías mediante referencias de MongoDB y `populate`.
- Control de existencias por depósito y producto.
- Emisión y consulta de facturas con ítems y cálculo de importes.
- Descuento de stock al facturar mediante transacciones de MongoDB.
- Registro administrado de usuarios, hash bcrypt y autenticación JWT.
- Autorización por roles y consulta de facturas propias para clientes.
- Configuración por variables de entorno y middleware CORS.

## 10. Posibles mejoras futuras

- Anulación de facturas con reposición automática del stock.
- Reportes de ventas y alertas de stock mínimo.
- Paginación, filtros y búsquedas avanzadas.
- Pruebas automatizadas de endpoints y servicios.
- Interfaz web para la administración comercial.

## 11. Seguridad y publicación

- No publicar credenciales reales de MongoDB, contraseñas, tokens ni claves JWT.
- Excluir `node_modules/` del repositorio.
- Publicar únicamente un `.env` con valores de ejemplo, tal como solicita la consigna.
- Usar un archivo local no versionado para credenciales reales.
- Revisar los archivos incluidos con `git status` y `git diff --cached` antes de hacer `git push`.

---

**Proyecto final — Curso de Backend Developer.**