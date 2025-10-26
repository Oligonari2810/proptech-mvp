'use client';

export default function AnalyticsCharts() {
  // Datos de ejemplo para gráficos
  const chartData = {
    visits: [65, 78, 90, 81, 56, 55, 40],
    conversions: [30, 45, 60, 35, 40, 50, 45],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
  };

  return (
    <div className="space-y-6">
      {/* Gráfico simple de barras */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Visitas vs Conversiones</h4>
        <div className="space-y-2">
          {chartData.months.map((month, index) => (
            <div key={month} className="flex items-center space-x-3">
              <span className="text-xs text-gray-500 w-8">{month}</span>
              <div className="flex-1 flex space-x-1">
                <div 
                  className="bg-blue-500 rounded h-4"
                  style={{ width: `${chartData.visits[index]}%` }}
                ></div>
                <div 
                  className="bg-green-500 rounded h-4"
                  style={{ width: `${chartData.conversions[index]}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 w-16 text-right">
                {chartData.visits[index]} / {chartData.conversions[index]}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Visitas</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Conversiones</span>
          </div>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">78%</div>
          <div className="text-sm text-gray-600">Tasa de Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">24h</div>
          <div className="text-sm text-gray-600">Tiempo Respuesta</div>
        </div>
      </div>
    </div>
  );
}
