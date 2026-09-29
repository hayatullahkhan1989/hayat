import { Heart, Target, Eye, Users, Award, Shield, TrendingUp, HandHeart } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Heart, title: 'Compassion', desc: 'We treat every patient with empathy and kindness.' },
    { icon: Shield, title: 'Integrity', desc: 'We uphold the highest ethical standards in healthcare.' },
    { icon: Award, title: 'Excellence', desc: 'We strive for quality in every aspect of our service.' },
    { icon: Users, title: 'Collaboration', desc: 'We work together for better patient outcomes.' },
  ];

  const stats = [
    { value: '50+', label: 'Specialist Doctors' },
    { value: '50K+', label: 'Patients Served' },
    { value: '10+', label: 'Years of Service' },
    { value: '4.9', label: 'Patient Rating' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-teal-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">About HealthCare+</h1>
          <p className="mt-2 text-primary-50">Dedicated to making quality healthcare accessible to all</p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 mb-4">
                <Target className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Transforming Healthcare Through Technology</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                HealthCare+ was founded with a simple goal: to bridge the gap between patients and quality healthcare. We believe everyone deserves access to excellent medical care, and our platform makes that possible.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                From booking appointments to managing medical records, we provide a seamless experience that puts patients first. Our network of experienced doctors and modern facilities ensures you receive the best care possible.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Healthcare team"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-primary-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700 mb-4">
            <Eye className="h-4 w-4" />
            Our Vision
          </div>
          <h2 className="text-3xl font-bold text-gray-900">A Healthier Tomorrow for Everyone</h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            We envision a world where healthcare is not a privilege but a right. Where technology empowers patients to take control of their health journey. Where doctors can focus on what matters most — caring for their patients.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-3 text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-4">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
