import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, User, FileText, Stethoscope } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { generateTimeSlots, formatTime, formatDate, getDayOfWeek, daysOfWeek } from '@/data/seed';
import type { Doctor } from '@/types';

const steps = [
  { label: 'Select Doctor', icon: Stethoscope },
  { label: 'Select Date', icon: Calendar },
  { label: 'Select Time', icon: Clock },
  { label: 'Reason', icon: FileText },
  { label: 'Confirm', icon: Check },
];

export default function Booking() {
  const navigate = useNavigate();
  const { doctors, appointments, addAppointment, addNotification, currentUser } = useApp();
  const [step, setStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const activeDoctors = doctors.filter((d) => d.active);

  // Generate next 14 days
  const upcomingDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const availableDates = upcomingDates.filter((date) => {
    if (!selectedDoctor) return false;
    const day = getDayOfWeek(date);
    return selectedDoctor.availableDays.includes(day);
  });

  const timeSlots = selectedDoctor ? generateTimeSlots(selectedDoctor.startTime, selectedDoctor.endTime) : [];
  const bookedTimes = appointments.filter(
    (a) => a.doctorId === selectedDoctor?.id && a.date === selectedDate && a.status !== 'Cancelled'
  ).map((a) => a.time);

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedDoctor;
      case 1: return !!selectedDate;
      case 2: return !!selectedTime;
      case 3: return reason.trim().length > 0;
      default: return true;
    }
  };

  const handleConfirm = () => {
    if (!selectedDoctor || !currentUser) return;
    const newApt = {
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      reason,
      status: 'Pending' as const,
    };
    addAppointment(newApt);
    addNotification({
      userId: currentUser.id,
      message: `Your appointment with ${selectedDoctor.name} on ${formatDate(selectedDate)} at ${formatTime(selectedTime)} is pending approval.`,
      date: new Date().toISOString(),
      read: false,
    });
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card max-w-md w-full p-8 text-center animate-slide-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mb-4">
            <Check className="h-8 w-8 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Appointment Booked!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your appointment with {selectedDoctor?.name} on {formatDate(selectedDate)} at {formatTime(selectedTime)} has been booked. Status: Pending.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate('/dashboard/patient/appointments')} className="btn-primary flex-1">
              View Appointments
            </button>
            <button onClick={() => navigate('/dashboard/patient')} className="btn-secondary flex-1">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-sm text-gray-600 mb-8">Complete the steps below to schedule your visit</p>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    i < step ? 'bg-teal-500 text-white' :
                    i === step ? 'bg-primary-600 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <span className={`mt-1.5 text-[10px] font-medium hidden sm:block ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${i < step ? 'bg-teal-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="card p-6 animate-fade-in">
          {/* Step 0: Select Doctor */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Doctor</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeDoctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelectedDoctor(doc); setSelectedDate(''); setSelectedTime(''); }}
                    className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                      selectedDoctor?.id === doc.id ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={doc.photo} alt={doc.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-sm text-primary-600">{doc.specialization}</p>
                      <p className="text-xs text-gray-500">{doc.hospital} • ₹{doc.fee}</p>
                    </div>
                    {selectedDoctor?.id === doc.id && <Check className="h-5 w-5 text-primary-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Select Date */}
          {step === 1 && selectedDoctor && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Choose a Date</h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedDoctor.name} is available on: {selectedDoctor.availableDays.join(', ')}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      selectedDate === date ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-xs text-gray-500">{getDayOfWeek(date)}</p>
                    <p className="text-lg font-semibold">{new Date(date + 'T00:00:00').getDate()}</p>
                    <p className="text-xs text-gray-500">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</p>
                  </button>
                ))}
              </div>
              {availableDates.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No available dates in the next 14 days for this doctor's schedule.</p>
              )}
            </div>
          )}

          {/* Step 2: Select Time */}
          {step === 2 && selectedDoctor && selectedDate && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Time Slot</h2>
              <p className="text-sm text-gray-500 mb-4">{formatDate(selectedDate)}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const isBooked = bookedTimes.includes(slot);
                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-xl border py-2.5 text-sm font-medium transition-all ${
                        isBooked ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through' :
                        selectedTime === slot ? 'border-primary-400 bg-primary-50 text-primary-700' :
                        'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Reason */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reason for Visit</h2>
              <textarea
                autoFocus
                rows={5}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field resize-none"
                placeholder="Describe your symptoms or reason for the appointment..."
              />
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && selectedDoctor && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review & Confirm</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                  <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
                    <p className="text-sm text-primary-600">{selectedDoctor.specialization}</p>
                    <p className="text-xs text-gray-500">{selectedDoctor.hospital}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedDate)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="font-semibold text-gray-900">{formatTime(selectedTime)}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Reason for Visit</p>
                  <p className="text-sm text-gray-900">{reason}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">Consultation Fee</p>
                  <p className="font-semibold text-gray-900">₹{selectedDoctor.fee}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleConfirm} className="btn-primary">
                <Check className="h-4 w-4" />
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
