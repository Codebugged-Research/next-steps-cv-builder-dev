import React, { useState } from 'react';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import ConferenceCard from '../../../components/Common/ConferenceCard';
import ConfirmationModal from '../../../components/Common/ConfirmationModal';

const UpcomingConferencesTab = ({ conferences, onRefreshRegistrations, loading, error, onRefresh }) => {
  const [bookingLoading, setBookingLoading] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);
  const [selectedConference, setSelectedConference] = useState(null);

  const handleRegisterClick = (conference) => {
    setSelectedConferenceId(conference._id);
    setSelectedConference(conference);
    setShowConfirmModal(true);
  };

  const confirmRegistration = async () => {
    try {
      setBookingLoading(selectedConferenceId);
      setShowConfirmModal(false);
      
      const response = await api.post(`/conferences/${selectedConferenceId}/register`);
      
      if (response.data.success) {
        toast.success('Successfully registered for the conference!');
        if (onRefreshRegistrations) {
          onRefreshRegistrations();
        }
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering for conference:', error);
      const errorMessage = error.response?.data?.message || 'Max registration limit reached';
      toast.error(errorMessage);
    } finally {
      setBookingLoading(null);
      setSelectedConferenceId(null);
      setSelectedConference(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="h-8 w-8 text-[#169AB4] animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-[#04445E] mb-2">Loading conferences...</h3>
        <p className="text-gray-600">Please wait while we fetch the latest conferences.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Conferences</h3>
        <p className="text-red-600 mb-6 text-center">{error}</p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-6 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (conferences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#04445E] mb-2">No Conferences Available</h3>
          <p className="text-gray-600 mb-6">No conferences are currently available or you have already registered for all conferences.</p>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#04445E]">Available Conferences</h2>
            <p className="text-gray-600">Found {conferences.length} conferences</p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 text-[#169AB4] border border-[#169AB4] rounded-lg hover:bg-[#169AB4] hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {conferences.map((conference) => (
            <ConferenceCard
              key={conference._id}
              conference={conference}
              onRegister={() => handleRegisterClick(conference)}
              isLoading={bookingLoading === conference._id}
            />
          ))}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedConferenceId(null);
          setSelectedConference(null);
        }}
        onConfirm={confirmRegistration}
        title="Confirm Conference Registration"
        type="warning"
        confirmText="Yes, Register Me"
        cancelText="Cancel"
      >
        <div className="space-y-3">
          <p className="text-gray-700 font-medium">
            Are you sure you want to register for this conference?
          </p>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>You cannot cancel registration after a certain period</span>
            </li>
          </ul>
        </div>
      </ConfirmationModal>
    </>
  );
};

export default UpcomingConferencesTab;