import logging

try:
    import json_log_formatter
except Exception:  # fallback si no está instalado
    json_log_formatter = None


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        if json_log_formatter:
            formatter = json_log_formatter.JSONFormatter()
            # Adaptar a interfaz del paquete
            return formatter.format(record)
        # Fallback simple key=value
        base = {
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
        }
        return ' '.join(f"{k}={v}" for k, v in base.items())


def setup_structured_logging():
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    root = logging.getLogger()
    if not any(isinstance(h, logging.StreamHandler) for h in root.handlers):
        root.addHandler(handler)
    root.setLevel(logging.INFO)


