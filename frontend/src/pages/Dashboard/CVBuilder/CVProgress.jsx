
import steps from "./constants/steps";
const CVProgress = () => {

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="font-semibold text-[#04445E] mb-4">CV Progress</h4>
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600"
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-200 text-gray-600">
              {step.id}
            </div>
            <span className="text-sm">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVProgress;