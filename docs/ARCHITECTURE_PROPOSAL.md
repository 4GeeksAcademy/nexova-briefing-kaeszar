# Documento de Arquitectura de Software
## Nexova Solutions — Backend

**Versión:** 1.0  
**Estado:** Arquitectura inicial aprobada  
**Stack principal:** Python + FastAPI + uv  
**Patrón arquitectónico:** Arquitectura por capas organizada por dominios  
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

La arquitectura está diseñada para una primera etapa de desarrollo, con un equipo reducido y priorizando la entrega de funcionalidades reales.

## 2. Contexto del proyecto

Nexova Solutions necesita desarrollar una plataforma que centralice diferentes áreas operativas del negocio.

El backend deberá atender ocho dominios funcionales:

1. Recruitment: gestión de selección y candidatos.
2. Sales: ventas y desarrollo comercial.
3. HR: gestión de recursos humanos.
4. Training: formación corporativa.
5. Support: soporte y atención al cliente.
6. Marketing: marketing y comunicación.
7. Executive: información y funcionalidades para dirección.
8. Integrations: comunicación con sistemas externos.

Estos dominios tienen responsabilidades diferentes, pero forman parte de una misma plataforma empresarial.

### Consideraciones iniciales

- El sistema comenzará como una aplicación backend única.
- Los dominios estarán organizados de forma independiente a nivel de código.
- La comunicación entre frontend y backend se realizará mediante API REST.
- El backend utilizará FastAPI.
- La gestión de dependencias y ejecución se realizará con uv.
- La persistencia de datos se incorporará progresivamente.
- Las funcionalidades de inteligencia artificial se integrarán cuando existan casos de uso definidos.

## 3. Decisión arquitectónica

### 3.1 Patrón elegido

**Arquitectura por capas (Layered Architecture) con organización por dominios (Domain-Based Organization).**

La estructura interna de cada dominio seguirá tres responsabilidades principales:

- Router: entrada HTTP y exposición de endpoints.
- Service: lógica de negocio y coordinación de operaciones.
- Data: acceso y persistencia de datos.

El flujo conceptual será:

`HTTP Request → Router → Service → Data → Database`

La respuesta recorrerá el camino inverso.

### 3.2 ¿Por qué se eligió este patrón?

Se evaluó una arquitectura modular más sofisticada basada en principios de arquitectura hexagonal.

Sin embargo, para la etapa actual, se decidió comenzar con una estructura más sencilla.

Los motivos son:

**1. Menor complejidad inicial**

Una arquitectura con múltiples abstracciones, interfaces, puertos, adaptadores y capas adicionales puede introducir costes de mantenimiento antes de que exista una necesidad real.

**2. Equipo reducido**

Actualmente el desarrollo está a cargo de dos participantes. La arquitectura debe facilitar la comprensión y modificación del código sin exigir una estructura organizativa compleja.

**3. Separación de responsabilidades**

Aunque sea sencilla, la arquitectura mantiene separadas las rutas HTTP, la lógica de negocio y el acceso a datos.

**4. Organización por áreas funcionales**

Cada dominio tiene sus propios módulos. Esto evita concentrar toda la lógica de la aplicación en unos pocos archivos.

**5. Evolución progresiva**

Si un dominio adquiere mayor complejidad, podrá incorporar nuevas capas o abstraer sus dependencias sin obligar a rediseñar toda la aplicación.

### 3.3 Consecuencias de la decisión

| Aspecto | Consecuencia |
|---|---|
| Desarrollo inicial | Menor coste de implementación |
| Mantenimiento | Responsabilidades más claras |
| Incorporación de funcionalidades | Cada dominio puede evolucionar de manera independiente |
| Testing | Servicios y acceso a datos pueden probarse por separado |
| Escalabilidad | Permite aumentar recursos de la aplicación completa |
| Complejidad | Menor que una arquitectura hexagonal completa |
| Independencia de módulos | Depende de respetar los límites entre dominios |

**Decisión:** mantener una aplicación única organizada por dominios, sin introducir microservicios ni abstracciones innecesarias.

## 4. Estructura de carpetas

La siguiente estructura constituye la organización inicial aprobada.

