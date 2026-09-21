"""
Nexova Solutions — API Centralizada
FastAPI backend que expone datos de la empresa para dashboards y agentes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import departments, kpis

app = FastAPI(
    title="Nexova Solutions API",
    description="API centralizada para dashboards, agentes y automatizaciones de Nexova Solutions.",
    version="0.1.0",
)

# CORS — permitir requests desde backoffice y website en desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(departments.router, prefix="/api/v1/departments", tags=["Departments"])
app.include_router(kpis.router, prefix="/api/v1/kpis", tags=["KPIs"])


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Nexova Solutions API",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
