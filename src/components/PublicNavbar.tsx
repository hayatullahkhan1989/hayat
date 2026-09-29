import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
              <Heart className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Health<span className="text-primary-600">Care+</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Login
            </button>
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-100 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); navigate('/login'); }}
              className="btn-primary mt-2 w-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
