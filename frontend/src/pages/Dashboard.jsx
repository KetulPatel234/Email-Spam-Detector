import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

function Dashboard() {

  const [meta, setMeta] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Dummy data to simulate an API response for dashboard metrics.
    const dummyMeta = {
      total_mails: 1258,
      spam_mails: 324,
      users: 15,
      spam_rate: ((324 / 1258) * 100).toFixed(1) + "%",
    };

    // Dummy data for recent activity log.
    const dummyActivity = [
      { id: 1, type: 'spam', details: 'Classified mail from "Online Casino" as spam.', time: '2 min ago' },
      { id: 2, type: 'undo', details: 'Undid spam classification for "Urgent Business Proposal".', time: '10 min ago' },
      { id: 3, type: 'user', details: 'A new user signed up for the service.', time: '15 min ago' },
      { id: 4, type: 'spam', details: 'Classified new mail as spam.', time: '30 min ago' },
    ];

    setTimeout(() => {
      setMeta(dummyMeta);
      setRecentActivity(dummyActivity);
    }, 500);

    document.title = "Live Dashboard";
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 min-h-screen p-8 text-gray-200 antialiased font-sans animate-fade-in">
      <div className="container mx-auto">
        <h2 className="mb-6 font-extrabold text-3xl text-gray-100 flex items-center">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 flex items-center h-48 border border-gray-700 transition-transform transform hover:-translate-y-2 duration-300">
            <div className="bg-indigo-600 text-white rounded-full flex items-center justify-center w-14 h-14 mr-5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-400 font-semibold text-sm">Total Mails</div>
              <div className="text-3xl font-extrabold text-indigo-300">{meta.total_mails || 0}</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-xl p-6 flex items-center h-48 border border-gray-700 transition-transform transform hover:-translate-y-2 duration-300">
            <div className="bg-purple-600 text-white rounded-full flex items-center justify-center w-14 h-14 mr-5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.3 11.7a1 1 0 011.4 0L10 14.6l3.3-3.3a1 1 0 111.4 1.4L11.4 16a1 1 0 01-1.4 0l-3.3-3.3a1 1 0 010-1.4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-gray-400 font-semibold text-sm">Spam Mails</div>
              <div className="text-3xl font-extrabold text-purple-300">{meta.spam_mails || 0}</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-xl p-6 flex items-center h-48 border border-gray-700 transition-transform transform hover:-translate-y-2 duration-300">
            <div className="bg-fuchsia-600 text-white rounded-full flex items-center justify-center w-14 h-14 mr-5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 15v-3.682A4.996 4.996 0 0012 10H8a4.996 4.996 0 00-4 1.318V15H2v3h16v-3h-2z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-400 font-semibold text-sm">Users</div>
              <div className="text-3xl font-extrabold text-fuchsia-300">{meta.users || 0}</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-xl p-6 flex items-center h-48 border border-gray-700 transition-transform transform hover:-translate-y-2 duration-300">
            <div className="bg-sky-600 text-white rounded-full flex items-center justify-center w-14 h-14 mr-5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 10.586V7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-gray-400 font-semibold text-sm">Spam Rate</div>
              <div className="text-3xl font-extrabold text-sky-300">{meta.spam_rate || '0%'}</div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-gray-100 mb-6">Recent Activity</h3>
            <ul className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <li key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
                    <div className="flex-shrink-0 pt-1">
                      {activity.type === 'spam' && <span className="text-purple-400 text-xl">🚀</span>}
                      {activity.type === 'undo' && <span className="text-indigo-400 text-xl">✅</span>}
                      {activity.type === 'user' && <span className="text-fuchsia-400 text-xl">👤</span>}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-400">
                        <span className="font-semibold text-gray-200">{activity.details}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No recent activity.</div>
              )}
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col justify-center items-center text-center transition-transform transform hover:-translate-y-2 duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 13a1 1 0 112 0 1 1 0 01-2 0zm1-9a1 1 0 011 1v5a1 1 0 11-2 0V7a1 1 0 011-1z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Manage Mails</h3>
            <p className="text-gray-400 text-sm mb-4">
              Navigate to the mails page to view and manage your spam list.
            </p>
            <Link
              to="/spam-manager"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
            >
              Go to Mails
            </Link>
          </div>
        </div>

        <div className="mt-8 text-gray-500 text-center">
          <p className="text-lg flex items-center justify-center">
            <Info className="h-5 w-5 mr-2" />
            Welcome to your AI-powered spam detection dashboard. View statistics and manage your mails efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;