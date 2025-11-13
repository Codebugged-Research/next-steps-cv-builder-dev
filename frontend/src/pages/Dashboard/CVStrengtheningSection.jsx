import React from 'react';
import { BookOpen, FileText, Calendar, Heart, Award, ArrowRight, ChevronDown, ChevronRight, ChartSpline, FileTextIcon } from 'lucide-react';

const CVStrengtheningSection = ({
  activeSection,
  onSectionChange,
  showPrograms,
  onTogglePrograms
}) => {
  const programItems = [
    { 
      id: 'systematic-reviews', 
      label: 'Publications', 
      icon: BookOpen,
      description: ''
    },
    { 
      id: 'conferences', 
      label: 'Conferences', 
      icon: Calendar,
      description: ''
    },
    {
      id:'workshops',
      label:'Workshops',
      icon: FileTextIcon,
      description:''
    },
    { 
      id: 'emr-training', 
      label: 'EMR & RCM Training', 
      icon: Award,
      description: ''
    },
  ];

  return (
    <div>
      <button
        onClick={onTogglePrograms}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
          programItems.some(item => activeSection === item.id)
            ? 'bg-gradient-to-r from-[#04445E] to-[#169AB4] text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <ChartSpline className={`h-5 w-5 ${
          programItems.some(item => activeSection === item.id) ? 'text-white' : 'text-gray-500'
        }`} />
        <span className="font-medium flex-1">My CV Strengthening Program</span>
        {showPrograms ? (
          <ChevronDown className={`h-4 w-4 transition-transform ${
            programItems.some(item => activeSection === item.id) ? 'text-white' : 'text-gray-400'
          }`} />
        ) : (
          <ChevronRight className={`h-4 w-4 transition-transform ${
            programItems.some(item => activeSection === item.id) ? 'text-white' : 'text-gray-400'
          }`} />
        )}
      </button>

      {showPrograms && (
        <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
          {programItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#169AB4] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`h-4 w-4 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`} />
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-white' : 'text-gray-700'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${
                    isActive ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <ArrowRight className="h-3 w-3 text-white flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CVStrengtheningSection;