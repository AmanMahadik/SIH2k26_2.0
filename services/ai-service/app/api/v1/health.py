from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "NirikshAI AI-Service",
        "version": "2.0.0",
        "gpu_accelerated": False
    }
