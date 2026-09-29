import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  Role,
  User,
  Doctor,
  Appointment,
  Prescription,
  MedicalRecord,
  MedicalReport,
  Notification,
  ContactMessage,
} from '@/types';
import {
  seedDoctors,
  seedAppointments,
  seedPrescriptions,
  seedMedicalRecords,
  seedMedicalReports,
  seedNotifications,
  seedContactMessages,
} from '@/data/seed';

interface AppState {
  // session
  currentUser: User | null;
  login: (role: Role, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  // doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  removeDoctor: (id: string) => void;
  // appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  // prescriptions
  prescriptions: Prescription[];
  addPrescription: (pres: Omit<Prescription, 'id'>) => void;
  // medical records
  medicalRecords: MedicalRecord[];
  addMedicalRecord: (rec: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => void;
  // medical reports
  medicalReports: MedicalReport[];
  addMedicalReport: (rep: Omit<MedicalReport, 'id'>) => void;
  removeMedicalReport: (id: string) => void;
  // notifications
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  // contact messages
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id'>) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = 'healthcare-plus-data';

interface StoredData {
  currentUser: User | null;
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  medicalReports: MedicalReport[];
  notifications: Notification[];
  contactMessages: ContactMessage[];
}

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredData;
      return {
        currentUser: parsed.currentUser || null,
        doctors: parsed.doctors?.length ? parsed.doctors : seedDoctors,
        appointments: parsed.appointments || seedAppointments,
        prescriptions: parsed.prescriptions || seedPrescriptions,
        medicalRecords: parsed.medicalRecords || seedMedicalRecords,
        medicalReports: parsed.medicalReports || seedMedicalReports,
        notifications: parsed.notifications || seedNotifications,
        contactMessages: parsed.contactMessages || seedContactMessages,
      };
    }
  } catch {
    // fall through to defaults
  }
  return {
    currentUser: null,
    doctors: seedDoctors,
    appointments: seedAppointments,
    prescriptions: seedPrescriptions,
    medicalRecords: seedMedicalRecords,
    medicalReports: seedMedicalReports,
    notifications: seedNotifications,
    contactMessages: seedContactMessages,
  };
}

function genId(prefix: string): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const login = (role: Role, name: string) => {
    const user: User = {
      id: genId('usr'),
      name,
      role,
      active: true,
    };
    setData((prev) => ({ ...prev, currentUser: user }));
  };

  const logout = () => {
    setData((prev) => ({ ...prev, currentUser: null }));
  };

  const updateProfile = (updates: Partial<User>) => {
    setData((prev) => ({
      ...prev,
      currentUser: prev.currentUser ? { ...prev.currentUser, ...updates } : null,
    }));
  };

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    setData((prev) => ({
      ...prev,
      doctors: [...prev.doctors, { ...doctor, id: genId('doc') }],
    }));
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setData((prev) => ({
      ...prev,
      doctors: prev.doctors.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const removeDoctor = (id: string) => {
    setData((prev) => ({
      ...prev,
      doctors: prev.doctors.filter((d) => d.id !== id),
    }));
  };

  const addAppointment = (apt: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newApt: Appointment = {
      ...apt,
      id: genId('apt'),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, appointments: [...prev.appointments, newApt] }));
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const addPrescription = (pres: Omit<Prescription, 'id'>) => {
    setData((prev) => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { ...pres, id: genId('pres') }],
    }));
  };

  const addMedicalRecord = (rec: Omit<MedicalRecord, 'id'>) => {
    setData((prev) => ({
      ...prev,
      medicalRecords: [...prev.medicalRecords, { ...rec, id: genId('rec') }],
    }));
  };

  const updateMedicalRecord = (id: string, updates: Partial<MedicalRecord>) => {
    setData((prev) => ({
      ...prev,
      medicalRecords: prev.medicalRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  };

  const addMedicalReport = (rep: Omit<MedicalReport, 'id'>) => {
    setData((prev) => ({
      ...prev,
      medicalReports: [...prev.medicalReports, { ...rep, id: genId('rep') }],
    }));
  };

  const removeMedicalReport = (id: string) => {
    setData((prev) => ({
      ...prev,
      medicalReports: prev.medicalReports.filter((r) => r.id !== id),
    }));
  };

  const addNotification = (notif: Omit<Notification, 'id'>) => {
    setData((prev) => ({
      ...prev,
      notifications: [...prev.notifications, { ...notif, id: genId('n') }],
    }));
  };

  const markNotificationRead = (id: string) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const addContactMessage = (msg: Omit<ContactMessage, 'id'>) => {
    setData((prev) => ({
      ...prev,
      contactMessages: [...prev.contactMessages, { ...msg, id: genId('msg') }],
    }));
  };

  const value: AppState = {
    currentUser: data.currentUser,
    login,
    logout,
    updateProfile,
    doctors: data.doctors,
    addDoctor,
    updateDoctor,
    removeDoctor,
    appointments: data.appointments,
    addAppointment,
    updateAppointment,
    prescriptions: data.prescriptions,
    addPrescription,
    medicalRecords: data.medicalRecords,
    addMedicalRecord,
    updateMedicalRecord,
    medicalReports: data.medicalReports,
    addMedicalReport,
    removeMedicalReport,
    notifications: data.notifications,
    addNotification,
    markNotificationRead,
    contactMessages: data.contactMessages,
    addContactMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
