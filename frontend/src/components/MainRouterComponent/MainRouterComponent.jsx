
import CVBuilder from '../../pages/Dashboard/CVBuilder/CVBuilder.jsx';
import ViewCV from '../../pages/Dashboard/ViewCV/ViewCV.jsx';
import Existingcv from '../../pages/Dashboard//ExistingCV/Existingcv.jsx';
import SystematicReviews from '../../pages/Dashboard/SystematicReview/SystematicReviews.jsx';
import Conferences from '../../pages/Dashboard/Conferences/Conferences.jsx';
import Emrtraining from '../../pages/Dashboard/EMRTraining/Emrtraining.jsx';
import WorkshopsComponent from '../../pages/Dashboard/Workshops/Workshops.jsx';

const MainContentRouter = ({ 
  activeSection, 
  onSectionChange, 
  user, 
  currentCVStep, 
  onCVStepChange, 
  onStepComplete 
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'cv-builder':
        return (
          <CVBuilder
            key={user?._id || "guest"}
            user={user}
            currentStep={currentCVStep}
            onStepChange={onCVStepChange}
            onStepComplete={onStepComplete}
          />
        );

      case 'cv-status':
        return (
          <ViewCV
            onEdit={() => onSectionChange('cv-builder')}
          />
        );

      case 'existing-cv':
        return (
          <Existingcv onBack={() => onSectionChange('cv-builder')} />
        );

      case 'systematic-reviews':
        return (
          <SystematicReviews
            onBack={() => onSectionChange('cv-builder')}
            user={user}
          />
        );

      case 'conferences':
        return (
          <Conferences
            onBack={() => onSectionChange('cv-builder')}
            user={user}
          />
        );

      case 'workshops':
        return (
          <WorkshopsComponent
            onBack={() => onSectionChange('cv-builder')}
            user={user}
          />
        );

      case 'emr-training':
        return (
          <Emrtraining
            onBack={() => onSectionChange('cv-builder')}
            user={user}
          />
        );
      default:
        return (
          <CVBuilder
            key={user?._id || "guest"}
            user={user}
            currentStep={currentCVStep}
            onStepChange={onCVStepChange}
            onStepComplete={onStepComplete}
          />
        );
    }
  };

  return (
    <div className="flex-1">
      {renderContent()}
    </div>
  );
};

export default MainContentRouter;