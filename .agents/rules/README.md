# .agents/rules/

Directorio de reglas de comportamiento para agentes de código.

Cada archivo `.md` en esta carpeta define **una regla** que el agente debe seguir. Las reglas se organizan por alcance:

## Formato del Frontmatter

Cada regla incluye metadatos en YAML frontmatter:

```yaml
---
description: Descripción breve de la regla
scope: always-active | file-pattern | on-demand
applyTo: "<patrón glob o*>"
---
```

| Campo         | Valores posibles                               | Descripción                                                  |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `description` | Texto libre                                    | Qué hace la regla (aparece en listados)                      |
| `scope`       | `always-active`, `file-pattern`, `on-demand`   | Cuándo se activa la regla                                    |
| `applyTo`     | Glob pattern (ej. `**`, `*.py`, `services/**`) | A qué archivos aplica (requerido si scope es `file-pattern`) |

## Alcances

- **`always-active`** → El agente la ejecuta siempre, sin ser invocada. Ej: carga de contexto.
- **`file-pattern`** → Se activa solo cuando el agente trabaja en archivos que coincidan con `applyTo`. Ej: reglas de Python solo para `*.py`.
- **`on-demand`** → Se activa solo cuando el agente la solicita explícitamente o el usuario la invoca. Ej: reglas de migración de datos.

## Reglas Existentes

| Archivo                                      | Alcance         | Descripción                                       |
| -------------------------------------------- | --------------- | ------------------------------------------------- |
| [`context-loading.md`](./context-loading.md) | `always-active` | Carga obligatoria de contexto al inicio de sesión |
