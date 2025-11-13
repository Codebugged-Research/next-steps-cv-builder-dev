import React, { useState, useEffect } from 'react';
import Header from '../../components/Common/Header.jsx';
import Footer from '../../components/Common/Footer.jsx';
import Sidebar from '../Dashboard/Sidebar.jsx';
import MainContentRouter from '../../components/MainRouterComponent/MainRouterComponent.jsx';

const DashboardLayout = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'cv-builder';
  });
  
  const [currentCVStep, setCurrentCVStep] = useState(() => {
    const saved = localStorage.getItem('currentCVStep');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('completedSteps');
    return saved ? JSON.parse(saved) : [];
  });

  console.log('DashboardLayout user prop:', user);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('currentCVStep', currentCVStep.toString());
  }, [currentCVStep]);

  useEffect(() => {
    localStorage.setItem('completedSteps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'cv-builder' && activeSection !== 'cv-builder') {
      setCurrentCVStep(1);
    }
  };

  const handleCVStepChange = (step) => {
    setCurrentCVStep(step);
  };

  const handleStepComplete = (step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step].sort((a, b) => a - b));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onLogout={onLogout} />
      <div className="flex-1 max-w-full w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 h-full">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            user={user}
            currentStep={activeSection === 'cv-builder' ? currentCVStep : null}
            onStepChange={activeSection === 'cv-builder' ? handleCVStepChange : null}
            completedSteps={activeSection === 'cv-builder' ? completedSteps : []}
          />
          
          <MainContentRouter
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            user={user}
            currentCVStep={currentCVStep}
            onCVStepChange={handleCVStepChange}
            onStepComplete={handleStepComplete}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;