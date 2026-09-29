import { Calendar, ClipboardList, Pill, FileText, User, Bell, Home } from 'lucide-react';
import type { NavItem } from '@/layouts/DashboardShell';

export const patientNav: NavItem[] = [
  { to: '/dashboard/patient', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  { to: '/dashboard/patient/appointments', label: 'My Appointments', icon: <Calendar className="h-5 w-5" /> },
  { to: '/dashboard/patient/history', label: 'Medical History', icon: <ClipboardList className="h-5 w-5" /> },
  { to: '/dashboard/patient/prescriptions', label: 'Prescriptions', icon: <Pill className="h-5 w-5" /> },
  { to: '/dashboard/patient/reports', label: 'Medical Reports', icon: <FileText className="h-5 w-5" /> },
  { to: '/dashboard/patient/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  { to: '/dashboard/patient/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
];
