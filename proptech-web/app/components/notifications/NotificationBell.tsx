'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Simular notificaciones enterprise
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nueva Propiedad',
        message: 'Se ha agregado una nueva propiedad en Santo Domingo',
        type: 'info',
        timestamp: '2024-10-28T10:30:00Z',
        read: false
      },
      {
        id: '2',
        title: 'Lead Generado',
        message: 'Nuevo lead desde WhatsApp para propiedad #123',
        type: 'success',
        timestamp: '2024-10-28T09:15:00Z',
        read: false
      },
      {
        id: '3',
        title: 'Propiedad Vendida',
        message: 'La propiedad en Punta Cana ha sido vendida',
        type: 'success',
        timestamp: '2024-10-27T16:45:00Z',
        read: true
      }
    ]
    
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay notificaciones
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t">
            <button className="w-full text-sm text-indigo-600 hover:text-indigo-900">
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  )
}