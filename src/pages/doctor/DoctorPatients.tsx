import { useState } from 'react';
import { Users, Search, FileText, Pill, ClipboardList, Plus, X, Save } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/data/seed';
import type { Medicine } from '@/types';

export default function DoctorPatients() {
  const { currentUser, appointments, doctors, prescriptions, medicalRecords, addPrescription, addMedicalRecord } = useApp();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [recordModal, setRecordModal] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [recordForm, setRecordForm] = useState({ diagnosis: '', notes: '' });

  const doctor = doctors.find((d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name);
  const myAppointments = doctor
    ? appointments.filter((a) => a.doctorId === doctor.id)
    : appointments.filter((a) => a.doctorName === `Dr. ${currentUser?.name}` || a.doctorName === currentUser?.name);

  // Unique patients
  const patientMap = new Map<string, string>();
  myAppointments.forEach((a) => patientMap.set(a.patientName, a.patientId));
  const patients = Array.from(patientMap.entries())
    .map(([name, id]) => ({ name, id }))
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const patientRecords = selectedPatient
    ? medicalRecords.filter((r) => r.patientName === selectedPatient)
    : [];
  const patientPrescriptions = selectedPatient
    ? prescriptions.filter((p) => p.patientName === selectedPatient)
    : [];
  const patientAppts = selectedPatient
    ? myAppointments.filter((a) => a.patientName === selectedPatient)
    : [];

  const handleAddPrescription = () => {
    if (!doctor || !selectedPatient) return;
    const patientId = patientMap.get(selectedPatient) || '';
    addPrescription({
      patientId,
      patientName: selectedPatient,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: new Date().toISOString().split('T')[0],
      medicines: medicines.filter((m) => m.name.trim()),
    });
    setPrescriptionModal(false);
    setMedicines([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleAddRecord = () => {
    if (!doctor || !selectedPatient) return;
    const patientId = patientMap.get(selectedPatient) || '';
    addMedicalRecord({
      patientId,
      patientName: selectedPatient,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis: recordForm.diagnosis,
      notes: recordForm.notes,
    });
    setRecordModal(false);
    setRecordForm({ diagnosis: '', notes: '' });
  };

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient list */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 px-2">All Patients ({patients.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p.name)}
                  className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                    selectedPatient === p.name ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{p.name}</span>
                </button>
              ))}
              {patients.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No patients found</p>
              )}
            </div>
          </div>

          {/* Patient detail */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-4">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                        {selectedPatient.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{selectedPatient}</h2>
                        <p className="text-sm text-gray-500">{patientAppts.length} appointments</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setPrescriptionModal(true)} className="btn-secondary text-sm">
                        <Pill className="h-4 w-4" />
                        Prescribe
                      </button>
                      <button onClick={() => setRecordModal(true)} className="btn-primary text-sm">
                        <Plus className="h-4 w-4" />
                        Add Record
                      </button>
                    </div>
                  </div>

                  {/* Appointment history */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Appointment History</h3>
                    <div className="space-y-2">
                      {patientApts.slice(0, 5).map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
                          <span className="text-gray-600">{formatDate(apt.date)}</span>
                          <span className="text-gray-600">{apt.reason}</span>
                          <span className={`badge ${
                            apt.status === 'Confirmed' ? 'badge-confirmed' :
                            apt.status === 'Pending' ? 'badge-pending' :
                            apt.status === 'Completed' ? 'badge-completed' :
                            'badge-cancelled'
                          }`}>{apt.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medical Records */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-teal-600" />
                      Medical Records
                    </h3>
                    {patientRecords.length > 0 ? (
                      <div className="space-y-2">
                        {patientRecords.map((rec) => (
                          <div key={rec.id} className="rounded-lg border border-gray-200 p-3">
                            <p className="font-medium text-gray-900 text-sm">{rec.diagnosis}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(rec.date)}</p>
                            <p className="text-sm text-gray-600 mt-1">{rec.notes}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No records yet</p>
                    )}
                  </div>

                  {/* Prescriptions */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-primary-600" />
                      Prescriptions
                    </h3>
                    {patientPrescriptions.length > 0 ? (
                      <div className="space-y-2">
                        {patientPrescriptions.map((pres) => (
                          <div key={pres.id} className="rounded-lg border border-gray-200 p-3">
                            <p className="text-xs text-gray-500 mb-2">{formatDate(pres.date)}</p>
                            {pres.medicines.map((m, i) => (
                              <div key={i} className="text-sm text-gray-700">
                                {m.name} — {m.dosage}, {m.frequency}, {m.duration}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No prescriptions yet</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="text-gray-500">Select a patient to view their details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {prescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={() => setPrescriptionModal(false)}>
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Prescription</h3>
              <button onClick={() => setPrescriptionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Patient: {selectedPatient}</p>
            <div className="space-y-4">
              {medicines.map((med, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Medicine {i + 1}</span>
                    {medicines.length > 1 && (
                      <button onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input type="text" placeholder="Medicine name" value={med.name} onChange={(e) => {
                    const updated = [...medicines]; updated[i] = { ...med, name: e.target.value }; setMedicines(updated);
                  }} className="input-field" />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => {
                      const updated = [...medicines]; updated[i] = { ...med, dosage: e.target.value }; setMedicines(updated);
                    }} className="input-field" />
                    <input type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => {
                      const updated = [...medicines]; updated[i] = { ...med, frequency: e.target.value }; setMedicines(updated);
                    }} className="input-field" />
                    <input type="text" placeholder="Duration" value={med.duration} onChange={(e) => {
                      const updated = [...medicines]; updated[i] = { ...med, duration: e.target.value }; setMedicines(updated);
                    }} className="input-field" />
                  </div>
                  <input type="text" placeholder="Instructions" value={med.instructions} onChange={(e) => {
                    const updated = [...medicines]; updated[i] = { ...med, instructions: e.target.value }; setMedicines(updated);
                  }} className="input-field" />
                </div>
              ))}
              <button onClick={() => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])} className="btn-ghost w-full">
                <Plus className="h-4 w-4" />
                Add Medicine
              </button>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setPrescriptionModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAddPrescription} className="btn-primary flex-1" disabled={!medicines.some((m) => m.name.trim())}>
                <Save className="h-4 w-4" />
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Modal */}
      {recordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={() => setRecordModal(false)}>
          <div className="card max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Medical Record</h3>
              <button onClick={() => setRecordModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Patient: {selectedPatient}</p>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Diagnosis</label>
                <input type="text" value={recordForm.diagnosis} onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} className="input-field" placeholder="Enter diagnosis" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
                <textarea rows={4} value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} className="input-field resize-none" placeholder="Clinical notes..." />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setRecordModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAddRecord} className="btn-primary flex-1" disabled={!recordForm.diagnosis.trim()}>
                <Save className="h-4 w-4" />
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
