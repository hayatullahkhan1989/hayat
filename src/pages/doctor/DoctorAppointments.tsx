import { useState } from 'react';
import { Check, X, Clock, Calendar, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';
import type { Appointment } from '@/types';

export default function DoctorAppointments() {
  const { currentUser, appointments, doctors, updateAppointment, addNotification } = useApp();
  const [filter, setFilter] = useState('all');
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const doctor = doctors.find((d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name);
  const myAppointments = doctor
    ? appointments.filter((a) => a.doctorId === doctor.id)
    : appointments.filter((a) => a.doctorName === `Dr. ${currentUser?.name}` || a.doctorName === currentUser?.name);

  const filtered = myAppointments
    .filter((a) => filter === 'all' || a.status.toLowerCase() === filter)
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  const handleAction = (apt: Appointment, action: 'Confirmed' | 'Cancelled' | 'Completed') => {
    updateAppointment(apt.id, { status: action });
    addNotification({
      userId: apt.patientId,
      message: `Your appointment with ${apt.doctorName} on ${formatDate(apt.date)} has been ${action.toLowerCase()}.`,
      date: new Date().toISOString(),
      read: false,
    });
  };

  const handleReschedule = () => {
    if (!rescheduleApt || !newDate || !newTime) return;
    updateAppointment(rescheduleApt.id, { date: newDate, time: newTime, status: 'Confirmed' });
    addNotification({
      userId: rescheduleApt.patientId,
      message: `Your appointment with ${rescheduleApt.doctorName} has been rescheduled to ${formatDate(newDate)} at ${formatTime(newTime)}.`,
      date: new Date().toISOString(),
      read: false,
    });
    setRescheduleApt(null);
    setNewDate('');
    setNewTime('');
  };

  const filters = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Appointments */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((apt) => (
              <div key={apt.id} className="card p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 shrink-0">
                      <Calendar className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{apt.patientName}</p>
                      <p className="text-sm text-gray-500">{apt.reason}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(apt.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(apt.time)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      apt.status === 'Confirmed' ? 'badge-confirmed' :
                      apt.status === 'Pending' ? 'badge-pending' :
                      apt.status === 'Completed' ? 'badge-completed' :
                      'badge-cancelled'
                    }`}>{apt.status}</span>
                    {apt.status === 'Pending' && (
                      <>
                        <button onClick={() => handleAction(apt, 'Confirmed')} className="flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors">
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </button>
                        <button onClick={() => handleAction(apt, 'Cancelled')} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {apt.status === 'Confirmed' && (
                      <>
                        <button onClick={() => handleAction(apt, 'Completed')} className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                          <Check className="h-4 w-4" />
                          Complete
                        </button>
                        <button onClick={() => setRescheduleApt(apt)} className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                          <RotateCcw className="h-4 w-4" />
                          Reschedule
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500">No {filter !== 'all' ? filter : ''} appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={() => setRescheduleApt(null)}>
          <div className="card max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
            <p className="text-sm text-gray-600 mb-4">Patient: {rescheduleApt.patientName}</p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">New Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">New Time</label>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="input-field" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setRescheduleApt(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleReschedule} className="btn-primary flex-1" disabled={!newDate || !newTime}>
                <RotateCcw className="h-4 w-4" />
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
