---
description: Screening y ranking de candidatos para un proceso de selección en Nexova
scope: on-demand
applyTo: "agents/**, services/**, data/**"
invokedBy: "Consultores de Selección, Agentes de IA de operaciones"
---

# Skill: Candidate Screening & Ranking

## Objetivo Único

Dado un **job description** y un conjunto de **CVs**, generar un **ranking scored y explicado** de candidatos ordenados por idoneidad, clasificándos en categorías claras para que el consultor de selección tome la decisión de avanzar o descartar.

> Esta skill **no toma la decisión final** — la **reduce** de 30-80 CVs leídos manualmente a una lista priorizada con justificación.

---

## Inputs Documentados

### Input 1: Job Description (`job_description`)

| Campo                | Tipo     | Requerido | Descripción                                    |
| -------------------- | -------- | --------- | ---------------------------------------------- | -------- |
| `title`              | string   | Sí        | Título del puesto (ej. "Sales Manager B2B")    |
| `department`         | string   | Sí        | Departamento del cliente                       |
| `required_skills`    | string[] | Sí        | Habilidades imprescindibles                    |
| `preferred_skills`   | string[] | No        | Habilidades deseables pero no excluyentes      |
| `experience_years`   | object   | Sí        | `{ min: number, max?: number }` años de exp.   |
| `education`          | string   | No        | Formación requerida o preferida                |
| `languages`          | object[] | No        | `[{ language: string, level: string }]`        |
| `location`           | string   | No        | Ubicación requerida o preferida                |
| `salary_range`       | object   | No        | `{ min?: number, max?: number, currency: "EUR" | "USD" }` |
| `extra_requirements` | string   | No        | Requisitos adicionales en texto libre          |

**Ejemplo:**

```json
{
  "title": "Sales Manager B2B",
  "department": "Ventas — Cliente: TechCorp",
  "required_skills": ["B2B sales", "SaaS", "CRM HubSpot", "negotiation"],
  "preferred_skills": ["team management", "Spanish native"],
  "experience_years": { "min": 5, "max": 10 },
  "education": "Bachelor's degree in Business or related",
  "languages": [
    { "language": "English", "level": "C1+" },
    { "language": "Spanish", "level": "C1+" }
  ],
  "location": "Valencia, Spain (hybrid)",
  "salary_range": { "min": 55000, "max": 70000, "currency": "EUR" },
  "extra_requirements": "Experience selling to enterprise accounts in tech sector"
}
```

### Input 2: Candidates (`candidates`)

Array de perfiles de candidatos. Cada candidato tiene:

| Campo              | Tipo   | Requerido | Descripción                                                   |
| ------------------ | ------ | --------- | ------------------------------------------------------------- |
| `candidate_id`     | string | Sí        | ID único en el ATS de Nexova                                  |
| `name`             | string | Sí        | Nombre completo (anonymizado si el cliente lo requiere)       |
| `cv_text`          | string | Sí        | Texto extraído del CV (ocr o parse)                           |
| `parsed_profile`   | object | Sí        | Datos estructurados: skills, experiencia, educación, idiomas  |
| `source`           | string | No        | Canal de origen: `linkedin`, `referral`, `portal`, `database` |
| `application_date` | string | No        | Fecha de postulación (ISO 8601)                               |
| `notes`            | string | No        | Notas previas del consultor si existen                        |

---

## Output Esperado

La skill genera un **candidate ranking report** con la siguiente estructura:

### Estructura del Reporte

```yaml
report:
  job_title: string
  total_candidates: number
  generated_at: datetime
  consultant: string

  summary:
    total_screened: number
    shortlisted: number        # Candidatos que avanzan
    borderline: number         # Candidatos en zona gris
    rejected: number           # Candidatos descartados
    avg_score: number          # Puntuación media (0-100)

  rankings:
    - candidate_id: string
      name: string
      overall_score: number          # 0-100
      category: "shortlist" | "borderline" | "rejected"
      scores:
        skills_match: number         # 0-100 — peso: 40%
        experience_fit: number       # 0-100 — peso: 25%
        education_fit: number        # 0-100 — peso: 10%
        language_match: number       # 0-100 — peso: 15%
        location_fit: number         # 0-100 — peso: 10%
      strengths:
        - string                     # Fortalezas identificadas
      concerns:
        - string                     # Precauciones o gaps detectados
      recommendation: string         # Breve justificación (1-2 frases)
      next_step: string              # Acción sugerida: "schedule_interview" | "request_more_info" | "reject_with_feedback"

  excluded:
    - candidate_id: string
      name: string
      reason: string                 # Por qué no fue considerado (datos incompletos, etc.)
```

