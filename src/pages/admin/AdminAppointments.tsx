import { useState } from 'react';
import {
  Calendar,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Check,
  RotateCcw,
  Trash2,
  User,
  Stethoscope,
  Filter,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { adminNav } from '@/navigation/adminNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';
import type { Appointment, AppointmentStatus } from '@/types';

export default function AdminAppointments() {
  const {
    appointments,
    doctors,
    updateAppointment,
    removeAppointment,
    addNotification,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Status counters
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const filtered = appointments
    .filter((a) => statusFilter === 'all' || a.status.toLowerCase() === statusFilter.toLowerCase())
    .filter((a) => doctorFilter === 'all' || a.doctorId === doctorFilter || a.doctorName === doctorFilter)
    .filter(
      (a) =>
        !search ||
        a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        a.reason.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  const handleStatusChange = (apt: Appointment, newStatus: AppointmentStatus) => {
    updateAppointment(apt.id, { status: newStatus });
    addNotification({
      userId: apt.patientId,
      message: `Your appointment with ${apt.doctorName} on ${formatDate(apt.date)} has been updated to ${newStatus}.`,
      date: new Date().toISOString(),
      read: false,
    });
  };

  const handleReschedule = () => {
    if (!rescheduleApt || !newDate || !newTime) return;
    updateAppointment(rescheduleApt.id, {
      date: newDate,
      time: newTime,
      status: 'Confirmed',
    });
    addNotification({
      userId: rescheduleApt.patientId,
      message: `Your appointment with ${rescheduleApt.doctorName} has been rescheduled to ${formatDate(
        newDate
      )} at ${formatTime(newTime)}.`,
      date: new Date().toISOString(),
      read: false,
    });
    setRescheduleApt(null);
    setNewDate('');
    setNewTime('');
  };

  const handleDelete = (id: string) => {
    removeAppointment(id);
    setDeleteConfirmId(null);
  };

  return (
    <DashboardShell navItems={adminNav} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
            <p className="text-sm text-gray-500">
              Global booking registry across all departments, doctors, and patients
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === 'all'
                ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500 font-medium">All Bookings</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-amber-600 font-medium">Pending</p>
            <p className="text-xl font-bold text-amber-700 mt-0.5">{pendingCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-teal-600 font-medium">Confirmed</p>
            <p className="text-xl font-bold text-teal-700 mt-0.5">{confirmedCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === 'completed'
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-blue-600 font-medium">Completed</p>
            <p className="text-xl font-bold text-blue-700 mt-0.5">{completedCount}</p>
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-red-50 border-red-300 ring-2 ring-red-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-red-600 font-medium">Cancelled</p>
            <p className="text-xl font-bold text-red-700 mt-0.5">{cancelledCount}</p>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient, doctor, or consultation reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="input-field text-xs"
            >
              <option value="all">All Doctors ({doctors.length})</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Appointments Table Card */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Assigned Doctor</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{apt.patientName}</p>
                          <p className="text-[11px] text-gray-400">ID: {apt.patientId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span>{apt.doctorName}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-600">
                      <div className="font-medium text-gray-900">{formatDate(apt.date)}</div>
                      <div className="text-gray-400">{formatTime(apt.time)}</div>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-600 max-w-xs">
                      <p className="truncate">{apt.reason}</p>
                      {apt.notes && (
                        <p className="text-[11px] text-teal-700 mt-0.5 truncate flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Note: {apt.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`badge ${
                          apt.status === 'Confirmed'
                            ? 'badge-confirmed'
                            : apt.status === 'Pending'
                            ? 'badge-pending'
                            : apt.status === 'Completed'
                            ? 'badge-completed'
                            : 'badge-cancelled'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(apt, 'Confirmed')}
                            className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Confirm Appointment"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}

                        {apt.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(apt, 'Completed')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}

                        {apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(apt, 'Cancelled')}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setRescheduleApt(apt)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reschedule"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(apt.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Appointment Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 text-xs">
                      No appointments found matching current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setRescheduleApt(null)}
        >
          <div className="card max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-amber-600" />
                Reschedule Appointment
              </h3>
              <button onClick={() => setRescheduleApt(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Patient: <span className="font-semibold text-gray-800">{rescheduleApt.patientName}</span> •
              Doctor: <span className="font-semibold text-gray-800">{rescheduleApt.doctorName}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setRescheduleApt(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="btn-primary flex-1"
                disabled={!newDate || !newTime}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div className="card max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900">Delete Appointment?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              This action will permanently delete this appointment from the system.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary flex-1 text-xs">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="btn-danger flex-1 text-xs">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
