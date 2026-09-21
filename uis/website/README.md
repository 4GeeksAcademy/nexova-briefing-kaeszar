# `uis/website/` — Web Corporativa Nexova Solutions

Sitio web público de Nexova Solutions. Ruta de inicio: `/`

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Runtime:** React 19

## Estructura

```text
uis/website/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout raíz (metadata, font, global styles)
│   │   ├── page.tsx            # Página de inicio (/)
│   │   └── globals.css         # Design tokens y estilos globales
│   └── components/
│       ├── Header.tsx          # Navbar fija con menú móvil
│       ├── Hero.tsx            # Sección principal (headline + CTAs)
│       ├── ServiceCard.tsx     # Card reutilizable de servicio
│       ├── Services.tsx        # Grid de 3 servicios de Nexova
│       ├── Stats.tsx           # Números clave de la empresa
│       ├── About.tsx           # Sección "Sobre nosotros"
│       ├── CTA.tsx             # Call to action de contacto
│       └── Footer.tsx          # Pie de página
├── package.json
├── tsconfig.json
├── next.config.js
└── postcss.config.mjs
```

## Identidad Visual

| Token              | Valor                 | Uso                                               |
| ------------------ | --------------------- | ------------------------------------------------- |
| **Primary (Navy)** | `#1a3a8a`             | Headlines, botones principales, fondos de sección |
| **Accent (Teal)**  | `#0d9488`             | Acentos, badges, estadísticas, hover states       |
| **Neutral**        | `#f9fafb` → `#111827` | Fondos, texto, bordes                             |

**Tipografías:**

- Headings: Plus Jakarta Sans (bold/extrabold)
- Body: Inter (regular/medium)

## Cómo ejecutar

```bash
cd uis/website
npm install
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## Componentes Reutilizables

| Componente    | Props                                      | Descripción                                        |
| ------------- | ------------------------------------------ | -------------------------------------------------- |
| `Header`      | —                                          | Navbar fija con logo, nav links y menú móvil       |
| `Hero`        | —                                          | Sección principal con headline, subheadline y CTAs |
| `ServiceCard` | `icon`, `title`, `description`, `features` | Card reutilizable para cualquier servicio          |
| `Services`    | —                                          | Grid de servicios (usa `ServiceCard`)              |
| `Stats`       | —                                          | Números clave de la empresa                        |
| `About`       | —                                          | Sección "Sobre nosotros" con valores               |
| `CTA`         | —                                          | Call to action con email y teléfono                |
| `Footer`      | —                                          | Pie de página con links y contacto                 |

## Notas

- La web está alineada con el briefing de Nexova Solutions (CONTEXT-nexova-briefing.es.md)
- Los datos de contacto y servicios son placeholders — reemplazar con datos reales
- El diseño es responsive (mobile-first)
- SEO optimizado con metadata en `layout.tsx`
