import { useState } from 'react';
import {
  User,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Building2,
  DollarSign,
  MapPin,
  Save,
  Check,
  Star,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { specializations, locations } from '@/data/seed';

export default function DoctorProfile() {
  const { currentUser, doctors, updateDoctor, updateProfile } = useApp();

  const doctor = doctors.find(
    (d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name
  );

  const [formData, setFormData] = useState({
    name: doctor?.name || currentUser?.name || 'Dr. Physician',
    specialization: doctor?.specialization || 'Cardiology',
    qualification: doctor?.qualification || 'MD, DM Cardiology',
    experience: doctor?.experience || 10,
    hospital: doctor?.hospital || 'City General Hospital',
    fee: doctor?.fee || 1000,
    location: doctor?.location || 'Mumbai',
    bio:
      doctor?.bio ||
      'Dedicated medical professional committed to providing the highest quality of healthcare and patient outcomes.',
    startTime: doctor?.startTime || '09:00',
    endTime: doctor?.endTime || '17:00',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctor) {
      updateDoctor(doctor.id, {
        name: formData.name,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: Number(formData.experience),
        hospital: formData.hospital,
        fee: Number(formData.fee),
        location: formData.location,
        bio: formData.bio,
      });
    }

    updateProfile({
      name: formData.name.replace(/^Dr\.\s*/, ''),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Profile & Practice Settings</h1>
            <p className="text-sm text-gray-500">Manage your professional credentials, fees, and bio</p>
          </div>
        </div>

        {saved && (
          <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-700 flex items-center gap-2 animate-fade-in shadow-sm">
            <Check className="h-4 w-4" />
            Your professional profile details have been saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Preview */}
          <div className="space-y-4">
            <div className="card p-6 text-center space-y-4 shadow-sm border border-gray-100">
              <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <span className="text-3xl font-extrabold">
                  {formData.name.replace(/^Dr\.\s*/, '').charAt(0) || 'D'}
                </span>
                <span className="absolute -bottom-1 -right-1 bg-teal-500 border-2 border-white rounded-full p-1 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">{formData.name}</h2>
                <p className="text-sm font-medium text-primary-600">{formData.specialization}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formData.qualification}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-left">
                <div className="bg-gray-50 p-2.5 rounded-xl">
                  <p className="text-[11px] text-gray-400 font-medium">EXPERIENCE</p>
                  <p className="text-sm font-semibold text-gray-800">{formData.experience}+ Years</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl">
                  <p className="text-[11px] text-gray-400 font-medium">CONSULTATION</p>
                  <p className="text-sm font-semibold text-teal-700">₹{formData.fee}</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-left space-y-1.5 pt-2 border-t border-gray-100">
                <p className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{formData.hospital}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span>{formData.location}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span>
                    {formData.startTime} - {formData.endTime}
                  </span>
                </p>
              </div>
            </div>

            <div className="card p-5 bg-gradient-to-br from-primary-600 to-teal-700 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                <span className="text-xs uppercase tracking-wider font-semibold text-white/90">
                  Doctor Rating
                </span>
              </div>
              <p className="text-3xl font-extrabold">4.9 / 5.0</p>
              <p className="text-xs text-white/80 mt-1">Based on 140+ verified patient reviews and follow-ups</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="card p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary-600" />
                Edit Profile Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name (with Title)</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Specialization</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Qualification & Degrees</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="input-field pl-9"
                        placeholder="e.g. MBBS, MD, FRCS"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Years of Experience</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                        className="input-field pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Hospital / Clinic Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.hospital}
                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                        className="input-field pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">City / Location</label>
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

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Consultation Fee (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      step="50"
                      min="100"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                      className="input-field pl-9"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Professional Biography</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input-field resize-none leading-relaxed"
                    placeholder="Describe your medical background, clinical interests, and care philosophy..."
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="btn-primary px-6">
                    <Save className="h-4 w-4" />
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
