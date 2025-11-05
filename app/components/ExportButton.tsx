'use client';

import { Patient } from './PatientModal';
import { Visit } from './VisitModal';

type ExportButtonProps = {
  patients: Patient[];
  visits: Visit[];
};

export default function ExportButton({ patients, visits }: ExportButtonProps) {
  function exportToCSV() {
    // Create CSV header
    let csv = 'Name,Date of Birth,Contact,Blood Type,Address,Total Visits,Last Visit\n';

    // Add patient data
    patients.forEach(patient => {
      // CHANGE: patientId → patient_id
      const patientVisits = visits.filter(v => v.patient_id === patient.id);
      const lastVisit = patientVisits.length > 0 
        ? patientVisits[patientVisits.length - 1].date 
        : 'None';
      
      csv += `"${patient.name}","${patient.dob}","${patient.contact}","${patient.bloodType || 'N/A'}","${patient.address || 'N/A'}",${patientVisits.length},"${lastVisit}"\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-records-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={exportToCSV}
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow transition flex items-center gap-2"
    >
      <span>📥</span>
      Export to CSV
    </button>
  );
}
