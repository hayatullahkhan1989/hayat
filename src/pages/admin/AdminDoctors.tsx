import { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Building2,
  MapPin,
  Calendar,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { adminNav } from '@/navigation/adminNav';
import { useApp } from '@/context/AppContext';
import { specializations, locations, daysOfWeek } from '@/data/seed';
import type { Doctor } from '@/types';

export default function AdminDoctors() {
  const { doctors, addDoctor, updateDoctor, removeDoctor } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [selectedLoc, setSelectedLoc] = useState('all');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const initialFormState = {
    name: '',
    specialization: 'General Medicine',
    experience: 5,
    qualification: 'MBBS, MD',
    hospital: 'City Hospital',
    fee: 800,
    location: 'Mumbai',
    photo:
      'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    startTime: '09:00',
    endTime: '17:00',
    bio: '',
    active: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = selectedSpec === 'all' || doc.specialization === selectedSpec;
    const matchesLoc = selectedLoc === 'all' || doc.location === selectedLoc;
    return matchesSearch && matchesSpec && matchesLoc;
  });

  const openCreateModal = () => {
    setEditingDoctor(null);
    setFormData(initialFormState);
    setModalMode('create');
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      experience: doc.experience,
      qualification: doc.qualification,
      hospital: doc.hospital,
      fee: doc.fee,
      location: doc.location,
      photo: doc.photo,
      availableDays: doc.availableDays || ['Mon', 'Tue', 'Wed'],
      startTime: doc.startTime || '09:00',
      endTime: doc.endTime || '17:00',
      bio: doc.bio,
      active: doc.active,
    });
    setModalMode('edit');
  };

  const handleToggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleToggleStatus = (doc: Doctor) => {
    updateDoctor(doc.id, { active: !doc.active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const formattedName = formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`;

    if (modalMode === 'create') {
      addDoctor({
        name: formattedName,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        qualification: formData.qualification,
        hospital: formData.hospital,
        fee: Number(formData.fee),
        location: formData.location,
        photo: formData.photo,
        availableDays: formData.availableDays.length > 0 ? formData.availableDays : ['Mon', 'Tue'],
        startTime: formData.startTime,
        endTime: formData.endTime,
        bio: formData.bio || `${formattedName} is a specialist in ${formData.specialization}.`,
        active: formData.active,
      });
    } else if (modalMode === 'edit' && editingDoctor) {
      updateDoctor(editingDoctor.id, {
        name: formattedName,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        qualification: formData.qualification,
        hospital: formData.hospital,
        fee: Number(formData.fee),
        location: formData.location,
        photo: formData.photo,
        availableDays: formData.availableDays,
        startTime: formData.startTime,
        endTime: formData.endTime,
        bio: formData.bio,
        active: formData.active,
      });
    }

    setModalMode(null);
    setEditingDoctor(null);
  };

  const handleDelete = (id: string) => {
    removeDoctor(id);
    setDeleteConfirmId(null);
  };

  return (
    <DashboardShell navItems={adminNav} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
            <p className="text-sm text-gray-500">
              Directory of hospital physicians, consultation hours, and practice fees
            </p>
          </div>
          <button onClick={openCreateModal} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Add New Doctor
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, hospital, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="input-field text-xs"
            >
              <option value="all">All Specialties ({specializations.length})</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="input-field text-xs"
            >
              <option value="all">All Locations ({locations.length})</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className={`card p-5 hover:shadow-md transition-all border ${
                doc.active ? 'border-gray-100' : 'border-red-100 bg-gray-50/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="h-14 w-14 rounded-2xl object-cover border border-gray-100 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{doc.name}</h3>
                    <button
                      onClick={() => handleToggleStatus(doc)}
                      className={`badge text-[10px] cursor-pointer ${
                        doc.active ? 'badge-confirmed hover:bg-teal-200' : 'badge-cancelled hover:bg-red-200'
                      }`}
                      title="Click to toggle active status"
                    >
                      {doc.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-primary-600 mt-0.5">{doc.specialization}</p>
                  <p className="text-[11px] text-gray-400">{doc.qualification}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{doc.hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span>{doc.location}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-500 font-medium">Experience: {doc.experience} yrs</span>
                  <span className="font-bold text-teal-700">₹{doc.fee} / visit</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-400 truncate max-w-[130px]">
                  {doc.availableDays.join(', ')}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit Doctor"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(doc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Doctor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <div className="col-span-full card p-12 text-center text-gray-400">
              <Stethoscope className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm font-medium">No doctors matching criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      {modalMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalMode(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-600" />
                {modalMode === 'create' ? 'Add New Doctor' : 'Edit Doctor Details'}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Doctor Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ramesh Gupta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Specialization</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="input-field"
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD (Cardiology)"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Max Super Speciality"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.pexels.com/..."
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              {/* Available Days */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isSelected = formData.availableDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Clinical experience, background, specializations..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field resize-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeDoc"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label htmlFor="activeDoc" className="text-xs font-medium text-gray-700">
                  Doctor is actively accepting patient appointments
                </label>
              </div>

              <div className="mt-5 flex gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalMode(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save className="h-4 w-4" />
                  {modalMode === 'create' ? 'Create Doctor' : 'Save Changes'}
                </button>
              </div>
            </form>
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
            <h3 className="text-base font-bold text-gray-900">Remove Doctor?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              This will remove the doctor from the active hospital directory and booking listings.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary flex-1 text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn-danger flex-1 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
