import React, { useState, useEffect } from 'react';
import { User, FileText, Heart, ArrowRight, CheckCircle, ChevronDown, ChevronRight, Eye, Menu, X } from 'lucide-react';
import NavigationItem from './NavigationItem';
import CVStrengtheningSection from './CVStrengtheningSection';
import useHasCV from '../../hooks/useHasCV';

const Sidebar = ({ 
  activeSection, 
  onSectionChange, 
  user, 
  currentStep, 
  onStepChange, 
  completedSteps = [] 
}) => {
  const [showCVSteps, setShowCVSteps] = useState(false);
  const [showPrograms, setShowPrograms] = useState(
    ['systematic-reviews', 'case-reports', 'conferences', 'workshops', 'emr-training'].includes(activeSection)
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { hasCV, loading } = useHasCV();

  const mainNavigationItems = [
    { id: 'cv-builder', label: 'CV Builder', icon: FileText },
    ...(hasCV ? [{ id: 'cv-status', label: 'View CV', icon: Eye }] : []),
  ];
  
  const cvSteps = [
    { id: 1, label: 'Basic Details', shortLabel: 'Basic Details' },
    { id: 2, label: 'Education', shortLabel: 'Education' },
    { id: 3, label: 'USMLE Scores', shortLabel: 'USMLE Scores' },
    { id: 4, label: 'US Clinical Experience', shortLabel: 'US CE' },
    { id: 5, label: 'Skills', shortLabel: 'Skills' },
    { id: 6, label: 'Achievements', shortLabel: 'Achievements' },
    { id: 7, label: 'Publications', shortLabel: 'Publications' },
    { id: 8, label: 'Conferences', shortLabel: 'Conferences' },
    { id: 9, label: 'EMR & RCM', shortLabel: 'EMR & RCM' },
    { id: 10, label: 'Workshops', shortLabel: 'Workshops' },
    { id: 11, label: 'Review', shortLabel: 'Review' }
  ];

  const handleCVBuilderClick = () => {
    onSectionChange('cv-builder');
    setShowCVSteps(!showCVSteps); 
    setShowPrograms(false);
  };

  const handleStepClick = (stepId) => {
    if (activeSection !== 'cv-builder') {
      onSectionChange('cv-builder');
    }
    if (onStepChange) {
      onStepChange(stepId);
    }
    // Close mobile menu after selection
    setIsMobileMenuOpen(false);
  };

  const handleTogglePrograms = () => {
    setShowPrograms(!showPrograms);
    setShowCVSteps(false);
  };

  const handleProgramSectionChange = (section) => {
    onSectionChange(section);
    setShowPrograms(true);
    setShowCVSteps(false);
    // Close mobile menu after selection
    setIsMobileMenuOpen(false);
  };

  const handleNavigationClick = (itemId) => {
    onSectionChange(itemId);
    setShowPrograms(false);
    setShowCVSteps(false);
    // Close mobile menu after selection
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (['systematic-reviews', 'case-reports', 'conferences', 'workshops', 'emr-training'].includes(activeSection)) {
      setShowPrograms(true);
      setShowCVSteps(false);
    }
  }, [activeSection]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#04445E] to-[#169AB4] rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#04445E] truncate text-sm sm:text-base">
            {user?.fullName || 'User'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 uppercase truncate">
            {user?.medicalSchool}
          </p>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] lg:max-h-none">
        {mainNavigationItems.map((item) => {
          if (item.id === 'cv-builder') {
            return (
              <div key={item.id}>
                <button
                  onClick={handleCVBuilderClick}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 group ${
                    activeSection === item.id
                      ? 'bg-[#04445E] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                    activeSection === item.id ? 'text-white' : 'text-gray-500'
                  }`} />
                  <span className="font-medium flex-1 text-sm sm:text-base">{item.label}</span>
                  {showCVSteps ? (
                    <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${
                      activeSection === item.id ? 'text-white' : 'text-gray-400'
                    }`} />
                  ) : (
                    <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${
                      activeSection === item.id ? 'text-white' : 'text-gray-400'
                    }`} />
                  )}
                </button>

                {showCVSteps && (
                  <div className="mt-2 ml-3 sm:ml-4 space-y-1 border-l-2 border-gray-100 pl-3 sm:pl-4">
                    {cvSteps.map((step) => {
                      const isActive = currentStep === step.id && activeSection === 'cv-builder';
                      const isCompleted = completedSteps.includes(step.id);
                      return (
                        <button
                          key={step.id}
                          onClick={() => handleStepClick(step.id)}
                          className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-left text-xs sm:text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-[#169AB4] text-white shadow-sm'
                              : isCompleted
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            ) : (
                              <span className={`text-xs font-medium ${
                                isActive ? 'text-white' : 'text-gray-500'
                              }`}>
                                {step.id}
                              </span>
                            )}
                          </div>
                          <span className="truncate">{step.shortLabel}</span>
                          {isActive && (
                            <ArrowRight className="h-3 w-3 text-white ml-auto flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavigationItem
              key={item.id}
              {...item}
              isActive={activeSection === item.id}
              onClick={() => handleNavigationClick(item.id)}
              color={item.color}
            />
          );
        })}
        
        <CVStrengtheningSection
          activeSection={activeSection}
          onSectionChange={handleProgramSectionChange}
          showPrograms={showPrograms}
          onTogglePrograms={handleTogglePrograms}
        />
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button - Fixed at top */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-[#04445E] text-white rounded-lg shadow-lg hover:bg-[#033647] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: static, Mobile: slide-out */}
      <div className={`
        lg:w-80 lg:flex-shrink-0
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="bg-white rounded-none lg:rounded-xl shadow-lg p-4 sm:p-6 h-full lg:h-auto lg:sticky lg:top-8 overflow-hidden w-80 max-w-[85vw] sm:max-w-md lg:max-w-none">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;