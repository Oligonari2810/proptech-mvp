'use client';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

export default function UsersManagement() {
  // Datos de ejemplo - integrar con API real después
  const users: User[] = [
    {
      id: 1,
      name: 'Ana María Pérez',
      email: 'ana@example.com',
      role: 'Admin',
      status: 'Activo',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      role: 'Usuario',
      status: 'Activo',
      joinDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'María López',
      email: 'maria@example.com',
      role: 'Broker',
      status: 'Inactivo',
      joinDate: '2024-01-10'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Usuarios Registrados</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          + Nuevo Usuario
        </button>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 text-xs rounded-full ${
                user.status === 'Activo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.status}
              </span>
              <span className="text-sm text-gray-500">{user.role}</span>
              <button className="text-blue-600 hover:text-blue-900 text-sm">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
