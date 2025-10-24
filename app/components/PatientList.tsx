'use client';

import { Patient } from './PatientForm';

type PatientListProps = {
  patients: Patient[];
};

export default function PatientList({ patients }: PatientListProps) {
  return (
    <section id="records" className="py-12 px-8 bg-gray-50">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Records</h2>
          {patients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No patients added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {patients.map((pat, idx) => (
                <li key={idx} className="py-4 hover:bg-gray-50 transition px-4 rounded">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <span className="font-semibold text-gray-800 text-lg">{pat.name}</span>
                    <div className="text-sm text-gray-600 mt-1 md:mt-0">
                      <span className="mr-4">DOB: {pat.dob}</span>
                      <span>Contact: {pat.contact}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}