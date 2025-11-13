import React from 'react';

const SaveProgressModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-[#04445E] mb-4">Save Progress</h2>
        <p className="text-gray-600 mb-6">
          Do you want to save your progress?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f]"
          >
            Yes, Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveProgressModal;
