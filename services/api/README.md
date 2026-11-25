# `services/api/` — API Centralizada Nexova Solutions

Backend FastAPI que expone datos de la empresa para dashboards, agentes y automatizaciones.

## Tech Stack

- **Framework:** FastAPI (Python 3.11+)
- **Server:** Uvicorn
- **Docs:** Swagger UI en `/docs`

## Endpoints

| Método | Ruta                            | Descripción                                              |
| ------ | ------------------------------- | -------------------------------------------------------- |
| GET    | `/`                             | Health check general                                     |
| GET    | `/health`                       | Health check                                             |
| GET    | `/api/v1/departments/`          | Lista todos los departamentos con métricas y necesidades |
| GET    | `/api/v1/departments/{id}`      | Detalle de un departamento específico                    |
| GET    | `/api/v1/kpis/`                 | KPIs generales de la empresa                             |
| GET    | `/api/v1/kpis/staff`            | Distribución de personal por departamento                |
| GET    | `/api/v1/kpis/revenue`          | Métricas de facturación                                  |
| POST   | `/api/incidents/analyze`        | Valida un CSV multipart y devuelve métricas agregadas    |
| GET    | `/api/incidents/results/export` | Descarga los agregados del último análisis               |

## Cómo ejecutar

```bash
cd services/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Swagger UI: `http://localhost:8000/docs`

El analizador de incidencias procesa CSV UTF-8 de hasta 10 MB en memoria. Solo conserva métricas agregadas del último análisis en el proceso; los datos de origen y la información personal no se devuelven ni se incluyen en la exportación. La lógica Python común se instala desde `packages/shared/python` mediante las dependencias del servicio.

## Datos

Todos los datos provienen de `CONTEXT-nexova-briefing.es.md`. Actualmente son hardcodeados como Constantes Python — se migrarán a base de datos cuando se defina el schema.
