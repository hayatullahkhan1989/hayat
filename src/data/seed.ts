import type {
  User,
  Doctor,
  Appointment,
  Prescription,
  MedicalRecord,
  MedicalReport,
  Notification,
  ContactMessage,
} from '@/types';

export const seedUsers: User[] = [
  {
    id: 'pat1',
    name: 'Aman',
    role: 'patient',
    email: 'aman.kumar@example.com',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    dob: '1995-04-12',
    address: 'Bandra West, Mumbai',
    active: true,
  },
  {
    id: 'pat2',
    name: 'Riya',
    role: 'patient',
    email: 'riya.sharma@example.com',
    phone: '+91 98765 43211',
    bloodGroup: 'A+',
    dob: '1998-08-25',
    address: 'Indiranagar, Bangalore',
    active: true,
  },
  {
    id: 'pat3',
    name: 'Karan',
    role: 'patient',
    email: 'karan.mehta@example.com',
    phone: '+91 98765 43212',
    bloodGroup: 'B+',
    dob: '1992-11-03',
    address: 'Connaught Place, Delhi',
    active: true,
  },
  {
    id: 'pat4',
    name: 'Sneha Verma',
    role: 'patient',
    email: 'sneha.verma@example.com',
    phone: '+91 98765 43213',
    bloodGroup: 'AB+',
    dob: '2000-01-18',
    address: 'Jubilee Hills, Hyderabad',
    active: true,
  },
  {
    id: 'usr-doc1',
    name: 'Dr. Rahul Sharma',
    role: 'doctor',
    email: 'dr.rahul@apollo.com',
    phone: '+91 98765 11111',
    active: true,
  },
  {
    id: 'usr-doc2',
    name: 'Dr. Priya Patel',
    role: 'doctor',
    email: 'dr.priya@fortis.com',
    phone: '+91 98765 22222',
    active: true,
  },
  {
    id: 'usr-doc3',
    name: 'Dr. Amit Kumar',
    role: 'doctor',
    email: 'dr.amit@smiledental.com',
    phone: '+91 98765 33333',
    active: true,
  },
  {
    id: 'usr-doc4',
    name: 'Dr. Sneha Reddy',
    role: 'doctor',
    email: 'dr.sneha@eyecare.com',
    phone: '+91 98765 44444',
    active: true,
  },
  {
    id: 'usr-doc5',
    name: 'Dr. Vikram Singh',
    role: 'doctor',
    email: 'dr.vikram@maxhealth.com',
    phone: '+91 98765 55555',
    active: true,
  },
  {
    id: 'usr-doc6',
    name: 'Dr. Anjali Gupta',
    role: 'doctor',
    email: 'dr.anjali@aiims.edu',
    phone: '+91 98765 66666',
    active: true,
  },
  {
    id: 'admin1',
    name: 'Admin Hayat',
    role: 'admin',
    email: 'admin@healthcareplus.com',
    phone: '+91 98765 99999',
    active: true,
  },
];

