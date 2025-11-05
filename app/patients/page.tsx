'use client';

import { useState, useEffect } from 'react';
import Topnav from '@/app/components/Topnav';
import PatientModal from '@/app/components/PatientModal';
import VisitModal from '@/app/components/VisitModal';
import Toast from '@/app/components/Toast';


export type Patient = {
  id: string;
  name: string;
  dob: string;
  contact: string;
  bloodType: string;
  address: string;
};

export type Visit = {
  id: string;
  patient_id: string;
  date: string;
  diagnosis: string;
  medication: string;
  notes: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientForVisit, setSelectedPatientForVisit] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    setToast({ message, type });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const patientsResponse = await fetch('/api/patients');
        const patientsData = await patientsResponse.json();
        setPatients(Array.isArray(patientsData) ? patientsData : []);

        const visitsResponse = await fetch('/api/visits');
        const visitsData = await visitsResponse.json();
        setVisits(Array.isArray(visitsData) ? visitsData : []);
      } catch {
        showToast('Failed to load data', 'error');
        setPatients([]);
        setVisits([]);
      }
    }
    fetchData();
  }, [refreshToggle]);

  async function handleAddPatient(patient: Patient) {
    try {
      const method = selectedPatient ? 'PUT' : 'POST';
      const url = selectedPatient ? `/api/patients/${patient.id}` : '/api/patients';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      if (res.ok) {
        showToast(`Patient ${selectedPatient ? 'updated' : 'added'} successfully!`, 'success');
        setRefreshToggle(prev => !prev);
        setSelectedPatient(null);
      } else {
        showToast(`Failed to ${selectedPatient ? 'update' : 'add'} patient.`, 'error');
      }
    } catch {
      showToast('Network error occurred', 'error');
    }
  }

  async function handleDeletePatient(id: string) {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Patient deleted successfully!', 'info');
        setRefreshToggle(prev => !prev);
      } else {
        showToast('Failed to delete patient.', 'error');
      }
    } catch {
      showToast('Network error occurred', 'error');
    }
  }

  async function handleAddVisit(visit: Visit) {
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visit),
      });

      if (res.ok) {
        showToast('Medical visit recorded!', 'success');
        setRefreshToggle(prev => !prev);
      } else {
        showToast('Failed to record visit', 'error');
      }
    } catch {
      showToast('Network error occurred', 'error');
    }
  }

  function handleEditPatient(patient: Patient) {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  }

  function openVisitModal(patientId: string) {
    setSelectedPatientForVisit(patientId);
    setIsVisitModalOpen(true);
  }

  const filteredPatients = patients.filter(
    p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.contact.includes(searchTerm)
  );

  return (
    <>
      <Topnav />
      <section className="pt-24 pb-12 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Patient Records</h2>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setIsPatientModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition"
              >
                + Add Patient
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by name or contact..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {patients.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No patients found. Add your first patient to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPatients.map(patient => (
                <div key={patient.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{patient.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div>📞 {patient.contact}</div>
                      {patient.bloodType && <div>🩸 {patient.bloodType}</div>}
                      {patient.address && <div>📍 {patient.address}</div>}
                      <div>📅 DOB: {patient.dob}</div>
                    </div>
                  </div>

                  {/* Medical History Section */}
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Medical History</h4>
                    {visits.filter(v => v.patient_id === patient.id).length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No visits recorded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {visits
                          .filter(v => v.patient_id === patient.id)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 3)
                          .map(visit => (
                            <div key={visit.id} className="bg-white dark:bg-gray-600 p-3 rounded border-l-4 border-blue-500">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 dark:text-white">{visit.diagnosis}</p>
                                  {visit.medication && <p className="text-sm text-gray-600 dark:text-gray-300">💊 {visit.medication}</p>}
                                  {visit.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{visit.notes}</p>}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">{visit.date}</span>
                              </div>
                            </div>
                          ))}
                        {visits.filter(v => v.patient_id === patient.id).length > 3 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                            +{visits.filter(v => v.patient_id === patient.id).length - 3} more visit(s)
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => openVisitModal(patient.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      + Visit
                    </button>
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setSelectedPatient(null);
        }}
        onSave={handleAddPatient}
        patient={selectedPatient}
      />

      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        onSave={handleAddVisit}
        patientId={selectedPatientForVisit}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}