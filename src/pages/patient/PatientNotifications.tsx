import { Bell, Check } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { patientNav } from '@/navigation/patientNav';
import { useApp } from '@/context/AppContext';

export default function PatientNotifications() {
  const { currentUser, notifications, markNotificationRead } = useApp();
  const myNotifications = notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardShell navItems={patientNav} role="patient">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

        {myNotifications.length > 0 ? (
          <div className="space-y-3">
            {myNotifications.map((n) => (
              <div
                key={n.id}
                className={`card p-4 flex items-start gap-4 ${!n.read ? 'border-primary-200 bg-primary-50/30' : ''}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                  n.read ? 'bg-gray-100 text-gray-400' : 'bg-primary-100 text-primary-600'
                }`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
