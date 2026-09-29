import { Home, Users, Calendar, Stethoscope } from 'lucide-react';
import type { NavItem } from '@/layouts/DashboardShell';

export const adminNav: NavItem[] = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  { to: '/dashboard/admin/doctors', label: 'Manage Doctors', icon: <Stethoscope className="h-5 w-5" /> },
  { to: '/dashboard/admin/appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
  { to: '/dashboard/admin/users', label: 'Manage Users', icon: <Users className="h-5 w-5" /> },
];
