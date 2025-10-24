'use client';

import { useState, useEffect } from 'react';
import Topnav from '../components/Topnav';
import PatientModal, { Patient } from '../components/PatientModal';
import VisitModal, { Visit } from '../components/VisitModal';
import Toast from '../components/Toast';
import ExportButton from '../components/ExportButton';
import PrintButton from '../components/PrintButton';
import SortDropdown from '../components/SortDropdown';

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientForVisit, setSelectedPatientForVisit] = useState<string>('');
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
  async function fetchData() {
    try {
      const patientsResponse = await fetch('/api/patients');
      const patientsData = await patientsResponse.json();
      setPatients(patientsData);

      const visitsResponse = await fetch('/api/visits');
      const visitsData = await visitsResponse.json();
      console.log('Fetched visits data:', visitsData);  // ← ADD THIS LINE
      setVisits(visitsData);
    } catch {
      showToast('Failed to load data', 'error');
    }
  }
  fetchData();
}, [refreshToggle]);

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    setToast({ message, type });
  }

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
        const errorData = await res.json();
        console.error('API Error:', errorData);
        showToast(`Failed to ${selectedPatient ? 'update' : 'add'} patient.`, 'error');
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      showToast('Network error occurred', 'error');
    }
  }

  async function handleDeletePatient(id: string) {
    if (!confirm('Are you sure you want to delete this patient? This will also delete all their medical records.')) return;

    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });

      if (res.ok) {
        showToast('Patient deleted successfully!', 'info');
        setRefreshToggle(prev => !prev);
      } else {
        const errorData = await res.json();
        console.error('Delete Error:', errorData);
        showToast('Failed to delete patient.', 'error');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
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
      setRefreshToggle(prev => !prev);  // ← THIS LINE MUST BE HERE
      console.log('Visit added, refresh triggered'); // ← ADD THIS LINE FOR DEBUG
    } else {
      const errorData = await res.json();
      console.error('Visit Error:', errorData);
      showToast('Failed to record visit', 'error');
    }
  } catch (error) {
    console.error('Error adding visit:', error);
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

  const filteredAndSortedPatients = patients
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.contact.includes(searchTerm))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.dob).getTime() - new Date(b.dob).getTime();
        case 'date-desc':
          return new Date(b.dob).getTime() - new Date(a.dob).getTime();
        default:
          return 0;
      }
    });

  return (
    <>
      <Topnav />
      <section className="pt-24 pb-12 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Patient Records</h2>
              <div className="flex gap-3">
                <ExportButton patients={patients} visits={visits} />
                <PrintButton patients={patients} visits={visits} />
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setIsPatientModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition whitespace-nowrap"
                >
                  + Add Patient
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name or contact..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <SortDropdown onSortChange={setSortBy} currentSort={sortBy} />
            </div>
          </div>
          {filteredAndSortedPatients.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm ? 'No patients match your search.' : 'No patients found. Add your first patient to get started!'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Showing {filteredAndSortedPatients.length} of {patients.length} patients
              </p>
              <div className="grid gap-4">
                {filteredAndSortedPatients.map(patient => (
                  <div
                    key={patient.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{patient.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div>📅 DOB: {patient.dob}</div>
                            <div>📞 {patient.contact}</div>
                            {patient.bloodType && <div>🩸 {patient.bloodType}</div>}
                          </div>
                          {patient.address && (
                            <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">📍 {patient.address}</div>
                          )}
                        </div>
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
                          <button
                            onClick={() => setExpandedPatient(expandedPatient === patient.id ? null : patient.id)}
                            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            {expandedPatient === patient.id ? '▲' : '▼'}
                          </button>
                        </div>
                      </div>
                      {expandedPatient === patient.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Medical History</h4>
                          {visits.filter(v => v.patient_id === patient.id).length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No visits recorded yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {visits.filter(v => v.patient_id === patient.id).map(visit => (
                                  <div
                                    key={visit.id}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-medium text-gray-800 dark:text-white">
                                        {visit.diagnosis}
                                      </span>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {visit.date}
                                      </span>
                                    </div>
                                    {visit.medication && (
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        💊 {visit.medication}
                                      </div>
                                    )}
                                    {visit.notes && (
                                      <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                        {visit.notes}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
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