export const seedDoctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Rahul Sharma',
    specialization: 'Cardiology',
    experience: 12,
    qualification: 'MD, DM Cardiology',
    hospital: 'Apollo Heart Institute',
    fee: 1200,
    location: 'Mumbai',
    photo: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri'],
    startTime: '09:00',
    endTime: '17:00',
    bio: 'Dr. Rahul Sharma is a renowned cardiologist with over 12 years of experience in interventional cardiology and heart failure management.',
    active: true,
  },
  {
    id: 'doc2',
    name: 'Dr. Priya Patel',
    specialization: 'General Medicine',
    experience: 8,
    qualification: 'MD Internal Medicine',
    hospital: 'Fortis Hospital',
    fee: 800,
    location: 'Delhi',
    photo: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    startTime: '10:00',
    endTime: '18:00',
    bio: 'Dr. Priya Patel specializes in internal medicine with a focus on preventive care and chronic disease management.',
    active: true,
  },
  {
    id: 'doc3',
    name: 'Dr. Amit Kumar',
    specialization: 'Dentistry',
    experience: 10,
    qualification: 'BDS, MDS',
    hospital: 'Smile Dental Clinic',
    fee: 600,
    location: 'Bangalore',
    photo: 'https://images.pexels.com/photos/6234600/pexels-photo-6234600.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    startTime: '09:30',
    endTime: '19:00',
    bio: 'Dr. Amit Kumar is a skilled dental surgeon specializing in cosmetic dentistry and oral rehabilitation.',
    active: true,
  },
  {
    id: 'doc4',
    name: 'Dr. Sneha Reddy',
    specialization: 'Ophthalmology',
    experience: 7,
    qualification: 'MS Ophthalmology',
    hospital: 'Eye Care Center',
    fee: 900,
    location: 'Hyderabad',
    photo: 'https://images.pexels.com/photos/6537600/pexels-photo-6537600.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    startTime: '08:00',
    endTime: '16:00',
    bio: 'Dr. Sneha Reddy is an expert ophthalmologist with a special interest in retinal disorders and cataract surgery.',
    active: true,
  },
  {
    id: 'doc5',
    name: 'Dr. Vikram Singh',
    specialization: 'Cardiology',
    experience: 15,
    qualification: 'MD, DM Cardiology, FACC',
    hospital: 'Max Healthcare',
    fee: 1500,
    location: 'Delhi',
    photo: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Mon', 'Wed', 'Fri'],
    startTime: '11:00',
    endTime: '19:00',
    bio: 'Dr. Vikram Singh is a senior cardiologist known for his expertise in complex coronary interventions.',
    active: true,
  },
  {
    id: 'doc6',
    name: 'Dr. Anjali Gupta',
    specialization: 'General Medicine',
    experience: 6,
    qualification: 'MD Internal Medicine',
    hospital: 'AIIMS',
    fee: 700,
    location: 'Mumbai',
    photo: 'https://images.pexels.com/photos/8460374/pexels-photo-8460374.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableDays: ['Tue', 'Wed', 'Thu', 'Sat'],
    startTime: '09:00',
    endTime: '15:00',
    bio: 'Dr. Anjali Gupta focuses on holistic patient care and lifestyle medicine.',
    active: true,
  },
];

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const seedAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc1',
    doctorName: 'Dr. Rahul Sharma',
    date: dateOffset(2),
    time: '10:00',
    reason: 'Regular heart checkup',
    status: 'Confirmed',
    notes: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt2',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc2',
    doctorName: 'Dr. Priya Patel',
    date: dateOffset(5),
    time: '11:00',
    reason: 'Fever and body pain',
    status: 'Pending',
    notes: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt3',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc3',
    doctorName: 'Dr. Amit Kumar',
    date: dateOffset(-10),
    time: '15:00',
    reason: 'Tooth pain',
    status: 'Completed',
    notes: 'Root canal treatment recommended. Patient tolerated procedure well.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt4',
    patientId: 'pat2',
    patientName: 'Riya',
    doctorId: 'doc1',
    doctorName: 'Dr. Rahul Sharma',
    date: dateOffset(1),
    time: '12:00',
    reason: 'Chest pain consultation',
    status: 'Pending',
    notes: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt5',
    patientId: 'pat2',
    patientName: 'Riya',
    doctorId: 'doc4',
    doctorName: 'Dr. Sneha Reddy',
    date: dateOffset(-5),
    time: '09:00',
    reason: 'Blurry vision',
    status: 'Completed',
    notes: 'Prescribed corrective lenses. Follow-up in 6 months.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt6',
    patientId: 'pat3',
    patientName: 'Karan',
    doctorId: 'doc5',
    doctorName: 'Dr. Vikram Singh',
    date: dateOffset(3),
    time: '14:00',
    reason: 'High blood pressure follow-up',
    status: 'Confirmed',
    notes: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt7',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc1',
    doctorName: 'Dr. Rahul Sharma',
    date: dateOffset(-20),
    time: '10:00',
    reason: 'Annual cardiac evaluation',
    status: 'Completed',
    notes: 'ECG normal. Continue current medication.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt8',
    patientId: 'pat2',
    patientName: 'Riya',
    doctorId: 'doc2',
    doctorName: 'Dr. Priya Patel',
    date: dateOffset(-3),
    time: '10:00',
    reason: 'Diabetes management',
    status: 'Cancelled',
    notes: '',
    createdAt: new Date().toISOString(),
  },
];

