# Documento de Arquitectura de Software

## Nexova Solutions — Backend

**Versión:** 1.0  
**Estado:** Arquitectura inicial aprobada  
**Stack principal:** Python + FastAPI + uv  
**Patrón arquitectónico:** Aplicación monolítica modular, por capas y organizada por dominios
**Versión de API:** v1

---

## 1. Propósito del documento

Este documento define la arquitectura inicial del backend de Nexova Solutions.

Su objetivo es establecer una base técnica compartida que permita:

- Comprender cómo está organizado el backend.
- Conocer las responsabilidades de cada carpeta y módulo.
- Entender cómo se procesan las solicitudes HTTP.
- Mantener criterios consistentes durante el desarrollo.
- Evitar dependencias innecesarias entre dominios.
- Facilitar el mantenimiento y la evolución del sistema.

También documenta las decisiones técnicas, sus motivos y las consecuencias que pueden tener a medida que el proyecto crezca.

La propuesta está pensada para el equipo de Tecnología e Infraestructura de seis personas y para una primera etapa de construcción de una plataforma común, priorizando la entrega progresiva de funcionalidades reales.

## 2. Contexto del proyecto

Nexova Solutions necesita desarrollar una plataforma que centralice diferentes áreas operativas del negocio.

El backend organizará sus funcionalidades alrededor de seis dominios de negocio:

1. Recruitment: gestión de selección y candidatos.
2. Sales: ventas y desarrollo comercial.
3. HR: gestión de recursos humanos.
4. Training: formación corporativa.
5. Support: prestación de servicios de soporte y atención al cliente.
6. Marketing: marketing y comunicación.

Estos dominios tienen responsabilidades y procesos propios, pero forman parte de una misma plataforma empresarial.

### Capacidades transversales

- **Reporting ejecutivo (`executive`):** consolida indicadores de los dominios para apoyar la toma de decisiones; no es propietario de los datos de origen.
- **Integraciones (`integrations`):** encapsula la comunicación técnica con sistemas externos como HubSpot, Zendesk, Google Workspace y el ATS. No representa una línea de negocio.

### Consideraciones iniciales

- Nexova tiene 120 empleados, opera en España y Estados Unidos y presta servicios de selección, soporte externalizado y formación corporativa.
- Las áreas de negocio dependen de herramientas desconectadas (HubSpot, Zendesk, ATS propio y Google Workspace), hojas de cálculo y tareas manuales.
- El sistema comenzará como una aplicación backend única, organizada por dominios y consumida por aplicaciones frontend separadas mediante API REST.
- FastAPI expondrá los servicios; `uv` gestionará dependencias y ejecución.
- Persistencia, autenticación y otras capacidades se incorporarán al definir los requisitos funcionales que las necesiten.

## 3. Decisión arquitectónica

### 3.1 Patrón elegido

**Aplicación monolítica modular: arquitectura por capas organizada por dominios (Domain-Based Organization).**

La estructura interna de cada dominio seguirá tres responsabilidades principales:

- Router: entrada HTTP y exposición de endpoints.
- Service: lógica de negocio y coordinación de operaciones.
- Data: acceso y persistencia de datos.

El flujo conceptual será:

`HTTP Request → Router → Service → Data → Database`

La respuesta recorrerá el camino inverso.

### 3.2 ¿Por qué se eligió este patrón?

La decisión responde a las características concretas de Nexova, no a una preferencia genérica:

1. **Una plataforma común para varias áreas:** Recruitment es el núcleo del negocio; Sales, HR, Training, Support y Marketing tienen procesos propios. Reporting ejecutivo consolida información de esas áreas sin ser propietario de sus datos.
2. **Integración antes que distribución:** las herramientas actuales están fragmentadas. Un backend común permite centralizar gradualmente la comunicación con HubSpot, Zendesk, Google Workspace y el ATS, sin introducir desde el comienzo el coste operativo de varios servicios desplegables.
3. **Equipo de seis personas:** el equipo de Tecnología e Infraestructura necesita límites y convenciones claros entre dominios y capacidades transversales, pero no una red de servicios o abstracciones difícil de operar para esta etapa.
4. **Separación útil para los flujos reales:** routers, servicios y acceso a datos permiten trabajar y probar cambios por responsabilidad, manteniendo la lógica de selección, atención al cliente y formación fuera de los endpoints HTTP.
5. **Evolución guiada por evidencia:** si un dominio requiere despliegue o escalado separado, podrá extraerse más adelante sin convertir esa complejidad en requisito inicial.

