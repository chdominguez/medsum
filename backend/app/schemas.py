"""
Schema definitions for request and response models.
"""

from pydantic import BaseModel


class SummarizeRequest(BaseModel):
    """
    Request model for text summarization.
    """

    text: str


class SummarizeResponse(BaseModel):
    """
    Response model for text summarization.
    """

    summary: str


class HealthResponse(BaseModel):
    """
    Response model for health check.
    """

    status: str
    model_name: str
    device: str
