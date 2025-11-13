import React, { useState } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Upload, X, User, Plus, Trash2, AlertCircle, Mail, Phone, MapPin, Globe, IdCard, Building2, FileText } from 'lucide-react';
import { toast } from 'react-toastify'; 
import api from '../../../../services/api';
import {
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  FLUENCY_OPTIONS,
  FILE_CONSTRAINTS
} from '../../../../constants/formConstants';
import {
  validateField,
  validateFile,
  validateLanguage,
  validateFormSection
} from '../../../../utils/validationRules';

const BasicDetailsStep = ({ formData, onInputChange }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [passportFrontPreview, setPassportFrontPreview] = useState(null);
  const [passportBackPreview, setPassportBackPreview] = useState(null);
  const [aadharFrontPreview, setAadharFrontPreview] = useState(null);
  const [aadharBackPreview, setAadharBackPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploading, setUploading] = useState({
    photo: false,
    passportFront: false,
    passportBack: false,
    aadharFront: false,
    aadharBack: false
  });
  const [pendingFiles, setPendingFiles] = useState({
    photo: null,
    passportFront: null,
    passportBack: null,
    aadharFront: null,
    aadharBack: null
  });
  
  const languages = formData.basicDetails.languages || [];

  const handleInputChange = (field, value) => {
    onInputChange('basicDetails', field, value);
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData.basicDetails[field];
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleDocumentSelect = (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file, 'PHOTO');
    if (error) {
      setErrors(prev => ({ ...prev, [documentType]: error }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      switch(documentType) {
        case 'photo':
          setPhotoPreview(reader.result);
          break;
        case 'passportFront':
          setPassportFrontPreview(reader.result);
          break;
        case 'passportBack':
          setPassportBackPreview(reader.result);
          break;
        case 'aadharFront':
          setAadharFrontPreview(reader.result);
          break;
        case 'aadharBack':
          setAadharBackPreview(reader.result);
          break;
      }
    };
    reader.readAsDataURL(file);

    setPendingFiles(prev => ({ ...prev, [documentType]: file }));
    setErrors(prev => ({ ...prev, [documentType]: '' }));
  };

  const handleDocumentUpload = async (documentType) => {
    const file = pendingFiles[documentType];
    if (!file) return;

    try {
      setUploading(prev => ({ ...prev, [documentType]: true }));
      
      const uploadFormData = new FormData();
      uploadFormData.append('document', file);
      
      const response = await api.post('/documents/upload-document', uploadFormData);
      
      if (response.data.success) {
        onInputChange('basicDetails', documentType, response.data.data.url);
        onInputChange('basicDetails', `${documentType}Key`, response.data.data.key);
        setPendingFiles(prev => ({ ...prev, [documentType]: null }));
        toast.success(`${getDocumentLabel(documentType)} uploaded successfully!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to upload ${getDocumentLabel(documentType)}`);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const getDocumentLabel = (documentType) => {
    const labels = {
      photo: 'Photo',
      passportFront: 'Passport Front',
      passportBack: 'Passport Back',
      aadharFront: 'Aadhar Front',
      aadharBack: 'Aadhar Back'
    };
    return labels[documentType] || documentType;
  };

  const removeDocument = (documentType) => {
    switch(documentType) {
      case 'photo':
        setPhotoPreview(null);
        break;
      case 'passportFront':
        setPassportFrontPreview(null);
        break;
      case 'passportBack':
        setPassportBackPreview(null);
        break;
      case 'aadharFront':
        setAadharFrontPreview(null);
        break;
      case 'aadharBack':
        setAadharBackPreview(null);
        break;
    }
    onInputChange('basicDetails', documentType, null);
    setPendingFiles(prev => ({ ...prev, [documentType]: null }));
  };

  const addLanguage = () => {
    const newLanguages = [...languages, { language: '', fluency: '' }];
    onInputChange('basicDetails', 'languages', newLanguages);
  };

  const updateLanguage = (index, field, value) => {
    const newLanguages = languages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang
    );
    onInputChange('basicDetails', 'languages', newLanguages);
    
    const langErrors = validateLanguage(newLanguages[index]);
    setErrors(prev => ({
      ...prev,
      [`language_${index}`]: langErrors
    }));
  };

  const removeLanguage = (index) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    onInputChange('basicDetails', 'languages', newLanguages);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`language_${index}`];
      return newErrors;
    });
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };

  const isFieldValid = (field) => {
    return touched[field] && !errors[field] && formData.basicDetails[field];
  };

  const getLanguageError = (index, field) => {
    return errors[`language_${index}`] && errors[`language_${index}`][field]
      ? errors[`language_${index}`][field]
      : '';
  };

  const DocumentUploadCard = ({ 
    title, 
    documentType, 
    preview, 
    isUploading, 
    error,
    required = false,
    hasPendingFile 
  }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-md font-semibold text-[#04445E] mb-3">
        {title} {required && <span className="text-red-500">*</span>}
      </h4>
      
      {!preview ? (
        <div>
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center">Select {title}</span>
            <input
              type="file"
              className="hidden"
              accept={FILE_CONSTRAINTS.PHOTO.ACCEPTED_EXTENSIONS}
              onChange={(e) => handleDocumentSelect(e, documentType)}
            />
          </label>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative w-32 h-32">
            <img
              src={preview}
              alt={`${title} Preview`}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <button
              onClick={() => removeDocument(documentType)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {hasPendingFile && !formData.basicDetails[documentType] && (
            <button
              onClick={() => handleDocumentUpload(documentType)}
              disabled={isUploading}
              className={`w-full px-4 py-2 rounded-lg text-white transition-colors ${
                isUploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#169AB4] hover:bg-[#147a8f]'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </span>
              ) : (
                'Upload'
              )}
            </button>
          )}
          
          {formData.basicDetails[documentType] && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <AlertCircle className="h-4 w-4" />
              <span>Uploaded</span>
            </div>
          )}
        </div>
      )}
      
      <p className="mt-2 text-sm text-gray-500">
        Accepted formats: {FILE_CONSTRAINTS.PHOTO.ACCEPTED_EXTENSIONS}. Maximum size: {FILE_CONSTRAINTS.PHOTO.MAX_SIZE / (1024 * 1024)}MB
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Basic Details</h2>
      
      <FormGrid>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.basicDetails.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                getFieldError('fullName') ? 'border-red-500' : isFieldValid('fullName') ? 'border-green-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {isFieldValid('fullName') && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">✓</div>
            )}
          </div>
          {getFieldError('fullName') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('fullName')}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={formData.basicDetails.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                getFieldError('email') ? 'border-red-500' : isFieldValid('email') ? 'border-green-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {isFieldValid('email') && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">✓</div>
            )}
          </div>
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={formData.basicDetails.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                getFieldError('phone') ? 'border-red-500' : isFieldValid('phone') ? 'border-green-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {isFieldValid('phone') && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">✓</div>
            )}
          </div>
          {getFieldError('phone') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.basicDetails.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            >
              {GENDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.basicDetails.nationality || ''}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              onBlur={() => handleBlur('nationality')}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                getFieldError('nationality') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your nationality"
            />
          </div>
          {getFieldError('nationality') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('nationality')}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            USMLE ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IdCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.basicDetails.usmleId || ''}
              onChange={(e) => handleInputChange('usmleId', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('usmleId')}
              className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                getFieldError('usmleId') ? 'border-red-500' : isFieldValid('usmleId') ? 'border-green-500' : 'border-gray-300'
              }`}
              placeholder="Enter your USMLE ID"
            />
            {isFieldValid('usmleId') && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">✓</div>
            )}
          </div>
          {getFieldError('usmleId') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('usmleId')}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.basicDetails.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                getFieldError('city') ? 'border-red-500' : isFieldValid('city') ? 'border-green-500' : 'border-gray-300'
              }`}
              placeholder="Enter your city"
            />
            {isFieldValid('city') && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">✓</div>
            )}
          </div>
          {getFieldError('city') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
          )}
        </div>
      </FormGrid>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#04445E]">Address</h3>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={formData.basicDetails.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                getFieldError('address') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your complete address"
              rows={3}
            />
          </div>
          {getFieldError('address') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('address')}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#04445E]">Languages & Fluency</h3>
          <button
            onClick={addLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Language
          </button>
        </div>
        
        {languages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No languages added yet. Click "Add Language" to start.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={lang.language}
                      onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                        getLanguageError(index, 'language') ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Language</option>
                      {LANGUAGE_OPTIONS.map(language => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                    {getLanguageError(index, 'language') && (
                      <p className="mt-1 text-sm text-red-600">{getLanguageError(index, 'language')}</p>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fluency Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={lang.fluency}
                      onChange={(e) => updateLanguage(index, 'fluency', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent ${
                        getLanguageError(index, 'fluency') ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      {FLUENCY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {getLanguageError(index, 'fluency') && (
                      <p className="mt-1 text-sm text-red-600">{getLanguageError(index, 'fluency')}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeLanguage(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Language"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#04445E]">Document Uploads</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DocumentUploadCard
            title="Profile Photo"
            documentType="photo"
            preview={photoPreview}
            isUploading={uploading.photo}
            error={errors.photo}
            required={true}
            hasPendingFile={!!pendingFiles.photo}
          />
          
          <DocumentUploadCard
            title="Passport Front"
            documentType="passportFront"
            preview={passportFrontPreview}
            isUploading={uploading.passportFront}
            error={errors.passportFront}
            hasPendingFile={!!pendingFiles.passportFront}
          />

          <DocumentUploadCard
            title="Passport Back"
            documentType="passportBack"
            preview={passportBackPreview}
            isUploading={uploading.passportBack}
            error={errors.passportBack}
            hasPendingFile={!!pendingFiles.passportBack}
          />
          
          <DocumentUploadCard
            title="Aadhar Front"
            documentType="aadharFront"
            preview={aadharFrontPreview}
            isUploading={uploading.aadharFront}
            error={errors.aadharFront}
            hasPendingFile={!!pendingFiles.aadharFront}
          />
          
          <DocumentUploadCard
            title="Aadhar Back"
            documentType="aadharBack"
            preview={aadharBackPreview}
            isUploading={uploading.aadharBack}
            error={errors.aadharBack}
            hasPendingFile={!!pendingFiles.aadharBack}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsStep;