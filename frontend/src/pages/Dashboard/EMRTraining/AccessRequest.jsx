import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader, Clock } from 'lucide-react';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';

const AccessRequest = ({ requestType = 'emr' }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAccessStatus();
  }, [requestType]);

  const fetchAccessStatus = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/virtual-access/my-requests?requestType=${requestType}`);
      if (response.data.success && response.data.data.length > 0) {
        const latestRequest = response.data.data[0];
        setAccessStatus(latestRequest.status);
      }
    } catch (error) {
      console.error('Error fetching access status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    setIsRequesting(true);
    try {
      const response = await api.post('/virtual-access/request', { requestType });
      if (response.data.success) {
        toast.success('Access request submitted successfully! You will be notified once approved.');
        setAccessStatus('pending');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit access request. Please try again.';
      toast.error(errorMessage);
      console.error('Access request error:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-[#169AB4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 text-base sm:text-lg mb-2">
              Disclaimer
            </h3>
            <p className="text-sm sm:text-base text-amber-800 leading-relaxed">
              Before gaining access, students must log in through the Nextsteps App and click the button to request access to the {requestType.toUpperCase()} course. Access will be granted only after approval. Once approved, the course will be available in the app.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleRequestAccess}
        disabled={isRequesting || accessStatus === 'pending' || accessStatus === 'approved'}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow font-medium transition-all ${
          accessStatus === 'approved'
            ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
            : accessStatus === 'pending'
            ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 cursor-not-allowed'
            : isRequesting
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-[#169AB4] text-white hover:bg-[#147a8f]'
        }`}
      >
        {isRequesting ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            Requesting Access...
          </>
        ) : accessStatus === 'approved' ? (
          <>
            <CheckCircle className="h-5 w-5" />
            Access Approved
          </>
        ) : accessStatus === 'pending' ? (
          <>
            <Clock className="h-5 w-5" />
            Request Pending
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5" />
            Request Access
          </>
        )}
      </button>

      {accessStatus === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-sm text-green-800">
            Your access has been approved! You can now access the {requestType.toUpperCase()} course in the NextSteps App.
          </p>
        </div>
      )}

      {accessStatus === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm text-red-800">
            Your previous access request was not approved. You can submit a new request.
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessRequest;