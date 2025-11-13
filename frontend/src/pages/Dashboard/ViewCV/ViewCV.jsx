import React, { useState, useEffect } from 'react';
import { Download, FileText, Edit, Calendar, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const ViewCV = ({ onEdit }) => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const fetchCVData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userResponse = await api.get('/users/current-user');
      if (!userResponse.data.success) {
        throw new Error('Failed to get user information');
      }

      const userId = userResponse.data.data._id;
      console.log('User ID:', userId);

      const cvEndpoint = `/cv/${userId}`;
      console.log('Calling CV endpoint:', cvEndpoint);

      const response = await api.get(cvEndpoint);

      if (response.data.success) {
        setCvData(response.data.data);
        console.log('CV data fetched successfully');
      } else {
        setError(response.data.message || 'Failed to fetch CV data');
      }
    } catch (error) {
      console.error('Error fetching CV data:', error);
      setError(error.response?.data?.message || 'Failed to load CV data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const userResponse = await api.get('/users/current-user');
      const userId = userResponse.data.data._id;

      const response = await api.get(`/cv/download/${userId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', getFileName());
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CV downloaded successfully!');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV');
    } finally {
      setDownloading(false);
    }
  };

  const getFileName = () => {
    const name = cvData?.basicDetails?.fullName || 'CV';
    return `${name.replace(/\s+/g, '_')}_CV.pdf`;
  };

  const getLastUpdated = () => {
    if (cvData?.updatedAt) {
      return new Date(cvData.updatedAt).toLocaleDateString();
    }
    return 'Recently';
  };

  useEffect(() => {
    fetchCVData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="h-8 w-8 text-[#169AB4] animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-[#04445E] mb-2">Loading your CV...</h3>
          <p className="text-gray-600">Please wait while we fetch your CV data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load CV</h3>
          <p className="text-red-600 mb-6 text-center">{error}</p>
          <button
            onClick={fetchCVData}
            className="flex items-center gap-2 px-6 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-[#04445E] mb-2">No CV Found</h3>
          <p className="text-gray-600 mb-6 text-center">
            You haven't created a CV yet. Start building your professional medical CV now.
          </p>
          <button
            onClick={() => onEdit && onEdit()}
            className="flex items-center gap-2 px-6 py-3 bg-[#04445E] text-white rounded-lg hover:bg-[#033a4d] transition-colors"
          >
            <Edit className="h-4 w-4" />
            Create CV
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#169AB4]" />
            <div>
              <h3 className="font-semibold text-[#04445E]">{getFileName()}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {getLastUpdated()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={fetchCVData}
            className="text-gray-500 hover:text-[#169AB4] p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh CV data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.publications?.length || 0}
            </div>
            <div>Publications</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.conferences?.length || 0}
            </div>
            <div>Conferences</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.workshops?.length || 0}
            </div>
            <div>Workshops</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.emrRcmTraining?.emrSystems?.length || 0}
            </div>
            <div>EMR Systems</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {/* <button
          onClick={() => onEdit && onEdit()}
          className="flex items-center gap-2 px-6 py-3 border border-[#169AB4] text-[#169AB4] rounded-lg hover:bg-[#169AB4] hover:text-white transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit CV
        </button> */}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 bg-[#04445E] text-white rounded-lg hover:bg-[#033a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ViewCV;