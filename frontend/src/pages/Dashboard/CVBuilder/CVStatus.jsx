import React from 'react';
import { Download, FileText, Edit, Calendar } from 'lucide-react';

const CVStatus = ({ cvData, onEdit, onDownload }) => {
  const getFileName = () => {
    const name = cvData?.basicDetails?.fullName || 'CV';
    return `${name.replace(/\s+/g, '_')}_CV.pdf`;
  };

  const getLastUpdated = () => {
    if (cvData?.updatedAt) {
      return new Date(cvData.updatedAt).toLocaleDateString();
    }
    return 'Recently';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-[#169AB4] rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#04445E] mb-2">Your CV is Ready!</h2>
        <p className="text-gray-600">Your professional medical CV has been created and saved.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#169AB4]" />
            <div>
              <h3 className="font-semibold text-[#04445E]">{getFileName()}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {getLastUpdated()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.publications?.length || 0}
            </div>
            <div>Publications</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.conferences?.length || 0}
            </div>
            <div>Conferences</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.workshops?.length || 0}
            </div>
            <div>Workshops</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[#04445E]">
              {cvData?.emrRcmTraining?.emrSystems?.length || 0}
            </div>
            <div>EMR Systems</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-6 py-3 border border-[#169AB4] text-[#169AB4] rounded-lg hover:bg-[#169AB4] hover:text-white transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit CV
        </button>
        
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-6 py-3 bg-[#04445E] text-white rounded-lg hover:bg-[#033a4d] transition-colors"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CVStatus;