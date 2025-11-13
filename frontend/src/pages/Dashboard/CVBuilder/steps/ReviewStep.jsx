import { CheckCircle } from 'lucide-react';

const ReviewStep = ({ formData }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#04445E] mb-6">Review & Submit</h2>
    
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-[#04445E] mb-4">CV Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Basic Information</h4>
          <p className="text-sm text-gray-600">{formData.basicDetails.fullName}</p>
          <p className="text-sm text-gray-600">{formData.basicDetails.email}</p>
          <p className="text-sm text-gray-600">{formData.basicDetails.medicalSchool}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Sections Completed</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Publications: {formData.publications.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Conferences: {formData.conferences.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Workshops: {formData.workshops.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">EMR Systems: {formData.emrRcmTraining.emrSystems.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReviewStep;