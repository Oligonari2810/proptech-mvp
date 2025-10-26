'use client';

interface MetricsCardsProps {
  data: {
    totalProperties: number;
    activeUsers: number;
    totalRevenue: number;
    conversionRate: number;
  };
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  const metrics = [
    {
      name: 'Propiedades Totales',
      value: data.totalProperties.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: '🏠'
    },
    {
      name: 'Usuarios Activos',
      value: data.activeUsers.toString(),
      change: '+1',
      changeType: 'positive' as const,
      icon: '👥'
    },
    {
      name: 'Ingresos Totales',
      value: `€${data.totalRevenue.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: '💰'
    },
    {
      name: 'Tasa Conversión',
      value: `${data.conversionRate}%`,
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: '📈'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {metric.value}
              </p>
              <p className={`text-sm mt-1 ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change} desde el último mes
              </p>
            </div>
            <div className="text-3xl">{metric.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
