'use client';

import { useSession, signIn } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-700 mb-4">Inicia sesión para ver tu perfil</p>
          <button onClick={() => signIn()} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Iniciar sesión</button>
        </div>
      </div>
    );
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Cuenta</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="font-medium text-gray-900">{user?.name || 'Usuario'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user?.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rol</p>
              <p className="font-medium text-gray-900">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


