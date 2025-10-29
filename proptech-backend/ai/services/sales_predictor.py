from __future__ import annotations

from typing import Dict, Any
import numpy as np

try:
    from sklearn.ensemble import RandomForestRegressor
except Exception:
    RandomForestRegressor = None  # Evitar fallo si sklearn no está instalado


class SalesPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42) if RandomForestRegressor else None

    def is_available(self) -> bool:
        return self.model is not None

    def train(self, X, y) -> None:
        if not self.model:
            return
        self.model.fit(X, y)

    def predict_with_confidence(self, features: Dict[str, Any]) -> Dict[str, Any]:
        if not self.model:
            # Fallback determinista simple
            base_pred = float(features.get('days_on_market', 45) or 45)
            return {
                'predicted_days': int(base_pred),
                'confidence_interval': [int(base_pred * 0.85), int(base_pred * 1.15)],
                'confidence_level': 80
            }

        # Convertir dict a vector respetando orden esperado
        ordered = ['price', 'location_score', 'days_on_market', 'seasonality']
        x = [[float(features.get(k, 0) or 0) for k in ordered]]

        pred = float(self.model.predict(x)[0])
        # Desviación estándar entre árboles como proxy de incertidumbre
        tree_preds = np.array([float(tree.predict(x)[0]) for tree in self.model.estimators_])
        std = float(np.std(tree_preds))
        low, high = max(0.0, pred - std), pred + std
        conf = max(70.0, min(95.0, 100.0 - (std / (pred + 1e-6)) * 100.0))

        return {
            'predicted_days': int(round(pred)),
            'confidence_interval': [int(round(low)), int(round(high))],
            'confidence_level': int(round(conf))
        }


