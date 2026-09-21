---
description: Carga obligatoria de contexto al inicio de cada sesión de trabajo
scope: always-active
applyTo: "**"
---

# Regla: Carga de Contexto Obligatoria

## Cuándo se aplica

**Siempre activa** — se ejecuta automáticamente al inicio de cada sesión del agente, sin necesidad de ser invocada.

## Qué hace

Antes de leer, escribir o modificar cualquier archivo del repositorio, el agente debe:

1. **Leer `memory-bank/projectbrief.md`** → entender qué es el proyecto y cuál es su alcance.
2. **Leer `memory-bank/techContext.md`** → conocer el stack, la arquitectura y las convenciones de desarrollo.
3. **Leer `memory-bank/progress.md`** → saber en qué punto se encuentra el proyecto, qué está completo y qué falta.
4. **Leer `AGENTS.md`** → recordar el protocolo completo, incluyendo archivos protegidos y flujo de commit.

## Por qué existe

Sin este contexto, el agente toma decisiones a ciegas: puede usar tecnologías incorrectas, romper convenciones del equipo, o duplicar trabajo ya hecho. Esta regla garantiza que el agente **siempre** parta de la misma base de conocimiento que el equipo humano.

## Qué hacer si falta un archivo

Si alguno de los archivos de `memory-bank/` no existe o está vacío:

- **No inventar contenido** para llenarlo.
- **Informar al desarrollador** que falta contexto.
- **Preguntar** si debe continuarse sin ese archivo o si se debe crear primero.

## Ejemplo de comportamiento correcto

```
Agente inicia sesión →
  ✅ Lee projectbrief.md → "OK, es Nexova, plataforma de..."
  ✅ Lee techContext.md → "OK, FastAPI + React, PostgreSQL..."
  ✅ Lee progress.md → "OK, el hito 2 está en progreso..."
  ✅ Lee AGENTS.md → "OK, no debo tocar infra/ sin preguntar..."
  → Ahora sí puede empezar a trabajar.
```

## Ejemplo de comportamiento incorrecto

```
Agente inicia sesión →
  ❌ Empieza a modificar archivos sin leer contextos
  ❌ Usa Django cuando el proyecto es FastAPI
  ❌ Modifica docker-compose.yml sin preguntar
```
