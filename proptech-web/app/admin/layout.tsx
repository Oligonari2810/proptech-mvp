import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - HabitatPro',
  description: 'Panel de administración enterprise',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">HabitatPro Admin</h1>
          </div>
          <nav className="p-4 space-y-2">
            {[
              { name: 'Dashboard', href: '/admin', icon: '📊' },
              { name: 'Usuarios', href: '/admin/users', icon: '👥' },
              { name: 'Propiedades', href: '/admin/properties', icon: '🏠' },
              { name: 'Assets Visuales', href: '/admin/assets', icon: '🎨' },
              { name: 'Métricas', href: '/admin/metrics', icon: '📈' },
              { name: 'Configuración', href: '/admin/settings', icon: '⚙️' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
