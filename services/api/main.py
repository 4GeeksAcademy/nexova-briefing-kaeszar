"""
Nexova Solutions — API Centralizada
FastAPI backend que expone datos de la empresa para dashboards y agentes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings

app = FastAPI(
    title="Nexova Solutions API",
    description="API centralizada para dashboards, agentes y automatizaciones de Nexova Solutions.",
    version="0.1.0",
)

# CORS — mantener los orígenes locales actuales y permitir configuración por entorno.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar la API versionada desde un único punto.
app.include_router(api_router, prefix="/api/v1")


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
