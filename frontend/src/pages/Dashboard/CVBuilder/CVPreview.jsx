import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';

const CVPreview = ({ cvData, onBack, onDownload }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-12 mb-8" id="cv-document">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#04445E] mb-4">
              {cvData?.basicDetails?.fullName || 'Your Name'}
            </h1>
            <div className="text-lg text-gray-600">
              {cvData?.basicDetails?.email || 'email@example.com'} | {cvData?.basicDetails?.phone || 'Phone Number'}
            </div>
            {cvData?.basicDetails?.city && (
              <div className="text-lg text-gray-600 mt-1">
                {cvData.basicDetails.city}
              </div>
            )}
          </div>

          {/* Education Section */}
          {(cvData?.education?.medicalSchoolName || cvData?.basicDetails?.medicalSchool || cvData?.basicDetails?.graduationYear) && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Education
              </h2>
              
              <div className="space-y-4">
                {cvData?.education?.medicalSchoolName && (
                  <div>
                    <div className="font-semibold text-lg">{cvData.education.medicalSchoolName}</div>
                    {cvData?.education?.country && (
                      <div className="text-gray-600">{cvData.education.country}</div>
                    )}
                    {(cvData?.education?.joiningDate || cvData?.education?.completionDate) && (
                      <div className="text-gray-600">
                        {cvData.education.joiningDate} - {cvData.education.completionDate}
                      </div>
                    )}
                  </div>
                )}
                
                {cvData?.basicDetails?.medicalSchool && !cvData?.education?.medicalSchoolName && (
                  <div>
                    <div className="font-semibold text-lg">{cvData.basicDetails.medicalSchool}</div>
                  </div>
                )}
                
                {cvData?.basicDetails?.graduationYear && (
                  <div className="text-gray-700">
                    <span className="font-medium">Graduation Year:</span> {cvData.basicDetails.graduationYear}
                  </div>
                )}

                {/* Academic Performance */}
                {(cvData?.education?.firstYearPercentage || cvData?.education?.secondYearPercentage || 
                  cvData?.education?.preFinalYearPercentage || cvData?.education?.finalYearPercentage) && (
                  <div className="mt-4">
                    <div className="font-medium text-gray-700 mb-2">Academic Performance:</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {cvData.education.firstYearPercentage && (
                        <div>First Year: {cvData.education.firstYearPercentage}%</div>
                      )}
                      {cvData.education.secondYearPercentage && (
                        <div>Second Year: {cvData.education.secondYearPercentage}%</div>
                      )}
                      {cvData.education.preFinalYearPercentage && (
                        <div>Pre-Final: {cvData.education.preFinalYearPercentage}%</div>
                      )}
                      {cvData.education.finalYearPercentage && (
                        <div>Final Year: {cvData.education.finalYearPercentage}%</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* USMLE Scores */}
          {(cvData?.usmleScores?.step1Status !== 'not-taken' || cvData?.usmleScores?.step2ckScore || cvData?.usmleScores?.ecfmgCertified) && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                USMLE Scores
              </h2>
              <div className="space-y-2">
                {cvData?.usmleScores?.step1Status !== 'not-taken' && (
                  <div><span className="font-medium">Step 1:</span> {cvData.usmleScores.step1Status}</div>
                )}
                {cvData?.usmleScores?.step2ckScore && (
                  <div><span className="font-medium">Step 2 CK:</span> {cvData.usmleScores.step2ckScore}</div>
                )}
                {cvData?.usmleScores?.ecfmgCertified && (
                  <div><span className="font-medium">ECFMG Certified:</span> Yes</div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData?.skills && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Skills & Competencies
              </h2>
              <div className="text-gray-700 whitespace-pre-line">
                {cvData.skills}
              </div>
            </div>
          )}

          {/* Publications */}
          {cvData?.publications && cvData.publications.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Publications
              </h2>
              <div className="space-y-4">
                {cvData.publications.map((pub, index) => (
                  <div key={index} className="border-l-4 border-[#169AB4] pl-4">
                    <div className="font-semibold">{pub.title}</div>
                    <div className="text-gray-600">{pub.journal} ({pub.year})</div>
                    <div className="text-sm text-gray-500 capitalize">{pub.type.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conferences */}
          {cvData?.conferences && cvData.conferences.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Conferences Attended
              </h2>
              <div className="space-y-4">
                {cvData.conferences.map((conf, index) => (
                  <div key={index} className="border-l-4 border-[#169AB4] pl-4">
                    <div className="font-semibold">{conf.name}</div>
                    <div className="text-gray-600">
                      {conf.role} ({conf.year})
                      {conf.certificateAwarded && <span className="ml-2 text-green-600">• Certificate Awarded</span>}
                    </div>
                    {conf.description && (
                      <div className="text-gray-700 mt-1">{conf.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workshops */}
          {cvData?.workshops && cvData.workshops.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Workshops & Training
              </h2>
              <div className="space-y-4">
                {cvData.workshops.map((workshop, index) => (
                  <div key={index} className="border-l-4 border-[#169AB4] pl-4">
                    <div className="font-semibold">{workshop.name}</div>
                    <div className="text-gray-600">
                      {workshop.organizer && `${workshop.organizer} • `}
                      {workshop.year || workshop.date}
                    </div>
                    {workshop.description && (
                      <div className="text-gray-700 mt-1">{workshop.description}</div>
                    )}
                    {workshop.awards && (
                      <div className="text-green-600 mt-1 font-medium">{workshop.awards}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(cvData?.emrRcmTraining?.emrSystems?.length > 0 || cvData?.emrRcmTraining?.rcmTraining) && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                EMR & RCM Training
              </h2>
              <div className="space-y-2">
                {cvData.emrRcmTraining.emrSystems.length > 0 && (
                  <div>
                    <span className="font-medium">EMR Systems:</span> {cvData.emrRcmTraining.emrSystems.join(', ')}
                  </div>
                )}
                {cvData.emrRcmTraining.rcmTraining && (
                  <div>
                    <span className="font-medium">RCM Training:</span> Completed
                    {cvData.emrRcmTraining.duration && ` (${cvData.emrRcmTraining.duration})`}
                  </div>
                )}
              </div>
            </div>
          )}

          {cvData?.significantAchievements && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#04445E] mb-6 border-b-2 border-gray-200 pb-2">
                Significant Achievements
              </h2>
              <div className="text-gray-700 whitespace-pre-line">
                {cvData.significantAchievements}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Edit
          </button>
          
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-8 py-3 bg-[#04445E] text-white rounded-lg hover:bg-[#033a4d] transition-colors font-medium"
          >
            <Download className="h-5 w-5" />
            Download PDF Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;