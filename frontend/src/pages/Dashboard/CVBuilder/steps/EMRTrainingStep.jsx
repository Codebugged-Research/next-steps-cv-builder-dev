import React, { useState, useCallback, useMemo } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Plus, Trash2, Monitor, Heart, Briefcase } from 'lucide-react';

const EMRTrainingStep = ({ formData, onInputChange, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const [activeTab, setActiveTab] = useState('emrRcm');

  const tabs = [
    { id: 'emrRcm', label: 'EMR & RCM Training'},
    { id: 'workExperience', label: 'Work Experience' },
  ];

  const emrSystems = ['Epic', 'Cerner', 'Allscripts', 'eClinicalWorks', 'NextGen', 'Other'];

  const newWorkExperience = {
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    currentJob: false,
    description: ''
  };

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const updateEmrRcmTraining = useCallback((field, value) => {
    onInputChange('emrRcmTraining', field, value);
  }, [onInputChange]);

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

  const EMRRCMTab = useMemo(() => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">EMR Systems Experience</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emrSystems.map((system) => (
            <label key={system} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.emrRcmTraining?.emrSystems?.includes(system) || false}
                onChange={(e) => {
                  const currentSystems = formData.emrRcmTraining?.emrSystems || [];
                  const updated = e.target.checked
                    ? [...currentSystems, system]
                    : currentSystems.filter(s => s !== system);
                  updateEmrRcmTraining('emrSystems', updated);
                }}
                className="text-[#169AB4] focus:ring-[#169AB4]"
              />
              <span className="text-sm">{system}</span>
            </label>
          ))}
        </div>
      </div>

      <FormField
        label="Revenue Cycle Management (RCM) Training"
        type="checkbox"
        value={formData.emrRcmTraining?.rcmTraining || false}
        onChange={(value) => updateEmrRcmTraining('rcmTraining', value)}
      />

      {formData.emrRcmTraining?.rcmTraining && (
        <FormField
          label="Training Duration"
          value={formData.emrRcmTraining?.duration || ''}
          onChange={(value) => updateEmrRcmTraining('duration', value)}
          placeholder="e.g., 3 months, 6 weeks"
        />
      )}
    </div>
  ), [formData.emrRcmTraining, updateEmrRcmTraining, emrSystems]);

  const WorkExperienceTab = useMemo(() => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#04445E]">Work Experience</h3>
        <button
          onClick={() => onArrayAdd('workExperience', newWorkExperience)}
          className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {(!formData.workExperience || formData.workExperience.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet</p>
          <p className="text-sm">Click "Add Experience" to start</p>
        </div>
      )}

      {formData.workExperience && formData.workExperience.length > 0 && formData.workExperience.map((experience, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6">
          <FormGrid>
            <FormField
              label="Job Title"
              value={experience.jobTitle}
              onChange={(value) => onArrayUpdate('workExperience', index, 'jobTitle', value)}
              placeholder="e.g., Medical Resident, Clinical Intern"
              required
            />

            <FormField
              label="Company/Hospital"
              value={experience.company}
              onChange={(value) => onArrayUpdate('workExperience', index, 'company', value)}
              placeholder="e.g., City Hospital, ABC Medical Center"
              required
            />

            <FormField
              label="Location"
              value={experience.location}
              onChange={(value) => onArrayUpdate('workExperience', index, 'location', value)}
              placeholder="e.g., New York, NY"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`current-job-${index}`}
                checked={experience.currentJob || false}
                onChange={(e) => onArrayUpdate('workExperience', index, 'currentJob', e.target.checked)}
                className="w-4 h-4 text-[#169AB4] focus:ring-[#169AB4] rounded"
              />
              <label htmlFor={`current-job-${index}`} className="text-sm font-medium text-gray-700">
                Current Position
              </label>
            </div>
          </FormGrid>

          <FormGrid>
            <FormField
              label="Start Date"
              type="date"
              value={experience.startDate}
              onChange={(value) => onArrayUpdate('workExperience', index, 'startDate', value)}
              required
            />

            {!experience.currentJob && (
              <FormField
                label="End Date"
                type="date"
                value={experience.endDate}
                onChange={(value) => onArrayUpdate('workExperience', index, 'endDate', value)}
                required
              />
            )}
          </FormGrid>

          <FormField
            label="Job Description"
            type="textarea"
            value={experience.description}
            onChange={(value) => onArrayUpdate('workExperience', index, 'description', value)}
            placeholder="Describe your responsibilities and achievements"
            rows={4}
          />

          <button
            onClick={() => onArrayRemove('workExperience', index)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm mt-4"
          >
            <Trash2 className="h-4 w-4" />
            Remove Experience
          </button>
        </div>
      ))}
    </div>
  ), [formData.workExperience, onArrayAdd, onArrayRemove, onArrayUpdate, newWorkExperience]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'emrRcm':
        return EMRRCMTab;
      case 'workExperience':
        return WorkExperienceTab;
      default:
        return EMRRCMTab;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Professional Training & Experience</h2>
      
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

export default EMRTrainingStep;