"""Validation and aggregate-only analysis for the incident CSV sample."""

from __future__ import annotations

import csv
from collections import Counter
from datetime import date
from pathlib import Path
from typing import TextIO

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
    """Return safe validation labels without including source values or PII."""
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


def analyze_stream(csv_file: TextIO) -> dict[str, object]:
    """Analyze a text stream, retaining aggregates and safe invalid-row labels."""
    total_rows = 0
    valid_rows = 0
    invalid_rows = 0
    invalid_records: list[dict[str, object]] = []
    invalid_reasons: Counter[str] = Counter()
    categories: Counter[str] = Counter()
    statuses: Counter[str] = Counter()
    satisfaction_total = 0.0
    closed_scored_count = 0

    reader = csv.DictReader(csv_file)
    headers = reader.fieldnames
    if not headers:
        raise ValueError("El fichero CSV está vacío o no contiene encabezados.")

    missing_headers = [field for field in EXPECTED_FIELDS if field not in headers]
    if missing_headers:
        raise ValueError("Faltan columnas en el encabezado: " + ", ".join(missing_headers))

    for record in reader:
        total_rows += 1
        issues = validate_record(record)
        if issues:
            invalid_rows += 1
            invalid_reasons.update(issues)
            # Include the header in the displayed CSV row number. total_rows
            # counts logical records, so embedded newlines do not skew it.
            invalid_records.append({"row_number": total_rows + 1, "reasons": issues})
            continue

        valid_rows += 1
        category = str(record["category"]).strip()
        status = str(record["status"]).strip()
        categories[category] += 1
        statuses[status] += 1

        score = record.get("satisfaction_score")
        if status == "CLOSED" and isinstance(score, str) and score.strip():
            satisfaction_total += float(score.strip())
            closed_scored_count += 1

    return {
        "total_rows": total_rows,
        "valid_rows": valid_rows,
        "invalid_rows": invalid_rows,
        "invalid_records": invalid_records,
        "invalid_reasons": dict(sorted(invalid_reasons.items())),
        "categories": dict(sorted(categories.items())),
        "statuses": dict(sorted(statuses.items())),
        "closed_scored_count": closed_scored_count,
        "average_closed_satisfaction": (
            satisfaction_total / closed_scored_count if closed_scored_count else None
        ),
    }


def analyze_csv(path: Path) -> dict[str, object]:
    """Analyze a local UTF-8 CSV file without retaining individual records."""
    with path.open("r", encoding="utf-8-sig", newline="") as csv_file:
        return analyze_stream(csv_file)


def summary_as_csv(metrics: dict[str, object]) -> str:
    """Serialize aggregate metrics as CSV without source record data."""
    from io import StringIO

    output = StringIO(newline="")
    writer = csv.writer(output)
    writer.writerow(("metric", "value"))
    writer.writerow(("total_rows", metrics["total_rows"]))
    writer.writerow(("valid_rows", metrics["valid_rows"]))
    writer.writerow(("invalid_rows", metrics["invalid_rows"]))

    for name, count in metrics["categories"].items():
        writer.writerow((f"category:{name}", count))
    for name, count in metrics["statuses"].items():
        writer.writerow((f"status:{name}", count))
    for name, count in metrics["invalid_reasons"].items():
        writer.writerow((f"invalid_reason:{name}", count))

    writer.writerow(("closed_with_satisfaction_score", metrics["closed_scored_count"]))
    average = metrics["average_closed_satisfaction"]
    writer.writerow(("average_closed_satisfaction", "" if average is None else f"{average:.2f}"))
    return output.getvalue()


def export_summary(metrics: dict[str, object], destination: Path) -> None:
    """Write the aggregate summary to a UTF-8 CSV file."""
    destination.write_text(summary_as_csv(metrics), encoding="utf-8", newline="")


def print_summary(metrics: dict[str, object]) -> None:
    """Print an aligned, privacy-preserving report of computed metrics."""
    print("\n" + "=" * 56)
    print("           ANALIZADOR DE INCIDENCIAS")
    print("=" * 56)
    print(f"{'Registros procesados:':<38}{metrics['total_rows']:>8}")
    print(f"{'Registros válidos:':<38}{metrics['valid_rows']:>8}")
    print(f"{'Registros inválidos:':<38}{metrics['invalid_rows']:>8}")

    print("\nTOTAL POR CATEGORÍA")
    print("-" * 56)
    for category, count in metrics["categories"].items():
        print(f"{category:<38}{count:>8}")

    print("\nTOTAL POR ESTADO")
    print("-" * 56)
    for status, count in metrics["statuses"].items():
        print(f"{status:<38}{count:>8}")

    average = metrics["average_closed_satisfaction"]
    average_text = f"{average:.2f}" if average is not None else "N/D"
    print("\nSATISFACCIÓN")
    print("-" * 56)
    print(f"{'Casos CLOSED con puntuación:':<38}{metrics['closed_scored_count']:>8}")
    print(f"{'Media (escala de 1 a 5):':<38}{average_text:>8}")

    print("\nMOTIVOS DE INVALIDACIÓN")
    print("-" * 56)
    if metrics["invalid_reasons"]:
        for reason, count in metrics["invalid_reasons"].items():
            print(f"{reason:<38}{count:>8}")
    else:
        print("Ninguno")
    print("=" * 56)
