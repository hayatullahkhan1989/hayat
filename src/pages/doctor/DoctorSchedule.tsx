import { useState } from 'react';
import { Clock, Save, Check } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { doctorNav } from '@/navigation/doctorNav';
import { useApp } from '@/context/AppContext';
import { daysOfWeek } from '@/data/seed';

export default function DoctorSchedule() {
  const { currentUser, doctors, updateDoctor } = useApp();
  const [saved, setSaved] = useState(false);

  const doctor = doctors.find((d) => d.name === `Dr. ${currentUser?.name}` || d.name === currentUser?.name);

  const [schedule, setSchedule] = useState<Record<string, { available: boolean; start: string; end: string }>>(
    daysOfWeek.reduce((acc, day) => {
      const isAvailable = doctor?.availableDays.includes(day) || false;
      acc[day] = {
        available: isAvailable,
        start: doctor?.startTime || '09:00',
        end: doctor?.endTime || '17:00',
      };
      return acc;
    }, {} as Record<string, { available: boolean; start: string; end: string }>)
  );

  const handleToggle = (day: string) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], available: !prev[day].available } }));
  };

  const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSave = () => {
    if (!doctor) return;
    const availableDays = daysOfWeek.filter((d) => schedule[d].available);
    const startTimes = availableDays.map((d) => schedule[d].start).sort();
    const endTimes = availableDays.map((d) => schedule[d].end).sort().reverse();
    updateDoctor(doctor.id, {
      availableDays,
      startTime: startTimes[0] || '09:00',
      endTime: endTimes[0] || '17:00',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!doctor) {
    return (
      <DashboardShell navItems={doctorNav} role="doctor">
        <div className="card p-12 text-center">
          <p className="text-gray-500">Schedule management is available for registered doctors.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={doctorNav} role="doctor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-4 w-4" />
            Save Schedule
          </button>
        </div>

        {saved && (
          <div className="rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-700 animate-fade-in flex items-center gap-2">
            <Check className="h-4 w-4" />
            Schedule updated successfully
          </div>
        )}

        <div className="card p-6">
          <p className="text-sm text-gray-600 mb-6">Set your weekly availability. Toggle a day off if you're not seeing patients.</p>
          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day} className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-4 transition-colors ${
                schedule[day].available ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between sm:w-32">
                  <span className="font-medium text-gray-900">{day}</span>
                  <button
                    onClick={() => handleToggle(day)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${schedule[day].available ? 'bg-primary-600' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${schedule[day].available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {schedule[day].available ? (
                  <div className="flex items-center gap-3 flex-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={schedule[day].start}
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                        className="input-field w-32"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={schedule[day].end}
                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                        className="input-field w-32"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-400 sm:flex-1">OFF</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
