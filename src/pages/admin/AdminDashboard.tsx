import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Shield,
  ArrowRight,
  Activity,
  AlertCircle,
  Heart,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { adminNav } from '@/navigation/adminNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';

export default function AdminDashboard() {
  const { users, doctors, appointments, prescriptions, contactMessages } = useApp();

  const totalPatients = users.filter((u) => u.role === 'patient').length;
  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter((d) => d.active).length;
  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledAppointments = appointments.filter((a) => a.status === 'Cancelled').length;

  // Calculate gross consultation value
  const totalGrossRevenue = appointments.reduce((sum, apt) => {
    if (apt.status === 'Completed' || apt.status === 'Confirmed') {
      const doc = doctors.find((d) => d.id === apt.doctorId || d.name === apt.doctorName);
      return sum + (doc?.fee || 800);
    }
    return sum;
  }, 0);

  const completionRate =
    totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

  // Stats cards
  const stats = [
    {
      label: 'Total Registered Users',
      value: users.length,
      detail: `${totalPatients} Patients • ${users.filter((u) => u.role === 'doctor').length} Doctors`,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      label: 'Verified Doctors',
      value: totalDoctors,
      detail: `${activeDoctors} currently active`,
      icon: Stethoscope,
      color: 'bg-teal-50 text-teal-600 border border-teal-100',
    },
    {
      label: 'Total Appointments',
      value: totalAppointments,
      detail: `${pendingAppointments} awaiting approval`,
      icon: Calendar,
      color: 'bg-primary-50 text-primary-600 border border-primary-100',
    },
    {
      label: 'Gross Consultations',
      value: `₹${totalGrossRevenue.toLocaleString()}`,
      detail: `${completionRate}% fulfillment rate`,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
  ];

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 6);

  // Group doctors by specialization
  const specializationCounts: Record<string, number> = {};
  doctors.forEach((d) => {
    specializationCounts[d.specialization] = (specializationCounts[d.specialization] || 0) + 1;
  });

  return (
    <DashboardShell navItems={adminNav} role="admin">
      <div className="space-y-6">
        {/* Admin Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-slate-800 to-primary-900 p-6 sm:p-8 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-primary-300 mb-3 border border-white/10">
              <Shield className="h-3.5 w-3.5" /> System Administration Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Operations & Analytics
            </h1>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              Global dashboard monitoring system users, registered physicians, active booking slots, and platform health.
            </p>

            {/* Quick Navigation Links */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                to="/dashboard/admin/doctors"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all active:scale-95"
              >
                <Stethoscope className="h-4 w-4 text-teal-600" /> Manage Doctors
              </Link>
              <Link
                to="/dashboard/admin/users"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all active:scale-95"
              >
                <Users className="h-4 w-4" /> Manage Users
              </Link>
              <Link
                to="/dashboard/admin/appointments"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all active:scale-95"
              >
                <Calendar className="h-4 w-4" /> All Appointments
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  Live
                </span>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-xs font-semibold text-gray-700 mt-1">{s.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Status Breakdown & Specializations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment Status Cards */}
          <div className="card p-6 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary-600" />
              Appointment Pipeline
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-900">Pending Review</span>
                </div>
                <span className="text-sm font-bold text-amber-700">{pendingAppointments}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/70 border border-teal-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-semibold text-teal-900">Confirmed & Scheduled</span>
                </div>
                <span className="text-sm font-bold text-teal-700">{confirmedAppointments}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900">Successfully Completed</span>
                </div>
                <span className="text-sm font-bold text-blue-700">{completedAppointments}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/70 border border-red-100">
                <div className="flex items-center gap-2.5">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-semibold text-red-900">Cancelled / Declined</span>
                </div>
                <span className="text-sm font-bold text-red-700">{cancelledAppointments}</span>
              </div>
            </div>

            {/* Specialization distribution */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Doctors by Department
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(specializationCounts).map(([spec, count]) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                  >
                    <span>{spec}</span>
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-white text-[10px] font-bold text-primary-700 flex items-center justify-center border border-gray-200">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent System Activity / Bookings Table */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Recent Appointments Activity</h3>
                <p className="text-xs text-gray-500">Live booking feed across all hospital departments</p>
              </div>
              <Link
                to="/dashboard/admin/appointments"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all ({totalAppointments}) <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    <th className="pb-3 font-semibold">Patient</th>
                    <th className="pb-3 font-semibold">Doctor</th>
                    <th className="pb-3 font-semibold">Schedule</th>
                    <th className="pb-3 font-semibold">Reason</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 font-medium text-gray-900 text-xs">
                        {apt.patientName}
                      </td>
                      <td className="py-3 text-xs text-gray-700">
                        {apt.doctorName}
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        <div>{formatDate(apt.date)}</div>
                        <div className="text-[11px] text-gray-400">{formatTime(apt.time)}</div>
                      </td>
                      <td className="py-3 text-xs text-gray-600 max-w-xs truncate">{apt.reason}</td>
                      <td className="py-3 text-right">
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
                    </tr>
                  ))}
                  {recentAppointments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400 text-xs">
                        No appointments registered
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
