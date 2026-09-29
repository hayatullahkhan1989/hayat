import { Home, Calendar, Users, ClipboardList, FileText, MessageSquare, User, Clock } from 'lucide-react';
import type { NavItem } from '@/layouts/DashboardShell';

export const doctorNav: NavItem[] = [
  { to: '/dashboard/doctor', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  { to: '/dashboard/doctor/appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
  { to: '/dashboard/doctor/schedule', label: 'Schedule', icon: <Clock className="h-5 w-5" /> },
  { to: '/dashboard/doctor/patients', label: 'Patients', icon: <Users className="h-5 w-5" /> },
  { to: '/dashboard/doctor/records', label: 'Medical Records', icon: <ClipboardList className="h-5 w-5" /> },
  { to: '/dashboard/doctor/messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
  { to: '/dashboard/doctor/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
];
