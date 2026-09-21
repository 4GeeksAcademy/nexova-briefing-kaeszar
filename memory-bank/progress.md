# Progress — Nexova Solutions

## Estado Actual

Fase de **configuración del entorno de desarrollo**. Se ha establecido la estructura base del monorepo y el sistema de reglas/skills para agentes de código.

## Hitos Completados

- [x] Estructura base del monorepo (carpetas y READMEs)
- [x] `memory-bank/` inicializado con contexto de Nexova
- [x] `AGENTS.md` — protocolo de agente creado (lectura contexto, flujo commit, archivos protegidos)
- [x] `.agents/rules/context-loading.md` — regla always-active de carga de contexto
- [x] `.agents/skills/candidate-screening/SKILL.md` — skill de screening de candidatos

## Hitos Pendientes

- [ ] `CONTEXT.md` — copiar briefing de Nexova como fuente de verdad del dominio
- [ ] `services/` — API FastAPI centralizada (endpoints iniciales)
- [ ] `agents/` — Primer agente de producto (soporte o selección)
- [ ] `data/` — Estructura de datos y primer dataset de ejemplo
- [ ] `uis/` — Primer dashboard (ejecutivo o de selección)
- [ ] Infraestructura de telemetría y logging

## Notas y Decisiones Recientes

- **2026-09-21:** Se creó la estructura `.agents/` con regla de context-loading y skill de candidate-screening. La skill está alineada con el departamento de Operaciones de Selección (principal fuente de ingresos de Nexova).
- **Decisión:** Se prioriza la automatización de screening de candidatos porque impacta a 40 consultores y es el core business.
- **Decisión:** El sistema de reglas usa frontmatter YAML con 3 alcances: `always-active`, `file-pattern`, `on-demand`.