```text
nexova-backend/
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
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── sales/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── hr/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── training/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── support/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── marketing/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   ├── executive/
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   └── data.py
│   │   │
│   │   └── integrations/
│   │       ├── router.py
│   │       ├── service.py
│   │       └── data.py
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

- Importar los routers de los ocho dominios.
- Asignar el prefijo general `/api/v1`.
- Registrar los routers en la aplicación.
- Mantener organizada la exposición de endpoints.

Esto permite que `main.py` no tenga que conocer los detalles de cada dominio.

### 4.5 Directorio `domains/`

Es el núcleo organizativo del backend.

Cada directorio representa un área funcional de Nexova.

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

### 4.6 Responsabilidades de los dominios

| Dominio | Responsabilidad principal |
|---|---|
| `recruitment/` | Candidatos, procesos de selección, evaluaciones y seguimiento |
| `sales/` | Clientes potenciales, oportunidades, pipeline y actividad comercial |
| `hr/` | Empleados, onboarding, vacaciones y procesos internos |
| `training/` | Cursos, alumnos, inscripciones y formación corporativa |
| `support/` | Tickets, SLA, atención al cliente y base de conocimiento |
| `marketing/` | Contenidos, campañas, métricas y comunicación |
| `executive/` | Indicadores, informes y vistas consolidadas para dirección |
| `integrations/` | Comunicación con HubSpot, Zendesk, Google Workspace y otros sistemas |

**Regla:** un dominio debe ser responsable de sus propias reglas y datos. Los demás dominios deben interactuar mediante interfaces de servicio explícitas, no accediendo directamente a sus módulos internos de datos.

### 4.7 Directorio `shared/`

Contiene elementos reutilizables que realmente sean comunes a varios dominios.

Ejemplos futuros:

- Tipos compartidos.
- Utilidades generales.
- Funciones comunes de formato.
- Componentes técnicos reutilizables.

No debe utilizarse como depósito de código que no sabemos dónde colocar.

La funcionalidad específica de un dominio debe permanecer dentro de ese dominio.

### 4.8 Directorio `tests/`

Contiene las pruebas automatizadas.

Se incorporarán progresivamente:

- Tests unitarios de servicios.
- Tests de endpoints.
- Tests de integración con persistencia.
- Tests de autorización.
- Tests de regresión.

La estructura de pruebas deberá acompañar el crecimiento de los dominios.

### 4.9 Archivos de configuración

| Archivo | Responsabilidad |
|---|---|
| `.env.example` | Documentar las variables de entorno necesarias sin incluir secretos reales |
| `.gitignore` | Excluir archivos locales, entornos virtuales y secretos |
| `pyproject.toml` | Configuración del proyecto y dependencias |
| `uv.lock` | Fijar las versiones resueltas de las dependencias |
| `README.md` | Documentar instalación, ejecución y uso del backend |

## 5. Organización de rutas y dominios

La API utilizará versionado mediante prefijos.

Prefijo general:

`/api/v1`

Cada dominio tendrá su propio prefijo.

| Dominio | Prefijo |
|---|---|
| Recruitment | `/api/v1/recruitment` |
| Sales | `/api/v1/sales` |
| HR | `/api/v1/hr` |
| Training | `/api/v1/training` |
| Support | `/api/v1/support` |
| Marketing | `/api/v1/marketing` |
| Executive | `/api/v1/executive` |
| Integrations | `/api/v1/integrations` |

### Ejemplos de endpoints futuros

```text
GET    /api/v1/recruitment/candidates
POST   /api/v1/recruitment/candidates
GET    /api/v1/recruitment/candidates/{id}

GET    /api/v1/sales/opportunities
POST   /api/v1/sales/opportunities

GET    /api/v1/hr/employees
GET    /api/v1/training/courses
GET    /api/v1/support/tickets
GET    /api/v1/marketing/campaigns
GET    /api/v1/executive/dashboard

