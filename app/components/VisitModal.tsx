'use client';

import { useState, useEffect, useRef } from 'react';

export type Visit = {
  id: string;
  patient_id: string;
  date: string;
  diagnosis: string;
  medication: string;
  notes: string;
};

type VisitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visit: Visit) => void;
  patientId: string;
};

export default function VisitModal({ isOpen, onClose, onSave, patientId }: VisitModalProps) {
  const [form, setForm] = useState<Visit>({
    id: Date.now().toString(),
    patient_id: patientId,
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    medication: '',
    notes: '',
  });

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(prev => ({ ...prev, patientId }));
  }, [patientId]);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, id: Date.now().toString() });
    onClose();
    setForm({
      id: Date.now().toString(),
      patientId,
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      medication: '',
      notes: '',
    });
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="visit-modal-title" className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Medical Visit
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="visit-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visit Date <span aria-label="required">*</span>
              </label>
              <input
                id="visit-date"
                ref={firstInputRef}
                required
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="visit-diagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Diagnosis <span aria-label="required">*</span>
              </label>
              <input
                id="visit-diagnosis"
                required
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Common cold, Hypertension"
              />
            </div>

            <div>
              <label htmlFor="visit-medication" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medication
              </label>
              <input
                id="visit-medication"
                name="medication"
                value={form.medication}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Paracetamol 500mg"
              />
            </div>

            <div>
              <label htmlFor="visit-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                id="visit-notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Visit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}