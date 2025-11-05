'use client';

import { Patient } from './PatientModal';
import { Visit } from './VisitModal';

type PrintButtonProps = {
  patients: Patient[];
  visits: Visit[];
};

export default function PrintButton({ patients, visits }: PrintButtonProps) {
  function handlePrint() {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Records - ${new Date().toLocaleDateString()}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #2563eb; color: white; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .header { margin-bottom: 20px; }
          .date { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Patient Records Report</h1>
          <p class="date">Generated on: ${new Date().toLocaleString()}</p>
          <p><strong>Total Patients:</strong> ${patients.length} | <strong>Total Visits:</strong> ${visits.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>Contact</th>
              <th>Blood Type</th>
              <th>Total Visits</th>
            </tr>
          </thead>
          <tbody>
    `;

    patients.forEach(patient => {
      // FIXED: Changed patientId to patient_id
      const patientVisits = visits.filter(v => v.patient_id === patient.id);
      html += `
        <tr>
          <td>${patient.name}</td>
          <td>${patient.dob}</td>
          <td>${patient.contact}</td>
          <td>${patient.bloodType || 'N/A'}</td>
          <td>${patientVisits.length}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  return (
    <button
      onClick={handlePrint}
      className="bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg shadow transition flex items-center gap-2"
    >
      <span>🖨️</span>
      Print Records
    </button>
  );
}