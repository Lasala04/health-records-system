import Topnav from '../components/Topnav';

export default function AboutPage() {
  return (
    <>
      <Topnav />
      
      <section className="pt-24 pb-12 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">About This Project</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Project Information</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              This website is created in compliance of the completions of the following projects simultaneously: 
              <span className="font-semibold"> "Server Administration Finals Project"</span> and 
              <span className="font-semibold"> "Health Information Management Finals Project"</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Health Information Management</h3>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Group Members:</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Lasala, Dwyn Richie T.</li>
                <li>• Alfaro, Larrah Shayne Ashley B.</li>
                <li>• David, John Angelo</li>
                <li>• Mayam, James Angelo</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Server Administration</h3>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Group Members:</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Lasala, Dwyn Richie T.</li>
                <li>• Alfaro, Larrah Shayne Ashley B.</li>
                <li>• David, John Angelo</li>
                <li>• Mayam, James Angelo</li>
                <li>• Ugay, Princess Ellein S.</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg p-8 text-center">
            <p className="text-lg text-gray-800 dark:text-white font-medium italic">
              "Without the help of the following people below, this project would have not been possible."
            </p>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Acknowledgments</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We would like to express our sincere gratitude to our instructors, mentors, and everyone who supported us throughout this project. 
              Your guidance and encouragement have been invaluable to our learning journey.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}