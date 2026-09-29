import { Pill, Clock, FileText } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { patientNav } from '@/navigation/patientNav';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/data/seed';

export default function PatientPrescriptions() {
  const { currentUser, prescriptions } = useApp();
  const myPrescriptions = prescriptions
    .filter((p) => p.patientId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardShell navItems={patientNav} role="patient">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>

        {myPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {myPrescriptions.map((pres) => (
              <div key={pres.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                      <Pill className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{pres.doctorName}</p>
                      <p className="text-sm text-gray-500">{formatDate(pres.date)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {pres.medicines.map((med, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{med.name}</p>
                          <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-600">
                            <span>Dosage: <strong>{med.dosage}</strong></span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {med.frequency}</span>
                            <span>Duration: <strong>{med.duration}</strong></span>
                          </div>
                        </div>
                      </div>
                      {med.instructions && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                          <FileText className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                          <span>{med.instructions}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Pill className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">No prescriptions yet</p>
            <p className="text-sm text-gray-400 mt-1">Your prescriptions will appear here after appointments</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
