'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface BookingFormData {
  propertyId: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

interface BookingSystemProps {
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  brokerId?: number;
  brokerName?: string;
  brokerPhone?: string;
  brokerEmail?: string;
  onBookingComplete?: (bookingId: string) => void;
  className?: string;
}

export function BookingSystem({
  propertyId,
  propertyTitle,
  propertyAddress,
  brokerId,
  brokerName,
  brokerPhone,
  brokerEmail,
  onBookingComplete,
  className = ''
}: BookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<BookingFormData>({
    propertyId,
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://proptech-mvp-1.onrender.com';

  // Generar slots disponibles (ejemplo: próximos 14 días)
  useEffect(() => {
    const slots: BookingSlot[] = [];
    const today = new Date();
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      timeSlots.forEach((time) => {
        // Simular disponibilidad (en producción vendría del backend)
        const isAvailable = Math.random() > 0.3; // 70% disponibles
        slots.push({
          id: `${dateStr}-${time}`,
          date: dateStr,
          time,
          available: isAvailable
        });
      });
    }

    setAvailableSlots(slots);
  }, []);

  // Filtrar slots por fecha seleccionada
  const filteredSlots = availableSlots.filter(
    (slot) => slot.date === selectedDate && slot.available
  );

  // Obtener próximos 30 días para selector
  const getAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setFormData({ ...formData, date });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setFormData({ ...formData, time });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.phone || !formData.email) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          broker_id: brokerId,
          date: selectedDate,
          time: selectedTime,
          visitor_name: formData.name,
          visitor_phone: formData.phone,
          visitor_email: formData.email,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingId(data.booking_id || data.id || `booking-${Date.now()}`);
        setIsSuccess(true);
        
        // Agregar a Google Calendar (opcional)
        // Generar URL de Google Calendar directamente (no requiere API)
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Visita+Propiedad:+${encodeURIComponent(propertyTitle)}&dates=${selectedDate}T${selectedTime.replace(':', '')}00/${selectedDate}T${(parseInt(selectedTime.split(':')[0]) + 1).toString().padStart(2, '0')}:${selectedTime.split(':')[1]}:00&details=${encodeURIComponent(`Dirección: ${propertyAddress}\nNotas: ${formData.notes || ''}`)}&location=${encodeURIComponent(propertyAddress)}`;
        // window.open(calendarUrl, '_blank'); // Descomentar para abrir automáticamente

        if (onBookingComplete) {
          onBookingComplete(bookingId);
        }
      } else {
        throw new Error('Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error booking:', error);
      alert('Hubo un error al crear la reserva. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h3>
          <p className="text-gray-600 mb-4">
            Tu cita ha sido confirmada para el <strong>{new Date(selectedDate).toLocaleDateString('es-ES')}</strong> a las <strong>{selectedTime}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            ID de Reserva: <code className="bg-gray-100 px-2 py-1 rounded">{bookingId}</code>
          </p>
          {brokerName && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Contacto del broker:</strong>
              </p>
              <p className="text-sm text-gray-700">{brokerName}</p>
              {brokerPhone && <p className="text-sm text-gray-700">{brokerPhone}</p>}
              {brokerEmail && <p className="text-sm text-gray-700">{brokerEmail}</p>}
            </div>
          )}
          <button
            onClick={() => {
              setIsSuccess(false);
              setSelectedDate('');
              setSelectedTime('');
              setFormData({
                propertyId,
                date: '',
                time: '',
                name: '',
                phone: '',
                email: '',
                notes: ''
              });
            }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
          >
            Nueva Reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservar Visita</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={16} />
          <p className="text-sm">{propertyAddress}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Selecciona una Fecha
          </label>
          <select
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          >
            <option value="">-- Selecciona fecha --</option>
            {getAvailableDates().map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Hora */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-2" />
              Selecciona una Hora
            </label>
            <div className="grid grid-cols-3 gap-2">
              {filteredSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleTimeSelect(slot.time)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedTime === slot.time
                      ? 'bg-brand-50 border-brand-600 text-brand-700 font-semibold'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-brand-400'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
            {filteredSlots.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No hay horarios disponibles para esta fecha</p>
            )}
          </div>
        )}

        {/* Información del Visitante */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-semibold text-gray-900">Información de Contacto</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="inline mr-2" />
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone size={16} className="inline mr-2" />
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} className="inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Ej: Prefiero tarde, tengo preguntas sobre..."
            />
          </div>
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !selectedDate || !selectedTime}
          className="w-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
}

