import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ProjectHeader from '../../Common/ProjectHeader';
import NextStepsProjects from './NextStepsProjects';
import IndependentArticles from './IndependentArticles';

const CaseReports = ({ onBack }) => {
  const headerConfig = {
    icon: BookOpen,
    title: 'Case Reports',
    subtitle: 'Collaborate with peers and Next Steps team for publication-ready research',
    stats: [
      { value: '8', label: 'Project Stages' },
      { value: '5', label: 'Students per Batch' },
      { value: '100%', label: 'Publication Support' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-[#169AB4] hover:text-[#147a8f] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button> */}

        <ProjectHeader {...headerConfig} />
        <NextStepsProjects />
        <IndependentArticles />
      </div>
    </div>
  );
};

export default CaseReports;