MVC no se propone como patrón principal porque el backend expondrá una API para clientes frontend independientes, no renderizará vistas de usuario. Serverless podría ser adecuado para tareas puntuales o cargas variables, pero aún no hay requisitos de ejecución o despliegue que justifiquen basar toda la plataforma en ese modelo. Se reconsiderará para casos concretos, no por anticipación.

### 3.3 Consecuencias de la decisión

| Aspecto                          | Consecuencia                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| Desarrollo inicial               | Menor coste operativo que distribuir desde el comienzo la aplicación en varios servicios          |
| Mantenimiento                    | Responsabilidades más claras                                                                      |
| Incorporación de funcionalidades | Cada dominio puede evolucionar de manera independiente                                            |
| Testing                          | Servicios y acceso a datos pueden probarse por separado                                           |
| Escalabilidad                    | Permite escalar inicialmente la aplicación completa; no ofrece escalado independiente por dominio |
| Complejidad                      | Menor que una arquitectura hexagonal completa                                                     |
| Independencia de módulos         | Depende de respetar los límites entre dominios                                                    |

**Decisión:** mantener una aplicación única organizada por dominios, sin introducir microservicios ni abstracciones innecesarias.

## 4. Estructura de carpetas

La siguiente estructura constituye la organización inicial aprobada.

```text
services/api/                         # Ubicación del backend en el monorepo
│
├── app/
│   │
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   └── exceptions.py
│   │
│   ├── api/
│   │   └── router.py
│   │
│   ├── domains/
│   │   │
│   │   ├── recruitment/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── sales/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── hr/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── training/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── support/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── marketing/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │
│   ├── capabilities/
│   │   └── executive/
│   │       ├── router.py
│   │       ├── schemas.py
│   │       ├── service.py
│   │       └── data.py
│   │
│   ├── integrations/
│   │   ├── hubspot/
│   │   ├── zendesk/
│   │   ├── google_workspace/
│   │   └── ats/
│   │
│   └── shared/
│       └── __init__.py
│
├── tests/
│   └── __init__.py
│
├── .env.example
├── .gitignore
├── pyproject.toml
├── uv.lock
└── README.md
```

La estructura es la propuesta lógica del backend; en este monorepo corresponde al servicio ubicado en `services/api/`. Las interfaces de usuario se mantienen en `uis/` y no importan módulos internos del backend.

### 4.1 Directorio `app/`

Es el paquete principal del backend.

Contiene el punto de entrada, la configuración global, el enrutamiento general y los dominios funcionales.

No debe convertirse en un contenedor de lógica de negocio.

### 4.2 Archivo `main.py`

Responsabilidad: inicializar la aplicación FastAPI.

Debe encargarse de:

- Crear la instancia de FastAPI.
- Configurar metadatos de la API.
- Registrar el router principal.
- Configurar elementos globales necesarios para iniciar la aplicación.

No debe contener:

- Endpoints de negocio.
- Consultas a bases de datos.
- Lógica de los dominios.
- Implementaciones de servicios.

**Justificación:** mantener un punto de entrada pequeño facilita el mantenimiento y evita que la aplicación dependa de un archivo central demasiado grande.

### 4.3 Directorio `core/`

Contiene configuraciones y mecanismos transversales.

**`config.py`**

Responsabilidades:

- Cargar variables de entorno.
- Centralizar configuraciones.
- Definir parámetros generales de la aplicación.
- Proporcionar configuración tipada.

**`exceptions.py`**

Responsabilidades:

- Definir excepciones comunes.
- Centralizar el tratamiento de errores.
- Facilitar respuestas HTTP consistentes.

No debe convertirse en un lugar para almacenar errores específicos de cada dominio cuando estos tengan reglas particulares.

### 4.4 Directorio `api/`

Centraliza el enrutamiento de la API.

