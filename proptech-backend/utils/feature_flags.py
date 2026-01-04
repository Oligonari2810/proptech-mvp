import os


def _env_true(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


class FeatureFlags:
    """
    Feature flags para habilitar módulos gradualmente (sin rewrite).
    """

    GEO = _env_true("FEATURE_GEO", default=False)
    RAG_LEGAL = _env_true("FEATURE_RAG_LEGAL", default=False)
    AVM = _env_true("FEATURE_AVM", default=True)
    MULTI_TENANT = _env_true("FEATURE_MULTI_TENANT", default=False)

