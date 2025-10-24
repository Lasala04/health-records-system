'use client';

import { Patient } from './PatientModal';
import { Visit } from './VisitModal';

type DashboardStatsProps = {
  patients: Patient[];
  visits: Visit[];
};

export default function DashboardStats({ patients, visits }: DashboardStatsProps) {
  const today = new Date().toISOString().split('T')[0];
  const recentVisits = visits.filter(v => v.date >= today).length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyVisits = visits.filter(v => v.date.startsWith(thisMonth)).length;

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{patients.length}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <span className="text-3xl">👥</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Visits</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{visits.length}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <span className="text-3xl">🏥</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">This Month</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{monthlyVisits}</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <span className="text-3xl">📅</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Upcoming</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{recentVisits}</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
            <span className="text-3xl">⏰</span>
          </div>
        </div>
      </div>
    </div>
  );
}