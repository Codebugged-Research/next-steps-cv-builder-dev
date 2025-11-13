import React, { useState } from 'react';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';
import { Shield, Lock, FileText, AlertTriangle } from 'lucide-react';

const HipaaAgreementComponent = ({ onAccept, onDecline, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/users/accept-hipaa');      
      if (response.data.success) {
        toast.success('HIPAA agreement accepted successfully.');
        onAccept();
      } else {
        toast.error('Failed to save agreement. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting HIPAA agreement:', error);
      toast.error('Failed to save agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#04445E] text-center flex-1">
              STUDENT CONSENT & HIPAA COMPLIANCE AGREEMENT
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                I, hereby acknowledge and agree to the following terms and conditions while participating in the Electronic Medical Records (EMR) and Revenue Cycle Management (RCM) training conducted at <span className="font-semibold">Next Steps Career Corp</span>.
              </p>
            </div>

            <div className="border-l-4 border-[#169AB4] pl-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-6 w-6 text-[#169AB4]" />
                <h3 className="text-lg font-bold text-[#04445E]">
                  1. Confidentiality and HIPAA Compliance
                </h3>
              </div>
              <p className="text-gray-700 mb-3">
                I understand that during my training, I may have access to sensitive Patient Health Information (PHI) as protected under the Health Insurance Portability and Accountability Act (HIPAA). I acknowledge my responsibility to uphold the highest standards of confidentiality, including:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Not accessing, using, or disclosing any patient information unless authorized and necessary for training purposes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Ensuring that all PHI remains strictly confidential and is not shared with unauthorized individuals.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Following all HIPAA policies and procedures as outlined by Next Steps Career Corp.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Reporting any potential breaches of confidentiality to my supervisor immediately.</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-[#169AB4] pl-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-6 w-6 text-[#169AB4]" />
                <h3 className="text-lg font-bold text-[#04445E]">
                  2. Data Security & Proper Use of Systems
                </h3>
              </div>
              <p className="text-gray-700 mb-3">I agree to:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Use the EMR system only for authorized training purposes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Refrain from taking screenshots, recording, or saving any patient-related data.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Log out of all systems when not in use to prevent unauthorized access.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#169AB4] font-bold">•</span>
                  <span className="text-gray-700">Adhere to the security policies set forth by Next Steps Career Corp.</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-[#169AB4] pl-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-6 w-6 text-[#169AB4]" />
                <h3 className="text-lg font-bold text-[#04445E]">
                  3. Non-Disclosure Agreement
                </h3>
              </div>
              <p className="text-gray-700">
                I understand that the information I have access to during the training is proprietary and confidential. I agree not to disclose or reproduce any materials, data, or training content outside of this program without prior written consent from Next Steps Career Corp.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-bold text-[#04445E]">
                  4. Acknowledgment of Compliance and Consequences of Violation
                </h3>
              </div>
              <p className="text-gray-700 mb-3">
                I acknowledge that any violation of HIPAA regulations, confidentiality agreements, or security protocols may result in:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-gray-700">Immediate termination of my training.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-gray-700">Legal consequences as per HIPAA and company policies.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-gray-700">Reporting to my educational institution for further disciplinary action.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-gray-800 font-medium">
                By clicking "I Agree & Accept" below, I confirm that I have read, understood, and agreed to abide by the above terms and conditions throughout my training period at Next Steps Career Corp.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex gap-4">
              <button
                onClick={onDecline}
                disabled={isSubmitting}
                className="px-8 py-3 border-2 border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'I Agree & Accept'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HipaaAgreementComponent;