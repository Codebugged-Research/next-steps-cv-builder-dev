import React, { useState } from 'react';
import FormField from '../forms/FormField';
import { Plus, X, Link, Upload, Award, Calendar, FileText, ExternalLink } from 'lucide-react';

const AchievementsStep = ({ formData, onInputChange, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
    url: '',
    attachmentType: 'none'
  });

  const handleAddAchievement = () => {
    if (newAchievement.title.trim()) {
      onArrayAdd('achievements', { ...newAchievement, id: Date.now() });
      setNewAchievement({
        title: '',
        description: '',
        date: '',
        url: '',
        attachmentType: 'none'
      });
    }
  };

  const handleRemoveAchievement = (index) => {
    onArrayRemove('achievements', index);
  };

  const handleUpdateAchievement = (index, field, value) => {
    onArrayUpdate('achievements', index, field, value);
  };

  const achievements = formData.achievements || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#04445E] mb-6">Significant Achievements</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          General Achievements Summary
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            value={formData.significantAchievements || ''}
            onChange={(e) => onInputChange('significantAchievements', '', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
            placeholder="Provide a general overview of your achievements, awards, honors, etc."
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#04445E]">Detailed Achievements</h3>
        
        {achievements.map((achievement, index) => (
          <div key={achievement.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-[#04445E] flex items-center gap-2">
                <Award className="h-5 w-5 text-[#169AB4]" />
                {achievement.title}
              </h4>
              <button
                onClick={() => handleRemoveAchievement(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Achievement Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => handleUpdateAchievement(index, 'title', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                    placeholder="e.g., Dean's List, Research Award"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Received
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={achievement.date}
                    onChange={(e) => handleUpdateAchievement(index, 'date', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={achievement.description}
                  onChange={(e) => handleUpdateAchievement(index, 'description', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                  placeholder="Brief description of the achievement"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <label className="text-sm font-medium text-gray-700">Supporting Evidence</label>
              
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`attachment-${index}`}
                    value="none"
                    checked={achievement.attachmentType === 'none'}
                    onChange={() => handleUpdateAchievement(index, 'attachmentType', 'none')}
                    className="mr-2"
                  />
                  None
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`attachment-${index}`}
                    value="url"
                    checked={achievement.attachmentType === 'url'}
                    onChange={() => handleUpdateAchievement(index, 'attachmentType', 'url')}
                    className="mr-2"
                  />
                  <Link className="h-4 w-4 mr-1" />
                  URL/Link
                </label>
              </div>
              
              {achievement.attachmentType === 'url' && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL/Drive Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={achievement.url || ''}
                      onChange={(e) => handleUpdateAchievement(index, 'url', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                      placeholder="https://drive.google.com/... or any supporting URL"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-[#04445E] mb-4">Add New Achievement</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievement Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Award className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                  placeholder="e.g., Dean's List, Research Award"
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Received
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="relative mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                value={newAchievement.description}
                onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                placeholder="Brief description of the achievement"
                rows={2}
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700">Supporting Evidence</label>
            
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="new-attachment"
                  value="none"
                  checked={newAchievement.attachmentType === 'none'}
                  onChange={() => setNewAchievement(prev => ({ ...prev, attachmentType: 'none', url: '' }))}
                  className="mr-2"
                />
                None
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="new-attachment"
                  value="url"
                  checked={newAchievement.attachmentType === 'url'}
                  onChange={() => setNewAchievement(prev => ({ ...prev, attachmentType: 'url' }))}
                  className="mr-2"
                />
                <Link className="h-4 w-4 mr-1" />
                URL/Link
              </label>
            </div>
            
            {newAchievement.attachmentType === 'url' && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL/Drive Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newAchievement.url}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#169AB4] focus:border-transparent"
                    placeholder="https://drive.google.com/... or any supporting URL"
                  />
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddAchievement}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsStep;