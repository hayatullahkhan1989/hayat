import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Eye, Smile, Shield, Clock, Users, Award, ArrowRight, Activity, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { doctors } = useApp();
  const featured = doctors.slice(0, 3);

  const services = [
    { icon: Stethoscope, title: 'General Medicine', desc: 'Comprehensive primary care for all ages', color: 'bg-primary-100 text-primary-600' },
    { icon: Heart, title: 'Cardiology', desc: 'Expert heart and cardiovascular care', color: 'bg-red-100 text-red-600' },
    { icon: Smile, title: 'Dentistry', desc: 'Complete dental and oral health services', color: 'bg-teal-100 text-teal-600' },
    { icon: Eye, title: 'Ophthalmology', desc: 'Eye care and vision correction', color: 'bg-accent-100 text-accent-600' },
  ];

  const features = [
    { icon: Shield, title: 'Trusted & Secure', desc: 'Your health data is protected with industry-standard security' },
    { icon: Clock, title: '24/7 Availability', desc: 'Book appointments anytime, anywhere at your convenience' },
    { icon: Users, title: 'Expert Doctors', desc: 'Connect with qualified and experienced specialists' },
    { icon: Award, title: 'Quality Care', desc: 'Healthcare services that meet the highest standards' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-teal-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-teal-200 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 mb-6">
                <Activity className="h-4 w-4" />
                <span>Trusted by 50,000+ patients</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health, <br />
                <span className="text-primary-600">Our Priority</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                Book appointments with top specialists, manage your medical records, and access quality healthcare — all from one seamless platform.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary text-base px-7 py-3"
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </button>
                <Link to="/doctors" className="btn-secondary text-base px-7 py-3">
                  Find Doctors
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              <div className="mt-10 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-gray-900">50+</p>
                  <p className="text-sm text-gray-500">Specialist Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-500">Happy Patients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">4.9</p>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Healthcare"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 card p-4 flex items-center gap-3 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Certified Care</p>
                  <p className="text-xs text-gray-500">ISO 9001 Standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Specialists</h2>
            <p className="mt-3 text-gray-600">Experienced doctors dedicated to your well-being</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((doc) => (
              <div key={doc.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <img src={doc.photo} alt={doc.name} className="h-16 w-16 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-primary-600">{doc.specialization}</p>
                    <p className="text-xs text-gray-500">{doc.experience} years exp.</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{doc.bio}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">₹{doc.fee}</span>
                  <Link to="/doctors" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    View Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/doctors" className="btn-secondary">
              View All Doctors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-3 text-gray-600">Comprehensive healthcare services under one roof</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="card p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${s.color} mb-4`}>
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose HealthCare+?</h2>
            <p className="mt-3 text-gray-600">We put patients first in everything we do</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-4">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-teal-600">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Take Control of Your Health?</h2>
          <p className="mt-4 text-primary-50 text-lg">Join thousands of patients who trust HealthCare+ for their medical needs.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-base font-semibold text-primary-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Get Started Today
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
