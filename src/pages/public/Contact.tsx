import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Contact() {
  const { addContactMessage } = useApp();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactMessage({
      ...form,
      date: new Date().toISOString(),
    });
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-teal-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Get in Touch</h1>
          <p className="mt-2 text-primary-50">We're here to help with any questions or concerns</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Visit Us</h3>
              <p className="mt-1 text-sm text-gray-600">123 Healthcare Ave<br />Mumbai, India 400001</p>
            </div>
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Call Us</h3>
              <p className="mt-1 text-sm text-gray-600">+91 98765 43210<br />Mon-Sat, 9AM-8PM</p>
            </div>
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Email Us</h3>
              <p className="mt-1 text-sm text-gray-600">support@healthcareplus.com<br />We reply within 24 hours</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Send Us a Message</h2>
              </div>
              {submitted && (
                <div className="mb-6 rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-700 animate-fade-in">
                  Thank you! Your message has been sent. We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
