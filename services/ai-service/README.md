# NirikshAI AI-Service (`services/ai-service`)

FastAPI microservice providing high-throughput OCR field extraction, layout perception, and structural PDF forensics for the NirikshAI platform.

## Features
- **PaddleOCR / Tesseract Dual Engine**: Robust multilingual extraction for English and Devanagari Hindi.
- **Spatial Bounding Boxes**: Normalized `(x, y, w, h)` coordinate output for split-screen dossier verification.
- **Structural PDF Forensics**: Detects incremental updates, metadata anomalies, and font substitutions.
- **Dockerized**: Production-ready container targeting Azure App Service or Kubernetes.

## Quickstart
```bash
pip install -e .
uvicorn app.main:app --port 8000 --reload
```
Interactive API docs available at `http://localhost:8000/docs`.
