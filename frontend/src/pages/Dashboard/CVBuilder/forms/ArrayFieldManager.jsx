import React from 'react';
import { Plus } from 'lucide-react';

const ArrayFieldManager = ({ title, items, onAdd, onRemove, renderItem, newItemTemplate }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[#04445E]">{title}</h2>
      <button
        onClick={() => onAdd(newItemTemplate)}
        className="flex items-center gap-2 px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add {title.slice(0, -1)}
      </button>
    </div>

    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          {renderItem(item, index)}
          
          <button
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 text-sm mt-4"
          >
            Remove {title.slice(0, -1)}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ArrayFieldManager;