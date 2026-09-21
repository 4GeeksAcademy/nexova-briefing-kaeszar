# AGENTS.md — Protocolo para Agentes de Código

Este archivo define el protocolo que todo agente de código (Cursor, Windsurf, Claude Code, etc.) debe seguir al trabajar en este repositorio.

---

## 1. Lectura Obligatoria al Inicio de Cada Sesión

Antes de ejecutar cualquier tarea, el agente **debe** leer los siguientes archivos del `memory-bank/` para cargar el contexto del proyecto:

| Archivo                       | Propósito                                      |
| ----------------------------- | ---------------------------------------------- |
| `memory-bank/projectbrief.md` | Descripción del proyecto, objetivos y alcance  |
| `memory-bank/techContext.md`  | Stack tecnológico, arquitectura y convenciones |
| `memory-bank/progress.md`     | Estado actual, hitos completados y pendientes  |

> ⚠️ Si alguno de estos archivos no existe o está vacío, el agente debe **informar al desarrollador** antes de continuar.

---

## 2. Flujo Obligatorio Antes de Cada Commit

El agente **debe** completar los siguientes pasos **en orden** antes de cualquier commit:

### Paso 1 — Leer el contexto actual

Cargar los archivos de `memory-bank/` y revisar el estado del proyecto. Verificar que se entiende el objetivo de la tarea en curso.

### Paso 2 — Revisar el estado del código

Ejecutar `git status` y `git diff` para entender qué ha cambiado. Asegurarse de que no hay cambios pendientes no relacionados con la tarea actual.

### Paso 3 — Validar el código

Ejecutar las pruebas y/o linting del proyecto según las convenciones definidas en `memory-bank/techContext.md`. No hacer commit si hay errores.

### Paso 4 — Documentar y confirmar

- Actualizar `memory-bank/progress.md` si la tarea representa un cambio significativo en el estado del proyecto.
- Redactar un mensaje de commit claro y descriptivo que explique **qué** se hizo y **por qué**.
- Pedir confirmación al desarrollador antes de ejecutar `git commit`.

---

## 3. Archivos y Carpetas Protegidas

Las siguientes rutas **no deben ser modificadas** por el agente sin confirmación explícita y previa del desarrollador:

### Protegidos (nunca modificar sin preguntar)

| Ruta                 | Motivo                                                        |
| -------------------- | ------------------------------------------------------------- |
| `AGENTS.md`          | Protocolo del agente — solo lo modifica el equipo humano      |
| `memory-bank/`       | Contexto del proyecto — solo se actualiza con autorización    |
| `.agents/`           | Configuración del agente de código — no es código de producto |
| `CONTEXT.md`         | Fuente de verdad del dominio de la empresa                    |
| `docker-compose.yml` | Infraestructura — cambios pueden romper el entorno local      |
| `infra/`             | Despliegue y configuración de infraestructura                 |
| `packages/shared/`   | Librería compartida — cambios afectan a múltiples módulos     |

### Solo lectura (explorar, no editar)

| Ruta                         | Motivo                                 |
| ---------------------------- | -------------------------------------- |
| `docs/`                      | Documentación transversal del proyecto |
| `README.md` / `README.es.md` | Guía general del monorepo              |

> Si el agente necesita modificar un archivo protegido, debe **explicar por qué** y **esperar aprobación explícita** antes de proceder.

---

## 4. Convenciones Generales

- **Idioma del código:** Inglés para código, nombres de variables y commits.
- **Idioma de documentación:** Según el contexto del proyecto (español o inglés).
- **Archivos nuevos:** Siempre incluir un `README.md` descriptivo en carpetas nuevas.
- **No asumir:** Si algo no está claro, preguntar al desarrollador antes de inventar una solución.
