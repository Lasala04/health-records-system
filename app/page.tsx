'use client';

import { useState, useEffect } from 'react';
import Topnav from './components/Topnav';
import DashboardStats from './components/DashboardStats';
import Link from 'next/link';
import { Patient } from './components/PatientModal';
import { Visit } from './components/VisitModal';

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);

  // Load data from localStorage (temporary solution)
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    const savedVisits = localStorage.getItem('visits');
    if (savedPatients) setPatients(JSON.parse(savedPatients));
    if (savedVisits) setVisits(JSON.parse(savedVisits));
  }, []);

  return (
    <>
      <Topnav />
      
      <section className="pt-24 pb-12 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Health Records Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Secure, efficient, and modern patient data management system
            </p>
          </div>

          <DashboardStats patients={patients} visits={visits} />
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link href="/patients" className="block">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Patient Records</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage patient information, medical history, and records
                </p>
              </div>
            </Link>

            <Link href="/about" className="block">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
                <div className="text-5xl mb-4">ℹ️</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">About Project</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learn about the team and purpose of this system
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Secure</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Patient data protection with industry standards
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Modern</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Built with latest web technologies
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Efficient</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Streamlined workflows for healthcare professionals
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}