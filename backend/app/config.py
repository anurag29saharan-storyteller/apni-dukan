from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://blinkit:blinkit@localhost:5432/blinkit"
    jwt_secret: str = "dev-secret-change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:5173"

    @property
    def database_url_async(self) -> str:
        url = self.database_url

        # Ensure asyncpg driver
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

        parsed = urlparse(url)
        if not parsed.query:
            return url

        params = parse_qs(parsed.query)

        # asyncpg uses `ssl` not `sslmode`
        if "sslmode" in params:
            params["ssl"] = params.pop("sslmode")

        # asyncpg doesn't support channel_binding
        params.pop("channel_binding", None)

        new_query = urlencode(params, doseq=True)
        return urlunparse(parsed._replace(query=new_query))

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()