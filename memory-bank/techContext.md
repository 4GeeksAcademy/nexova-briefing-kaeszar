# Tech Context — Nexova Solutions

## Stack Tecnológico

| Capa          | Tecnología                | Estado                |
| ------------- | ------------------------- | --------------------- |
| Backend API   | FastAPI (Python)          | Por definir           |
| Frontend      | React / Next.js           | Por definir           |
| Base de datos | PostgreSQL                | Principal             |
| RAG           | Embeddings + vector store | Por definir           |
| CRM           | HubSpot                   | En uso (40% adoption) |
| Helpdesk      | Zendesk legacy            | En uso, obsoleto      |
| Productividad | Google Workspace          | En uso                |
| ATS           | Sistema custom (2010)     | En uso, legacy        |
| Despliegue    | Docker                    | Por configurar        |
| Orquestación  | n8n / workflows           | Por configurar        |
| Telemetría    | No existe                 | Por construir         |

## Arquitectura

```text
[Clientes/Consultores] → [uis/ (dashboards, portales)]
                              ↓
                    [services/ (FastAPI API)]
                      ↓           ↓
              [data/ (pipelines)]  [agents/ (IA)]
                      ↓                ↓
            [PostgreSQL + VectorDB]  [RAG, LLMs]
                      ↑
    [HubSpot, Zendesk, Google Workspace] (fuentes de datos)
```

## Dependencias Clave

- **HubSpot API** — CRM de ventas,.sync de contactos y deals
- **Zendesk API** — Tickets de soporte (legacy, puede requerir migración)
- **Google Workspace API** — Docs, Forms, Calendar para RRHH y formación
- **LLM Provider** — Para agentes de IA, RAG y scoring (por definir: OpenAI, Azure, local)

## Convenciones de Desarrollo

- **Lenguaje del código:** Inglés
- **Lenguaje de documentación:** Español (contexto de Nexova)
- **Idioma de commits:** Inglés
- **Testing:** pytest para backend, Jest/Vitest para frontend
- **API design:** REST, versionado por URL (`/api/v1/...`)
- **Seguridad:** No exponer datos personales de candidatos en logs. PII handling según GDPR (empresa en España).
- **Archivos nuevos:** Siempre incluir README.md descriptivo
