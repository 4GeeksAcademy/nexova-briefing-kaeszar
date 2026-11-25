"""Privacy-preserving incident analysis endpoints."""

from __future__ import annotations

import csv
import io
import sys
from pathlib import Path
from threading import Lock

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

# Keep source-checkout imports working; normal installs also declare the package.
SHARED_PYTHON = Path(__file__).resolve().parents[3] / "packages" / "shared" / "python"
sys.path.insert(0, str(SHARED_PYTHON))

from nexova_incidents import analyze_stream, summary_as_csv

router = APIRouter()
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
_last_export: str | None = None
_export_lock = Lock()


@router.post("/analyze")
async def analyze_incidents(file: UploadFile = File(...)) -> dict[str, object]:
    """Validate an uploaded CSV and return aggregate metrics only."""
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="El archivo debe tener extensión .csv.")

    content = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="El CSV supera el límite de 10 MB.")
    if not content:
        raise HTTPException(status_code=400, detail="El archivo CSV está vacío.")

    try:
        text = content.decode("utf-8-sig")
        metrics = analyze_stream(io.StringIO(text, newline=""))
    except UnicodeDecodeError as error:
        raise HTTPException(
            status_code=400,
            detail="No se pudo leer el CSV como UTF-8. Guárdalo con codificación UTF-8 e inténtalo de nuevo.",
        ) from error
    except (csv.Error, ValueError) as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    export_content = summary_as_csv(metrics)
    with _export_lock:
        global _last_export
        _last_export = export_content
    return metrics


@router.get("/results/export")
def export_incident_results() -> StreamingResponse:
    """Download the aggregate-only CSV for the most recent analysis."""
    with _export_lock:
        content = _last_export
    if content is None:
        raise HTTPException(status_code=404, detail="No hay resultados para exportar. Analiza un CSV primero.")

    return StreamingResponse(
        iter([content]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="incident-analysis-results.csv"'},
    )
