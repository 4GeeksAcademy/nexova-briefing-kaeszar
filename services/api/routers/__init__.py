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
        "description": "Núcleo del negocio y principal fuente de ingresos. Procesos de reclutamiento end-to-end: briefing, criba de CVs, entrevistas y contratación.",
        "pain_points": [
            "Cribado de CVs completamente manual (30-80 CVs por proceso)",
            "Comunicación con candidatos por email individual sin plantillas",
            "Sin sistema de estado en tiempo real — los clientes llaman a preguntar",
            "Matching candidato-vacante basado en intuición del consultor",
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
        "description": "Diseño e impartición de programas de formación para empresas clientes: liderazgo, comunicación y gestión de equipos.",
        "pain_points": [
            "Catálogo en PDF que se actualiza trimestralmente",
            "Inscripciones por Google Form + hoja de cálculo manual",
            "Sin registro de quién completó qué formación",
            "Personalización cero — todos los clientes reciben el mismo catálogo",
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
        "name": "Atención al Cliente (Externalizado)",
        "head": "Roberto Díaz",
        "head_title": "Head of Support",
        "headcount": 30,
        "description": "Equipos de atención dedicados para clientes de outsourcing (tech, retail, finanzas). Teléfono, email y chat.",
        "pain_points": [
            "Sin base de conocimiento centralizada — resuelven por experiencia",
            "Tiempo medio de resolución: 48h (SLA comprometido: 24h)",
            "Sin visibilidad en tiempo real sobre carga de trabajo",
            "Supervisores sin datos del backlog",
        ],
        "needs": [
            "Chatbot de soporte de primera línea con RAG (resolver 40% sin humano)",
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
        "description": "Account managers que cuidan clientes actuales y SDRs que persiguen nuevos. CRM HubSpot con adoption del 40%.",
        "pain_points": [
            "Prospectación manual en LinkedIn + exportación a Excel",
            "Solo 40% del equipo actualiza HubSpot con regularidad",
            "Deals perdidos por falta de seguimiento",
            "Sin visibilidad sobre qué prospectos tienen más probabilidad de cerrar",
        ],
        "needs": [
            "Dashboard del pipeline de ventas",
            "Automatización de secuencias de prospección",
            "Alertas para conversaciones sin actividad",
            "Agente de IA para ángulo de propuesta por prospecto",
        ],
        "color": "#ea580c",
    },
    {
        "id": "marketing",
        "name": "Marketing y Comunicación",
        "head": "Carmen Ruiz",
        "head_title": "Head of Marketing",
        "headcount": 6,
        "description": "Presencia externa: web corporativa, LinkedIn, newsletter mensual y blog. Producción manual con visibilidad limitada.",
        "pain_points": [
            "Web construida en 2019, lenta y no accesible",
            "Contenido producido completamente manual",
            "Sin medición del impacto real del trabajo",
            "Visibilidad limitada sobre qué funciona",
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
        "description": "Gestión de los 120 empleados de Nexova: contratos, onboarding, vacaciones, evaluaciones. Todo por email y hoja de cálculo.",
        "pain_points": [
            "Solicitudes de vacaciones y ausencias por email",
            "Onboarding manual sin checklists",
            "Evaluaciones de desempeño por Google Forms sin revisión sistemática",
            "Sin métricas: no hay tasa de rotación, absentismo ni tiempo de cobertura",
        ],
        "needs": [
            "Portal interno de RRHH",
            "Flujo automatizado de onboarding con checklists",
            "Dashboard de KPIs de RRHH",
            "Agente interno para preguntas sobre políticas y beneficios",
        ],
        "color": "#0891b2",
    },
    {
        "id": "tech",
        "name": "Tecnología e Infraestructura",
        "head": "Sergio Molina",
        "head_title": "CTO",
        "headcount": 6,
        "description": "Stack tecnológico desconectado: HubSpot, Zendesk legacy, Google ATS (2010), Google Workspace. Sin telemetría ni logging centralizado.",
        "pain_points": [
            "Mosaico de herramientas desconectadas",
            "Sin telemetría ni logging centralizado",
            "Cuando algo falla, el equipo se entera por los usuarios",
            "Despliegues manuales",
        ],
        "needs": [
            "Telemetría y logging centralizados",
            "Pipeline de datos para dashboards",
            "Monitorización en tiempo real con alertas",
            "Agente interno de ingeniería para docs técnicas",
        ],
        "color": "#4f46e5",
    },
]


@router.get("/")
def list_departments():
    """Lista todos los departamentos de Nexova con sus métricas y necesidades."""
    return {
        "total_departments": len(DEPARTMENTS),
        "total_employees": sum(d["headcount"] for d in DEPARTMENTS),
        "departments": DEPARTMENTS,
    }


@router.get("/{department_id}")
def get_department(department_id: str):
    """Obtiene un departamento específico por su ID."""
    for dept in DEPARTMENTS:
        if dept["id"] == department_id:
            return dept
    return {"error": f"Department '{department_id}' not found"}
