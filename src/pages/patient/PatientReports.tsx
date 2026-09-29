import { useRef, useState } from 'react';
import { FileText, Upload, Trash2, Download, File } from 'lucide-react';
import DashboardShell from '@/layouts/DashboardShell';
import { patientNav } from '@/navigation/patientNav';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/data/seed';

export default function PatientReports() {
  const { currentUser, medicalReports, addMedicalReport, removeMedicalReport } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const myReports = medicalReports
    .filter((r) => r.patientId === currentUser?.id)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !currentUser) return;
    setUploading(true);
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        addMedicalReport({
          patientId: currentUser.id,
          patientName: currentUser.name,
          fileName: file.name,
          fileType: file.type,
          fileData: reader.result as string,
          uploadDate: new Date().toISOString(),
          uploadedBy: currentUser.name,
        });
      };
      reader.readAsDataURL(file);
    });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (report: typeof myReports[0]) => {
    const link = document.createElement('a');
    link.href = report.fileData;
    link.download = report.fileName;
    link.click();
  };

  return (
    <DashboardShell navItems={patientNav} role="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary" disabled={uploading}>
            <Upload className="h-4 w-4" />
            Upload Report
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Upload zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="card p-8 border-2 border-dashed border-gray-200 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all"
        >
          <Upload className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-700">Click to upload medical reports</p>
          <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 10MB each</p>
        </div>

        {/* Reports list */}
        {myReports.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myReports.map((rep) => (
              <div key={rep.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                    {rep.fileType.includes('image') ? (
                      <img src={rep.fileData} alt={rep.fileName} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <File className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{rep.fileName}</p>
                    <p className="text-xs text-gray-500">{formatDate(rep.uploadDate.split('T')[0])}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleDownload(rep)} className="btn-ghost flex-1 text-sm">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() => removeMedicalReport(rep.id)}
                    className="flex items-center justify-center rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">No reports uploaded yet</p>
            <p className="text-sm text-gray-400 mt-1">Upload blood tests, X-rays, and other medical documents</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
