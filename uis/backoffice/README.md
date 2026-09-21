# `uis/backoffice/` — Panel Interno Nexova Solutions

Aplicación interna de gestión para el equipo de Nexova. Muestra datos del briefing de la empresa: departamentos, KPIs, distribución de personal.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS v4
- **Runtime:** React 19
- **Puerto:** 3001 (para no conflicto con website en 3000)

## Estructura

```
uis/backoffice/
├── src/
│   └── app/
│       ├── globals.css      # Tailwind v4 + tokens de Nexova
│       ├── layout.tsx       # Layout con sidebar (navegación interna)
│       ├── page.tsx         # Dashboard principal con KPIs
│       ├── departments/
│       │   └── page.tsx     # Lista de departamentos
│       └── kpis/
│           └── page.tsx     # KPIs detallados
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Cómo ejecutar

```bash
cd uis/backoffice
npm install
npm run dev
```

Abre `http://localhost:3001`

## Datos

Actualmente los datos están hardcodeados en los componentes. Próximamente se consumirán desde `services/api/` via fetch.
