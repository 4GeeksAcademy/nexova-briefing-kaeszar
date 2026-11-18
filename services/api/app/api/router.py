"""Versioned API router composition."""

from fastapi import APIRouter

from routers import departments, kpis

api_router = APIRouter()
api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(kpis.router, prefix="/kpis", tags=["KPIs"])