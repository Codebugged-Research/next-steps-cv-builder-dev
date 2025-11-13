import React from 'react';
import { ArrowRight, Download, FileText } from 'lucide-react';

const NavigationControls = ({ currentStep, totalSteps, onPrevious, onNext, onSave, onSaveProgress }) => (
  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
    <button
      onClick={onPrevious}
      disabled={currentStep === 1}
      className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <div className="flex gap-4">
      {currentStep === totalSteps ? (
        <>
          {/* <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2 border border-[#169AB4] text-[#169AB4] rounded-lg hover:bg-[#169AB4] hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            Download CV
          </button> */}

          <button
            onClick={onSaveProgress}
            className="flex items-center gap-2 px-6 py-2 bg-[#04445E] text-white rounded-lg hover:bg-[#033a4d] transition-colors"
          >
            <FileText className="h-4 w-4" />
            Save Progress
          </button>
        </>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);

export default NavigationControls;