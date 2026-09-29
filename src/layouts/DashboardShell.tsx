import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, LogOut, Menu, X, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Role } from '@/types';

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

interface DashboardShellProps {
  navItems: NavItem[];
  children: ReactNode;
  role: Role;
}

const roleLabels: Record<Role, string> = {
  patient: 'Patient Portal',
  doctor: 'Doctor Portal',
  admin: 'Admin Panel',
};

export default function DashboardShell({ navItems, children, role }: DashboardShellProps) {
  const { currentUser, logout, notifications } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName =
    role === 'doctor' && currentUser?.name && !currentUser.name.startsWith('Dr.')
      ? `Dr. ${currentUser.name}`
      : currentUser?.name || 'User';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-white border-r border-gray-100 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-5 border-b border-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Heart className="h-4 w-4 text-white" fill="white" />
          </div>
          <span className="text-base font-bold text-gray-900">
            Health<span className="text-primary-600">Care+</span>
          </span>
        </div>
        <div className="px-3 py-4">
          <div className="mb-4 px-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {roleLabels[role]}
            </p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to ||
                (item.to !== `/dashboard/${role}` && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Welcome, {displayName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/dashboard/${role}/notifications`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {displayName}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