**`router.py`**

Responsabilidades:

- Importar los routers de los dominios y capacidades HTTP que estén implementados.
- Asignar el prefijo general `/api/v1`.
- Registrar los routers en la aplicación.
- Mantener organizada la exposición de endpoints.

Esto permite que `main.py` no tenga que conocer los detalles de cada dominio.

### 4.5 Directorio `domains/`

Es el núcleo organizativo del backend.

Cada directorio representa un dominio de negocio de Nexova: Recruitment, Sales, HR, Training, Support o Marketing.

Los dominios tienen una estructura común para que cualquier desarrollador pueda identificar rápidamente dónde incorporar una nueva funcionalidad.

#### Estructura interna de un dominio

**`router.py` — Capa de presentación**

Responsabilidades:

- Declarar endpoints HTTP.
- Definir métodos y rutas.
- Validar y recibir datos mediante esquemas.
- Invocar servicios.
- Devolver respuestas HTTP.

No debe contener lógica de negocio compleja ni consultas directas a la base de datos.

**`service.py` — Capa de negocio**

Responsabilidades:

- Implementar reglas de negocio.
- Coordinar operaciones.
- Validar condiciones funcionales.
- Invocar la capa de datos.
- Coordinar operaciones que involucren otros servicios cuando corresponda.

Debe ser independiente del protocolo HTTP siempre que sea posible.

**`data.py` — Capa de acceso a datos**

Responsabilidades:

- Consultar información.
- Crear, modificar y eliminar registros.
- Interactuar con la persistencia.
- Encapsular las operaciones de acceso a datos.

No debe contener reglas de negocio ni lógica de presentación.

**`schemas.py` — Contratos de la API**

Define los modelos Pydantic de entrada y salida usados por los endpoints. Cuando se incorpore una base de datos, los modelos de persistencia deberán mantenerse diferenciados de estos esquemas: tienen propósitos distintos y no deben confundirse.

### 4.6 Responsabilidades de los dominios de negocio

| Dominio        | Responsabilidad principal                                           |
| -------------- | ------------------------------------------------------------------- |
| `recruitment/` | Candidatos, procesos de selección, evaluaciones y seguimiento       |
| `sales/`       | Clientes potenciales, oportunidades, pipeline y actividad comercial |
| `hr/`          | Empleados, onboarding, vacaciones y procesos internos               |
| `training/`    | Cursos, alumnos, inscripciones y formación corporativa              |
| `support/`     | Tickets, SLA, atención al cliente y base de conocimiento            |
| `marketing/`   | Contenidos, campañas, métricas y comunicación                       |

**Regla:** un dominio debe ser responsable de sus propias reglas y datos. Los demás dominios deben interactuar mediante interfaces de servicio explícitas, no accediendo directamente a sus módulos internos de datos.

Los dominios se delimitan según las áreas y procesos reales de Nexova. Las capacidades transversales pueden consultar interfaces explícitas de los dominios, pero no deben apropiarse de sus reglas ni de sus datos.

### 4.7 Capacidades transversales

**`capabilities/executive/`** agrupa los casos de uso de reporting ejecutivo. Sus servicios pueden combinar indicadores de varios dominios mediante contratos explícitos; el módulo no es la fuente de verdad de esos datos. Solo tendrá router y endpoints cuando se implementen operaciones consumibles por clientes.

**`integrations/`** contiene adaptadores y clientes para sistemas externos, separados por proveedor. Es una responsabilidad técnica transversal y no un dominio de negocio. Los webhooks u otros endpoints de integración se expondrán solo cuando un flujo concreto los requiera.

### 4.8 Directorio `shared/`

Contiene elementos reutilizables que realmente sean comunes a varios dominios.

Ejemplos futuros:

- Tipos compartidos.
- Utilidades generales.
- Funciones comunes de formato.
- Componentes técnicos reutilizables.

No debe utilizarse como depósito de código que no sabemos dónde colocar.

La funcionalidad específica de un dominio debe permanecer dentro de ese dominio.

### 4.9 Directorio `tests/`

Contiene las pruebas automatizadas.

Se incorporarán progresivamente:

