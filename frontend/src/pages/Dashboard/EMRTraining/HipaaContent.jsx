import React from 'react';
import { Shield, Lock, FileText, AlertTriangle, X } from 'lucide-react';

const HipaaContent = ({ onClose }) => {
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
              >
                <X className="w-6 h-6" />
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
                This agreement outlines your responsibilities and commitments during your training period at Next Steps Career Corp.
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#169AB4] text-white rounded-lg hover:bg-[#147a8f] transition-colors font-medium shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HipaaContent;