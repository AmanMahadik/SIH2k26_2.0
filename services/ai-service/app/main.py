"""
NirikshAI AI-Service - FastAPI Microservice
Provides intelligent OCR perception, PDF forensics, and tamper detection.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import ocr, forensics, health
from app.core.config import settings

app = FastAPI(
    title="NirikshAI AI-Service",
    description="High-Throughput Perception OCR & PDF Forensics Engine for AICTE Scrutiny (PS 26261)",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1/health", tags=["Health"])
app.include_router(ocr.router, prefix="/api/v1/ocr", tags=["OCR Perception"])
app.include_router(forensics.router, prefix="/api/v1/forensics", tags=["PDF Forensics"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
