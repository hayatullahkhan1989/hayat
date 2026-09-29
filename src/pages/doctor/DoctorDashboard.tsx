import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Check,
  Users,
  TrendingUp,
  ClipboardList,
  Pill,
  ArrowRight,
  DollarSign,
  Plus,
  ShieldCheck,
  Activity,
  ChevronRight,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';

export default function DoctorDashboard() {
  const { currentUser, appointments, doctors, prescriptions, medicalRecords } = useApp();

  // Match doctor by name
  const doctor = doctors.find(
    (d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name
  );
  const myAppointments = doctor
    ? appointments.filter((a) => a.doctorId === doctor.id)
    : appointments.filter(
        (a) => a.doctorName === `Dr. ${currentUser?.name}` || a.doctorName === currentUser?.name
      );

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter((a) => a.date === today);
  const pendingCount = myAppointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = myAppointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = myAppointments.filter((a) => a.status === 'Completed').length;
  const uniquePatients = new Set(myAppointments.map((a) => a.patientName)).size;

  // Consultation earnings estimate
  const fee = doctor?.fee || 800;
  const totalEarnings = completedCount * fee;

  const myPrescriptions = doctor
    ? prescriptions.filter((p) => p.doctorId === doctor.id || p.doctorName === doctor.name)
    : prescriptions;

  const myRecords = doctor
    ? medicalRecords.filter((r) => r.doctorId === doctor.id || r.doctorName === doctor.name)
    : medicalRecords;

  const stats = [
    {
      label: "Today's Consults",
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-primary-50 text-primary-600 border border-primary-100',
      badge: 'Live Today',
    },
    {
      label: 'Pending Requests',
      value: pendingCount,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
      badge: 'Needs Review',
    },
    {
      label: 'Completed Consults',
      value: completedCount,
      icon: Check,
      color: 'bg-teal-50 text-teal-600 border border-teal-100',
      badge: 'All Time',
    },
    {
      label: 'Active Patients',
      value: uniquePatients,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
      badge: 'Unique',
    },
  ];

  const upcoming = myAppointments
    .filter((a) => a.status === 'Pending' || a.status === 'Confirmed')
    .sort(
      (a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
    );

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        {/* Welcome Doctor Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-teal-600 p-6 sm:p-8 text-white shadow-md">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-medium text-white mb-3">
              <Activity className="h-3.5 w-3.5" /> Doctor Practice Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {doctor?.name || `Dr. ${currentUser?.name || 'Physician'}`}
            </h1>
            <p className="mt-2 text-sm text-primary-100 leading-relaxed">
              {doctor?.specialization || 'General Healthcare'} • {doctor?.hospital || 'City Hospital'}. You have{' '}
              <span className="font-semibold text-white underline decoration-accent-400">
                {todayAppointments.length} appointment{todayAppointments.length === 1 ? '' : 's'} scheduled today
              </span>{' '}
              and {pendingCount} awaiting confirmation.
            </p>

            {/* Quick Actions in Hero */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                to="/dashboard/doctor/appointments"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-primary-700 shadow-sm hover:bg-primary-50 transition-all active:scale-95"
              >
                <Calendar className="h-4 w-4" /> Manage Appointments
              </Link>
              <Link
                to="/dashboard/doctor/records"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all active:scale-95"
              >
                <ClipboardList className="h-4 w-4" /> Clinical Records
              </Link>
              <Link
                to="/dashboard/doctor/schedule"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all active:scale-95"
              >
                <Clock className="h-4 w-4" /> Update Schedule
              </Link>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  {s.badge}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Practice Overview & Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="card p-6 lg:col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
              </div>
              <Link
                to="/dashboard/doctor/schedule"
                className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Hours <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex-1 space-y-2.5">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50/80 p-3.5 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 font-bold text-xs shrink-0">
                        {formatTime(apt.time).split(' ')[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{apt.patientName}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[140px]">{apt.reason}</p>
                      </div>
                    </div>
                    <span
                      className={`badge text-[10px] ${
                        apt.status === 'Confirmed'
                          ? 'badge-confirmed'
                          : apt.status === 'Pending'
                          ? 'badge-pending'
                          : 'badge-completed'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 my-auto text-gray-400">
                  <Clock className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm">No appointments scheduled for today</p>
                  <p className="text-xs text-gray-400 mt-1">Free day or off-duty</p>
                </div>
              )}
            </div>

            {/* Practice Quick Metrics */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-600">
                <span>Working Days:</span>
                <span className="font-semibold text-gray-900">
                  {doctor?.availableDays.join(', ') || 'Mon, Wed, Fri'}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Office Hours:</span>
                <span className="font-semibold text-gray-900">
                  {doctor?.startTime || '09:00'} - {doctor?.endTime || '17:00'}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Consultation Fee:</span>
                <span className="font-bold text-teal-700">₹{doctor?.fee || 800}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments Table */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                <p className="text-xs text-gray-500">Upcoming patient bookings requiring your attention</p>
              </div>
              <Link
                to="/dashboard/doctor/appointments"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all ({myAppointments.length}) <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {upcoming.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      <th className="pb-3 font-semibold">Patient</th>
                      <th className="pb-3 font-semibold">Date & Time</th>
                      <th className="pb-3 font-semibold">Consultation Reason</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {upcoming.slice(0, 5).map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                              {apt.patientName.charAt(0)}
                            </div>
                            {apt.patientName}
                          </div>
                        </td>
                        <td className="py-3 text-xs text-gray-600">
                          <div>{formatDate(apt.date)}</div>
                          <div className="text-gray-400">{formatTime(apt.time)}</div>
                        </td>
                        <td className="py-3 text-xs text-gray-600 max-w-xs truncate">{apt.reason}</td>
                        <td className="py-3">
                          <span
                            className={`badge ${
                              apt.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to="/dashboard/doctor/appointments"
                            className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors inline-block"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p className="text-sm">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Prescriptions & Medical Records Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Prescriptions */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Recent Prescriptions</h3>
              </div>
              <Link
                to="/dashboard/doctor/patients"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Patients & Rx
              </Link>
            </div>

            <div className="space-y-3">
              {myPrescriptions.slice(0, 3).map((pres) => (
                <div key={pres.id} className="rounded-xl border border-gray-100 p-3.5 bg-gray-50/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-gray-900">{pres.patientName}</span>
                    <span className="text-gray-400">{formatDate(pres.date)}</span>
                  </div>
                  <div className="space-y-1">
                    {pres.medicines.slice(0, 2).map((m, i) => (
                      <p key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-500 inline-block"></span>
                        <span className="font-medium text-gray-800">{m.name}</span> • {m.dosage} ({m.frequency})
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {myPrescriptions.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No prescriptions issued yet</p>
              )}
            </div>
          </div>

          {/* Recent Medical Records / Notes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Recent Clinical Notes</h3>
              </div>
              <Link
                to="/dashboard/doctor/records"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                All Records
              </Link>
            </div>

            <div className="space-y-3">
              {myRecords.slice(0, 3).map((rec) => (
                <div key={rec.id} className="rounded-xl border border-gray-100 p-3.5 bg-gray-50/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-900">{rec.patientName}</span>
                    <span className="text-gray-400">{formatDate(rec.date)}</span>
                  </div>
                  <p className="text-xs font-medium text-teal-700">{rec.diagnosis}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{rec.notes}</p>
                </div>
              ))}
              {myRecords.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No clinical records found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