POST   /api/v1/integrations/hubspot/sync
```

Estos endpoints son ejemplos de diseño, no funcionalidades ya implementadas ni contratos definitivos.

### 5.1 Registro de routers

El archivo `app/api/router.py` será responsable de incluir los routers de todos los dominios.

El flujo de registro será:

1. Cada dominio declara su propio `APIRouter`.
2. El router principal importa los routers de dominio.
3. El router principal los registra bajo `/api/v1`.
4. `main.py` incluye el router principal en FastAPI.

Esto evita registrar rutas manualmente dentro de `main.py`.

### 5.2 Documentación OpenAPI

FastAPI generará automáticamente la documentación en:

- `/docs`: Swagger UI.
- `/redoc`: documentación ReDoc.
- `/openapi.json`: esquema OpenAPI.

**Punto técnico importante:** un `APIRouter` sin endpoints puede estar registrado en la aplicación, pero no aparecerá como grupo visible en Swagger UI.

Si se necesita que cada dominio aparezca en `/docs` desde el comienzo, habrá que incorporar al menos un endpoint provisional documentado por dominio. Si se decide mantener routers completamente vacíos, la validación deberá comprobar su registro mediante la configuración de la aplicación, no mediante su visibilidad como sección en Swagger.

## 6. Flujo de procesamiento de una solicitud

Ejemplo conceptual: consultar los candidatos de Recruitment.

```text
Frontend
   |
   | HTTP Request
   v
FastAPI
   |
   v
recruitment/router.py
   |
   | Valida entrada y parámetros
   v
recruitment/service.py
   |
   | Ejecuta reglas de negocio
   v
recruitment/data.py
   |
   | Consulta información
   v
Base de datos
   |
   v
Data → Service → Router
   |
   v
