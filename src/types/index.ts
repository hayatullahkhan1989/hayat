export type Role = 'patient' | 'doctor' | 'admin';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  bloodGroup?: string;
  active: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  qualification: string;
  hospital: string;
  fee: number;
  location: string;
  photo: string;
  availableDays: string[]; // e.g. ['Mon','Tue','Wed']
  startTime: string; // '09:00'
  endTime: string; // '17:00'
  bio: string;
  active: boolean;
}

export interface TimeSlot {
  time: string; // '09:00'
  label: string; // '9:00 AM'
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // ISO date string
  time: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  medicines: Medicine[];
  date: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  notes: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  fileName: string;
  fileType: string;
  fileData: string; // base64 data URL
  uploadDate: string;
  uploadedBy: string;
}

export interface Schedule {
  doctorId: string;
  // Map of day -> { start, end } or null for OFF
  [key: string]: string | null | { start: string; end: string };
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}
