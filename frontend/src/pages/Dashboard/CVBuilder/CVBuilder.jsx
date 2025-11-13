import React, { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import StepContent from './StepContent';
import NavigationControls from './NavigationControls';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';
import CVPreview from './CVPreview.jsx';
import SaveProgressModal from '../../../components/Common/SaveProgressModal.jsx';

const initialCVData = {
  basicDetails: {
    fullName: '',
    email: '',
    phone: '',
    medicalSchool: '',
    graduationYear: '',
    city: ''
  },
  education: {
    schooling: {
      schoolName: '',
      board: '',
      city: '',
      state: '',
      startYear: '',
      endYear: '',
      grade: ''
    },
    college: {
      collegeName: '',
      stream: '',
      city: '',
      state: '',
      startYear: '',
      endYear: '',
      eleventhGrade: '',
      twelfthGrade: ''
    },
    graduation: {
      universityName: '',
      degree: '',
      specialization: '',
      city: '',
      state: '',
      country: '',
      startDate: '',
      endDate: '',
      firstYearPercentage: '',
      secondYearPercentage: '',
      thirdYearPercentage: '',
      finalYearPercentage: '',
      overallGrade: '',
      classType: ''
    },
    postGraduation: {
      universityName: '',
      degree: '',
      specialization: '',
      city: '',
      state: '',
      country: '',
      startDate: '',
      endDate: '',
      status: '',
      overallGrade: ''
    }
  },
  usmleScores: {
    step1Status: 'not-taken',
    step2ckScore: '',
    ecfmgCertified: false
  },
  usClinicalExperience: {  
    list: []
  },
  clinicalExperiences: [],
  skills: {
    skillsList: '',
    supportingDocuments: []
  },
  professionalExperiences: [],
  volunteerExperiences: [],
  significantAchievements: '',
  publications: [],
  conferences: [],
  workshops: [],
  emrRcmTraining: {
    emrSystems: [],
    rcmTraining: false,
    duration: ''
  },
  aclsBls: {
    aclsCertified: false,
    blsCertified: false,
    aclsIssueDate: '',
    aclsExpiryDate: '',
    blsIssueDate: '',
    blsExpiryDate: '',
    provider: ''
  },
  workExperience: []
};

const CVBuilder = ({ onPreview, user, onStepChange, currentStep, onStepComplete }) => {
  const [formData, setFormData] = useState(initialCVData);
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const totalSteps = 11;
  const activeStep = currentStep || internalCurrentStep;

  useEffect(() => {
    console.log('CVBuilder - User prop:', user);
    console.log('CVBuilder - User ID:', user?._id || user?.id);
  }, [user]);

  const validateCurrentStep = useCallback(() => {
    const missingFields = [];
    
    switch (activeStep) {
      case 1:
        if (!formData.basicDetails?.fullName?.trim()) missingFields.push('Full Name');
        if (!formData.basicDetails?.email?.trim()) missingFields.push('Email');
        if (!formData.basicDetails?.phone?.trim()) missingFields.push('Phone');
        if (!formData.basicDetails?.medicalSchool?.trim()) missingFields.push('Medical School');
        if (!formData.basicDetails?.graduationYear?.trim()) missingFields.push('Graduation Year');
        if (!formData.basicDetails?.city?.trim()) missingFields.push('City');
        break;
        
      case 2:
        if (!formData.education?.schooling?.schoolName?.trim()) missingFields.push('School Name');
        if (!formData.education?.schooling?.board?.trim()) missingFields.push('Board');
        if (!formData.education?.schooling?.city?.trim()) missingFields.push('Schooling City');
        if (!formData.education?.schooling?.state?.trim()) missingFields.push('Schooling State');
        if (!formData.education?.schooling?.startYear) missingFields.push('Schooling Start Year');
        if (!formData.education?.schooling?.endYear) missingFields.push('Schooling End Year');
        
        if (!formData.education?.college?.collegeName?.trim()) missingFields.push('College Name');
        if (!formData.education?.college?.stream?.trim()) missingFields.push('Stream');
        if (!formData.education?.college?.city?.trim()) missingFields.push('College City');
        if (!formData.education?.college?.state?.trim()) missingFields.push('College State');
        if (!formData.education?.college?.startYear) missingFields.push('College Start Year');
        if (!formData.education?.college?.endYear) missingFields.push('College End Year');
        
        if (!formData.education?.graduation?.universityName?.trim()) missingFields.push('University Name');
        if (!formData.education?.graduation?.degree?.trim()) missingFields.push('Degree');
        if (!formData.education?.graduation?.city?.trim()) missingFields.push('Graduation City');
        if (!formData.education?.graduation?.state?.trim()) missingFields.push('Graduation State');
        if (!formData.education?.graduation?.country?.trim()) missingFields.push('Country');
        if (!formData.education?.graduation?.startDate?.trim()) missingFields.push('Graduation Start Date');
        if (!formData.education?.graduation?.endDate?.trim()) missingFields.push('Graduation End Date');
        break;
        
      case 3:
        if (!formData.usmleScores?.step1Status) missingFields.push('USMLE Step 1 Status');
        break;
        
      case 4:
        if (!formData.usClinicalExperience?.list || formData.usClinicalExperience.list.length === 0) {
          missingFields.push('At least one US Clinical Experience');
        } else {
          formData.usClinicalExperience.list.forEach((exp, index) => {
            if (!exp.institution?.trim()) missingFields.push(`Experience ${index + 1}: Institution`);
            if (!exp.role?.trim()) missingFields.push(`Experience ${index + 1}: Role`);
            if (!exp.startDate) missingFields.push(`Experience ${index + 1}: Start Date`);
            if (!exp.endDate && !exp.current) missingFields.push(`Experience ${index + 1}: End Date`);
          });
        }
        break;
        
      case 5:
        if (!formData.skills?.skillsList?.trim()) missingFields.push('Skills List');
        break;
        
      default:
        break;
    }
    
    return missingFields;
  }, [activeStep, formData]);

  const calculateCompletedSteps = useCallback((data) => {
    const checks = [
      { condition: data.basicDetails?.fullName && data.basicDetails?.email, step: 1 },
      { condition: data.education?.graduation?.universityName && data.education?.graduation?.country, step: 2 },
      { condition: data.usmleScores?.step1Status, step: 3 },
      { condition: data.usClinicalExperience?.list?.length > 0, step: 4 },
      { condition: data.skills?.skillsList?.trim(), step: 5 },
      { condition: data.significantAchievements?.trim(), step: 6 },
      { condition: data.publications?.length > 0, step: 7 },
      { condition: data.conferences?.length > 0, step: 8 },
      { condition: data.emrRcmTraining?.emrSystems?.length > 0 || data.emrRcmTraining?.rcmTraining, step: 9 },
      { condition: data.workshops?.length > 0, step: 10 },
      { condition: true, step: 11 }
    ];
    
    return checks.filter(({ condition }) => condition).map(({ step }) => step);
  }, []);

  const getUserId = useCallback(() => {
    return user?._id || user?.id || localStorage.getItem('userId') || null;
  }, [user]);

  const checkExistingCV = useCallback(async () => {
    const userId = getUserId();
    
    if (!userId) {
      console.warn('No user ID found, skipping CV load');
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/cv/${userId}`);
      if (response.data.success) {
        const cvData = response.data.data;
        if (typeof cvData.skills === 'string') {
          cvData.skills = { skillsList: cvData.skills, supportingDocuments: [] };
        } else if (!cvData.skills) {
          cvData.skills = { skillsList: '', supportingDocuments: [] };
        }
        setFormData(cvData);
        setCompletedSteps(calculateCompletedSteps(cvData));
      }
    } catch (error) {
      console.error('Error loading CV:', error);
    } finally {
      setLoading(false);
    }
  }, [getUserId, calculateCompletedSteps]);

  const updateCompletedSteps = useCallback((newData) => {
    const newCompleted = calculateCompletedSteps(newData);
    setCompletedSteps(newCompleted);
    if (onStepComplete && newCompleted.includes(activeStep) && !completedSteps.includes(activeStep)) {
      onStepComplete(activeStep);
    }
  }, [calculateCompletedSteps, activeStep, completedSteps, onStepComplete]);

  useEffect(() => {
    checkExistingCV();
  }, [checkExistingCV]);

  useEffect(() => {
    if (currentStep && currentStep !== internalCurrentStep) {
      setInternalCurrentStep(currentStep);
    }
  }, [currentStep, internalCurrentStep]);

  const handleSaveProgress = () => {
    const missingFields = validateCurrentStep();
    
    if (missingFields.length > 0) {
      const fieldsList = missingFields.slice(0, 5).join(', ');
      const remainingCount = missingFields.length - 5;
      const message = remainingCount > 0 
        ? `${fieldsList} and ${remainingCount} more field${remainingCount > 1 ? 's' : ''}`
        : fieldsList;
      
      toast.error(`Please fill in the following required fields: ${message}`, {
        autoClose: 5000,
        position: 'top-right'
      });
      return;
    }
    
    setShowSaveModal(true);
  };

  const confirmSaveProgress = async () => {
    setShowSaveModal(false);
    await handleSave();
    handleNext();
  };

  const cancelSaveProgress = () => setShowSaveModal(false);

  const handleInputChange = useCallback((section, field, value) => {
    setFormData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (section === 'skills') {
        if (!newData.skills) newData.skills = {};
        newData.skills[field] = value;
      } else if (section === 'significantAchievements') {
        newData.significantAchievements = value;
      } else if (section === 'education') {
        if (!newData.education) newData.education = {};
        newData.education[field] = value;
      } else {
        if (!newData[section]) newData[section] = {};
        newData[section][field] = value;
      }
      return newData;
    });
  }, []);

  const handleArrayAdd = useCallback((section, newItem) => {
    setFormData(prevData => {
      const newData = { ...prevData, [section]: [...(prevData[section] || []), newItem] };
      setTimeout(() => updateCompletedSteps(newData), 100);
      return newData;
    });
  }, [updateCompletedSteps]);

  const handleArrayRemove = useCallback((section, index) => {
    setFormData(prevData => {
      const newData = { ...prevData, [section]: (prevData[section] || []).filter((_, i) => i !== index) };
      setTimeout(() => updateCompletedSteps(newData), 100);
      return newData;
    });
  }, [updateCompletedSteps]);

  const handleArrayUpdate = useCallback((section, index, field, value) => {
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [section]: prevData[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      };
      setTimeout(() => updateCompletedSteps(newData), 100);
      return newData;
    });
  }, [updateCompletedSteps]);

  const handleStepChange = useCallback((step) => {
    setInternalCurrentStep(step);
    onStepChange?.(step);
  }, [onStepChange]);

  const handleNext = useCallback(() => {
    const missingFields = validateCurrentStep();
    
    if (missingFields.length > 0 && activeStep <= 5) {
      const fieldsList = missingFields.slice(0, 5).join(', ');
      const remainingCount = missingFields.length - 5;
      const message = remainingCount > 0 
        ? `${fieldsList} and ${remainingCount} more field${remainingCount > 1 ? 's' : ''}`
        : fieldsList;
      
      toast.warning(`Please fill in the following required fields: ${message}`, {
        autoClose: 5000,
        position: 'top-right'
      });
      return;
    }
    
    handleStepChange(Math.min(totalSteps, activeStep + 1));
  }, [totalSteps, activeStep, handleStepChange, validateCurrentStep]);

  const handlePrevious = useCallback(() => {
    handleStepChange(Math.max(1, activeStep - 1));
  }, [activeStep, handleStepChange]);

  const handleSave = useCallback(async () => {
    const userId = getUserId();
    
    console.log('=== DEBUG INFO ===');
    console.log('User ID:', userId);
    console.log('User object:', user);
    console.log('LocalStorage userId:', localStorage.getItem('userId'));
    
    if (!userId) {
      toast.error('User not authenticated. Please login again.');
      return;
    }
    
    try {
      const saveData = { 
        ...formData, 
        userId: userId 
      };
      
      console.log('Making request to /cv/save');
      console.log('Request data:', { userId: saveData.userId });
      
      const response = await api.post('/cv/save', saveData);
      
      if (response.data.success) {
        toast.success("CV Saved Successfully");
      } else {
        toast.error(response.data.message || 'Failed to save CV');
      }
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save CV');
      }
    }
  }, [getUserId, user, formData]);

  const handlePreview = useCallback(() => setShowPreview(true), []);
  const handleBackFromPreview = useCallback(() => setShowPreview(false), []);
  const handleDownload = useCallback(() => {
    toast.info('PDF download functionality will be implemented soon');
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mx-auto max-w-full">
        <div className="text-center py-8 sm:py-12">
          <div className="text-lg sm:text-xl text-[#04445E]">Loading your CV...</div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <CVPreview
        cvData={formData}
        onClose={handleBackFromPreview}
        onBack={handleBackFromPreview}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mx-auto max-w-full lg:max-w-6xl">
      <ProgressBar currentStep={activeStep} totalSteps={totalSteps} />
      
      <StepContent
        currentStep={activeStep}
        formData={formData}
        onInputChange={handleInputChange}
        onArrayAdd={handleArrayAdd}
        onArrayRemove={handleArrayRemove}
        onArrayUpdate={handleArrayUpdate}
      />
      
      <NavigationControls
        currentStep={activeStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSaveProgress={handleSaveProgress}
        onPreview={handlePreview}
        completedSteps={completedSteps}
      />
      
      <SaveProgressModal
        open={showSaveModal}
        onConfirm={confirmSaveProgress}
        onCancel={cancelSaveProgress}
      />
    </div>
  );
};

export default CVBuilder;