# Shared Python incident-analysis module

This directory contains the Python implementation shared by the incident-analysis CLI and FastAPI endpoint. The existing `packages/shared` TypeScript package remains unchanged.

The package validates and aggregates uploaded or local CSV data in a streaming manner. It retains aggregate metrics only and never returns source rows, incident descriptions, company names, or customer email addresses.

The API and CLI add this directory to Python's import path at runtime. Keep schema and aggregation changes centralized in `nexova_incidents` so both entry points remain consistent.
