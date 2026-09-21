from fastapi import APIRouter

router = APIRouter()

# Datos de departamentos extraídos del briefing de Nexova Solutions
# Fuente: CONTEXT-nexova-briefing.es.md

DEPARTMENTS = [
    {
        "id": "seleccion",
        "name": "Operaciones de Selección",
        "head": "Javier Almeida",
        "head_title": "Head of Selection",
        "headcount": 40,
        "description": "Núcleo del negocio y principal fuente de ingresos. Procesos de reclutamiento end-to-end.",
        "pain_points": [
            "Cribado de CVs completamente manual (30-80 CVs por proceso)",
            "Comunicación con candidatos por email individual sin plantillas",
            "Sin sistema de estado en tiempo real",
            "Matching candidato-vacante basado en intuición",
        ],
        "needs": [
            "Pipeline de selección asistido por IA con scoring automático",
            "Sistema RAG sobre base de datos de candidatos",
            "Portal de candidatos con estado en tiempo real",
            "Agente de comunicación para emails de seguimiento",
        ],
        "color": "#1a3a8a",
    },
    {
        "id": "formacion",
        "name": "Formación Corporativa",
        "head": "Elena Vargas",
        "head_title": "Head of Training",
        "headcount": 12,
        "description": "Programas de formación: liderazgo, comunicación y gestión de equipos.",
        "pain_points": [
            "Catálogo en PDF actualizado trimestralmente",
            "Inscripciones por Google Form + hoja de cálculo",
            "Sin registro de completion",
            "Personalización cero",
        ],
        "needs": [
            "Plataforma de catálogo con búsqueda e inscripción online",
            "Sistema de recomendación por perfil de cliente",
            "Portal del alumno con seguimiento de progreso",
            "Chatbot de asesoramiento formativo",
        ],
        "color": "#0d9488",
    },
    {
        "id": "soporte",
        "name": "Atención al Cliente",
        "head": "Roberto Díaz",
        "head_title": "Head of Support",
        "headcount": 30,
        "description": "Equipos de atención dedicados para clientes de outsourcing.",
        "pain_points": [
            "Sin base de conocimiento centralizada",
            "Tiempo medio de resolución: 48h (SLA: 24h)",
            "Sin visibilidad en tiempo real sobre carga",
            "Supervisores sin datos del backlog",
        ],
        "needs": [
            "Chatbot de soporte de primera línea con RAG",
            "Base de conocimiento con búsqueda semántica",
            "Dashboard de soporte en tiempo real",
            "Análisis de sentimiento de tickets",
        ],
        "color": "#7c3aed",
    },
    {
        "id": "ventas",
        "name": "Ventas y Desarrollo de Negocio",
        "head": "Marcos Ibáñez",
        "head_title": "Head of Sales",
        "headcount": 18,
        "description": "Account managers y SDRs. CRM HubSpot con adoption del 40%.",
        "pain_points": [
            "Prospectación manual en LinkedIn + Excel",
            "Solo 40% actualiza HubSpot regularmente",
            "Deals perdidos por falta de seguimiento",
            "Sin scoring de probabilidad de cierre",
        ],
        "needs": [
            "Dashboard del pipeline de ventas",
            "Automatización de secuencias de prospección",
            "Alertas para conversaciones sin actividad",
            "Agente IA para ángulo de propuesta",
        ],
        "color": "#ea580c",
    },
    {
        "id": "marketing",
        "name": "Marketing y Comunicación",
        "head": "Carmen Ruiz",
        "head_title": "Head of Marketing",
        "headcount": 6,
        "description": "Web, LinkedIn, newsletter y blog. Producción manual.",
        "pain_points": [
            "Web de 2019, lenta y no accesible",
            "Contenido producido manual",
            "Sin medición de impacto",
            "Visibilidad limitada",
        ],
        "needs": [
            "Rediseño web con SEO/GEO y schema.org",
            "Pipeline de contenido asistido por IA",
            "Dashboard de métricas de marketing",
        ],
        "color": "#db2777",
    },
    {
        "id": "rrhh",
        "name": "Recursos Humanos (interno)",
        "head": "Patricia Solís",
        "head_title": "Head of HR",
        "headcount": 4,
        "description": "Gestión de los 120 empleados de Nexova.",
        "pain_points": [
            "Solicitudes por email",
            "Onboarding manual sin checklists",
            "Evaluaciones por Google Forms sin revisión",
            "Sin métricas de RRHH",
        ],
        "needs": [
            "Portal interno de RRHH",
            "Flujo automatizado de onboarding",
            "Dashboard de KPIs de RRHH",
            "Agente interno para políticas",
        ],
        "color": "#0891b2",
    },
    {
        "id": "tech",
        "name": "Tecnología e Infraestructura",
        "head": "Sergio Molina",
        "head_title": "CTO",
        "headcount": 6,
        "description": "Stack desconectado: HubSpot, Zendesk legacy, ATS 2010, Google Workspace.",
        "pain_points": [
            "Herramientas desconectadas",
            "Sin telemetría ni logging centralizado",
            "Fallos detectados por usuarios",
            "Despliegues manuales",
        ],
        "needs": [
            "Telemetría y logging centralizados",
            "Pipeline de datos para dashboards",
            "Monitorización en tiempo real",
            "Agente de ingeniería para docs técnicas",
        ],
        "color": "#4f46e5",
    },
]


@router.get("/")
def list_departments():
    """Lista todos los departamentos de Nexova."""
    return {
        "total_departments": len(DEPARTMENTS),
        "total_employees": sum(d["headcount"] for d in DEPARTMENTS),
        "departments": DEPARTMENTS,
    }


@router.get("/{department_id}")
def get_department(department_id: str):
    """Obtiene un departamento por su ID."""
    for dept in DEPARTMENTS:
        if dept["id"] == department_id:
            return dept
    return {"error": f"Department '{department_id}' not found"}
