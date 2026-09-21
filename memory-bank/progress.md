# Progress — Nexova Solutions

## Estado Actual

Fase de **desarrollo inicial**. Se ha establecido la estructura del monorepo, el sistema de reglas/skills para agentes, y el sitio web público corporativo.

## Hitos Completados

- [x] Estructura base del monorepo (carpetas y READMEs)
- [x] `memory-bank/` inicializado con contexto de Nexova
- [x] `AGENTS.md` — protocolo de agente creado (lectura contexto, flujo commit, archivos protegidos)
- [x] `.agents/rules/context-loading.md` — regla always-active de carga de contexto
- [x] `.agents/skills/candidate-screening/SKILL.md` — skill de screening de candidatos
- [x] `uis/website/` — Web corporativa Next.js con 8 componentes reutilizables

## Hitos Pendientes

- [ ] `CONTEXT.md` — copiar briefing de Nexova como fuente de verdad del dominio
- [ ] `services/` — API FastAPI centralizada (endpoints iniciales)
- [ ] `agents/` — Primer agente de producto (soporte o selección)
- [ ] `data/` — Estructura de datos y primer dataset de ejemplo
- [ ] `uis/backoffice/` — Panel interno de administración
- [ ] Infraestructura de telemetría y logging

## Notas y Decisiones Recientes

- **2026-09-21:** Se creó `uis/website/` con Next.js 15, Tailwind CSS v4, App Router. 8 componentes reutilizables: Header, Hero, ServiceCard, Services, Stats, About, CTA, Footer. Identidad visual: Navy (#1a3a8a) + Teal (#0d9488). Ruta `/` renderiza landing page corporativa alineada con briefing Nexova.
- **2026-09-21:** Se creó la estructura `.agents/` con regla de context-loading y skill de candidate-screening. La skill está alineada con el departamento de Operaciones de Selección (principal fuente de ingresos de Nexova).
- **Decisión:** Se prioriza la automatización de screening de candidatos porque impacta a 40 consultores y es el core business.
- **Decisión:** El sistema de reglas usa frontmatter YAML con 3 alcances: `always-active`, `file-pattern`, `on-demand`.
- **Decisión:** Se usa Next.js App Router para el frontend (moderno, SSR/SSG, good para corporate sites).
