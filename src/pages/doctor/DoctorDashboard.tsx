import { Calendar, Clock, Check, X, Users, TrendingUp, ClipboardList } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';

export default function DoctorDashboard() {
  const { currentUser, appointments, doctors } = useApp();

  // Match doctor by name (since login assigns a new ID)
  const doctor = doctors.find((d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name);
  const myAppointments = doctor
    ? appointments.filter((a) => a.doctorId === doctor.id)
    : appointments.filter((a) => a.doctorName === `Dr. ${currentUser?.name}` || a.doctorName === currentUser?.name);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter((a) => a.date === today);
  const pendingCount = myAppointments.filter((a) => a.status === 'Pending').length;
  const completedCount = myAppointments.filter((a) => a.status === 'Completed').length;
  const uniquePatients = new Set(myAppointments.map((a) => a.patientName)).size;

  const stats = [
    { label: "Today's Appointments", value: todayAppointments.length, icon: Calendar, color: 'bg-primary-100 text-primary-600' },
    { label: 'Pending', value: pendingCount, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Completed', value: completedCount, icon: Check, color: 'bg-teal-100 text-teal-600' },
    { label: 'Total Patients', value: uniquePatients, icon: Users, color: 'bg-blue-100 text-blue-600' },
  ];

  const upcoming = myAppointments
    .filter((a) => a.status === 'Pending' || a.status === 'Confirmed')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color} mb-3`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          {upcoming.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcoming.slice(0, 6).map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{apt.patientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(apt.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatTime(apt.time)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{apt.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${apt.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'}`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Practice Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="font-semibold text-gray-900">{myAppointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {myAppointments.length > 0 ? Math.round((completedCount / myAppointments.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unique Patients</span>
                <span className="font-semibold text-gray-900">{uniquePatients}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
            </div>
            {todayAppointments.length > 0 ? (
              <div className="space-y-2">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{formatTime(apt.time)}</span>
                    <span className="text-sm text-gray-600">{apt.patientName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
