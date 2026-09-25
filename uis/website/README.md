# `uis/website/` — Web Corporativa Nexova Solutions

Sitio web público de Nexova Solutions. Ruta de inicio: `/`

## Archivo principal

Este proyecto fue iniciado previamente con Next.js y utiliza App Router.
Por ello, no existe un `index.html` tradicional.

La equivalencia funcional es:

```text
index.html = src/app/page.tsx
```

`src/app/page.tsx` es la página principal que Next.js sirve en `/`.

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
├── public/
│   ├── application.html        # Formulario público de aplicación
│   └── validation.js           # Validación accesible y envío simulado
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

### Desarrollo local

```bash
cd uis/website
npm install
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

### Desarrollo en GitHub Codespaces con `npx`

También se puede iniciar Next.js directamente con `npx`. La opción
`--hostname 0.0.0.0` permite que Codespaces exponga el puerto mediante el
reenvío de puertos:

```bash
cd uis/website
npm install
npx next dev --hostname 0.0.0.0
```

Después, abre el puerto `3000` desde la pestaña **Ports** de Codespaces o usa:

- Página principal: `http://localhost:3000`
- Formulario de aplicación: `http://localhost:3000/application.html`

Para detener el servidor, pulsa `Ctrl+C` en la terminal.

## Formulario de aplicación

El formulario está disponible en `public/application.html` y se sirve como
recurso estático en `/application.html`. El CTA principal de `Hero.tsx`,
**Aplicar a Nexova**, enlaza directamente con esta ruta.

Incluye:

- HTML semántico con `header`, `main`, `section`, `form`, `fieldset`, `legend`
  y `footer`.
- Campos de datos personales y perfil profesional relacionados con las áreas
  de Nexova.
- Etiquetas `label` asociadas a todos los campos mediante `for` e `id`.
- Campos obligatorios mediante `required`.
- Diseño mobile-first con clases utilitarias de Tailwind CSS.
- Una columna y botones apilados en móvil; dos columnas y botones horizontales
  desde el breakpoint `sm`.
- Atributos ARIA como `aria-label`, `aria-labelledby`, `aria-hidden`,
  `aria-invalid` y `aria-describedby` donde son necesarios.
- Mensajes de error específicos, visibles y anunciados con `role="alert"`.
- Prevención del envío cuando existen errores de validación.
- Mensaje de éxito con `role="status"` para simular el envío correcto.
- Validaciones de email, teléfono, experiencia, fechas, extensión del CV y
  longitud máxima del texto de experiencia.
- Botón para limpiar el formulario y sus mensajes de validación.

La validación se carga desde `public/validation.js`. El formulario usa
`novalidate` mediante JavaScript para mostrar mensajes propios y evitar el
envío real mientras no exista un backend conectado.

## SEO y datos estructurados

El layout principal define metadata SEO mediante `src/app/layout.tsx`.
Además, el formulario incluye marcado JSON-LD de Schema.org con tipo
`Organization` para describir Nexova Solutions, su año de fundación y sus
ubicaciones conocidas en Valencia y Miami.

No se utiliza `JobPosting`, porque el formulario es una aplicación general y
no representa una vacante específica. Ese tipo de marcado podrá añadirse en
el futuro en páginas individuales de ofertas de empleo, siempre que los datos
sean reales y coincidan con el contenido visible.

## Accesibilidad y recursos visuales

Actualmente no se usan imágenes en la landing ni en el formulario, por lo que
no existen imágenes que requieran atributos `alt`. Si se incorporan imágenes,
deberán incluir texto alternativo descriptivo; las imágenes puramente
decorativas deberán marcarse con `alt=""`.

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
