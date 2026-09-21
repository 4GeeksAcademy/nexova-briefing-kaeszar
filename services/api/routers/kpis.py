from fastapi import APIRouter

router = APIRouter()

# KPIs generales de Nexova Solutions extraídos del briefing
# Fuente: CONTEXT-nexova-briefing.es.md

COMPANY_INFO = {
    "name": "Nexova Solutions",
    "founded": 2011,
    "hq": "Valencia, España",
    "secondary_office": "Miami, Florida",
    "total_employees": 120,
    "annual_revenue_usd": 8_000_000,
    " ceo": "Laura Mendoza",
    "cto": "Sergio Molina",
}

# Distribución de personal por departamento (sum = 116, approx 120 con dirección)
STAFF_DISTRIBUTION = [
    {"department": "Operaciones de Selección", "headcount": 40, "percentage": 33.3},
    {"department": "Atención al Cliente", "headcount": 30, "percentage": 25.0},
    {"department": "Ventas y Desarrollo", "headcount": 18, "percentage": 15.0},
    {"department": "Formación Corporativa", "headcount": 12, "percentage": 10.0},
    {"department": "Tecnología e Infraestructura", "headcount": 6, "percentage": 5.0},
    {"department": "Marketing y Comunicación", "headcount": 6, "percentage": 5.0},
    {"department": "Recursos Humanos", "headcount": 4, "percentage": 3.3},
    {"department": "Dirección Ejecutiva", "headcount": 4, "percentage": 3.3},
]

# Métricas clave del negocio
BUSINESS_METRICS = {
    "revenue": {
        "annual_usd": 8_000_000,
        "revenue_per_employee": 66_667,
        "primary_line": "Headhunting & Selección",
    },
    "operations": {
        "avg_cv_per_process": "30-80",
        "screening_time_reduction_target": "70%",
        "consultants": 40,
    },
    "support": {
        "agents": 30,
        "current_avg_resolution_hours": 48,
        "sla_target_hours": 24,
        "first_line_resolution_target": "40%",
    },
    "sales": {
        "team_size": 18,
        "crm_adoption": "40%",
        "account_managers": 6,
        "sdrs": 12,
    },
}


@router.get("/")
def get_kpis():
    """KPIs generales de Nexova Solutions."""
    return {
        "company": COMPANY_INFO,
        "staff_distribution": STAFF_DISTRIBUTION,
        "business_metrics": BUSINESS_METRICS,
    }


@router.get("/staff")
def get_staff_distribution():
    """Distribución de personal por departamento."""
    return {
        "total": COMPANY_INFO["total_employees"],
        "distribution": STAFF_DISTRIBUTION,
    }


@router.get("/revenue")
def get_revenue():
    """Métricas de facturación."""
    return BUSINESS_METRICS["revenue"]
