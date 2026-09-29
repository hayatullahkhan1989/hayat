import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Filter } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { patientNav } from '@/navigation/patientNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';
import type { AppointmentStatus } from '@/types';

type Tab = 'upcoming' | 'completed' | 'cancelled';

export default function PatientAppointments() {
  const { currentUser, appointments } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('upcoming');

  const myAppointments = appointments.filter((a) => a.patientId === currentUser?.id);

  const filtered = myAppointments.filter((a) => {
    if (tab === 'upcoming') return a.status === 'Pending' || a.status === 'Confirmed';
    if (tab === 'completed') return a.status === 'Completed';
    if (tab === 'cancelled') return a.status === 'Cancelled';
    return true;
  }).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: myAppointments.filter((a) => a.status === 'Pending' || a.status === 'Confirmed').length },
    { key: 'completed', label: 'Completed', count: myAppointments.filter((a) => a.status === 'Completed').length },
    { key: 'cancelled', label: 'Cancelled', count: myAppointments.filter((a) => a.status === 'Cancelled').length },
  ];

  return (
    <DashboardShell navItems={patientNav} role="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <button onClick={() => navigate('/book')} className="btn-primary">
            <Plus className="h-4 w-4" />
            Book Appointment
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              <span className={`badge ${tab === t.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{apt.doctorName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(apt.date)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatTime(apt.time)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{apt.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${
                          apt.status === 'Confirmed' ? 'badge-confirmed' :
                          apt.status === 'Pending' ? 'badge-pending' :
                          apt.status === 'Completed' ? 'badge-completed' :
                          'badge-cancelled'
                        }`}>{apt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Filter className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500">No {tab} appointments</p>
              <button onClick={() => navigate('/book')} className="btn-secondary mt-4">
                <Plus className="h-4 w-4" />
                Book an Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
