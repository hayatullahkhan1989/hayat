import { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Mail,
  Phone,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  Save,
  Droplet,
} from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { adminNav } from '@/navigation/adminNav';
import { useApp } from '@/context/AppContext';
import type { User, Role } from '@/types';

export default function AdminUsers() {
  const { users, addUser, updateUser, removeUser, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const initialFormState: Omit<User, 'id'> = {
    name: '',
    role: 'patient',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    dob: '1995-01-01',
    address: '',
    active: true,
  };

  const [formData, setFormData] = useState<Omit<User, 'id'>>(initialFormState);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search)) ||
      (u.bloodGroup && u.bloodGroup.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && u.active) ||
      (statusFilter === 'inactive' && !u.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(initialFormState);
    setModalMode('create');
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      role: u.role,
      email: u.email || '',
      phone: u.phone || '',
      bloodGroup: u.bloodGroup || 'O+',
      dob: u.dob || '',
      address: u.address || '',
      active: u.active,
    });
    setModalMode('edit');
  };

  const handleToggleActive = (u: User) => {
    if (u.id === currentUser?.id) {
      alert("You cannot deactivate your own logged-in admin account.");
      return;
    }
    updateUser(u.id, { active: !u.active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (modalMode === 'create') {
      addUser({
        name: formData.name.trim(),
        role: formData.role,
        email: formData.email?.trim() || `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
        phone: formData.phone?.trim() || '+91 98765 00000',
        bloodGroup: formData.bloodGroup,
        dob: formData.dob,
        address: formData.address,
        active: formData.active,
      });
    } else if (modalMode === 'edit' && editingUser) {
      updateUser(editingUser.id, {
        name: formData.name.trim(),
        role: formData.role,
        email: formData.email?.trim(),
        phone: formData.phone?.trim(),
        bloodGroup: formData.bloodGroup,
        dob: formData.dob,
        address: formData.address,
        active: formData.active,
      });
    }

    setModalMode(null);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own logged-in admin account.");
      return;
    }
    removeUser(id);
    setDeleteConfirmId(null);
  };

  const patientCount = users.filter((u) => u.role === 'patient').length;
  const doctorCount = users.filter((u) => u.role === 'doctor').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <DashboardShell navItems={adminNav} role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage System Users</h1>
            <p className="text-sm text-gray-500">
              User accounts, access permissions, profile details, and account status
            </p>
          </div>
          <button onClick={openCreateModal} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Add New User
          </button>
        </div>

        {/* User Role Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => setRoleFilter('all')}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${
              roleFilter === 'all'
                ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
          </div>
          <div
            onClick={() => setRoleFilter('patient')}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${
              roleFilter === 'patient'
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-blue-600 font-medium">Patients</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{patientCount}</p>
          </div>
          <div
            onClick={() => setRoleFilter('doctor')}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${
              roleFilter === 'doctor'
                ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-teal-600 font-medium">Doctors</p>
            <p className="text-2xl font-bold text-teal-700 mt-1">{doctorCount}</p>
          </div>
          <div
            onClick={() => setRoleFilter('admin')}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${
              roleFilter === 'admin'
                ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-100'
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-purple-600 font-medium">Admins</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{adminCount}</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search user name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field text-xs"
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients Only</option>
              <option value="doctor">Doctors Only</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive / Suspended Only</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">System Role</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Medical Info</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'doctor'
                              ? 'bg-teal-100 text-teal-700'
                              : 'bg-primary-100 text-primary-700'
                          }`}
                        >
                          {u.name.replace(/^Dr\.\s*/, '').charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{u.name}</p>
                          <p className="text-[11px] text-gray-400">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'doctor'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role === 'admin' && <Shield className="h-3 w-3" />}
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-600">
                      {u.email && (
                        <p className="flex items-center gap-1.5 truncate max-w-xs">
                          <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{u.email}</span>
                        </p>
                      )}
                      {u.phone && (
                        <p className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{u.phone}</span>
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-600">
                      {u.bloodGroup ? (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[11px] font-medium">
                          <Droplet className="h-3 w-3" /> {u.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                      {u.dob && <p className="text-[11px] text-gray-400 mt-1">DOB: {u.dob}</p>}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`badge text-[10px] cursor-pointer ${
                          u.active ? 'badge-confirmed hover:bg-teal-200' : 'badge-cancelled hover:bg-red-200'
                        }`}
                        title="Click to toggle user status"
                      >
                        {u.active ? 'Active' : 'Suspended'}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 text-xs">
                      No users found matching current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {modalMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalMode(null)}
        >
          <div
            className="card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-600" />
                {modalMode === 'create' ? 'Create New User Account' : 'Edit User Profile'}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">User Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="input-field"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="input-field"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Address</label>
                <textarea
                  rows={2}
                  placeholder="Street, City, Postal Code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field resize-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeUser"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label htmlFor="activeUser" className="text-xs font-medium text-gray-700">
                  Account is active (Uncheck to suspend access)
                </label>
              </div>

              <div className="mt-5 flex gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalMode(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save className="h-4 w-4" />
                  {modalMode === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div className="card max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900">Delete User Account?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              This action will permanently delete this user from the system directory.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary flex-1 text-xs">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="btn-danger flex-1 text-xs">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
