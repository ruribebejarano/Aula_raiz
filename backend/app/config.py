import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    ai_provider: str = os.getenv("AI_PROVIDER", "demo").strip().lower()
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3.1")

    # Claude (Anthropic): opcional, pensado para usarse solo durante una
    # presentacion/demo en vivo, no como dependencia del MVP offline. Sin
    # ANTHROPIC_API_KEY, AI_PROVIDER=claude cae automaticamente a demo.
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    claude_model: str = os.getenv("CLAUDE_MODEL", "claude-opus-5")

    school_name: str = os.getenv("SCHOOL_NAME", "I.E. Rural Huarin (demo)")

    # Origenes siempre permitidos: desarrollo local y el demo publico desplegado
    # en Vercel. CORS_ORIGINS (variable de entorno) se agrega a esta lista, no
    # la reemplaza, para que un valor mal escrito en el dashboard no rompa el
    # demo publico.
    _default_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://aula-raiz.vercel.app",
    ]
    cors_origins: list[str] = list(
        dict.fromkeys(
            _default_origins
            + [
                origin.strip().rstrip("/")
                for origin in os.getenv("CORS_ORIGINS", "").split(",")
                if origin.strip()
            ]
        )
    )
    database_path: str = os.getenv(
        "DATABASE_PATH", os.path.join(os.path.dirname(__file__), "..", "aula_raiz.db")
    )


settings = Settings()