- Tests unitarios de servicios.
- Tests de endpoints.
- Tests de integración con persistencia.
- Tests de autorización.
- Tests de regresión.

La estructura de pruebas deberá acompañar el crecimiento de los dominios.

### 4.10 Archivos de configuración

| Archivo          | Responsabilidad                                                            |
| ---------------- | -------------------------------------------------------------------------- |
| `.env.example`   | Documentar las variables de entorno necesarias sin incluir secretos reales |
| `.gitignore`     | Excluir archivos locales, entornos virtuales y secretos                    |
| `pyproject.toml` | Configuración del proyecto y dependencias                                  |
| `uv.lock`        | Fijar las versiones resueltas de las dependencias                          |
| `README.md`      | Documentar instalación, ejecución y uso del backend                        |

## 5. Organización de rutas y dominios

La API utilizará versionado mediante prefijos.

Prefijo general:

`/api/v1`

Cada dominio tendrá su propio prefijo.

| Dominio     | Prefijo               |
| ----------- | --------------------- |
| Recruitment | `/api/v1/recruitment` |
| Sales       | `/api/v1/sales`       |
| HR          | `/api/v1/hr`          |
| Training    | `/api/v1/training`    |
| Support     | `/api/v1/support`     |
| Marketing   | `/api/v1/marketing`   |

Las rutas representan recursos y operaciones del dominio, no nombres de implementación. Por ejemplo, `GET /api/v1/recruitment/candidates` y `POST /api/v1/recruitment/candidates` pertenecerían a Recruitment; `GET /api/v1/sales/opportunities` a Sales; `GET /api/v1/hr/employees` a HR; `GET /api/v1/training/courses` a Training; `GET /api/v1/support/tickets` a Support; y `GET /api/v1/marketing/campaigns` a Marketing. Son rutas ilustrativas, no contratos definitivos.

Reporting ejecutivo podría exponerse bajo `/api/v1/executive` cuando exista una funcionalidad concreta. Las integraciones no requieren automáticamente un prefijo público: sus endpoints se definirán según cada flujo, por ejemplo webhooks entrantes autenticados cuando corresponda.

### 5.1 Registro de routers

El archivo `app/api/router.py` será responsable de incluir los routers de los dominios y de las capacidades que expongan endpoints.

El flujo de registro será:

1. Cada dominio o capacidad HTTP implementada declara su propio `APIRouter`.
2. El router principal importa los routers disponibles.
3. El router principal los registra bajo `/api/v1` y sus respectivos prefijos.
4. `main.py` incluye el router principal en FastAPI.

Esto evita registrar rutas manualmente dentro de `main.py`.

### 5.2 Documentación OpenAPI

FastAPI generará automáticamente la documentación en:

- `/docs`: Swagger UI.
- `/redoc`: documentación ReDoc.
- `/openapi.json`: esquema OpenAPI.

**Punto técnico importante:** un `APIRouter` sin endpoints puede estar registrado en la aplicación, pero no aparecerá como grupo visible en Swagger UI. En la etapa inicial se verificará el registro de routers sin inventar endpoints de negocio.

### 5.3 Convenciones de FastAPI que influyen en la propuesta

FastAPI no impone una única estructura de carpetas. Su documentación recomienda dividir aplicaciones grandes en módulos y usar `APIRouter` para agrupar endpoints, incluyéndolos desde un router principal. En proyectos habituales también se separan configuración, esquemas Pydantic, dependencias y acceso a datos.

Esta propuesta adopta esas prácticas y agrega la organización por dominios para que el equipo encuentre juntas las funciones de cada área. Reporting ejecutivo se mantiene como capacidad transversal y las integraciones como adaptadores técnicos, no como dominios de negocio. No se crea una capa adicional por cada concepto mientras no tenga una responsabilidad real: `router.py` gestiona HTTP, `schemas.py` los contratos, `service.py` las reglas y `data.py` el acceso a datos. El router central compone los módulos; no contiene lógica de negocio.

### 5.4 Separación entre frontend y backend

