"""
FASTAPI server definiton and routes.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.schemas import SummarizeRequest, SummarizeResponse, HealthResponse
from app.model import Summarizer

app = FastAPI(title="Medical Report Summarizer", version="0.1")

# allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load model at startup
summarizer = Summarizer.load()


@app.get("/health", response_model=HealthResponse)
def health():
    """
    Health check endpoint.
    """
    return HealthResponse(status="ok", model_name=summarizer.model_name, device=summarizer.device)


@app.post("/summarize", response_model=SummarizeResponse)
def summarize(payload: SummarizeRequest):
    """
    Summarization endpoint.
    """
    text = payload.text.strip()

    print("Received text for summarization:", text[:50], "..." if len(text) > 50 else "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty")

    try:
        summary = summarizer.summarize(text)
        return SummarizeResponse(summary=summary)
    except Exception as e:
        logger.exception("Inference failed")
        raise HTTPException(status_code=500, detail=str(e)) from e
