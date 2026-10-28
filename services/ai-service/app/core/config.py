from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NirikshAI AI-Service"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    OCR_ENGINE: str = "paddleocr"
    TESSERACT_CMD: str = "/usr/bin/tesseract"
    MAX_FILE_SIZE_MB: int = 50

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
