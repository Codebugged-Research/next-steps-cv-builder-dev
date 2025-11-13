import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';

const NextStepsProjects = () => {
  const [projects] = useState([]);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-[#04445E]">Next Steps Projects ({projects.length})</h3>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-semibold text-[#04445E]">Next Steps Projects</h4>
            <p className="text-gray-600">Work with Next Steps team and peer groups</p>
          </div>
          <div className="flex gap-3">
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No Next Steps projects yet</p>
            <p className="text-sm">Start your first project or join an existing one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h5 className="font-semibold text-[#04445E] mb-2">{project.title}</h5>
                <p className="text-gray-600 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NextStepsProjects;