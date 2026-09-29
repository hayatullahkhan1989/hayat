import { useState } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Edit2,
  Calendar,
  User,
  X,
  Save,
  FileText,
  Clock,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/data/seed';
import type { MedicalRecord } from '@/types';

export default function DoctorRecords() {
  const { currentUser, medicalRecords, doctors, appointments, addMedicalRecord, updateMedicalRecord } = useApp();

  const doctor = doctors.find((d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name);
  const myRecords = doctor
    ? medicalRecords.filter((r) => r.doctorId === doctor.id || r.doctorName === doctor.name)
    : medicalRecords;

  const [search, setSearch] = useState('');
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('all');
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    notes: '',
  });

  // Extract unique patient list from appointments and records
  const patientMap = new Map<string, string>();
  appointments.forEach((a) => {
    if (doctor && a.doctorId === doctor.id) {
      patientMap.set(a.patientName, a.patientId);
    } else if (!doctor) {
      patientMap.set(a.patientName, a.patientId);
    }
  });
  myRecords.forEach((r) => patientMap.set(r.patientName, r.patientId));
  const patientOptions = Array.from(patientMap.entries()).map(([name, id]) => ({ name, id }));

  const filteredRecords = myRecords
    .filter((r) => {
      const matchesSearch =
        r.patientName.toLowerCase().includes(search.toLowerCase()) ||
        r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
        r.notes.toLowerCase().includes(search.toLowerCase());
      const matchesPatient = selectedPatientFilter === 'all' || r.patientName === selectedPatientFilter;
      return matchesSearch && matchesPatient;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openCreateModal = () => {
    const defaultPatient = patientOptions[0]?.name || '';
    const defaultPatientId = patientOptions[0]?.id || '';
    setFormData({
      patientName: defaultPatient,
      patientId: defaultPatientId,
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      notes: '',
    });
    setActiveModal('create');
  };

  const openEditModal = (rec: MedicalRecord) => {
    setSelectedRecord(rec);
    setFormData({
      patientName: rec.patientName,
      patientId: rec.patientId,
      date: rec.date,
      diagnosis: rec.diagnosis,
      notes: rec.notes,
    });
    setActiveModal('edit');
  };

  const openViewModal = (rec: MedicalRecord) => {
    setSelectedRecord(rec);
    setActiveModal('view');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.diagnosis.trim()) return;

    const patientId = formData.patientId || patientMap.get(formData.patientName) || 'pat-gen';
    const doctorId = doctor?.id || 'doc-gen';
    const doctorName = doctor?.name || (currentUser?.name.startsWith('Dr.') ? currentUser.name : `Dr. ${currentUser?.name || 'Physician'}`);

    if (activeModal === 'create') {
      addMedicalRecord({
        patientId,
        patientName: formData.patientName,
        doctorId,
        doctorName,
        date: formData.date,
        diagnosis: formData.diagnosis.trim(),
        notes: formData.notes.trim(),
      });
    } else if (activeModal === 'edit' && selectedRecord) {
      updateMedicalRecord(selectedRecord.id, {
        patientName: formData.patientName,
        patientId,
        date: formData.date,
        diagnosis: formData.diagnosis.trim(),
        notes: formData.notes.trim(),
      });
    }

    setActiveModal(null);
    setSelectedRecord(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Medical Records</h1>
            <p className="text-sm text-gray-500">Document clinical diagnoses, observations, and treatment plans</p>
          </div>
          <button onClick={openCreateModal} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            New Clinical Record
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, diagnosis, or clinical notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div>
            <select
              value={selectedPatientFilter}
              onChange={(e) => setSelectedPatientFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Patients ({patientOptions.length})</option>
              {patientOptions.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Records Grid */}
        <div className="space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="card p-5 hover:shadow-md transition-all border-l-4 border-l-teal-500"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-gray-900 bg-gray-100 rounded-lg px-2.5 py-1 text-sm">
                        <User className="h-3.5 w-3.5 text-primary-600" />
                        {rec.patientName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {formatDate(rec.date)}
                      </span>
                      <span className="text-xs text-gray-400">Attended by {rec.doctorName}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-teal-600" />
                        {rec.diagnosis}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-line bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        {rec.notes}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                    <button
                      onClick={() => openViewModal(rec)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => openEditModal(rec)}
                      className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100 transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-base font-medium text-gray-900">No medical records found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {search || selectedPatientFilter !== 'all'
                  ? 'Try adjusting your search criteria or selected patient'
                  : 'Start by creating your first clinical record for a patient'}
              </p>
              <button onClick={openCreateModal} className="btn-primary mt-4 text-xs">
                <Plus className="h-3.5 w-3.5" /> Create Record
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="card max-w-lg w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-teal-600" />
                {activeModal === 'create' ? 'Create Medical Record' : 'Edit Medical Record'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Patient</label>
                {activeModal === 'create' ? (
                  patientOptions.length > 0 ? (
                    <select
                      value={formData.patientName}
                      onChange={(e) => {
                        const pName = e.target.value;
                        const pId = patientMap.get(pName) || '';
                        setFormData({ ...formData, patientName: pName, patientId: pId });
                      }}
                      className="input-field"
                      required
                    >
                      {patientOptions.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Patient name"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="input-field"
                      required
                    />
                  )
                ) : (
                  <input
                    type="text"
                    disabled
                    value={formData.patientName}
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Date of Consultation</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Diagnosis / Clinical Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Stage 1 Hypertension, Acute Pharyngitis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Clinical Notes, Findings & Recommendations
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed clinical examination findings, advice, prescribed diet, or next steps..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save className="h-4 w-4" />
                  {activeModal === 'create' ? 'Save Record' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {activeModal === 'view' && selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="card max-w-xl w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Clinical Consultation Record</h3>
                  <p className="text-xs text-gray-500">Record ID: {selectedRecord.id}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 bg-gray-50/70 rounded-xl p-4 border border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-400">PATIENT NAME</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedRecord.patientName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">CONSULTATION DATE</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{formatDate(selectedRecord.date)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">ATTENDING DOCTOR</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedRecord.doctorName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">STATUS</p>
                  <p className="text-teal-600 font-semibold mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200/60 pt-3">
                <p className="text-xs font-medium text-gray-400">PRIMARY DIAGNOSIS</p>
                <p className="text-base font-bold text-gray-900 mt-1">{selectedRecord.diagnosis}</p>
              </div>

              <div className="border-t border-gray-200/60 pt-3">
                <p className="text-xs font-medium text-gray-400 mb-1">CLINICAL OBSERVATIONS & NOTES</p>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-gray-200/70">
                  {selectedRecord.notes}
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={handlePrint} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                <Printer className="h-4 w-4" />
                Print Record
              </button>
              <button onClick={() => setActiveModal(null)} className="btn-primary flex-1">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
