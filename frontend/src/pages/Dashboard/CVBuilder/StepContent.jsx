import BasicDetailsStep from './steps/BasicDetailsStep';
import EducationStep from './steps/EducationStep';
import USMLEScoresStep from './steps/USMLEScoresStep';
import USClinicalExperienceStep from './steps/USClinicalExperienceStep';
import SkillsStep from './steps/SkillsStep';
import AchievementsStep from './steps/AchievementsStep';
import PublicationsStep from './steps/PublicationsStep';
import ConferencesStep from './steps/ConferencesStep';
import WorkshopsStep from './steps/WorkshopsStep';
import EMRTrainingStep from './steps/EMRTrainingStep';
import ReviewStep from './steps/ReviewStep';

const stepComponents = {
  1: BasicDetailsStep,
  2: EducationStep,
  3: USMLEScoresStep,
  4: USClinicalExperienceStep,
  5: SkillsStep,
  6: AchievementsStep,
  7: PublicationsStep,
  8: ConferencesStep,
  9: EMRTrainingStep,
  10: WorkshopsStep,
  11: ReviewStep
};

const StepContent = ({ currentStep, formData, onInputChange, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const StepComponent = stepComponents[currentStep];
  
  if (!StepComponent) return null;
  
  return (
    <StepComponent
      formData={formData}
      onInputChange={onInputChange}
      onArrayAdd={onArrayAdd}
      onArrayRemove={onArrayRemove}
      onArrayUpdate={onArrayUpdate}
    />
  );
};

export default StepContent;