import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';

const IndependentArticles = () => {
  const [articles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddArticle = () => {
    setShowAddForm(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg mb-8">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-[#04445E]">Independent Articles ({articles.length})</h3>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-semibold text-[#04445E]">Independent Articles</h4>
            <p className="text-gray-600">Add articles you've worked on independently</p>
          </div>
          <button
            onClick={handleAddArticle}
            className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Article
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No independent articles added yet</p>
            <p className="text-sm">Add articles you've worked on with your college team</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h5 className="font-semibold text-[#04445E] mb-2">{article.title}</h5>
                <p className="text-gray-600 text-sm mb-2">Journal: {article.journal}</p>
                <p className="text-gray-600 text-sm">Year: {article.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndependentArticles;