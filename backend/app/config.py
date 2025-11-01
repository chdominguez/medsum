"""
Configuration settings for the application.
"""

from pydantic_settings import BaseSettings
import torch


class Settings(BaseSettings):
    """
    Application configuration settings.
    """

    MODEL_NAME: str = "facebook/bart-large-cnn"
    MAX_INPUT_CHARS: int = 4000
    DEVICE: str = "cuda" if torch.cuda.is_available() else "cpu"
    CHUNK_OVERLAP: int = 200  # characters overlap between chunks

    class Config:
        """
        Pydantic configuration to load from .env file.
        """

        env_file = ".env"


settings = Settings()
