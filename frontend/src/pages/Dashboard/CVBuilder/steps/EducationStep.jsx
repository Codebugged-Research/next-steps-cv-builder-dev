import React, { useState, useCallback, useMemo } from 'react';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';
import { GraduationCap, School, BookOpen, Award, Building2, MapPin, Calendar, Hash, TrendingUp, Globe } from 'lucide-react';

const EducationStep = ({ formData, onInputChange }) => {
  const [activeTab, setActiveTab] = useState('schooling');
  const [dateErrors, setDateErrors] = useState({});

  const tabs = [
    { id: 'schooling', label: 'Schooling', icon: School },
    { id: 'college', label: 'College (+1 & +2)', icon: BookOpen },
    { id: 'graduation', label: 'Graduation', icon: GraduationCap },
    { id: 'postGraduation', label: 'Post Graduation', icon: Award }
  ];

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const validatePercentage = (value) => {
    const regex = /^(\d{0,3}\.?\d{0,2})%?$/;
    return regex.test(value);
  };

  const handlePercentageChange = (subsection, field, value) => {
    if (value === '' || validatePercentage(value)) {
      updateSubSection(subsection, field, value);
    }
  };

  const validateYears = (startYear, endYear, section) => {
    if (startYear && endYear) {
      const start = parseInt(startYear);
      const end = parseInt(endYear);
      
      if (end < start) {
        setDateErrors(prev => ({
          ...prev,
          [`${section}_year`]: 'End year must be after or equal to start year'
        }));
        return false;
      } else {
        setDateErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`${section}_year`];
          return newErrors;
        });
        return true;
      }
    }
    return true;
  };

  const validateDates = (startDate, endDate, section) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        setDateErrors(prev => ({
          ...prev,
          [`${section}_date`]: 'End date must be after start date'
        }));
        return false;
      } else {
        setDateErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`${section}_date`];
          return newErrors;
        });
        return true;
      }
    }
    return true;
  };

  const updateSubSection = useCallback((subsection, field, value) => {
    const currentData = formData.education?.[subsection] || {};
    
    onInputChange('education', subsection, {
      ...currentData,
      [field]: value
    });

    if (field === 'startYear') {
      validateYears(value, currentData.endYear, subsection);
    } else if (field === 'endYear') {
      validateYears(currentData.startYear, value, subsection);
    } else if (field === 'startDate') {
      validateDates(value, currentData.endDate, subsection);
    } else if (field === 'endDate') {
      validateDates(currentData.startDate, value, subsection);
    }
  }, [formData.education, onInputChange]);

  const TabButton = ({ tab, isActive }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={() => handleTabClick(tab.id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[#169AB4] text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="font-medium">{tab.label}</span>
      </button>
    );
  };

  const SchoolingTab = useMemo(() => (
    <div className="space-y-6">
      <FormGrid>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            School Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <School className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.schooling?.schoolName || ''}
              onChange={(e) => updateSubSection('schooling', 'schoolName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter school name"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Board <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.schooling?.board || ''}
              onChange={(e) => updateSubSection('schooling', 'board', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter board name"
            />
          </div>
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
              value={formData.education?.schooling?.city || ''}
              onChange={(e) => updateSubSection('schooling', 'city', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter city"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.schooling?.state || ''}
              onChange={(e) => updateSubSection('schooling', 'state', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter state"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Year <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.education?.schooling?.startYear || ''}
              onChange={(e) => updateSubSection('schooling', 'startYear', e.target.value)}
              min="1990"
              max={formData.education?.schooling?.endYear || new Date().getFullYear()}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Start year"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Year <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.education?.schooling?.endYear || ''}
              onChange={(e) => updateSubSection('schooling', 'endYear', e.target.value)}
              min={formData.education?.schooling?.startYear || "1990"}
              max={new Date().getFullYear()}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="End year"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Percentage
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.schooling?.grade || ''}
              onChange={(e) => handlePercentageChange('schooling', 'grade', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 85% or A+"
            />
          </div>
        </div>
      </FormGrid>
      {dateErrors.schooling_year && (
        <p className="text-sm text-red-600">{dateErrors.schooling_year}</p>
      )}
    </div>
  ), [formData.education?.schooling, updateSubSection, dateErrors.schooling_year]);

  const CollegeTab = useMemo(() => (
    <div className="space-y-6">
      <FormGrid>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            College Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.college?.collegeName || ''}
              onChange={(e) => updateSubSection('college', 'collegeName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter college name"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stream <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.education?.college?.stream || ''}
              onChange={(e) => updateSubSection('college', 'stream', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            >
              <option value="">Select Stream</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
              <option value="Other">Other</option>
            </select>
          </div>
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
              value={formData.education?.college?.city || ''}
              onChange={(e) => updateSubSection('college', 'city', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter city"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.college?.state || ''}
              onChange={(e) => updateSubSection('college', 'state', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter state"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Year <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.education?.college?.startYear || ''}
              onChange={(e) => updateSubSection('college', 'startYear', e.target.value)}
              min="1990"
              max={formData.education?.college?.endYear || new Date().getFullYear()}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Start year"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Year <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.education?.college?.endYear || ''}
              onChange={(e) => updateSubSection('college', 'endYear', e.target.value)}
              min={formData.education?.college?.startYear || "1990"}
              max={new Date().getFullYear()}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="End year"
            />
          </div>
        </div>
      </FormGrid>
      {dateErrors.college_year && (
        <p className="text-sm text-red-600">{dateErrors.college_year}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            11th Grade (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.college?.eleventhGrade || ''}
              onChange={(e) => handlePercentageChange('college', 'eleventhGrade', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 85%"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            12th Grade (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.college?.twelfthGrade || ''}
              onChange={(e) => handlePercentageChange('college', 'twelfthGrade', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 90%"
            />
          </div>
        </div>
      </div>
    </div>
  ), [formData.education?.college, updateSubSection, dateErrors.college_year]);

  const GraduationTab = useMemo(() => (
    <div className="space-y-6">
      <FormGrid>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University/College Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.universityName || ''}
              onChange={(e) => updateSubSection('graduation', 'universityName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter university/college name"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.education?.graduation?.degree || ''}
              onChange={(e) => updateSubSection('graduation', 'degree', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            >
              <option value="">Select Degree</option>
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="BAMS">BAMS</option>
              <option value="BHMS">BHMS</option>
              <option value="B.Sc">B.Sc</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.specialization || ''}
              onChange={(e) => updateSubSection('graduation', 'specialization', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter specialization"
            />
          </div>
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
              value={formData.education?.graduation?.city || ''}
              onChange={(e) => updateSubSection('graduation', 'city', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter city"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.state || ''}
              onChange={(e) => updateSubSection('graduation', 'state', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter state"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.country || ''}
              onChange={(e) => updateSubSection('graduation', 'country', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter country"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.education?.graduation?.startDate || ''}
              onChange={(e) => updateSubSection('graduation', 'startDate', e.target.value)}
              max={formData.education?.graduation?.endDate || undefined}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.education?.graduation?.endDate || ''}
              onChange={(e) => updateSubSection('graduation', 'endDate', e.target.value)}
              min={formData.education?.graduation?.startDate || undefined}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            />
          </div>
        </div>
      </FormGrid>
      {dateErrors.graduation_date && (
        <p className="text-sm text-red-600">{dateErrors.graduation_date}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1st Year (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.firstYearPercentage || ''}
              onChange={(e) => handlePercentageChange('graduation', 'firstYearPercentage', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 85%"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            2nd Year (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.secondYearPercentage || ''}
              onChange={(e) => handlePercentageChange('graduation', 'secondYearPercentage', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 87%"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            3rd Year (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.thirdYearPercentage || ''}
              onChange={(e) => handlePercentageChange('graduation', 'thirdYearPercentage', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 89%"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Final Year (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.finalYearPercentage || ''}
              onChange={(e) => handlePercentageChange('graduation', 'finalYearPercentage', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 91%"
            />
          </div>
        </div>
      </div>
      <FormGrid>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overall CGPA/Percentage
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.graduation?.overallGrade || ''}
              onChange={(e) => updateSubSection('graduation', 'overallGrade', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 8.5 CGPA or 85%"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.education?.graduation?.classType || ''}
              onChange={(e) => updateSubSection('graduation', 'classType', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            >
              <option value="">Select Class Type</option>
              <option value="First Class with Distinction">First Class with Distinction</option>
              <option value="First Class">First Class</option>
              <option value="Second Class">Second Class</option>
              <option value="Pass Class">Pass Class</option>
            </select>
          </div>
        </div>
      </FormGrid>
    </div>
  ), [formData.education?.graduation, updateSubSection, dateErrors.graduation_date]);

  const PostGraduationTab = useMemo(() => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          Fill this section only if you have completed or are pursuing post-graduation.
        </p>
      </div>
      <FormGrid>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University/Institute Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.postGraduation?.universityName || ''}
              onChange={(e) => updateSubSection('postGraduation', 'universityName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter university/institute name"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.education?.postGraduation?.degree || ''}
              onChange={(e) => updateSubSection('postGraduation', 'degree', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            >
              <option value="">Select Degree</option>
              <option value="MD">MD</option>
              <option value="MS">MS</option>
              <option value="DNB">DNB</option>
              <option value="DM">DM</option>
              <option value="MCh">MCh</option>
              <option value="M.Sc">M.Sc</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.postGraduation?.specialization || ''}
              onChange={(e) => updateSubSection('postGraduation', 'specialization', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter specialization"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.postGraduation?.city || ''}
              onChange={(e) => updateSubSection('postGraduation', 'city', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter city"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.postGraduation?.state || ''}
              onChange={(e) => updateSubSection('postGraduation', 'state', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter state"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.postGraduation?.country || ''}
              onChange={(e) => updateSubSection('postGraduation', 'country', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="Enter country"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.education?.postGraduation?.startDate || ''}
              onChange={(e) => updateSubSection('postGraduation', 'startDate', e.target.value)}
              max={formData.education?.postGraduation?.endDate || undefined}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.education?.postGraduation?.endDate || ''}
              onChange={(e) => updateSubSection('postGraduation', 'endDate', e.target.value)}
              min={formData.education?.postGraduation?.startDate || undefined}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.education?.postGraduation?.status || ''}
              onChange={(e) => updateSubSection('postGraduation', 'status', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="Pursuing">Pursuing</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overall Grade/CGPA
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.education?.postGraduation?.overallGrade || ''}
              onChange={(e) => updateSubSection('postGraduation', 'overallGrade', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
              placeholder="e.g., 8.5 CGPA or 85%"
            />
          </div>
        </div>
      </FormGrid>
      {dateErrors.postGraduation_date && (
        <p className="text-sm text-red-600">{dateErrors.postGraduation_date}</p>
      )}
    </div>
  ), [formData.education?.postGraduation, updateSubSection, dateErrors.postGraduation_date]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'schooling':
        return SchoolingTab;
      case 'college':
        return CollegeTab;
      case 'graduation':
        return GraduationTab;
      case 'postGraduation':
        return PostGraduationTab;
      default:
        return SchoolingTab;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Education Details</h2>
      
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

export default EducationStep;