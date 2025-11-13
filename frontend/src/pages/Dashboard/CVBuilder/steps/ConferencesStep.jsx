import React, { useState } from 'react';
import { Plus, Upload, X, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../../services/api';
import { validateFile } from '../../../../utils/validationRules';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';

const ConferencesStep = ({ formData, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  const newConference = { 
    name: '', 
    year: '', 
    location: '',
    country: '',
    role: '', 
    description: '', 
    certificateAwarded: false,
    supportingDocument: null
  };

  const handleDocumentUpload = async (e, conferenceIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file, 'DOCUMENT');
    if (error) {
      setErrors(prev => ({ ...prev, [`conference_${conferenceIndex}`]: error }));
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [`conference_${conferenceIndex}`]: true }));
      
      const formDataObj = new FormData();
      formDataObj.append('document', file);

      const response = await api.post('/documents/upload-document', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const documentData = {
          url: response.data.data.url,
          key: response.data.data.key,
          fileName: file.name,
          fileSize: file.size
        };
        
        onArrayUpdate('conferences', conferenceIndex, 'supportingDocument', documentData);
        setErrors(prev => ({ ...prev, [`conference_${conferenceIndex}`]: '' }));
        toast.success('Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(prev => ({ ...prev, [`conference_${conferenceIndex}`]: false }));
    }
  };

  const removeDocument = (conferenceIndex) => {
    onArrayUpdate('conferences', conferenceIndex, 'supportingDocument', null);
  };

  const renderConference = (conference, index) => (
    <div className="border border-gray-200 rounded-lg p-6 mb-4">
      <FormGrid>
        <FormField
          label="Conference Name"
          value={conference.name}
          onChange={(value) => onArrayUpdate('conferences', index, 'name', value)}
          placeholder="Enter conference name"
        />
        
        <FormField
          label="Year"
          type="number"
          value={conference.year}
          onChange={(value) => onArrayUpdate('conferences', index, 'year', value)}
          placeholder="e.g., 2023"
          min="1990"
          max={new Date().getFullYear() + 1}
        />
        
        <FormField
          label="Location"
          value={conference.location}
          onChange={(value) => onArrayUpdate('conferences', index, 'location', value)}
          placeholder="e.g., New York, Mumbai, London"
        />
        
        <FormField
          label="Country"
          value={conference.country}
          onChange={(value) => onArrayUpdate('conferences', index, 'country', value)}
          placeholder="e.g., USA, India, UK"
        />
      </FormGrid>
      
      <div className="mt-4">
        <FormField
          label="Role"
          value={conference.role}
          placeholder="e.g., Presenter, Attendee, Speaker, Poster Presenter"
          onChange={(value) => onArrayUpdate('conferences', index, 'role', value)}
        />
      </div>
      
      <div className="mt-4">
        <FormField
          label="Description"
          type="textarea"
          value={conference.description}
          placeholder="Describe your participation and contributions"
          rows={4}
          onChange={(value) => onArrayUpdate('conferences', index, 'description', value)}
        />
      </div>
      
      <div className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          id={`certificate-${index}`}
          checked={conference.certificateAwarded || false}
          onChange={(e) => onArrayUpdate('conferences', index, 'certificateAwarded', e.target.checked)}
          className="text-[#169AB4] focus:ring-[#169AB4]"
        />
        <label htmlFor={`certificate-${index}`} className="text-sm font-medium text-gray-700">
          Certificate Awarded
        </label>
      </div>

      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Supporting Document <span className="text-xs text-gray-500">(Optional)</span>
        </h4>
        
        {!conference.supportingDocument ? (
          <div>
            <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              {uploading[`conference_${index}`] ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#169AB4] mx-auto mb-1"></div>
                  <span className="text-xs text-gray-500">Uploading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Upload Certificate/Document</span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleDocumentUpload(e, index)}
                disabled={uploading[`conference_${index}`]}
              />
            </label>
            {errors[`conference_${index}`] && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[`conference_${index}`]}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-900 truncate">{conference.supportingDocument.fileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={conference.supportingDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#169AB4] hover:text-[#147a8f] underline"
                >
                  View
                </a>
                <button
                  onClick={() => removeDocument(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Remove Document"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => onArrayRemove('conferences', index)}
        className="text-red-600 hover:text-red-800 text-sm mt-4"
      >
        Remove Conference
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#04445E]">Conferences</h2>
        <button
          onClick={() => onArrayAdd('conferences', newConference)}
          className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Conference
        </button>
      </div>

      <div className="space-y-4">
        {formData.conferences.map((conference, index) => (
          <div key={index}>
            {renderConference(conference, index)}
          </div>
        ))}
        
        {formData.conferences.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No conferences added yet</p>
            <p className="text-sm">Click "Add Conference" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferencesStep;