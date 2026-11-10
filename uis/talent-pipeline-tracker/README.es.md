# Talent Pipeline Tracker

Aplicación web para consultar y gestionar candidaturas dentro del proceso de selección. Permite registrar candidaturas, filtrar el pipeline, consultar y editar fichas, actualizar estado y etapa, y añadir o eliminar notas.

## Requisitos

- Node.js y npm.
- Acceso a la API de candidaturas. Si no se configura una URL propia, la aplicación usa `https://playground.4geeks.com/tracker/api/v1`.

## Configuración y ejecución

Desde esta carpeta (`uis/talent-pipeline-tracker`):

```bash
npm install
cp .env.example .env.local
```

Si la API está en otra URL, configura `NEXT_PUBLIC_API_URL` en `.env.local`, por ejemplo:

```dotenv
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

No publiques `.env.local` ni incluyas credenciales o datos personales en el repositorio.

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para comprobar una compilación de producción y ejecutarla localmente:

```bash
npm run lint
npm run build
npm run start
```

## Funcionalidades

- **Listado del pipeline (`/`)**: consulta candidaturas y filtra por nombre/email, estado y etapa.
- **Nueva candidatura (`/candidates/new`)**: registra los datos de una persona candidata, con validación accesible de campos y enlaces.
- **Detalle (`/candidates/[id]`)**: muestra la información de la candidatura y sus notas.
- **Gestión**: permite editar los datos, actualizar estado y etapa, y añadir o eliminar notas.

El formulario requiere nombre, email, teléfono con prefijo internacional (`+`), puesto y rango de experiencia. LinkedIn y el enlace al CV son opcionales.

## Organización del código

```text
app/          Rutas y pantallas del App Router, incluidos componentes propios de una ruta
components/   Componentes de interfaz compartidos, como el formulario y el listado
lib/          Acceso HTTP a la API y funciones de consulta/mutación
types/        Tipos del dominio, payloads y contratos de respuesta de la API
```

Los contratos del candidato están definidos en `types/candidate.ts`. `lib/api.ts` centraliza las llamadas HTTP y utiliza esos tipos. El borrado de notas responde `204 No Content`, por lo que no tiene cuerpo JSON. No se crea una carpeta `hooks/` mientras no haya hooks compartidos que lo justifiquen.

## Rutas de API utilizadas

La aplicación consume la API configurada en `NEXT_PUBLIC_API_URL`:

| Operación                        | Método y ruta                         |
| -------------------------------- | ------------------------------------- |
| Listar candidaturas (paginación) | `GET /records?page=…&limit=…`         |
| Consultar candidatura            | `GET /records/{id}`                   |
| Crear candidatura                | `POST /records`                       |
| Reemplazar datos de candidatura  | `PUT /records/{id}`                   |
| Actualizar estado o etapa        | `PATCH /records/{id}`                 |
| Consultar notas                  | `GET /records/{id}/notes`             |
| Añadir nota                      | `POST /records/{id}/notes`            |
| Eliminar nota                    | `DELETE /records/{id}/notes/{noteId}` |

## Tecnologías

Next.js App Router, React, TypeScript y Tailwind CSS. El acceso a la API se realiza con `fetch` desde `lib/api.ts`.
