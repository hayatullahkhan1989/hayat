import { Stethoscope, Heart, Smile, Eye, Shield, Clock, Users, Award, ArrowRight, Pill, Microscope, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    { icon: Stethoscope, title: 'General Medicine', desc: 'Routine check-ups, preventive care, and treatment for common illnesses.', color: 'bg-primary-100 text-primary-600' },
    { icon: Heart, title: 'Cardiology', desc: 'Diagnosis and treatment of heart conditions, ECG, and cardiac consultations.', color: 'bg-red-100 text-red-600' },
    { icon: Smile, title: 'Dentistry', desc: 'Complete dental care including cleaning, fillings, root canals, and cosmetic dentistry.', color: 'bg-teal-100 text-teal-600' },
    { icon: Eye, title: 'Ophthalmology', desc: 'Eye examinations, vision correction, cataract surgery, and retinal care.', color: 'bg-accent-100 text-accent-600' },
    { icon: Pill, title: 'Pharmacy', desc: 'Online prescription management and medicine delivery to your doorstep.', color: 'bg-purple-100 text-purple-600' },
    { icon: Microscope, title: 'Lab Tests', desc: 'Book lab tests and diagnostics with home sample collection available.', color: 'bg-blue-100 text-blue-600' },
    { icon: Brain, title: 'Mental Health', desc: 'Confidential counseling and therapy sessions with certified professionals.', color: 'bg-indigo-100 text-indigo-600' },
    { icon: Shield, title: 'Health Insurance', desc: 'Guidance on health insurance plans and seamless claim assistance.', color: 'bg-green-100 text-green-600' },
  ];

  const features = [
    { icon: Clock, title: '24/7 Access', desc: 'Book appointments anytime' },
    { icon: Users, title: 'Expert Team', desc: 'Qualified specialists' },
    { icon: Award, title: 'Certified', desc: 'ISO 9001 standards' },
    { icon: Shield, title: 'Secure', desc: 'Data protection guaranteed' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-teal-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Our Services</h1>
          <p className="mt-2 text-primary-50">Comprehensive healthcare services for every need</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="card p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.color} mb-4`}>
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 card p-8 lg:p-12 bg-gradient-to-br from-primary-50 to-teal-50">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Why Choose Our Services?</h2>
              <p className="mt-3 text-gray-600">We provide patient-centered care with a focus on quality, convenience, and compassion. Our integrated platform connects you with specialists, manages your records, and ensures continuity of care.</p>
              <Link to="/login" className="btn-primary mt-6">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 mb-3">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
