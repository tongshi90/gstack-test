from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///data/school.db"
    port: int = 8084

    model_config = {
        "env_file": ".env"
    }

settings = Settings()
