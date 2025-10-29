from prometheus_client import Gauge, Counter

PROPERTIES_COUNT = Gauge('habitatpro_properties_total', 'Total de propiedades en el sistema')
ROI_CALCULATIONS = Counter('habitatpro_roi_calculations_total', 'Total de cálculos ROI realizados')


def update_properties_count(Property):
    try:
        PROPERTIES_COUNT.set(Property.query.count())
    except Exception:
        # No bloquear en caso de error de DB
        pass


