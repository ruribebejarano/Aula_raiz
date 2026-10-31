import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ai_provider: str = os.getenv("AI_PROVIDER", "demo").strip().lower()
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3.1")
    school_name: str = os.getenv("SCHOOL_NAME", "I.E. Rural Huarin (demo)")
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]
    database_path: str = os.getenv(
        "DATABASE_PATH", os.path.join(os.path.dirname(__file__), "..", "aula_raiz.db")
    )


settings = Settings()
