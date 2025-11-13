import React, { useState, useCallback, useMemo } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Plus, Trash2, Heart, Award } from 'lucide-react';

const WorkshopsStep = ({ formData, onInputChange, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const [activeTab, setActiveTab] = useState('bls');
  const [dateErrors, setDateErrors] = useState({});

  const tabs = [
    { id: 'bls', label: 'BLS Certification' },
    { id: 'acls', label: 'ACLS Certification' },
    { id: 'workshops', label: 'Workshops & Certifications' }
  ];

  const newWorkshop = {
    workshopName: '',
    organizer: '',
    location: '',
    date: '',
    duration: '',
    description: '',
    certificateReceived: false
  };

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const validateDates = (issueDate, expiryDate, certType) => {
    if (issueDate && expiryDate) {
      const issue = new Date(issueDate);
      const expiry = new Date(expiryDate);
      
      if (expiry <= issue) {
        setDateErrors(prev => ({
          ...prev,
          [certType]: 'Expiry date must be after issue date'
        }));
        return false;
      } else {
        setDateErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[certType];
          return newErrors;
        });
        return true;
      }
    }
    return true;
  };

  const updateAclsBls = useCallback((field, value) => {
    onInputChange('aclsBls', field, value);
    
    if (field === 'blsIssueDate') {
      validateDates(value, formData.aclsBls?.blsExpiryDate, 'bls');
    } else if (field === 'blsExpiryDate') {
      validateDates(formData.aclsBls?.blsIssueDate, value, 'bls');
    } else if (field === 'aclsIssueDate') {
      validateDates(value, formData.aclsBls?.aclsExpiryDate, 'acls');
    } else if (field === 'aclsExpiryDate') {
      validateDates(formData.aclsBls?.aclsIssueDate, value, 'acls');
    }
  }, [onInputChange, formData.aclsBls]);

  const TabButton = ({ tab, isActive }) => {
    return (
      <button
        onClick={() => handleTabClick(tab.id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[#169AB4] text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="font-medium">{tab.label}</span>
      </button>
    );
  };

  const BLSTab = useMemo(() => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="h-6 w-6 text-[#169AB4]" />
        <h3 className="text-lg font-semibold text-[#04445E]">Basic Life Support (BLS)</h3>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="bls-certified"
          checked={formData.aclsBls?.blsCertified || false}
          onChange={(e) => updateAclsBls('blsCertified', e.target.checked)}
          className="w-4 h-4 text-[#169AB4] focus:ring-[#169AB4] rounded"
        />
        <label htmlFor="bls-certified" className="text-sm font-medium text-gray-700">
          I am BLS Certified
        </label>
      </div>

      {formData.aclsBls?.blsCertified && (
        <div className="space-y-6 mt-6 p-6 bg-gray-50 rounded-lg">
          <FormGrid>
            <FormField
              label="Issue Date"
              type="date"
              value={formData.aclsBls?.blsIssueDate || ''}
              onChange={(value) => updateAclsBls('blsIssueDate', value)}
              max={formData.aclsBls?.blsExpiryDate || undefined}
              required
            />
            <FormField
              label="Expiry Date"
              type="date"
              value={formData.aclsBls?.blsExpiryDate || ''}
              onChange={(value) => updateAclsBls('blsExpiryDate', value)}
              min={formData.aclsBls?.blsIssueDate || undefined}
              required
            />
          </FormGrid>
          {dateErrors.bls && (
            <p className="text-sm text-red-600">{dateErrors.bls}</p>
          )}
          <FormField
            label="Certification Provider"
            value={formData.aclsBls?.blsProvider || ''}
            onChange={(value) => updateAclsBls('blsProvider', value)}
            placeholder="e.g., American Heart Association, Red Cross"
            required
          />
          <FormField
            label="Certificate Number (Optional)"
            value={formData.aclsBls?.blsCertificateNumber || ''}
            onChange={(value) => updateAclsBls('blsCertificateNumber', value)}
            placeholder="Enter certificate number if available"
          />
        </div>
      )}

      {!formData.aclsBls?.blsCertified && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Not BLS Certified</p>
          <p className="text-sm">Check the box above if you have BLS certification</p>
        </div>
      )}
    </div>
  ), [formData.aclsBls, updateAclsBls, dateErrors.bls]);

  const ACLSTab = useMemo(() => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="h-6 w-6 text-[#169AB4]" />
        <h3 className="text-lg font-semibold text-[#04445E]">Advanced Cardiac Life Support (ACLS)</h3>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="acls-certified"
          checked={formData.aclsBls?.aclsCertified || false}
          onChange={(e) => updateAclsBls('aclsCertified', e.target.checked)}
          className="w-4 h-4 text-[#169AB4] focus:ring-[#169AB4] rounded"
        />
        <label htmlFor="acls-certified" className="text-sm font-medium text-gray-700">
          I am ACLS Certified
        </label>
      </div>

      {formData.aclsBls?.aclsCertified && (
        <div className="space-y-6 mt-6 p-6 bg-gray-50 rounded-lg">
          <FormGrid>
            <FormField
              label="Issue Date"
              type="date"
              value={formData.aclsBls?.aclsIssueDate || ''}
              onChange={(value) => updateAclsBls('aclsIssueDate', value)}
              max={formData.aclsBls?.aclsExpiryDate || undefined}
              required
            />
            <FormField
              label="Expiry Date"
              type="date"
              value={formData.aclsBls?.aclsExpiryDate || ''}
              onChange={(value) => updateAclsBls('aclsExpiryDate', value)}
              min={formData.aclsBls?.aclsIssueDate || undefined}
              required
            />
          </FormGrid>
          {dateErrors.acls && (
            <p className="text-sm text-red-600">{dateErrors.acls}</p>
          )}
          <FormField
            label="Certification Provider"
            value={formData.aclsBls?.aclsProvider || ''}
            onChange={(value) => updateAclsBls('aclsProvider', value)}
            placeholder="e.g., American Heart Association"
            required
          />
          <FormField
            label="Certificate Number (Optional)"
            value={formData.aclsBls?.aclsCertificateNumber || ''}
            onChange={(value) => updateAclsBls('aclsCertificateNumber', value)}
            placeholder="Enter certificate number if available"
          />
        </div>
      )}

      {!formData.aclsBls?.aclsCertified && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Not ACLS Certified</p>
          <p className="text-sm">Check the box above if you have ACLS certification</p>
        </div>
      )}
    </div>
  ), [formData.aclsBls, updateAclsBls, dateErrors.acls]);

  const WorkshopsTab = useMemo(() => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#04445E]">Workshops & Certifications</h3>
        <button
          onClick={() => onArrayAdd('workshops', newWorkshop)}
          className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Workshop
        </button>
      </div>

      {(!formData.workshops || formData.workshops.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No workshops added yet</p>
          <p className="text-sm">Click "Add Workshop" to start</p>
        </div>
      )}

      {formData.workshops && formData.workshops.length > 0 && formData.workshops.map((workshop, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <FormGrid>
            <FormField
              label="Workshop Name"
              value={workshop.workshopName}
              onChange={(value) => onArrayUpdate('workshops', index, 'workshopName', value)}
              placeholder="e.g., Advanced Suturing Techniques"
              required
            />
            <FormField
              label="Organizer"
              value={workshop.organizer}
              onChange={(value) => onArrayUpdate('workshops', index, 'organizer', value)}
              placeholder="e.g., Medical Association"
              required
            />
            <FormField
              label="Location"
              value={workshop.location}
              onChange={(value) => onArrayUpdate('workshops', index, 'location', value)}
              placeholder="e.g., Boston, MA"
            />
            <FormField
              label="Date"
              type="date"
              value={workshop.date}
              onChange={(value) => onArrayUpdate('workshops', index, 'date', value)}
              required
            />
            <FormField
              label="Duration"
              value={workshop.duration}
              onChange={(value) => onArrayUpdate('workshops', index, 'duration', value)}
              placeholder="e.g., 2 days, 8 hours"
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`certificate-${index}`}
                checked={workshop.certificateReceived || false}
                onChange={(e) => onArrayUpdate('workshops', index, 'certificateReceived', e.target.checked)}
                className="w-4 h-4 text-[#169AB4] focus:ring-[#169AB4] rounded"
              />
              <label htmlFor={`certificate-${index}`} className="text-sm font-medium text-gray-700">
                Certificate Received
              </label>
            </div>
          </FormGrid>

          <FormField
            label="Description"
            type="textarea"
            value={workshop.description}
            onChange={(value) => onArrayUpdate('workshops', index, 'description', value)}
            placeholder="Describe what you learned and key takeaways"
            rows={3}
          />

          <button
            onClick={() => onArrayRemove('workshops', index)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm mt-4"
          >
            <Trash2 className="h-4 w-4" />
            Remove Workshop
          </button>
        </div>
      ))}
    </div>
  ), [formData.workshops, onArrayAdd, onArrayRemove, onArrayUpdate]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'bls':
        return BLSTab;
      case 'acls':
        return ACLSTab;
      case 'workshops':
        return WorkshopsTab;
      default:
        return BLSTab;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Professional Training & Workshops</h2>
      
      <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-50 rounded-lg">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default WorkshopsStep;