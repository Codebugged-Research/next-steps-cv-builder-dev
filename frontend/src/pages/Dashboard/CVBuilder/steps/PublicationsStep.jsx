import React, { useState } from 'react';
import ArrayFieldManager from '../forms/ArrayFieldManager';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../../services/api';
import { validateFile } from '../../../../utils/validationRules';

const PublicationsStep = ({ formData, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  const newPublication = { 
    title: '', 
    journal: '', 
    year: '', 
    type: 'research-article',
    supportingDocument: null
  };

  const handleDocumentUpload = async (e, publicationIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file, 'DOCUMENT');
    if (error) {
      setErrors(prev => ({ ...prev, [`publication_${publicationIndex}`]: error }));
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [`publication_${publicationIndex}`]: true }));

      const formDataObj = new FormData();
      formDataObj.append('document', file);

      const response = await api.post('/documents/upload-document', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Document upload response:', response);
      if (response.data.success) {
        const documentData = {
          url: response.data.data.url,
          key: response.data.data.key,
          fileName: file.name,
          fileSize: file.size
        };

        onArrayUpdate('publications', publicationIndex, 'supportingDocument', documentData);
        setErrors(prev => ({ ...prev, [`publication_${publicationIndex}`]: '' }));
        toast.success('Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(prev => ({ ...prev, [`publication_${publicationIndex}`]: false }));
    }
  };

  const removeDocument = (publicationIndex) => {
    onArrayUpdate('publications', publicationIndex, 'supportingDocument', null);
  };

  const renderPublication = (publication, index) => (
    <div className="space-y-4">
      <FormGrid>
        <FormField
          label="Title"
          value={publication.title}
          onChange={(value) => onArrayUpdate('publications', index, 'title', value)}
          placeholder="Enter publication title"
        />
        
        <FormField
          label="Journal"
          value={publication.journal}
          onChange={(value) => onArrayUpdate('publications', index, 'journal', value)}
          placeholder="Enter journal name"
        />
        
        <FormField
          label="Year"
          type="number"
          value={publication.year}
          onChange={(value) => onArrayUpdate('publications', index, 'year', value)}
          placeholder="e.g., 2023"
          min="1900"
          max={new Date().getFullYear() + 1}
        />
        
        <FormField
          label="Type"
          type="select"
          value={publication.type}
          options={[
            { value: 'research-article', label: 'Research Article' },
            { value: 'case-report', label: 'Case Report' },
            { value: 'review-article', label: 'Review Article' },
            { value: 'conference-paper', label: 'Conference Paper' }
          ]}
          onChange={(value) => onArrayUpdate('publications', index, 'type', value)}
        />
      </FormGrid>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Supporting Document <span className="text-xs text-gray-500">(Optional)</span>
        </h4>

        {!publication.supportingDocument ? (
          <div>
            <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              {uploading[`publication_${index}`] ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#169AB4] mx-auto mb-1"></div>
                  <span className="text-xs text-gray-500">Uploading...</span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Upload Document</span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleDocumentUpload(e, index)}
                disabled={uploading[`publication_${index}`]}
              />
            </label>
            {errors[`publication_${index}`] && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[`publication_${index}`]}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-900 truncate">{publication.supportingDocument.fileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={publication.supportingDocument.url}
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
    </div>
  );

  if (formData.publications.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#04445E]">Publications</h2>
          <button
            onClick={() => onArrayAdd('publications', newPublication)}
            className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <FileText className="h-4 w-4" />
            Add Publication
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No publications added yet</p>
          <p className="text-sm">Click "Add Publication" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <ArrayFieldManager
      title="Publications"
      items={formData.publications}
      onAdd={(item) => onArrayAdd('publications', item)}
      onRemove={(index) => onArrayRemove('publications', index)}
      renderItem={renderPublication}
      newItemTemplate={newPublication}
    />
  );
};

export default PublicationsStep;