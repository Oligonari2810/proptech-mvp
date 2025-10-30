'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface NextAuthRoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function NextAuthRoleGuard({ 
  allowedRoles, 
  children, 
  fallback 
}: NextAuthRoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    // Redirigir a login si no está autenticado
    if (typeof window !== 'undefined') {
      const returnUrl = window.location.pathname;
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`);
    }
    return null;
  }

  const userRole = (session.user as any)?.role;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual: <strong>{userRole || 'No asignado'}</strong>
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

