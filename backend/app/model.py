"""
Summarization model loading and inference logic.
"""

from typing import List, Self
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, GenerationConfig
from loguru import logger

from app.config import settings


class Summarizer:
    """
    Model wrapper for text summarization.
    """

    def __init__(self, tokenizer, model, device: str, model_name: str):
        self.tokenizer = tokenizer
        self.model = model
        self.device = device
        self.model_name = model_name

    def summarize(self, text: str) -> str:
        """
        Summarize the input text, handling chunking if necessary.
        """

        # If text is small enough, do single pass
        if len(text) <= settings.MAX_INPUT_CHARS:
            return self._infer(text)

        # else: chunk text, summarize chunks,
        # then summarize concatenated summaries
        chunks = self._chunk_text(text, settings.MAX_INPUT_CHARS, settings.CHUNK_OVERLAP)
        summaries = [self._infer(chunk) for chunk in chunks]
        combined = " ".join(summaries)
        # final pass to make coherent short summary
        return self._infer(combined, max_length=120, min_length=30)

    def _infer(self, text: str, max_length=90, min_length=20) -> str:
        """
        Perform inference on a single text input.
        """

        # encode + generate
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=1024)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        gen_config = GenerationConfig(
            max_new_tokens=max_length,
            min_length=min_length,
            do_sample=False,
            early_stopping=True,
        )

        with torch.no_grad():
            outputs = self.model.generate(**inputs, **gen_config.__dict__)
        summary = self.tokenizer.decode(
            outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True
        )
        return summary.strip()

    def _chunk_text(self, text: str, max_chars: int, overlap: int) -> List[str]:
        """
        Chunk text into pieces of max_chars with specified overlap.
        """

        if len(text) <= max_chars:
            return [text]
        chunks = []
        start = 0
        length = len(text)
        while start < length:
            end = start + max_chars
            if end >= length:
                chunks.append(text[start:length])
                break
            # try to break at sentence boundary (period)
            slice_ = text[start:end]
            last_period = slice_.rfind(".")
            if last_period != -1 and last_period > (len(slice_) * 0.4):
                # break at last_period inside slice
                chunks.append(text[start : start + last_period + 1])
                start = start + last_period + 1 - overlap
            else:
                # fallback: fixed chunk
                chunks.append(slice_)
                start = end - overlap
        # clean chunks
        return [c.strip() for c in chunks if c.strip()]

    @classmethod
    def load(cls) -> Self:
        """
        Loads the summarization model and tokenizer.
        """

        logger.info(f"Loading model {settings.MODEL_NAME} on {settings.DEVICE} ...")
        tokenizer = AutoTokenizer.from_pretrained(settings.MODEL_NAME)
        model = AutoModelForSeq2SeqLM.from_pretrained(settings.MODEL_NAME)
        model.to(settings.DEVICE)
        model.eval()
        logger.info("Model loaded successfully")

        return cls(
            tokenizer=tokenizer,
            model=model,
            device=settings.DEVICE,
            model_name=settings.MODEL_NAME,
        )