export const seedPrescriptions: Prescription[] = [
  {
    id: 'pres1',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc3',
    doctorName: 'Dr. Amit Kumar',
    appointmentId: 'apt3',
    date: dateOffset(-10),
    medicines: [
      {
        name: 'Amoxicillin 500mg',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '7 days',
        instructions: 'Take after meals with water',
      },
      {
        name: 'Ibuprofen 400mg',
        dosage: '400mg',
        frequency: '2 times daily',
        duration: '5 days',
        instructions: 'Take with food, do not exceed 3 doses per day',
      },
    ],
  },
  {
    id: 'pres2',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc1',
    doctorName: 'Dr. Rahul Sharma',
    appointmentId: 'apt7',
    date: dateOffset(-20),
    medicines: [
      {
        name: 'Atorvastatin 10mg',
        dosage: '10mg',
        frequency: '1 time daily at night',
        duration: '30 days',
        instructions: 'Continue as prescribed, follow up in 1 month',
      },
    ],
  },
  {
    id: 'pres3',
    patientId: 'pat2',
    patientName: 'Riya',
    doctorId: 'doc4',
    doctorName: 'Dr. Sneha Reddy',
    appointmentId: 'apt5',
    date: dateOffset(-5),
    medicines: [
      {
        name: 'Lubricant Eye Drops',
        dosage: '2 drops',
        frequency: '4 times daily',
        duration: '15 days',
        instructions: 'Apply to both eyes, avoid touching the dropper tip',
      },
    ],
  },
];

export const seedMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec1',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc3',
    doctorName: 'Dr. Amit Kumar',
    date: dateOffset(-10),
    diagnosis: 'Pulpitis with periapical abscess',
    notes: 'Root canal treatment initiated. Patient prescribed antibiotics and painkillers. Next appointment scheduled for crown placement.',
  },
  {
    id: 'rec2',
    patientId: 'pat1',
    patientName: 'Aman',
    doctorId: 'doc1',
    doctorName: 'Dr. Rahul Sharma',
    date: dateOffset(-20),
    diagnosis: 'Mild hypertension, well-controlled',
    notes: 'Blood pressure 130/85. ECG normal. Continue Atorvastatin. Lifestyle counseling provided.',
  },
  {
    id: 'rec3',
    patientId: 'pat2',
    patientName: 'Riya',
    doctorId: 'doc4',
    doctorName: 'Dr. Sneha Reddy',
    date: dateOffset(-5),
    diagnosis: 'Refractive error (myopia)',
    notes: 'Visual acuity reduced. Prescribed corrective lenses. Follow-up recommended in 6 months.',
  },
];

export const seedMedicalReports: MedicalReport[] = [];

export const seedNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'pat1',
    message: 'Your appointment with Dr. Rahul Sharma is confirmed for ' + dateOffset(2) + ' at 10:00 AM',
    date: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n2',
    userId: 'pat1',
    message: 'Your appointment with Dr. Priya Patel is pending approval',
    date: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n3',
    userId: 'pat2',
    message: 'Your appointment with Dr. Rahul Sharma is pending approval',
    date: new Date().toISOString(),
    read: false,
  },
];

export const seedContactMessages: ContactMessage[] = [];

export const specializations = [
  'General Medicine',
  'Cardiology',
  'Dentistry',
  'Ophthalmology',
];

export const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'];

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  let [sh, sm] = start.split(':').map(Number);
  let [eh, em] = end.split(':').map(Number);
  let current = sh * 60 + sm;
  const endMins = eh * 60 + em;
  while (current < endMins) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    current += 30;
  }
  return slots;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}
