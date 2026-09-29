import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, GraduationCap, IndianRupee, Calendar, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { specializations, locations, formatTime, formatDate, daysOfWeek } from '@/data/seed';
import type { Doctor } from '@/types';

export default function Doctors() {
  const { doctors } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [expFilter, setExpFilter] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      if (!d.active) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.specialization.toLowerCase().includes(search.toLowerCase())) return false;
      if (specFilter && d.specialization !== specFilter) return false;
      if (locFilter && d.location !== locFilter) return false;
      if (expFilter && d.experience < expFilter) return false;
      return true;
    });
  }, [doctors, search, specFilter, locFilter, expFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-teal-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Find Your Doctor</h1>
          <p className="mt-2 text-primary-50">Browse our network of experienced healthcare specialists</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="card p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Doctor name or specialization"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Specialization</label>
              <select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className="input-field">
                <option value="">All Specializations</option>
                {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Location</label>
              <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)} className="input-field">
                <option value="">All Locations</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Min Experience: {expFilter}+ years</label>
              <input
                type="range"
                min="0"
                max="15"
                value={expFilter}
                onChange={(e) => setExpFilter(Number(e.target.value))}
                className="w-full accent-primary-600 mt-3"
              />
            </div>
          </div>
          {(search || specFilter || locFilter || expFilter > 0) && (
            <button
              onClick={() => { setSearch(''); setSpecFilter(''); setLocFilter(''); setExpFilter(0); }}
              className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Clear all filters
            </button>
          )}
        </div>

        <p className="mb-4 text-sm text-gray-600">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Doctor Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((doc) => (
            <div key={doc.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <img src={doc.photo} alt={doc.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-primary-600 font-medium">{doc.specialization}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-accent-500" fill="currentColor" />
                    <span className="text-xs text-gray-600">4.9 (120+ reviews)</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{doc.experience} years exp.</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{doc.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{doc.hospital}, {doc.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <IndianRupee className="h-4 w-4 text-gray-400" />
                  <span>{doc.fee} consultation</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {doc.availableDays.map((d) => (
                  <span key={d} className="badge bg-primary-50 text-primary-700">{d}</span>
                ))}
                <span className="badge bg-gray-100 text-gray-600">{formatTime(doc.startTime)} - {formatTime(doc.endTime)}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setSelectedDoctor(doc)} className="btn-secondary flex-1">
                  View Profile
                </button>
                <button onClick={() => navigate('/login')} className="btn-primary flex-1">
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-500">No doctors match your filters. Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={() => setSelectedDoctor(null)}>
          <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="h-24 w-24 rounded-2xl object-cover" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h2>
                <p className="text-primary-600 font-medium">{selectedDoctor.specialization}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-4 w-4 text-accent-500" fill="currentColor" />
                  <span className="text-sm text-gray-600">4.9 rating</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{selectedDoctor.bio}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{selectedDoctor.experience} years of experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                <span>{selectedDoctor.qualification}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{selectedDoctor.hospital}, {selectedDoctor.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IndianRupee className="h-4 w-4 text-gray-400" />
                <span>₹{selectedDoctor.fee} per consultation</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Days & Hours</p>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((d) => (
                  <span key={d} className={`badge ${selectedDoctor.availableDays.includes(d) ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-400'}`}>
                    {d}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">{formatTime(selectedDoctor.startTime)} - {formatTime(selectedDoctor.endTime)}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedDoctor(null)} className="btn-secondary flex-1">Close</button>
              <button onClick={() => { setSelectedDoctor(null); navigate('/login'); }} className="btn-primary flex-1">
                <Calendar className="h-4 w-4" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
