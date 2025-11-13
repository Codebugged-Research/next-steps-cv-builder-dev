import React, { useState } from 'react';
import UpcomingConferencesTab from './UpcomingConferences.jsx';
import MyRegistrationsTab from './MyRegistrationsTab';

const ConferenceTabs = ({ upcomingConferences, registrations, onRefreshRegistrations }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? 'border-[#169AB4] text-[#169AB4]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming Conferences
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'registrations'
              ? 'border-[#169AB4] text-[#169AB4]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Registrations ({registrations.length})
        </button>
      </div>

      {activeTab === 'upcoming' && (
        <UpcomingConferencesTab 
          conferences={upcomingConferences}
          onRefreshRegistrations={onRefreshRegistrations}
        />
      )}

      {activeTab === 'registrations' && (
        <MyRegistrationsTab 
          registrations={registrations}
          onRefreshRegistrations={onRefreshRegistrations}
        />
      )}
    </div>
  );
};

export default ConferenceTabs;