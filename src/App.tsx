import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/public/Home';
import Doctors from '@/pages/public/Doctors';
import Services from '@/pages/public/Services';
import About from '@/pages/public/About';
import Contact from '@/pages/public/Contact';
import Login from '@/pages/Login';
import Welcome from '@/pages/Welcome';
import PatientDashboard from '@/pages/patient/PatientDashboard';
import PatientAppointments from '@/pages/patient/PatientAppointments';
import PatientMedicalHistory from '@/pages/patient/PatientMedicalHistory';
import PatientPrescriptions from '@/pages/patient/PatientPrescriptions';
import PatientReports from '@/pages/patient/PatientReports';
import PatientProfile from '@/pages/patient/PatientProfile';
import PatientNotifications from '@/pages/patient/PatientNotifications';
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import DoctorSchedule from '@/pages/doctor/DoctorSchedule';
import DoctorAppointments from '@/pages/doctor/DoctorAppointments';
import DoctorPatients from '@/pages/doctor/DoctorPatients';
import DoctorRecords from '@/pages/doctor/DoctorRecords';
import DoctorMessages from '@/pages/doctor/DoctorMessages';
import DoctorProfile from '@/pages/doctor/DoctorProfile';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminDoctors from '@/pages/admin/AdminDoctors';
import AdminAppointments from '@/pages/admin/AdminAppointments';
import AdminUsers from '@/pages/admin/AdminUsers';
import Booking from '@/pages/Booking';

function ProtectedRoute({ role, children }: { role: string; children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== role) return <Navigate to={`/dashboard/${currentUser.role}`} replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />

      {/* Booking */}
      <Route path="/book" element={<Booking />} />

      {/* Patient routes */}
      <Route path="/dashboard/patient" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/patient/appointments" element={<ProtectedRoute role="patient"><PatientAppointments /></ProtectedRoute>} />
      <Route path="/dashboard/patient/history" element={<ProtectedRoute role="patient"><PatientMedicalHistory /></ProtectedRoute>} />
      <Route path="/dashboard/patient/prescriptions" element={<ProtectedRoute role="patient"><PatientPrescriptions /></ProtectedRoute>} />
      <Route path="/dashboard/patient/reports" element={<ProtectedRoute role="patient"><PatientReports /></ProtectedRoute>} />
      <Route path="/dashboard/patient/profile" element={<ProtectedRoute role="patient"><PatientProfile /></ProtectedRoute>} />
      <Route path="/dashboard/patient/notifications" element={<ProtectedRoute role="patient"><PatientNotifications /></ProtectedRoute>} />

      {/* Doctor routes */}
      <Route path="/dashboard/doctor" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/doctor/schedule" element={<ProtectedRoute role="doctor"><DoctorSchedule /></ProtectedRoute>} />
      <Route path="/dashboard/doctor/appointments" element={<ProtectedRoute role="doctor"><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/dashboard/doctor/patients" element={<ProtectedRoute role="doctor"><DoctorPatients /></ProtectedRoute>} />
      <Route path="/dashboard/doctor/records" element={<ProtectedRoute role="doctor"><DoctorRecords /></ProtectedRoute>} />
      <Route path="/dashboard/doctor/messages" element={<ProtectedRoute role="doctor"><DoctorMessages /></ProtectedRoute>} />
      <Route path="/dashboard/doctor/profile" element={<ProtectedRoute role="doctor"><DoctorProfile /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/dashboard/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/admin/doctors" element={<ProtectedRoute role="admin"><AdminDoctors /></ProtectedRoute>} />
      <Route path="/dashboard/admin/appointments" element={<ProtectedRoute role="admin"><AdminAppointments /></ProtectedRoute>} />
      <Route path="/dashboard/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
