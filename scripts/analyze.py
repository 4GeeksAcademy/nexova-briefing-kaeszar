"""Analyze incident CSV files locally without exposing customer data in output.

The script validates each row, aggregates metrics for valid incidents, and can
export an aggregate-only report. Source rows and personal data are never printed
or copied to the results file.
"""

from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

# Allow direct execution from a source checkout without package installation.
SHARED_PYTHON = Path(__file__).resolve().parents[1] / "packages" / "shared" / "python"
sys.path.insert(0, str(SHARED_PYTHON))

from nexova_incidents import analyze_csv, export_summary, print_summary


def ask_export() -> bool:
    """Prompt until the user enters an accepted yes/no response."""
    while True:
        answer = input("\n¿Deseas exportar los resultados a CSV? [s/n] ").strip().casefold()
        if answer in {"s", "n"}:
            return answer == "s"
        print("Respuesta no válida. Escribe 's' o 'n'.")


def main() -> int:
    """Parse command-line arguments, run the analysis, and handle export."""
    parser = argparse.ArgumentParser(description="Analiza incidencias desde un fichero CSV local.")
    parser.add_argument("csv_path", type=Path, help="Ruta al fichero CSV de incidencias")
    args = parser.parse_args()

    try:
        metrics = analyze_csv(args.csv_path)
    except (OSError, UnicodeError, csv.Error, ValueError) as error:
        print(f"Error al analizar el CSV: {error}")
        return 1

    print_summary(metrics)
    invalid_records = metrics["invalid_records"]
    if invalid_records:
        print("\nREGISTROS INVÁLIDOS (fila CSV y tipo de problema)")
        for invalid_record in invalid_records:
            reasons = ", ".join(invalid_record["reasons"])
            print(f"Fila {invalid_record['row_number']}: {reasons}")

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
