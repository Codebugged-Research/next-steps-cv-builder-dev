import React from 'react';
import { ArrowRight } from 'lucide-react';

const NavigationItem = ({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
      isActive
        ? 'bg-[#169AB4] text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
    {isActive && <ArrowRight className="h-4 w-4 ml-auto" />}
  </button>
);

export default NavigationItem;