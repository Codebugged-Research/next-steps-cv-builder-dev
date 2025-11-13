import React, { useState, useEffect } from 'react';
import { Calendar, Play, Clock, Users, ExternalLink, CheckCircle, X, FileText, Loader, MapPin, AlertCircle, Info } from 'lucide-react';
import HipaaAgreementComponent from './HipaaAgreeement';
import HipaaContent from './HipaaContent';
import ConfirmationModal from '../../../components/Common/ConfirmationModal';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';

const EmrTrainingComponent = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showHipaaContent, setShowHipaaContent] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  const months = [
    { name: 'January', days: 31 },
    { name: 'February', days: 29 },
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 }
  ];

  const trainingInfo = {
    schedule: '2:00 PM – 5:00 PM | Monday to Friday',
    duration: 'Every Calendar Month (1st – 31st)',
    guidelines: [
      'All patient information is confidential and must not be shared',
      'No personal devices (phones, cameras) during training',
      'Use only assigned credentials - never share passwords',
      'Always log out after training sessions',
      'Training uses simulated data only - no real patient information',
      'Report any suspected data breach immediately'
    ]
  };

  useEffect(() => {
    const checkHipaaStatus = async () => {
      try {
        const response = await api.get('/users/hipaa-status');
        if (response.data.success) {
          setHasAgreedToTerms(response.data.data.isSigned);
        }
      } catch (error) {
        console.error('Error checking HIPAA status:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkHipaaStatus();
  }, []);

  useEffect(() => {
    if (hasAgreedToTerms) {
      fetchUserRegistrations();
    }
  }, [hasAgreedToTerms]);

  const fetchUserRegistrations = async () => {
    setIsLoadingRegistrations(true);
    try {
      const response = await api.get('/emr-training/my-registrations');
      if (response.data.success) {
        setRegistrations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  const handleRegisterClick = (month) => {
    setSelectedSession({
      month: month,
      time: '2:00 PM - 5:00 PM',
      duration: '3 hours',
      location: '3rd Floor, M Square Building, above Swiggy Onboarding Office, Patrika Nagar, Madhapur, Hyderabad, Telangana 500081'
    });
    setShowRegistrationModal(true);
  };

  const confirmRegistration = async () => {
  try {
    const response = await api.post('/emr-training/register', {
      month: selectedSession.month,
      sessionTime: selectedSession.time
    });
    
    if (response.data.success) {
      toast.success('Registration request submitted successfully! Awaiting admin approval.');
      await fetchUserRegistrations();
      setActiveTab('registrations');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    toast.error(errorMessage);
    console.error('Registration error:', error);
  } finally {
    setShowRegistrationModal(false);
    setSelectedSession(null);
  }
};

const handleCancelRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/emr-training/registrations/${registrationId}`);
    if (response.data.success) {
      toast.success('Registration cancelled successfully');
      await fetchUserRegistrations();
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to cancel registration';
    toast.error(errorMessage);
    console.error('Cancel error:', error);
  }
};

  const handleShowBookingTab = () => {
    if (!hasAgreedToTerms) {
      setShowAgreement(true);
    } else {
      setActiveTab('book');
    }
  };

  const handleAgreementAccept = () => {
    setHasAgreedToTerms(true);
    setShowAgreement(false);
    setActiveTab('book');
  };

  const handleAgreementDecline = () => {
    setShowAgreement(false);
    setActiveTab('recordings');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isMonthRegistered = (monthName) => {
    return registrations.some(
      r => r.month === monthName && 
      (r.status === 'pending' || r.status === 'confirmed')
    );
  };

  const RegistrationCard = ({ registration }) => (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-[#04445E] mb-2">
            EMR Training Session
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(registration.status)}`}>
              {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-[#169AB4] flex-shrink-0" />
          <span>{registration.month} 2025</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-[#169AB4] flex-shrink-0" />
          <span>2:00 PM - 5:00 PM (3 hours)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-[#169AB4] flex-shrink-0" />
          <span>Virtual - Zoom</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-[#169AB4] flex-shrink-0" />
          <span>Registered on {new Date(registration.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
        {registration.rejectionReason && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span><strong>Reason:</strong> {registration.rejectionReason}</span>
          </div>
        )}
      </div>
      
      {registration.status === 'pending' && (
        <button
          onClick={() => handleCancelRegistration(registration._id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          <X className="h-4 w-4" />
          Cancel Registration
        </button>
      )}
      
      {registration.status === 'confirmed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-sm text-green-800 font-medium">
            ✓ Your session is confirmed! Check your email for joining details.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {showAgreement && (
        <HipaaAgreementComponent
          onAccept={handleAgreementAccept}
          onDecline={handleAgreementDecline}
          onClose={() => setShowAgreement(false)}
        />
      )}
      
      {showHipaaContent && (
        <HipaaContent onClose={() => setShowHipaaContent(false)} />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 mb-6 sm:mb-8 gap-4">
        <div className="flex overflow-x-auto">
          <button
            onClick={handleShowBookingTab}
            className={`px-4 sm:px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'book'
                ? 'border-[#169AB4] text-[#169AB4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Book Training
            {!hasAgreedToTerms && <span className="ml-2 text-xs text-red-500">*</span>}
          </button>
          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-4 sm:px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'recordings'
                ? 'border-[#169AB4] text-[#169AB4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Virtual Training
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 sm:px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'registrations'
                ? 'border-[#169AB4] text-[#169AB4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="hidden sm:inline">Your Registrations</span>
            <span className="sm:hidden">Registrations</span>
            {registrations.length > 0 && ` (${registrations.length})`}
          </button>
        </div>
        <button
          onClick={() => setShowHipaaContent(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#04445E] text-white rounded-lg hover:bg-[#06617f] transition-colors font-medium text-sm sm:text-base"
        >
          <FileText className="h-4 w-4" />
          HIPAA Agreement
        </button>
      </div>

      {activeTab === 'book' && hasAgreedToTerms && (
        <div>
          <div className="bg-gradient-to-r from-[#04445E] to-[#169AB4] text-white rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              <h3 className="text-base sm:text-lg font-semibold">{trainingInfo.schedule}</h3>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              <p className="text-sm sm:text-base">{trainingInfo.duration}</p>
            </div>
            <div className="border-t border-white border-opacity-30 pt-4">
              <h4 className="font-semibold mb-3 text-sm sm:text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Important Guidelines:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {trainingInfo.guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#04445E] mb-4">
              Select Month for Training - 2025
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {months.map((month) => {
                const isRegistered = isMonthRegistered(month.name);
                return (
                  <button
                    key={month.name}
                    onClick={() => !isRegistered && handleRegisterClick(month.name)}
                    disabled={isRegistered}
                    className={`px-4 py-6 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                      isRegistered
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-2 border-gray-200 hover:border-[#169AB4] hover:bg-[#169AB4] hover:text-white text-gray-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {month.name}
                  </button>
                );
              })}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">
              * Grayed out months are already registered or unavailable
            </p>
          </div>
        </div>
      )}

      {activeTab === 'book' && !hasAgreedToTerms && (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-2 font-semibold text-lg">HIPAA Compliance Agreement Required</p>
          <p className="text-sm mb-4">Please accept the terms and conditions to access training booking</p>
          <button
            onClick={() => setShowAgreement(true)}
            className="mt-4 px-6 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium"
          >
            Review Agreement
          </button>
        </div>
      )}

      {activeTab === 'recordings' && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#04445E] mb-6">
            Available Recordings
          </h2>
          <a
            href="https://app.nextstepscareer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#04445E] text-white px-6 py-3 rounded-lg shadow hover:bg-[#06617f] transition font-medium"
          >
            <ExternalLink className="h-5 w-5" />
            Click here to access NextSteps App
          </a>
        </div>
      )}

      {activeTab === 'registrations' && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#04445E] mb-6">Your Registrations</h2>
          {isLoadingRegistrations ? (
            <div className="text-center py-12">
              <Loader className="h-12 w-12 mx-auto mb-4 text-[#169AB4] animate-spin" />
              <p className="text-gray-500">Loading registrations...</p>
            </div>
          ) : registrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {registrations.map((registration) => (
                <RegistrationCard key={registration._id} registration={registration} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-semibold text-lg mb-2">No active registrations</p>
              <p className="text-sm">Register for training sessions to see them here</p>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedSession(null);
        }}
        onConfirm={confirmRegistration}
        title="Confirm Registration"
        type="warning"
        confirmText="Yes, Register"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <p className="text-gray-700 font-semibold text-base">
            Confirm your registration for:
          </p>
          {selectedSession && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm"><strong>Month:</strong> {selectedSession.month} 2025</p>
              <p className="text-sm"><strong>Time:</strong> {selectedSession.time}</p>
              <p className="text-sm"><strong>Duration:</strong> {selectedSession.duration}</p>
              <p className="text-sm"><strong>Location:</strong> {selectedSession.location}</p>
            </div>
          )}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Your registration will be pending until approved by an administrator. You will receive an email notification once your registration is confirmed or if additional information is needed.
            </p>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default EmrTrainingComponent;