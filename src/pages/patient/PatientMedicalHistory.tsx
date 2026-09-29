import { Activity, ClipboardList } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { patientNav } from '@/navigation/patientNav';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/data/seed';

export default function PatientMedicalHistory() {
  const { currentUser, medicalRecords } = useApp();
  const myRecords = medicalRecords
    .filter((r) => r.patientId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardShell navItems={patientNav} role="patient">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>

        {myRecords.length > 0 ? (
          <div className="space-y-4">
            {myRecords.map((rec) => (
              <div key={rec.id} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 shrink-0">
                    <Activity className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{rec.diagnosis}</h3>
                      <span className="text-sm text-gray-500">{formatDate(rec.date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-primary-600">{rec.doctorName}</p>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{rec.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">No medical history records yet</p>
            <p className="text-sm text-gray-400 mt-1">Your records will appear here after your appointments</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
