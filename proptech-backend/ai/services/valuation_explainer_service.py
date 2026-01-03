"""
Valuation Explainer Service - Explicabilidad avanzada con NLP
Genera insights detallados y explicaciones naturales de las valoraciones
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class ValuationExplainerService:
    """Servicio para generar explicaciones avanzadas de valoraciones emocionales"""
    
    def generate_emotional_insights(
        self,
        valuation_result: Dict[str, Any],
        property_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Genera insights emocionales detallados basados en valoración
        
        Args:
            valuation_result: Resultado de la valoración emocional
            property_data: Datos de la propiedad
        
        Returns:
            Diccionario con insights y explicaciones detalladas
        """
        insights = {
            'summary': self._generate_summary(valuation_result, property_data),
            'emotional_breakdown': self._generate_emotional_breakdown(valuation_result),
            'lifestyle_analysis': self._generate_lifestyle_analysis(valuation_result, property_data),
            'recommendations': self._generate_recommendations(valuation_result, property_data),
            'comparison': self._generate_comparison_insights(valuation_result, property_data),
            'natural_language_explanation': self._generate_natural_language_explanation(valuation_result, property_data)
        }
        
        return insights
    
    def _generate_summary(
        self,
        valuation_result: Dict[str, Any],
        property_data: Dict[str, Any]
    ) -> str:
        """Genera resumen ejecutivo de la valoración emocional"""
        emotional_score = valuation_result.get('emotional_score', 0)
        price_avg = valuation_result.get('priceRange', {}).get('avg', 0)
        
        if emotional_score >= 80:
            summary = f"Esta propiedad tiene un score emocional excepcional de {emotional_score}/100, "
            summary += f"indicando que no solo es una excelente inversión a ${price_avg:,.0f}, sino que también "
            summary += "ofrece una calidad de vida superior. Los factores emocionales elevan significativamente "
            summary += "el valor más allá del precio tradicional."
        elif emotional_score >= 70:
            summary = f"Con un score emocional de {emotional_score}/100, esta propiedad ofrece un excelente "
            summary += f"equilibrio entre valor de inversión (${price_avg:,.0f}) y calidad de vida. "
            summary += "Los factores emocionales positivos añaden valor significativo a la propiedad."
        elif emotional_score >= 50:
            summary = f"Score emocional de {emotional_score}/100 indica una propiedad sólida con "
            summary += f"valor de mercado de ${price_avg:,.0f}. Aunque tiene aspectos emocionales positivos, "
            summary += "existen áreas de oportunidad para mejorar la calidad de vida."
        else:
            summary = f"Score emocional de {emotional_score}/100 sugiere que esta propiedad, valorada en "
            summary += f"${price_avg:,.0f}, tiene desafíos en factores de calidad de vida. "
            summary += "Se recomienda evaluar mejoras para aumentar el valor emocional."
        
        return summary
    
    def _generate_emotional_breakdown(self, valuation_result: Dict[str, Any]) -> List[Dict[str, str]]:
        """Genera breakdown detallado de factores emocionales"""
        breakdown = valuation_result.get('emotional_breakdown', {})
        factors = []
        
        # Lifestyle Score
        lifestyle_score = breakdown.get('lifestyle_score', 0)
        if lifestyle_score >= 80:
            factors.append({
                'category': 'Calidad de Vida',
                'score': lifestyle_score,
                'description': 'Excepcional calidad de vida con acceso a naturaleza, aire limpio y comunidad activa.'
            })
        elif lifestyle_score >= 60:
            factors.append({
                'category': 'Calidad de Vida',
                'score': lifestyle_score,
                'description': 'Buena calidad de vida con balance entre comodidad y accesibilidad.'
            })
        else:
            factors.append({
                'category': 'Calidad de Vida',
                'score': lifestyle_score,
                'description': 'Calidad de vida aceptable con oportunidades de mejora en el entorno.'
            })
        
        # Wellness Score
        wellness_score = breakdown.get('wellness_score', 0)
        if wellness_score >= 70:
            factors.append({
                'category': 'Bienestar',
                'score': wellness_score,
                'description': 'Excelentes espacios para bienestar: gimnasio, áreas de relajación y espacios sociales.'
            })
        elif wellness_score >= 50:
            factors.append({
                'category': 'Bienestar',
                'score': wellness_score,
                'description': 'Espacios de bienestar adecuados con potencial para mejoras.'
            })
        else:
            factors.append({
                'category': 'Bienestar',
                'score': wellness_score,
                'description': 'Espacios de bienestar limitados - consideraciones para mejoras futuras.'
            })
        
        # Community Score
        community_score = breakdown.get('community_score', 0)
        if community_score >= 70:
            factors.append({
                'category': 'Comunidad',
                'score': community_score,
                'description': 'Comunidad vibrante con excelente acceso a servicios, parques y transporte.'
            })
        elif community_score >= 50:
            factors.append({
                'category': 'Comunidad',
                'score': community_score,
                'description': 'Comunidad estable con acceso moderado a servicios y amenities.'
            })
        else:
            factors.append({
                'category': 'Comunidad',
                'score': community_score,
                'description': 'Comunidad en desarrollo - acceso a servicios puede mejorar con el tiempo.'
            })
        
        return factors
    
    def _generate_lifestyle_analysis(
        self,
        valuation_result: Dict[str, Any],
        property_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Genera análisis detallado de estilo de vida"""
        breakdown = valuation_result.get('emotional_breakdown', {})
        insights = breakdown.get('insights', [])
        
        analysis = {
            'strengths': [],
            'opportunities': [],
            'lifestyle_fit': {}
        }
        
        # Analizar insights para identificar fortalezas y oportunidades
        for insight in insights:
            if any(word in insight.lower() for word in ['excelente', 'perfecto', 'ideal', 'vibrante', 'seguro']):
                analysis['strengths'].append(insight)
            elif any(word in insight.lower() for word in ['mejora', 'oportunidad', 'potencial']):
                analysis['opportunities'].append(insight)
        
        # Determinar fit de estilo de vida
        emotional_score = valuation_result.get('emotional_score', 0)
        property_type = property_data.get('property_type', 'apartment')
        
        if emotional_score >= 80:
            analysis['lifestyle_fit'] = {
                'families': 'excellent',
                'professionals': 'excellent',
                'retirees': 'excellent',
                'students': 'good'
            }
        elif emotional_score >= 60:
            analysis['lifestyle_fit'] = {
                'families': 'good',
                'professionals': 'excellent',
                'retirees': 'good',
                'students': 'good'
            }
        else:
            analysis['lifestyle_fit'] = {
                'families': 'fair',
                'professionals': 'good',
                'retirees': 'fair',
                'students': 'fair'
            }
        
        return analysis
    
    def _generate_recommendations(
        self,
        valuation_result: Dict[str, Any],
        property_data: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Genera recomendaciones personalizadas basadas en valoración"""
        recommendations = []
        breakdown = valuation_result.get('emotional_breakdown', {})
        lifestyle_score = breakdown.get('lifestyle_score', 0)
        wellness_score = breakdown.get('wellness_score', 0)
        community_score = breakdown.get('community_score', 0)
        
        # Recomendaciones basadas en scores
        if lifestyle_score < 60:
            recommendations.append({
                'priority': 'high',
                'category': 'Calidad de Vida',
                'recommendation': 'Considera buscar propiedades más cerca de espacios verdes o en zonas con mejor calidad de aire.',
                'impact': 'Aumentaría significativamente el score emocional y la calidad de vida.'
            })
        
        if wellness_score < 60:
            recommendations.append({
                'priority': 'medium',
                'category': 'Bienestar',
                'recommendation': 'Evalúa agregar espacios wellness como gimnasio o área de yoga.',
                'impact': 'Mejoraría el bienestar y atraería compradores interesados en salud.'
            })
        
        if community_score < 60:
            recommendations.append({
                'priority': 'medium',
                'category': 'Comunidad',
                'recommendation': 'Busca propiedades con mejor acceso a transporte público y servicios.',
                'impact': 'Aumentaría la conveniencia y el valor comunitario.'
            })
        
        # Recomendaciones de existing insights
        existing_recommendations = breakdown.get('recommendations', [])
        for rec in existing_recommendations:
            recommendations.append({
                'priority': 'low',
                'category': 'Estilo de Vida',
                'recommendation': rec,
                'impact': 'Mejoraría la experiencia de vida diaria.'
            })
        
        return recommendations
    
    def _generate_comparison_insights(
        self,
        valuation_result: Dict[str, Any],
        property_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Genera insights comparativos con el mercado"""
        emotional_score = valuation_result.get('emotional_score', 0)
        price_avg = valuation_result.get('priceRange', {}).get('avg', 0)
        
        # Comparación con promedio del mercado
        market_avg_emotional = 60  # Estimado
        price_per_sqm = price_avg / (property_data.get('area', 100) or 100)
        
        comparison = {
            'emotional_vs_market': {
                'score': emotional_score,
                'market_average': market_avg_emotional,
                'difference': emotional_score - market_avg_emotional,
                'interpretation': ''
            },
            'value_proposition': '',
            'market_positioning': ''
        }
        
        diff = emotional_score - market_avg_emotional
        if diff >= 20:
            comparison['emotional_vs_market']['interpretation'] = 'Significativamente por encima del mercado en factores emocionales'
            comparison['value_proposition'] = 'Esta propiedad ofrece valor emocional excepcional comparado con el mercado.'
            comparison['market_positioning'] = 'Premium - Ideal para compradores que valoran calidad de vida'
        elif diff >= 10:
            comparison['emotional_vs_market']['interpretation'] = 'Por encima del promedio del mercado'
            comparison['value_proposition'] = 'Buena relación calidad-precio con factores emocionales superiores.'
            comparison['market_positioning'] = 'Alta gama - Excelente opción para inversión con calidad de vida'
        elif diff >= -10:
            comparison['emotional_vs_market']['interpretation'] = 'Alineado con el mercado'
            comparison['value_proposition'] = 'Propiedad sólida con factores emocionales estándar del mercado.'
            comparison['market_positioning'] = 'Estándar - Opción viable para compradores'
        else:
            comparison['emotional_vs_market']['interpretation'] = 'Por debajo del promedio del mercado'
            comparison['value_proposition'] = 'Oportunidad de inversión con potencial de mejora en factores emocionales.'
            comparison['market_positioning'] = 'Economía - Buena opción con consideraciones'
        
        return comparison
    
    def _generate_natural_language_explanation(
        self,
        valuation_result: Dict[str, Any],
        property_data: Dict[str, Any]
    ) -> str:
        """Genera explicación en lenguaje natural de la valoración"""
        emotional_score = valuation_result.get('emotional_score', 0)
        price_avg = valuation_result.get('priceRange', {}).get('avg', 0)
        breakdown = valuation_result.get('emotional_breakdown', {})
        
        location = property_data.get('location', 'esta ubicación')
        property_type = property_data.get('property_type', 'propiedad')
        
        explanation = f"Esta {property_type} en {location} tiene un valor estimado de ${price_avg:,.0f}. "
        explanation += f"Sin embargo, nuestro análisis de IA Emocional revela que más allá del precio, "
        explanation += f"la propiedad tiene un score emocional de {emotional_score}/100, lo que significa que "
        
        if emotional_score >= 80:
            explanation += "ofrece una experiencia de vida excepcional. Los factores emocionales indican que "
            explanation += "vivir aquí te hará sentir genuinamente feliz debido a la excelente calidad de vida, "
            explanation += "espacios para bienestar y una comunidad vibrante."
        elif emotional_score >= 60:
            explanation += "ofrece una buena experiencia de vida. Los factores emocionales muestran un balance "
            explanation += "positivo entre comodidad, accesibilidad y bienestar que hace que esta propiedad "
            explanation += "sea una excelente opción para tu estilo de vida."
        else:
            explanation += "tiene aspectos emocionales que podrían mejorarse. Aunque el precio es competitivo, "
            explanation += "considera factores de calidad de vida que podrían afectar tu satisfacción a largo plazo."
        
        # Agregar breakdown específico
        insights = breakdown.get('insights', [])
        if insights:
            explanation += " Específicamente, "
            explanation += ". ".join(insights[:3])  # Primeros 3 insights
            explanation += "."
        
        return explanation

