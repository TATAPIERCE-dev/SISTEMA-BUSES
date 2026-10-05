# TravelEase

Sistema web de reserva de pasajes de bus para rutas dentro de Chile. Permite buscar destinos, consultar horarios, seleccionar asientos, simular pagos con tarjeta y generar un comprobante de compra.

## Funcionalidades

- Busqueda de viajes por origen, destino y fecha.
- Catalogo de ciudades chilenas con rutas y horarios disponibles.
- Filtros por operador, tipo de asiento, horario, viaje directo y precio maximo.
- Seleccion visual de asientos por piso.
- Bloqueo temporal de asientos durante 10 minutos.
- Compra como invitado o usuario registrado.
- Pago simulado con Visa o Mastercard.
- Datos de tarjeta de prueba sin cobros reales.
- Generacion de factura y comprobante en una URL independiente.
- Registro, inicio de sesion y consulta de reservas.
- Proteccion CSRF y validacion de formularios en backend.

## Tecnologias

- AdonisJS 7
- TypeScript
- PostgreSQL
- Lucid ORM
- React 19
- Inertia.js
- Vite
- Tailwind CSS 4
- VineJS
- Luxon

## Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL 14 o superior

## Instalacion

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd sistema-reserva-buses
```

2. Instala las dependencias:

```bash
npm install
```

3. Copia el archivo de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell puedes usar:

```powershell
Copy-Item .env.example .env
```

4. Configura PostgreSQL en `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contrasena
DB_DATABASE=sistema_reserva_buses
```

5. Genera la clave de la aplicacion:

```bash
node ace generate:key
```

6. Ejecuta las migraciones y carga los datos iniciales:

```bash
node ace migration:run
node ace db:seed
```

## Ejecutar el proyecto

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3333](http://localhost:3333).

Flujo principal:

1. Selecciona origen, destino y fecha.
2. Elige un viaje.
3. Selecciona uno o mas asientos.
4. Completa los datos del pasajero.
5. Presiona `Proceder al Pago`.
6. Selecciona Visa o Mastercard y confirma el pago de prueba.
7. Consulta la factura generada.

## Tarjetas de prueba

La aplicacion no procesa pagos reales. Usa estos datos ficticios:

| Marca | Numero | Vencimiento | CVV |
| --- | --- | --- | --- |
| Visa | `4111111111111111` | `12/30` | `123` |
| Mastercard | `5555555555554444` | `12/30` | `123` |

El nombre del titular puede ser `JUAN PEREZ`.

## Comandos disponibles

```bash
npm run dev          # Desarrollo con HMR
npm run build        # Compilar para produccion
npm start            # Ejecutar la compilacion
npm run typecheck    # Verificar TypeScript
npm run lint         # Ejecutar Oxlint
npm test             # Ejecutar pruebas
node ace migration:run
node ace db:seed
```

## Estructura principal

```text
app/
  controllers/       Controladores HTTP
  models/            Modelos Lucid
  validators/        Validadores VineJS
database/
  migrations/        Estructura de PostgreSQL
  seeders/           Datos iniciales
inertia/
  pages/             Paginas React
  components/        Componentes reutilizables
start/
  routes.ts          Rutas de la aplicacion
```

## Rutas principales

- `/` - Pagina de inicio.
- `/search` - Busqueda de viajes.
- `/seats?tripId=<id>` - Seleccion de asientos.
- `/pagar` - Pago simulado.
- `/factura?reservationId=<id>` - Factura de la reserva.
- `/login` - Inicio de sesion.
- `/signup` - Registro de usuario.
- `/bookings` - Reservas del usuario autenticado.

## Nota

Este proyecto es una aplicacion educativa y de demostracion. Los pagos son simulados y las tarjetas mostradas en este README son datos de prueba.

## Licencia

Proyecto personal para fines educativos y demostrativos.
