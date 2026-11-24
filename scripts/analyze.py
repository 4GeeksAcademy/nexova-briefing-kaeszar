"""Analyze incident CSV files locally without exposing customer data in output."""

from __future__ import annotations

import argparse
import csv
from collections import Counter
from datetime import date
from pathlib import Path

REQUIRED_FIELDS = (
    "ticket_id",
    "date",
    "client_company",
    "category",
    "description",
    "agent_id",
    "status",
    "customer_email",
)
OPTIONAL_FIELDS = ("satisfaction_score",)
EXPECTED_FIELDS = REQUIRED_FIELDS + OPTIONAL_FIELDS
VALID_CATEGORIES = {"ACCESS", "BILLING", "COMPLAINT", "HR_QUERY", "TECHNICAL"}
VALID_STATUSES = {"OPEN", "CLOSED", "DISCARDED"}


def validate_record(record: dict[str | None, str | list[str] | None]) -> list[str]:
    """Return validation issue labels, never including field values or PII."""
    issues: list[str] = []

    for field in REQUIRED_FIELDS:
        value = record.get(field)
        if not isinstance(value, str) or not value.strip():
            issues.append(f"missing_required_field:{field}")

    category = record.get("category")
    if isinstance(category, str) and category.strip() and category.strip() not in VALID_CATEGORIES:
        issues.append("value_out_of_range:category")

    status = record.get("status")
    if isinstance(status, str) and status.strip() and status.strip() not in VALID_STATUSES:
        issues.append("value_out_of_range:status")

    record_date = record.get("date")
    if isinstance(record_date, str) and record_date.strip():
        try:
            date.fromisoformat(record_date.strip())
        except ValueError:
            issues.append("invalid_format:date")

    score = record.get("satisfaction_score")
    if isinstance(score, str) and score.strip():
        try:
            numeric_score = float(score.strip())
            if not 1 <= numeric_score <= 5:
                issues.append("value_out_of_range:satisfaction_score")
        except ValueError:
            issues.append("invalid_format:satisfaction_score")

    if None in record:
        issues.append("invalid_record_structure:extra_columns")

    return issues


def analyze_csv(path: Path) -> dict[str, object]:
    """Stream the CSV and return aggregate metrics without retaining records."""
    total_rows = 0
    valid_rows = 0
    invalid_rows = 0
    invalid_reasons: Counter[str] = Counter()
    categories: Counter[str] = Counter()
    statuses: Counter[str] = Counter()
    closed_scores: list[float] = []

    with path.open("r", encoding="utf-8-sig", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        headers = reader.fieldnames
        missing_headers = [field for field in EXPECTED_FIELDS if field not in (headers or [])]
        if missing_headers:
            raise ValueError(
                "Faltan columnas requeridas en el encabezado: " + ", ".join(missing_headers)
            )

        for record in reader:
            total_rows += 1
            issues = validate_record(record)
            if issues:
                invalid_rows += 1
                invalid_reasons.update(issues)
                continue

            valid_rows += 1
            category = str(record["category"]).strip()
            status = str(record["status"]).strip()
            categories[category] += 1
            statuses[status] += 1

            score = record.get("satisfaction_score")
            if status == "CLOSED" and isinstance(score, str) and score.strip():
                closed_scores.append(float(score.strip()))

    return {
        "total_rows": total_rows,
        "valid_rows": valid_rows,
        "invalid_rows": invalid_rows,
        "invalid_reasons": invalid_reasons,
        "categories": categories,
        "statuses": statuses,
        "closed_scored_count": len(closed_scores),
        "average_closed_satisfaction": (
            sum(closed_scores) / len(closed_scores) if closed_scores else None
        ),
    }


def print_summary(metrics: dict[str, object]) -> None:
    """Print a readable aggregate report without exposing source records."""
    print("\n" + "=" * 56)
    print("           ANALIZADOR DE INCIDENCIAS")
    print("=" * 56)
    print(f"{'Registros procesados:':<38}{metrics['total_rows']:>8}")
    print(f"{'Registros válidos:':<38}{metrics['valid_rows']:>8}")
    print(f"{'Registros inválidos:':<38}{metrics['invalid_rows']:>8}")

    print("\nTOTAL POR CATEGORÍA")
    print("-" * 56)
    for category, count in sorted(metrics["categories"].items()):
        print(f"{category:<38}{count:>8}")

    print("\nTOTAL POR ESTADO")
    print("-" * 56)
    for status, count in sorted(metrics["statuses"].items()):
        print(f"{status:<38}{count:>8}")

    average = metrics["average_closed_satisfaction"]
    average_text = f"{average:.2f}" if average is not None else "N/D"
    print("\nSATISFACCIÓN")
    print("-" * 56)
    print(f"{'Casos CLOSED con puntuación:':<38}{metrics['closed_scored_count']:>8}")
    print(f"{'Media (escala de 1 a 5):':<38}{average_text:>8}")

    print("\nMOTIVOS DE INVALIDACIÓN")
    print("-" * 56)
    reasons = metrics["invalid_reasons"]
    if reasons:
        for reason, count in sorted(reasons.items()):
            print(f"{reason:<38}{count:>8}")
    else:
        print("Ninguno")
    print("=" * 56)


def export_summary(metrics: dict[str, object], destination: Path) -> None:
    """Export one aggregate metric per CSV row; do not export customer data."""
    rows: list[tuple[str, object]] = [
        ("total_rows", metrics["total_rows"]),
        ("valid_rows", metrics["valid_rows"]),
        ("invalid_rows", metrics["invalid_rows"]),
    ]
    rows.extend(
        (f"category:{name}", count)
        for name, count in sorted(metrics["categories"].items())
    )
    rows.extend(
        (f"status:{name}", count)
        for name, count in sorted(metrics["statuses"].items())
    )
    rows.extend(
        (f"invalid_reason:{name}", count)
        for name, count in sorted(metrics["invalid_reasons"].items())
    )
    rows.extend(
        [
            ("closed_with_satisfaction_score", metrics["closed_scored_count"]),
            ("average_closed_satisfaction", metrics["average_closed_satisfaction"] or ""),
        ]
    )

    with destination.open("w", encoding="utf-8", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(("metric", "value"))
        writer.writerows(rows)


def ask_export() -> bool:
    while True:
        answer = input("\n¿Deseas exportar los resultados a CSV? [s/n] ").strip().casefold()
        if answer in {"s", "n"}:
            return answer == "s"
        print("Respuesta no válida. Escribe 's' o 'n'.")


def main() -> int:
    parser = argparse.ArgumentParser(description="Analiza incidencias desde un fichero CSV local.")
    parser.add_argument("csv_path", type=Path, help="Ruta al fichero CSV de incidencias")
    args = parser.parse_args()

    try:
        metrics = analyze_csv(args.csv_path)
    except (OSError, UnicodeError, csv.Error, ValueError) as error:
        print(f"Error al analizar el CSV: {error}")
        return 1

    print_summary(metrics)
    if ask_export():
        destination = Path("result.csv")
        try:
            export_summary(metrics, destination)
        except OSError as error:
            print(f"No se pudo guardar el CSV de resultados: {error}")
            return 1
        print(f"Resultados exportados a: {destination.resolve()}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
