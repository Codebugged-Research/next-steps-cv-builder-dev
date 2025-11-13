import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, CheckCircle, Loader, BookOpen, X, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';
import ProjectHeader from '../../../components/Common/ProjectHeader';
import ConfirmationModal from '../../../components/Common/ConfirmationModal';

const WorkshopsComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMonths, setLoadingMonths] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [cancellingId, setCancellingId] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);

  useEffect(() => {
    fetchAvailableMonths();
    fetchUserRegistrations();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchWorkshops();
    }
  }, [selectedMonth]);

  const fetchAvailableMonths = async () => {
    setLoadingMonths(true);
    try {
      const response = await api.get('/workshops');
      if (response.data.success) {
        const allWorkshops = response.data.data;
        
        const monthsMap = new Map();
        allWorkshops.forEach(workshop => {
          const date = new Date(workshop.date);
          const month = date.toLocaleDateString('en-US', { month: 'long' });
          const year = date.getFullYear();
          const key = `${month}-${year}`;
          
          if (!monthsMap.has(key)) {
            monthsMap.set(key, { month, year, date: workshop.date });
          }
        });

        const uniqueMonths = Array.from(monthsMap.values())
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setAvailableMonths(uniqueMonths);
      }
    } catch (error) {
      console.error('Error fetching available months:', error);
      toast.error('Failed to load available months');
    } finally {
      setLoadingMonths(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const response = await api.get('/workshops/registrations');
      if (response.data.success) {
        setUserRegistrations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setUserRegistrations([]);
    }
  };

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/workshops?month=${selectedMonth.month}&year=${selectedMonth.year}`);
      if (response.data.success) {
        setWorkshops(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
      toast.error('Failed to load workshops');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAvailableMonths();
      await fetchUserRegistrations();
      if (selectedMonth) {
        await fetchWorkshops();
      }
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleMonthSelect = (monthData) => {
    setSelectedMonth(monthData);
    setActiveTab('available');
  };

  const handleRegisterClick = (workshopId) => {
    if (userRegistrations.length > 0) {
      toast.error('You can only register for one workshop. Please cancel your existing registration first.');
      return;
    }
    setSelectedWorkshopId(workshopId);
    setShowRegistrationModal(true);
  };

  const confirmRegistration = async () => {
    try {
      const response = await api.post(`/workshops/${selectedWorkshopId}/register`);
      if (response.data.success) {
        toast.success('Successfully registered for workshop. Waiting for admin confirmation.');
        fetchWorkshops();
        fetchUserRegistrations();
        setActiveTab('registrations');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setShowRegistrationModal(false);
      setSelectedWorkshopId(null);
    }
  };

  const handleCancelClick = (registrationId) => {
    setSelectedRegistrationId(registrationId);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    try {
      setCancellingId(selectedRegistrationId);
      const response = await api.delete(`/workshops/registrations/${selectedRegistrationId}`);
      if (response.data.success) {
        toast.success('Registration cancelled successfully');
        fetchUserRegistrations();
        if (selectedMonth) {
          fetchWorkshops();
        }
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
      setShowCancelModal(false);
      setSelectedRegistrationId(null);
    }
  };

  const isRegistered = (workshopId) => {
    return userRegistrations.some(reg => reg.workshop?._id === workshopId);
  };

  const getRegistrationStatus = (workshopId) => {
    const registration = userRegistrations.find(reg => reg.workshop?._id === workshopId);
    return registration?.status || null;
  };

  const getAvailableSeats = (workshop) => {
    const confirmedUsers = workshop.registeredUsers.filter(reg => reg.status === 'confirmed').length;
    return workshop.capacity - confirmedUsers;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasExistingRegistration = userRegistrations.length > 0;

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: AlertCircle },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: X }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="h-3 w-3 inline mr-1" />
        {badge.label}
      </span>
    );
  };

  const headerConfig = {
    backgroundImage: '/training.jpg',
    icon: BookOpen,
    title: 'BLS/ACLS Training',
    subtitle: 'Select a training month to view and book available sessions',
    stats: [
      { value: workshops.length.toString(), label: 'Available Workshops' },
      { value: userRegistrations.length.toString(), label: 'Your Registration' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <ProjectHeader {...headerConfig} />
          <div className="absolute top-0 right-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                refreshing
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-[#169AB4] hover:bg-[#147a8f] text-white shadow-md hover:shadow-lg'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-8 mt-4">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'available'
                ? 'border-[#169AB4] text-[#169AB4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Available Workshops
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'registrations'
                ? 'border-[#169AB4] text-[#169AB4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Registration ({userRegistrations.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <>
            {hasExistingRegistration && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> You already have an active workshop registration.
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#04445E] mb-4">Select Training Month</h2>
              
              {loadingMonths ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-[#169AB4]" />
                  <span className="ml-3 text-gray-600">Loading available months...</span>
                </div>
              ) : availableMonths.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {availableMonths.map((monthData, index) => (
                    <button
                      key={index}
                      onClick={() => handleMonthSelect(monthData)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMonth?.month === monthData.month && selectedMonth?.year === monthData.year
                          ? 'border-[#169AB4] bg-[#169AB4] text-white shadow-lg'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#169AB4] hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <Calendar className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-semibold">{monthData.month}</p>
                        <p className="text-sm">{monthData.year}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">No Workshops Available</h3>
                  <p>There are currently no workshops scheduled. Check back later!</p>
                </div>
              )}
            </div>

            {selectedMonth ? (
              <div>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader className="h-8 w-8 animate-spin text-[#169AB4]" />
                  </div>
                ) : workshops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workshops.map((workshop) => {
                      const registrationStatus = getRegistrationStatus(workshop._id);
                      const isUserRegistered = isRegistered(workshop._id);
                      
                      return (
                        <div key={workshop._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-[#04445E] mb-2">
                              {workshop.title}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                workshop.type === 'BLS' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {workshop.type}
                              </span>
                              {isUserRegistered && getStatusBadge(registrationStatus)}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-[#169AB4]" />
                              <span>{formatDate(workshop.date)}</span>
                            </div>
                            {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 text-[#169AB4]" />
                              <span>{workshop.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-4 w-4 text-[#169AB4]" />
                              <span>{getAvailableSeats(workshop)} seats available</span>
                            </div> */}
                          </div>

                          {isUserRegistered ? (
                            <button
                              disabled
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                            >
                              {registrationStatus === 'confirmed' ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Confirmed
                                </>
                              ) : registrationStatus === 'rejected' ? (
                                <>
                                  <X className="h-4 w-4" />
                                  Rejected
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4" />
                                  Pending Approval
                                </>
                              )}
                            </button>
                          ) : hasExistingRegistration ? (
                            <button
                              disabled
                              className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                            >
                              Already Registered
                            </button>
                          ) : getAvailableSeats(workshop) > 0 ? (
                            <button
                              onClick={() => handleRegisterClick(workshop._id)}
                              className="w-full px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium"
                            >
                              Register Now
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                            >
                              Fully Booked
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8">
                    <div className="text-center text-gray-600">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-semibold text-[#04445E] mb-2">
                        No Workshops Available
                      </h3>
                      <p className="text-gray-500 mb-4">
                        There are no training sessions scheduled for {selectedMonth.month} {selectedMonth.year}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Select a Month</h3>
                <p>Choose a training month from the options above to see available sessions</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'registrations' && (
          <div className="space-y-4">
            {userRegistrations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-semibold text-lg mb-2">No workshop registration yet</p>
                <p className="text-sm">Register for a workshop to track it here</p>
              </div>
            ) : (
              userRegistrations.map((registration) => {
                const workshop = registration.workshop;
                if (!workshop) return null;

                return (
                  <div key={registration._id} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-[#04445E] mb-2">
                          {workshop.title}
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            workshop.type === 'BLS' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {workshop.type}
                          </span>
                          {getStatusBadge(registration.status)}
                        </div>
                      </div>
                    </div>

                    {registration.status === 'pending' && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          <AlertCircle className="h-4 w-4 inline mr-2" />
                          Your registration is pending admin approval.
                        </p>
                      </div>
                    )}

                    {registration.status === 'rejected' && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">
                          <X className="h-4 w-4 inline mr-2" />
                          Your registration was rejected. Please register for another workshop.
                        </p>
                      </div>
                    )}

                    {registration.certificate && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-green-800 font-semibold mb-2">
                              🎉 Your Certificate is Ready!
                            </p>
                            <p className="text-green-700 text-sm mb-3">
                              Congratulations on completing the workshop. Download your certificate below.
                            </p>
                            <a
                              href={registration.certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              <BookOpen className="h-4 w-4" />
                              Download Certificate
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-[#169AB4]" />
                        <span>{formatDate(workshop.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-[#169AB4]" />
                        <span>{workshop.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Registered on {formatDate(registration.registeredAt)}</span>
                      </div>
                      {registration.confirmedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Confirmed on {formatDate(registration.confirmedAt)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCancelClick(registration._id)}
                        disabled={cancellingId === registration._id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                          cancellingId === registration._id
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        {cancellingId === registration._id ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            Cancel Registration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedWorkshopId(null);
        }}
        onConfirm={confirmRegistration}
        title="Confirm Workshop Registration"
        type="warning"
        confirmText="Yes, Register Me"
        cancelText="Cancel"
      >
        <div className="space-y-3">
          <p className="text-gray-700 font-medium">
            Are you sure you want to proceed with this registration?
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Registration <strong>cannot be cancelled after a</strong> certain period</span>
            </li>
          </ul>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedRegistrationId(null);
        }}
        onConfirm={confirmCancellation}
        title="Cancel Workshop Registration"
        type="danger"
        confirmText="Yes, Cancel Registration"
        cancelText="Keep Registration"
      >
        <div className="space-y-3">
          <p className="text-gray-700 font-medium">
            Are you sure you want to cancel this workshop registration?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. You will lose your spot in this workshop and may need to wait for the next available session.
            </p>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default WorkshopsComponent;