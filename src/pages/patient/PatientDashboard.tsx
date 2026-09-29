import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, Activity, ClipboardList, Pill, FileText, TrendingUp } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { patientNav } from '@/navigation/patientNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';

export default function PatientDashboard() {
  const { currentUser, appointments, prescriptions, medicalRecords, medicalReports } = useApp();
  const navigate = useNavigate();

  const myAppointments = appointments.filter((a) => a.patientId === currentUser?.id);
  const upcoming = myAppointments
    .filter((a) => a.status === 'Pending' || a.status === 'Confirmed')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
  const completed = myAppointments.filter((a) => a.status === 'Completed');
  const myPrescriptions = prescriptions.filter((p) => p.patientId === currentUser?.id);
  const myRecords = medicalRecords.filter((r) => r.patientId === currentUser?.id);
  const myReports = medicalReports.filter((r) => r.patientId === currentUser?.id);

  const stats = [
    { label: 'Upcoming', value: upcoming.length, icon: Calendar, color: 'bg-primary-100 text-primary-600' },
    { label: 'Completed', value: completed.length, icon: ClipboardList, color: 'bg-teal-100 text-teal-600' },
    { label: 'Prescriptions', value: myPrescriptions.length, icon: Pill, color: 'bg-accent-100 text-accent-600' },
    { label: 'Reports', value: myReports.length, icon: FileText, color: 'bg-blue-100 text-blue-600' },
  ];

  const quickActions = [
    { label: 'Book Appointment', icon: Plus, to: '/book', color: 'bg-primary-600' },
    { label: 'My Appointments', icon: Calendar, to: '/dashboard/patient/appointments', color: 'bg-teal-600' },
    { label: 'Medical History', icon: ClipboardList, to: '/dashboard/patient/history', color: 'bg-accent-500' },
    { label: 'Prescriptions', icon: Pill, to: '/dashboard/patient/prescriptions', color: 'bg-blue-600' },
  ];

  return (
    <DashboardShell navItems={patientNav} role="patient">
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

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.color} text-white`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <button onClick={() => navigate('/dashboard/patient/appointments')} className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all →
            </button>
          </div>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 rounded-xl border border-gray-200 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{apt.doctorName}</p>
                    <p className="text-sm text-gray-500">{apt.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatDate(apt.date)}</p>
                    <p className="text-sm text-gray-500">{formatTime(apt.time)}</p>
                  </div>
                  <span className={`badge ${
                    apt.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'
                  }`}>{apt.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <button onClick={() => navigate('/book')} className="btn-primary">
                <Plus className="h-4 w-4" />
                Book an Appointment
              </button>
            </div>
          )}
        </div>

        {/* Recent Medical History */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Medical History</h2>
            <button onClick={() => navigate('/dashboard/patient/history')} className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all →
            </button>
          </div>
          {myRecords.length > 0 ? (
            <div className="space-y-3">
              {myRecords.slice(0, 3).map((rec) => (
                <div key={rec.id} className="flex items-start gap-4 rounded-xl border border-gray-200 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 shrink-0">
                    <Activity className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{rec.diagnosis}</p>
                    <p className="text-sm text-gray-500">{rec.doctorName} • {formatDate(rec.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No medical history records yet</p>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
