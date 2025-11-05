'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type Patient = {
  id: string;
  name: string;
  dob: string;
  contact: string;
  bloodType: string;
  address: string;
};

type PatientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patient?: Patient | null;
};

const getEmptyForm = (): Patient => ({
  id: Date.now().toString(),
  name: '',
  dob: '',
  contact: '',
  bloodType: '',
  address: '',
});

export default function PatientModal({ isOpen, onClose, onSave, patient }: PatientModalProps) {
  // Only initialize once per modal opening
  const [form, setForm] = useState<Patient>(getEmptyForm());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    onClose();
    setErrors({});
    setForm(getEmptyForm());
  }, [onClose]);

  // Reset form ONLY when modal opens (not continuously)
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(patient || getEmptyForm());
      setErrors({});
    }
  }, [isOpen, patient]);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  function validateForm(): boolean {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(form.name)) {
      newErrors.name = 'Name can only contain letters, spaces, and common punctuation';
    }
    if (!form.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(form.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (birthDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      } else if (age > 150) {
        newErrors.dob = 'Please enter a valid date of birth';
      }
    }
    if (!form.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[\d\s+()-]{10,}$/.test(form.contact)) {
      newErrors.contact = 'Please enter a valid phone number (at least 10 digits)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(form);
    setLoading(false);
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-800 dark:text-white">
              {patient ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name <span aria-label="required">*</span>
              </label>
              <input
                id="patient-name"
                ref={firstInputRef}
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                placeholder="John Doe"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="patient-dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth <span aria-label="required">*</span>
              </label>
              <input
                id="patient-dob"
                required
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className={`w-full border ${errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                aria-invalid={!!errors.dob}
                aria-describedby={errors.dob ? "dob-error" : undefined}
              />
              {errors.dob && <p id="dob-error" className="text-red-500 text-sm mt-1" role="alert">{errors.dob}</p>}
            </div>

            <div>
              <label htmlFor="patient-contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Number <span aria-label="required">*</span>
              </label>
              <input
                id="patient-contact"
                required
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className={`w-full border ${errors.contact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none`}
                placeholder="+1 234 567 8900"
                aria-invalid={!!errors.contact}
                aria-describedby={errors.contact ? "contact-error" : undefined}
              />
              {errors.contact && <p id="contact-error" className="text-red-500 text-sm mt-1" role="alert">{errors.contact}</p>}
            </div>

            <div>
              <label htmlFor="patient-blood-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blood Type
              </label>
              <select
                id="patient-blood-type"
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label htmlFor="patient-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                id="patient-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                placeholder="123 Main St, City"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2.5 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-busy={loading}
              >
                {loading ? 'Saving...' : 'Save Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}