'use client';

import { useState } from 'react';

export type Patient = {
  name: string;
  dob: string;
  contact: string;
};

type PatientFormProps = {
  onAddPatient: (patient: Patient) => void;
};

export default function PatientForm({ onAddPatient }: PatientFormProps) {
  const [form, setForm] = useState<Patient>({ name: '', dob: '', contact: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.dob && form.contact) {
      onAddPatient(form);
      setForm({ name: '', dob: '', contact: '' });
    }
  }

  return (
    <section id="add-patient" className="py-12 px-8 bg-white">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Patient</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input 
                required 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input 
                required 
                name="dob" 
                type="date" 
                value={form.dob} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input 
                required 
                name="contact" 
                value={form.contact} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter contact number"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Save Patient
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}