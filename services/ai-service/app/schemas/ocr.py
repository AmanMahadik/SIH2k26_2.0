from pydantic import BaseModel, Field
from typing import List, Optional

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class ExtractedFieldModel(BaseModel):
    field_key: str
    value: str
    confidence: float
    page: int
    bbox: Optional[BoundingBox] = None

class OCRResponse(BaseModel):
    document_id: str
    total_pages: int
    fields: List[ExtractedFieldModel]
    mean_confidence: float
    processing_time_ms: float
