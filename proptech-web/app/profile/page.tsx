'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  last_login?: string;
  subscription_type?: string;
  subscription_status?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (session) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('habitatpro_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/backend/api/auth/me`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user || data;
        setUserData(user);
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          avatar_url: user.avatar_url || '',
        });
      } else {
        const user = session?.user as any;
        setUserData({
          id: 0,
          name: user?.name || 'Usuario',
          email: user?.email || '',
          role: user?.role || 'user',
          is_verified: user?.emailVerified || false,
        });
        setFormData({
          name: user?.name || '',
          phone: '',
          avatar_url: '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const user = session?.user as any;
      setUserData({
        id: 0,
        name: user?.name || 'Usuario',
        email: user?.email || '',
        role: user?.role || 'user',
        is_verified: false,
      });
      setFormData({
        name: user?.name || '',
        phone: '',
        avatar_url: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      const token = localStorage.getItem('habitatpro_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/backend/api/auth/me`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user || userData);
        setEditing(false);
        setSaveMessage('Perfil actualizado exitosamente');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inicia sesión</h2>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para ver tu perfil</p>
          <button 
            onClick={() => signIn()} 
            className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const user = userData || (session.user as any);
  const displayName = user?.name || user?.email?.split('@')[0] || 'Usuario';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    super_admin: 'Super Administrador',
    broker: 'Broker',
    user: 'Usuario',
    developer: 'Desarrollador',
  };

  const isBroker = user?.role === 'broker';
  const isDeveloper = user?.role === 'developer';
  const isClient = user?.role === 'user';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
            <p className="text-gray-600">Gestiona tu información y preferencias</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              ✏️ Editar Perfil
            </button>
          )}
        </div>

        {/* Mensaje de éxito/error */}
        {saveMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            saveMessage.includes('exitosamente') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Perfil Principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Avatar y Nombre */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
            )}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del avatar (opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : '💾 Guardar'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          avatar_url: user?.avatar_url || '',
                        });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  {user?.is_verified && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-md">
                      ✓ Verificado
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Información Personal - Formulario Editable */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (809) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <span className="inline-flex px-3 py-1 text-sm font-medium text-brand-700 bg-brand-50 rounded-md">
                    {roleLabels[user?.role] || user?.role || 'Usuario'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">El rol no se puede cambiar</p>
                </div>
                {user?.last_login && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Último acceso
                    </label>
                    <p className="text-gray-900">
                      {new Date(user.last_login).toLocaleString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Nombre completo</p>
                  <p className="text-gray-900">{user?.name || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900">{user?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Teléfono</p>
                  <p className="text-gray-900">{user?.phone || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rol</p>
                  <span className="inline-flex px-3 py-1 text-sm font-medium text-brand-700 bg-brand-50 rounded-md">
                    {roleLabels[user?.role] || user?.role || 'Usuario'}
                  </span>
                </div>
                {user?.last_login && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Último acceso</p>
                    <p className="text-gray-900">
                      {new Date(user.last_login).toLocaleString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Información Específica por Rol */}
          {!editing && (
            <>
              {/* Información para Broker */}
              {isBroker && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Información de Broker</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Plan de Suscripción</p>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-md ${
                        user?.subscription_type === 'broker_pro' 
                          ? 'text-purple-700 bg-purple-50' 
                          : user?.subscription_type === 'broker_basic'
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-gray-700 bg-gray-50'
                      }`}>
                        {user?.subscription_type === 'broker_pro' ? 'Broker Pro' :
                         user?.subscription_type === 'broker_basic' ? 'Broker Básico' :
                         'Free'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Estado de Suscripción</p>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-md ${
                        user?.subscription_status === 'active' 
                          ? 'text-green-700 bg-green-50' 
                          : 'text-red-700 bg-red-50'
                      }`}>
                        {user?.subscription_status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/admin/properties"
                      className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                    >
                      Gestionar mis propiedades →
                    </Link>
                  </div>
                </div>
              )}

              {/* Información para Cliente Particular */}
              {isClient && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Área de Cliente</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Gestiona tus preferencias y propiedades favoritas
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/dashboard/favorites"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">❤️ Mis Favoritos</div>
                      <div className="text-sm text-gray-600">Ver propiedades guardadas</div>
                    </Link>
                    <Link
                      href="/comprar"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">🔍 Buscar Propiedades</div>
                      <div className="text-sm text-gray-600">Explorar opciones de compra</div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Información para Desarrollador */}
              {isDeveloper && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 Área de Desarrollador</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Acceso a APIs y herramientas de desarrollo
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/admin/api-marketplace"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">🔌 API Marketplace</div>
                      <div className="text-sm text-gray-600">Explorar APIs disponibles</div>
                    </Link>
                    <Link
                      href="/admin"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">⚙️ Panel de Desarrollo</div>
                      <div className="text-sm text-gray-600">Herramientas y configuración</div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Información para Admin */}
              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Área de Administrador</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Gestión completa de la plataforma
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/admin"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">📊 Dashboard Admin</div>
                      <div className="text-sm text-gray-600">Métricas y estadísticas</div>
                    </Link>
                    <Link
                      href="/admin/users"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">👥 Gestión de Usuarios</div>
                      <div className="text-sm text-gray-600">Administrar usuarios</div>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Secciones de Acceso Rápido */}
        {!editing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/dashboard/favorites"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-2xl">
                  ❤️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mis Favoritos</h3>
                  <p className="text-sm text-gray-600">Ver propiedades guardadas</p>
                </div>
              </div>
            </Link>

            <Link
              href="/properties?myProperties=true"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">
                  🏠
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mis Propiedades</h3>
                  <p className="text-sm text-gray-600">Gestionar mis propiedades</p>
                </div>
              </div>
            </Link>

            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link
                href="/admin"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-2xl">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Panel Admin</h3>
                    <p className="text-sm text-gray-600">Administrar plataforma</p>
                  </div>
                </div>
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">
                  🚪
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cerrar Sesión</h3>
                  <p className="text-sm text-gray-600">Salir de tu cuenta</p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
