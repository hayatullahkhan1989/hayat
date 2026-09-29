import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <span className="text-lg font-bold text-white">
                Health<span className="text-primary-400">Care+</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner in healthcare. Book appointments, manage records, and connect with top doctors — all in one place.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/doctors" className="hover:text-primary-400 transition-colors">Find Doctors</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>General Medicine</li>
              <li>Cardiology</li>
              <li>Dentistry</li>
              <li>Ophthalmology</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-400 shrink-0" />
                <span>123 Healthcare Ave, Mumbai, India 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                <span>support@healthcareplus.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HealthCare+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
