import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ArrowRight, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Role } from '@/types';

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useApp();
  const [name, setName] = useState('');
  const role = (searchParams.get('role') || 'patient') as Role;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(role, name.trim());
    navigate(`/dashboard/${role}`);
  };

  const roleLabel: Record<Role, string> = {
    patient: 'Patient',
    doctor: 'Doctor',
    admin: 'Admin',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 shadow-lg mb-4">
            <Heart className="h-7 w-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to HealthCare+</h1>
          <p className="mt-2 text-sm text-gray-600">
            You're signing in as a <span className="font-semibold text-primary-600">{roleLabel[role]}</span>
          </p>
        </div>

        {/* Name form */}
        <div className="card p-8">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">What's your name?</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={!name.trim()}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
}