HTTP Response
```

### ¿Por qué separar estas responsabilidades?

Permite modificar una parte del sistema sin afectar necesariamente las demás.

Ejemplo:

Si cambia la forma de almacenar candidatos, se puede modificar la capa `data.py` sin trasladar consultas SQL a los endpoints.

Si cambia una regla de negocio, se modifica `service.py` sin alterar la exposición HTTP.

Si cambia una ruta, se modifica `router.py` sin duplicar la lógica de negocio.

## 7. Convenciones de desarrollo

Para mantener la consistencia del proyecto se establecen las siguientes reglas.

### 7.1 Imports absolutos

Se utilizarán imports absolutos desde el paquete `app`.

Ejemplo:

```python
from app.domains.recruitment.service import CandidateService
```

Evitar imports relativos como:

```python
from .service import CandidateService
```

Esto permite identificar claramente el origen de cada dependencia.

### 7.2 Prevención de dependencias circulares

Se establecen estas reglas:

- Los routers pueden depender de los servicios de su dominio.
- Los servicios pueden depender de la capa de datos.
- La capa de datos no debe depender de los routers.
- Los dominios no deben importar directamente los módulos internos de datos de otros dominios.
- Los componentes compartidos no deben depender de dominios concretos.
- `main.py` debe limitarse a la inicialización y composición de la aplicación.

Si dos dominios necesitan colaborar, la comunicación debe realizarse mediante servicios o contratos explícitos.

### 7.3 Nomenclatura

Se utilizará:

- `snake_case` para archivos, funciones y variables.
- `PascalCase` para clases.
- Nombres descriptivos para endpoints y servicios.
- Un lenguaje de dominio consistente para los modelos y operaciones.

### 7.4 Validación de datos

Los datos recibidos desde el exterior deben validarse antes de ejecutar operaciones de negocio.

Se utilizarán modelos de Pydantic para validar solicitudes y estructurar respuestas.

La validación de entrada no reemplaza las verificaciones de permisos ni las reglas de negocio.

## 8. Gestión del entorno y ejecución

El proyecto utilizará `uv` para administrar dependencias y ejecutar la aplicación.

### Comandos principales

Inicialización:

```bash
uv init --bare
```

Instalación de dependencias iniciales:

```bash
uv add fastapi "uvicorn[standard]"
```

Sincronización del entorno:

```bash
uv sync
```

Ejecución en desarrollo:

```bash
uv run uvicorn app.main:app --reload
```

La aplicación estará disponible en:

```text
http://127.0.0.1:8000
```

Documentación:

```text
http://127.0.0.1:8000/docs
```

El archivo `uv.lock` deberá mantenerse actualizado y versionado para asegurar entornos reproducibles.

## 9. Seguridad y protección de datos

Nexova gestionará información personal de candidatos, empleados y clientes.

Por este motivo, la seguridad debe considerarse desde las primeras funcionalidades que procesen datos reales.

### Riesgos identificados

**9.1 Datos personales y RGPD**

Los datos de candidatos y empleados pueden incluir información personal sensible.

Se deberá contemplar:

- Minimización de datos.
- Finalidad del tratamiento.
- Control de acceso.
- Retención y eliminación.
- Registro de operaciones relevantes.
- Gestión de solicitudes de acceso y supresión cuando corresponda.

**9.2 Autenticación y autorización**

La autenticación deberá incorporarse antes de exponer funcionalidades privadas.

La autorización deberá controlar:

- Rol del usuario.
- Dominio al que puede acceder.
- Recurso específico.
- Organización o contexto empresarial cuando corresponda.

No alcanza con ocultar botones en el frontend. El backend debe verificar los permisos en cada operación protegida.

**9.3 Secretos y variables de entorno**

Las credenciales de servicios externos y bases de datos no deben almacenarse en el código fuente.

Se utilizarán variables de entorno y, cuando el despliegue lo requiera, un gestor de secretos.

**9.4 Archivos y CV**

Los documentos deben almacenarse fuera del sistema de archivos público de la aplicación.

Se deberán contemplar:

- Validación de formato y tamaño.
- Restricciones de acceso.
- Análisis de archivos.
- URLs temporales o mecanismos equivalentes de descarga autorizada.
- Protección contra archivos maliciosos.

**Decisión:** estas medidas se implementarán antes de habilitar el procesamiento de datos reales y no se considerarán opcionales para producción.

## 10. Integraciones externas

El dominio `integrations` centralizará las comunicaciones con servicios externos.

Integraciones previstas:

- HubSpot.
- Zendesk.
- Google Workspace.
- ATS existente.
- Otros servicios que se incorporen posteriormente.

### Riesgos

- Caídas de servicios externos.
- Límites de solicitudes (rate limits).
- Cambios en APIs.
- Errores de autenticación.
- Datos duplicados.
- Sincronizaciones incompletas.
- Inconsistencias entre sistemas.

### Criterios técnicos

Las integraciones deberán contemplar:

- Timeouts.
- Manejo de errores.
- Reintentos controlados.
- Registro de operaciones.
- Protección de credenciales.
- Idempotencia en operaciones que puedan repetirse.
- Control de sincronización.

No se debe asumir que una solicitud externa siempre tendrá éxito.

## 11. Procesamiento asíncrono e inteligencia artificial

Algunas operaciones de Nexova podrían requerir más tiempo de procesamiento que una solicitud HTTP convencional.

Ejemplos:

- Extracción de información de CV.
- Clasificación y análisis de candidatos.
- Sincronización con HubSpot.
- Procesamiento de tickets.
- Generación de informes.
- Procesamiento documental mediante IA.

Estas tareas no deberían bloquear innecesariamente las solicitudes HTTP.

**Decisión inicial:** no introducir una infraestructura de workers antes de tener un caso de uso concreto que lo justifique.

Cuando sea necesario, se evaluará una solución de procesamiento asíncrono, incorporando colas, workers y mecanismos de seguimiento de tareas.

Las decisiones automatizadas que puedan afectar oportunidades laborales deberán contar con supervisión humana y controles adecuados.

## 12. Riesgos arquitectónicos y puntos de atención

| Riesgo | Consecuencia posible | Medida preventiva |
|---|---|---|
| Servicios demasiado grandes | Dificultad de mantenimiento | Dividir por responsabilidades |
| Dependencias entre dominios | Acoplamiento excesivo | Comunicación mediante servicios explícitos |
| Consultas sin índices | Lentitud con grandes volúmenes | Revisar consultas y medir rendimiento |
| Falta de autorización | Exposición de datos | Validación de permisos en backend |
| Integraciones inestables | Errores y datos inconsistentes | Timeouts, reintentos e idempotencia |
| Procesos largos en HTTP | Bloqueo de solicitudes | Incorporar workers cuando corresponda |
| Datos duplicados | Inconsistencias | Definir reglas de identidad y sincronización |
| Crecimiento del código | Módulos difíciles de mantener | Revisar límites de cada dominio |
| Falta de observabilidad | Diagnóstico lento | Logging, métricas y trazabilidad |

### 12.1 Límites de la arquitectura elegida

La arquitectura por capas es adecuada para comenzar, pero no resuelve automáticamente todos los problemas de escalabilidad.

A medida que crezca el sistema podrían aparecer:

- Servicios con demasiadas responsabilidades.
- Dependencias cruzadas entre dominios.
- Consultas complejas.
- Procesos de larga duración.
- Necesidad de aislar cargas específicas.
- Requerimientos de despliegue independiente.

Esto no significa que debamos anticipar una migración.

Significa que debemos monitorear estos indicadores y evolucionar la arquitectura cuando exista evidencia suficiente.

## 13. Estrategia de evolución

La arquitectura se desarrollará progresivamente.

### Etapa 1 — Fundación

- Crear la estructura de carpetas.
- Configurar FastAPI y uv.
- Registrar los ocho routers.
- Configurar el sistema de excepciones.
- Establecer convenciones de imports.
- Verificar `/docs`.

### Etapa 2 — Persistencia

- Incorporar PostgreSQL.
- Definir modelos y relaciones.
- Implementar migraciones.
- Implementar la capa de datos.
- Incorporar tests de persistencia.

### Etapa 3 — Seguridad

- Implementar autenticación.
- Implementar autorización.
- Definir roles y permisos.
- Proteger recursos y documentos.
- Incorporar auditoría de operaciones relevantes.

### Etapa 4 — Funcionalidades principales

- Implementar los servicios de cada dominio.
- Exponer endpoints.
- Integrar el frontend.
- Incorporar pruebas automatizadas.

### Etapa 5 — Integraciones e IA

- Integrar sistemas externos.
- Incorporar procesamiento asíncrono.
- Desarrollar funcionalidades de IA.
- Implementar controles de supervisión humana.

### Etapa 6 — Optimización

- Medir rendimiento.
- Analizar consultas.
- Incorporar caché cuando sea necesario.
- Mejorar observabilidad.
- Evaluar necesidades de escalabilidad.

## 14. Criterios de aceptación de la arquitectura inicial

La primera implementación de la estructura se considerará válida cuando:

- [ ] El proyecto pueda instalarse mediante `uv sync`.
- [ ] FastAPI pueda iniciarse mediante `uv run`.
- [ ] `main.py` mantenga únicamente responsabilidades de inicialización.
- [ ] Los ocho dominios estén creados.
- [ ] Cada dominio tenga `router.py`, `service.py` y `data.py`.
- [ ] Los routers estén registrados centralmente.
- [ ] Se utilicen imports absolutos.
- [ ] No existan dependencias circulares.
- [ ] La aplicación exponga la documentación OpenAPI.
- [ ] Los routers estén registrados y puedan verificarse.
- [ ] No se haya introducido lógica de negocio prematuramente.

**Nota:** para que los ocho dominios sean visibles como grupos en Swagger UI deberán disponer de al menos un endpoint documentado. Si se mantienen vacíos, su registro se verificará mediante la configuración de la aplicación.

## 15. Decisiones pendientes

Las siguientes decisiones no forman parte de la estructura inicial y deberán definirse antes de implementar las funcionalidades correspondientes:

| Tema | Decisión pendiente |
|---|---|
| Base de datos | PostgreSQL y estrategia de migraciones |
| ORM | Selección de tecnología de persistencia |
| Autenticación | Estrategia de sesiones o tokens |
| Autorización | Modelo de roles y permisos |
| Multi-tenancy | Determinar alcance y aislamiento entre organizaciones |
| Archivos | Proveedor de almacenamiento documental |
| Procesamiento asíncrono | Tecnología de colas y workers |
| IA | Proveedores, modelos y estrategia de integración |
| Observabilidad | Logging, métricas y trazabilidad |
| Deployment | Infraestructura y estrategia de despliegue |

Estas decisiones deberán tomarse en función de los requisitos concretos, no por anticipación.

## 16. Conclusión

Nexova Solutions comenzará con una arquitectura backend basada en FastAPI, organizada por dominios y estructurada en tres capas: router, service y data.

La decisión prioriza:

- Simplicidad.
- Claridad.
- Separación de responsabilidades.
- Bajo coste de mantenimiento.
- Velocidad de desarrollo.
- Evolución progresiva.

No se incorporarán microservicios ni patrones arquitectónicos complejos mientras no exista una necesidad técnica que los justifique.

La arquitectura debe acompañar el crecimiento del producto, no convertirse en un obstáculo para construirlo.

**Principio rector del proyecto:**

> Construir lo necesario hoy, mantener la calidad técnica y dejar preparada una evolución razonable para mañana.

---
***Recomendación técnica
Hay una decisión que conviene no postergar demasiado: definir el modelo de autenticación, autorización y aislamiento de datos entre organizaciones antes de implementar Recruitment y HR con información real. Son áreas especialmente sensibles de Nexova.***