import React, { useState } from 'react';
import FormField from '../forms/FormField';
import { Info, Upload, X, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../../services/api';
import { FILE_CONSTRAINTS } from '../../../../constants/formConstants';
import { validateFile } from '../../../../utils/validationRules';

const SkillsStep = ({ formData, onInputChange }) => {
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const error = validateFile(file, 'DOCUMENT');
    if (error) {
      setErrors(prev => ({ ...prev, document: error }));
      return;
    }

    try {
      setUploading(true);
      const formDataObj = new FormData();
      formDataObj.append('document', file);

      const response = await api.post('/documents/upload-document', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Document upload response:', response);

      if (response.data.success) {
        const newDocument = {
          id: Date.now(),
          name: file.name,
          url: response.data.data.url,
          key: response.data.data.key,
          type: file.type,
          size: file.size
        };

        const updatedDocuments = [...supportingDocuments, newDocument];
        setSupportingDocuments(updatedDocuments);
        onInputChange('skills', 'supportingDocuments', updatedDocuments);
        
        setErrors(prev => ({ ...prev, document: '' }));
        toast.success('Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (documentId) => {
    const updatedDocuments = supportingDocuments.filter(doc => doc.id !== documentId);
    setSupportingDocuments(updatedDocuments);
    onInputChange('skills', 'supportingDocuments', updatedDocuments);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Skills & Competencies</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <FormField
              label="Skills & Competencies"
              type="textarea"
              value={formData.skills?.skillsList || ''}
              onChange={(value) => onInputChange('skills', 'skillsList', value)}
              placeholder="e.g., Clinical Research, Patient Care, EMR Systems, Laboratory Techniques, Medical Imaging..."
              rows={6}
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <Info className="h-4 w-4 inline mr-2 text-blue-600" />
          Add relevant skills separated by commas. Include medical skills, technical competencies, languages, and certifications.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#04445E]">
            Supporting Documents
            <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Upload certificates, training documents, or other files that support your skills (optional).
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#169AB4] hover:bg-blue-50 transition-colors">
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#169AB4]"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Upload Document</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                disabled={uploading}
              />
            </label>

            {errors.document && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.document}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX, JPG, PNG. Maximum size: 5MB per file.
          </p>

          {supportingDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
              <div className="space-y-2">
                {supportingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#169AB4] hover:text-[#147a8f] underline"
                      >
                        View
                      </a>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Remove Document"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;