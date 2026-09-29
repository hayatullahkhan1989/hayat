import { useState } from 'react';
import {
  Check,
  X,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  Search,
  FileText,
  Pill,
  Plus,
  Save,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/data/seed';
import type { Appointment, Medicine } from '@/types';

export default function DoctorAppointments() {
  const {
    currentUser,
    appointments,
    doctors,
    updateAppointment,
    addNotification,
    addPrescription,
  } = useApp();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Consultation Note Modal
  const [noteApt, setNoteApt] = useState<Appointment | null>(null);
  const [noteText, setNoteText] = useState('');

  // Prescription Modal
  const [prescribeApt, setPrescribeApt] = useState<Appointment | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);

  const doctor = doctors.find(
    (d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name
  );
  const myAppointments = doctor
    ? appointments.filter((a) => a.doctorId === doctor.id)
    : appointments.filter(
        (a) => a.doctorName === `Dr. ${currentUser?.name}` || a.doctorName === currentUser?.name
      );

  const filtered = myAppointments
    .filter((a) => filter === 'all' || a.status.toLowerCase() === filter)
    .filter(
      (a) =>
        !search ||
        a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.reason.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
    );

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

  const openNoteModal = (apt: Appointment) => {
    setNoteApt(apt);
    setNoteText(apt.notes || '');
  };

  const handleSaveNote = () => {
    if (!noteApt) return;
    updateAppointment(noteApt.id, { notes: noteText });
    setNoteApt(null);
    setNoteText('');
  };

  const openPrescribeModal = (apt: Appointment) => {
    setPrescribeApt(apt);
    setMedicines([{ name: '', dosage: '500mg', frequency: '2 times daily', duration: '5 days', instructions: 'Take after meals' }]);
  };

  const handleSavePrescription = () => {
    if (!prescribeApt) return;
    const validMedicines = medicines.filter((m) => m.name.trim());
    if (validMedicines.length === 0) return;

    addPrescription({
      patientId: prescribeApt.patientId,
      patientName: prescribeApt.patientName,
      doctorId: prescribeApt.doctorId,
      doctorName: prescribeApt.doctorName,
      appointmentId: prescribeApt.id,
      date: new Date().toISOString().split('T')[0],
      medicines: validMedicines,
    });

    // Mark appointment completed
    updateAppointment(prescribeApt.id, { status: 'Completed' });

    addNotification({
      userId: prescribeApt.patientId,
      message: `Dr. ${prescribeApt.doctorName} has issued a new prescription for your consultation.`,
      date: new Date().toISOString(),
      read: false,
    });

    setPrescribeApt(null);
  };

  const filters = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-sm text-gray-500">Manage patient bookings, clinical consultations, notes & prescriptions</p>
          </div>
        </div>

        {/* Filter tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((apt) => (
              <div key={apt.id} className="card p-5 hover:shadow-sm transition-all border-l-4 border-l-primary-500">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 font-bold shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-base">{apt.patientName}</p>
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
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{apt.reason}</p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" /> {formatDate(apt.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gray-400" /> {formatTime(apt.time)}
                        </span>
                        {apt.notes && (
                          <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Has Notes
                          </span>
                        )}
                      </div>

                      {apt.notes && (
                        <div className="mt-2 p-2.5 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                          <span className="font-semibold text-gray-700">Doctor Note: </span>
                          {apt.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openNoteModal(apt)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                      title="Add or edit consultation notes"
                    >
                      <FileText className="h-3.5 w-3.5 text-gray-500" />
                      {apt.notes ? 'Edit Notes' : 'Add Notes'}
                    </button>

                    {apt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAction(apt, 'Confirmed')}
                          className="flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(apt, 'Cancelled')}
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </>
                    )}

                    {apt.status === 'Confirmed' && (
                      <>
                        <button
                          onClick={() => openPrescribeModal(apt)}
                          className="flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
                        >
                          <Pill className="h-3.5 w-3.5" />
                          Prescribe
                        </button>
                        <button
                          onClick={() => handleAction(apt, 'Completed')}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Complete
                        </button>
                        <button
                          onClick={() => setRescheduleApt(apt)}
                          className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
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
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No {filter !== 'all' ? filter : ''} appointments found</p>
              <p className="text-xs text-gray-400 mt-1">Patient bookings matching your filter will show up here</p>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setRescheduleApt(null)}
        >
          <div className="card max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reschedule Appointment</h3>
            <p className="text-sm text-gray-600 mb-4">Patient: {rescheduleApt.patientName}</p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">New Time</label>
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
                <RotateCcw className="h-4 w-4" />
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Notes Modal */}
      {noteApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setNoteApt(null)}
        >
          <div className="card max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-600" />
                Consultation Notes
              </h3>
              <button onClick={() => setNoteApt(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Patient: <span className="font-semibold text-gray-800">{noteApt.patientName}</span> •{' '}
              {formatDate(noteApt.date)} at {formatTime(noteApt.time)}
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Doctor's Clinical Notes</label>
                <textarea
                  rows={5}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="input-field resize-none leading-relaxed"
                  placeholder="Record symptoms, observations, vitals, or clinical advice for this consultation..."
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setNoteApt(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSaveNote} className="btn-primary flex-1">
                <Save className="h-4 w-4" />
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Prescription Modal */}
      {prescribeApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setPrescribeApt(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Issue Medical Prescription</h3>
                  <p className="text-xs text-gray-500">
                    Patient: <span className="font-semibold text-gray-700">{prescribeApt.patientName}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setPrescribeApt(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {medicines.map((med, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Medicine #{i + 1}
                    </span>
                    {medicines.length > 1 && (
                      <button
                        onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                    value={med.name}
                    onChange={(e) => {
                      const updated = [...medicines];
                      updated[i] = { ...med, name: e.target.value };
                      setMedicines(updated);
                    }}
                    className="input-field"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 500mg)"
                      value={med.dosage}
                      onChange={(e) => {
                        const updated = [...medicines];
                        updated[i] = { ...med, dosage: e.target.value };
                        setMedicines(updated);
                      }}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g. Twice daily)"
                      value={med.frequency}
                      onChange={(e) => {
                        const updated = [...medicines];
                        updated[i] = { ...med, frequency: e.target.value };
                        setMedicines(updated);
                      }}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 5 days)"
                      value={med.duration}
                      onChange={(e) => {
                        const updated = [...medicines];
                        updated[i] = { ...med, duration: e.target.value };
                        setMedicines(updated);
                      }}
                      className="input-field"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Special instructions (e.g. After breakfast with water)"
                    value={med.instructions}
                    onChange={(e) => {
                      const updated = [...medicines];
                      updated[i] = { ...med, instructions: e.target.value };
                      setMedicines(updated);
                    }}
                    className="input-field"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setMedicines([
                    ...medicines,
                    { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
                  ])
                }
                className="btn-ghost w-full border border-dashed border-gray-300 py-3 text-xs"
              >
                <Plus className="h-4 w-4" /> Add Another Medication
              </button>
            </div>

            <div className="mt-6 flex gap-3 pt-3 border-t border-gray-100">
              <button onClick={() => setPrescribeApt(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleSavePrescription}
                className="btn-primary flex-1"
                disabled={!medicines.some((m) => m.name.trim())}
              >
                <Save className="h-4 w-4" />
                Issue & Complete Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