El backend y las interfaces son aplicaciones separadas aunque residan en el mismo monorepo. Se comunican exclusivamente mediante contratos HTTP versionados (`/api/v1`); el frontend no accede directamente a la base de datos ni importa módulos Python del backend. Mantenerlos en repositorios distintos también sería posible sin cambiar este límite de integración.

Cada aplicación tendrá configuración propia por entorno. El frontend recibirá la URL base de la API como configuración y no contendrá secretos. Las credenciales de base de datos e integraciones externas solo estarán disponibles en el backend, mediante variables de entorno o un gestor de secretos. Se versionará un `.env.example` sin valores secretos.

Como frontend y backend pueden servirse desde orígenes distintos, FastAPI configurará CORS con una lista explícita de orígenes permitidos: orígenes locales necesarios en desarrollo y dominios aprobados en producción. No se habilitará cualquier origen por defecto. CORS no reemplaza autenticación ni autorización; el backend debe verificar permisos en cada operación protegida.

## 6. Decisiones técnicas iniciales

| Decisión                     | Propuesta inicial                                                 | Motivo / límite                                                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Estilo de aplicación         | Monolito modular por dominios                                     | Integra las áreas sin coste de despliegue distribuido prematuro.                                                                                          |
| Framework y ejecución        | FastAPI + `uv`                                                    | FastAPI ofrece routers y documentación OpenAPI; `uv` gestiona dependencias y ejecución reproducible.                                                      |
| Contrato entre sistemas      | API REST versionada bajo `/api/v1`                                | Mantiene desacoplados los frontends y el backend.                                                                                                         |
| Validación                   | Esquemas Pydantic por dominio                                     | Separa contratos de entrada/salida de reglas de negocio y persistencia.                                                                                   |
| Configuración                | Variables de entorno y `.env.example` sin secretos                | Permite configuración por entorno sin credenciales en el repositorio ni en el frontend.                                                                   |
| CORS                         | Lista explícita de orígenes por entorno                           | Permite los frontends previstos sin abrir el API a cualquier origen.                                                                                      |
| Persistencia y autenticación | Elegir antes de operar con datos reales                           | PostgreSQL/ORM, autenticación, permisos y aislamiento entre organizaciones requieren requisitos concretos; Recruitment y HR contienen datos personales.   |
| Tareas asíncronas            | No añadir cola/workers hasta que exista un proceso largo definido | Evita infraestructura sin caso de uso; procesamiento de CVs, sincronizaciones y analítica se evaluarán cuando se implementen.                             |
| Integraciones                | Encapsular adaptadores técnicos por proveedor                     | HubSpot, Zendesk, Google Workspace y el ATS son sistemas existentes que pueden fallar o cambiar; la integración es transversal, no un dominio de negocio. |

## 7. Riesgos si no se sigue la estructura

| Riesgo                                                  | Qué puede salir mal                                                                                   | Prevención                                                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Routers contienen negocio o acceso directo a datos      | Cambios de API, reglas y persistencia se mezclan; aumentan duplicación y dificultad para probar.      | Mantener el flujo router → service → data y probar servicios por separado.                       |
| Dominios acceden a datos internos de otros dominios     | Una modificación en Recruitment puede romper Sales o Executive y bloquear la evolución independiente. | Colaborar mediante servicios/contratos explícitos; preservar la propiedad de datos por dominio.  |
| Configuración frontend/backend o CORS demasiado abierta | Secretos expuestos en cliente o llamadas web permitidas desde orígenes no aprobados.                  | Separar variables de entorno y permitir solo orígenes conocidos; CORS no reemplaza autorización. |
| Integraciones externas consideradas infalibles          | Caídas, límites o cambios de APIs producen solicitudes bloqueadas y datos inconsistentes.             | Definir timeouts, manejo de errores y reintentos cuando se implemente cada integración.          |

## 8. Referencias técnicas

- FastAPI, _Bigger Applications — Multiple Files_: https://fastapi.tiangolo.com/tutorial/bigger-applications/
- FastAPI, _CORS (Cross-Origin Resource Sharing)_: https://fastapi.tiangolo.com/tutorial/cors/
- FastAPI, _Settings and Environment Variables_: https://fastapi.tiangolo.com/advanced/settings/
- The Twelve-Factor App, _Config_: https://12factor.net/config
