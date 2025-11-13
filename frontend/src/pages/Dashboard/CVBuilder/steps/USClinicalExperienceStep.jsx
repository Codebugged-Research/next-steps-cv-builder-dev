import React, { useState } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { Plus, X, Building2, Calendar, CheckCircle } from 'lucide-react';

const USClinicalExperienceStep = ({ formData, onInputChange }) => {
  const [showUSCE, setShowUSCE] = useState(false);
  const [usceList, setUsceList] = useState(formData.usClinicalExperience?.list || []);

  const handleToggleUSCE = () => {
    setShowUSCE(!showUSCE);
    if (!showUSCE && usceList.length === 0) {
      addNewUSCE();
    }
  };

  const addNewUSCE = () => {
    const newUSCE = {
      id: Date.now(),
      hospitalName: '',
      startDate: '',
      endDate: ''
    };
    const updatedList = [...usceList, newUSCE];
    setUsceList(updatedList);
    onInputChange('usClinicalExperience', 'list', updatedList);
  };

  const removeUSCE = (id) => {
    const updatedList = usceList.filter(usce => usce.id !== id);
    setUsceList(updatedList);
    onInputChange('experienceDetails', 'usce', updatedList);
    
    if (updatedList.length === 0) {
      setShowUSCE(false);
    }
  };

  const updateUSCE = (id, field, value) => {
    const updatedList = usceList.map(usce => 
      usce.id === id ? { ...usce, [field]: value } : usce
    );
    setUsceList(updatedList);
    onInputChange('experienceDetails', 'usce', updatedList);
  };

  return (
    <div className="space-y-6">
      {/* USCE Toggle Button */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-[#169AB4]" />
          <div>
            <h3 className="text-lg font-semibold text-[#04445E]">
              US Clinical Experience (USCE)
            </h3>
            <p className="text-sm text-gray-600">
              Add your clinical experience in the United States
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleUSCE}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            showUSCE
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-[#169AB4] text-white hover:bg-[#147a8f]'
          }`}
        >
          {showUSCE ? 'Hide USCE' : 'Add USCE'}
        </button>
      </div>

      {/* USCE Forms */}
      {showUSCE && (
        <div className="space-y-6">
          {usceList.map((usce, index) => (
            <div
              key={usce.id}
              className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm"
            >
              {/* Header with remove button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#169AB4]" />
                  <h4 className="text-lg font-semibold text-[#04445E]">
                    USCE #{index + 1}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeUSCE(usce.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove USCE"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Hospital Name */}
                <FormField
                  label="Hospital Name"
                  type="text"
                  value={usce.hospitalName}
                  onChange={(value) => updateUSCE(usce.id, 'hospitalName', value)}
                  placeholder="Enter hospital name"
                  required
                />

                {/* Time Period */}
                <FormGrid>
                  <FormField
                    label="Start Date"
                    type="date"
                    value={usce.startDate}
                    onChange={(value) => updateUSCE(usce.id, 'startDate', value)}
                    required
                  />
                  <FormField
                    label="End Date"
                    type="date"
                    value={usce.endDate}
                    onChange={(value) => updateUSCE(usce.id, 'endDate', value)}
                    required
                  />
                </FormGrid>

                {usce.startDate && usce.endDate && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Duration: {new Date(usce.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(usce.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addNewUSCE}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#169AB4] hover:text-[#169AB4] hover:bg-blue-50 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Another USCE</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default USClinicalExperienceStep;