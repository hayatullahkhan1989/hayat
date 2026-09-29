import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Heart, User, Stethoscope, Shield, ArrowRight } from 'lucide-react';
import type { Role } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const roles: { role: Role; label: string; desc: string; icon: typeof User; color: string }[] = [
    { role: 'patient', label: 'Continue as Patient', desc: 'Book appointments and manage your health records', icon: User, color: 'from-primary-500 to-primary-700' },
    { role: 'doctor', label: 'Continue as Doctor', desc: 'Manage appointments, patients, and prescriptions', icon: Stethoscope, color: 'from-teal-500 to-teal-700' },
    { role: 'admin', label: 'Continue as Admin', desc: 'Oversee the entire healthcare system', icon: Shield, color: 'from-gray-600 to-gray-800' },
  ];

  const handleSelect = (role: Role) => {
    setSelectedRole(role);
    setTimeout(() => navigate(`/welcome?role=${role}`), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 shadow-lg mb-4">
            <Heart className="h-7 w-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health<span className="text-primary-600">Care+</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">Choose how you'd like to continue</p>
        </div>

        {/* Role buttons */}
        <div className="space-y-3">
          {roles.map(({ role, label, desc, icon: Icon, color }) => (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              className={`group w-full card p-5 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                selectedRole === role ? 'ring-2 ring-primary-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          No password needed. Just pick a role to get started instantly.
        </p>
      </div>
    </div>
  );
}