### Ejemplo de Salida

```yaml
rankings:
  - candidate_id: "NXV-2847"
    name: "Ana García"
    overall_score: 87
    category: "shortlist"
    scores:
      skills_match: 92
      experience_fit: 85
      education_fit: 80
      language_match: 95
      location_fit: 90
    strengths:
      - "7 years B2B SaaS sales experience"
      - "HubSpot certified, fluent in English and Spanish"
      - "Track record of exceeding quotas by 20%+"
    concerns:
      - "No direct experience in enterprise segment (>€100K deals)"
    recommendation: "Strong fit for mid-market B2B role. Enterprise experience gap is manageable with onboarding."
    next_step: "schedule_interview"
```

---

## Criterios de Aceptación Verificables

### ✅ Criterio 1: Completitud del output

| Verificación                                             | Esperado                                      |
| -------------------------------------------------------- | --------------------------------------------- |
| Todos los candidatos del input aparecen en el output     | `total_screened == length(candidates)`        |
| Cada candidato tiene `overall_score`                     | `0 <= score <= 100`                           |
| Cada candidato tiene `category`                          | Uno de: `shortlist`, `borderline`, `rejected` |
| Cada candidato tiene al menos 1 `strength` y 1 `concern` | Mínimo 1 de cada uno                          |

### ✅ Criterio 2: Coherencia del scoring

| Verificación                                          | Esperado                                                   |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `overall_score` es ponderación correcta de sub-scores | `skills*0.40 + exp*0.25 + edu*0.10 + lang*0.15 + loc*0.10` |
| Scores dentro de rangos válidos                       | Todos los sub-scores entre 0 y 100                         |
| Categoría es consistente con score                    | `>=70` → shortlist, `50-69` → borderline, `<50` → rejected |

### ✅ Criterio 3: Alineación con job description

| Verificación                                           | Esperado                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| Skills requeridas impactan significativamente el score | Si falta una `required_skill`, `skills_match` no puede superar 60  |
| Preferencias afectan pero no excluyen                  | `preferred_skills` dan bonus de hasta +15 puntos en `skills_match` |
| Idiomas verificados contra `languages` del input       | Si no cumple nivel mínimo, `language_match` <= 40                  |

### ✅ Criterio 4: Calidad de justificaciones

| Verificación | Esperado |
| ------------------------------------------------------ | ----------------────────----- |
| `recommendation` menciona al menos un skill específico | No genérico ("es bueno") sino concreto ("7 años en B2B SaaS") |
| `concerns` son accionables | No "falta experiencia" sino "no ha gestionado cuentas >€100K" |
| `next_step` es coherente con categoría | shortlist → interview, borderline → more_info, rejected → feedback |

### ✅ Criterio 5: Respeto de restricciones Nexova

| Verificación                                           | Esperado                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------ |
| No se descarta candidato por un solo criterio faltante | Salvo `required_skills` críticas — se evalúa holísticamente              |
| El score refleja el contexto del cliente               | No scoring genérico — adaptado al sector y tamaño de empresa del cliente |
| Se preserva `candidate_id` sin alterar                 | El ID del ATS se mantiene intacto en todo el output                      |

---

## Flujo de Uso

```text
1. Consultor llama a la skill con job_description + candidates[]
2. Skill procesa: parsing → scoring → ranking → justificación
3. Skill genera candidate-ranking-report
4. Consultor revisa el shortlist (5-10 candidatos en vez de 30-80)
5. Consultor agenda entrevistas para shortlist
6. Consultor envía feedback a borderline/rejected si aplica
```

---

## Restricciones y Límites

- **No contacto directo con candidatos** — la skill solo genera el ranking, no envía emails ni notifica.
- **No acceso a datos salariales del candidato** — el scoring no considera expectativas salariales del candidato (eso es negociación posterior).
- **Transparencia total** — cada score tiene justificación; no hay "caja negra".
- **Re-ranking manual permitido** — el consultor puede ajustar el ranking con anotaciones adicionales.

---

## Métricas de Éxito

| Métrica                         | Target        | Cómo medir                               |
| ------------------------------- | ------------- | ---------------------------------------- |
| Tiempo de screening por proceso | Reducir 70%+  | Tiempo antes vs después (min)            |
| Tasa de interview-to-hire       | Aumentar 40%+ | % de shortlist que se contrata           |
| Satisfacción del consultor      | >= 4/5        | Survey post-uso (1-5)                    |
| Cobertura de candidatos aptos   | >= 95%        | Candidatos shortlisteados / aptos reales |
