const ProgressBar = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
      <span className="text-sm text-gray-500">{Math.round((currentStep - 1) / totalSteps * 100)}% Complete</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-[#169AB4] h-2 rounded-full transition-all duration-300"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  </div>
);
export default ProgressBar;