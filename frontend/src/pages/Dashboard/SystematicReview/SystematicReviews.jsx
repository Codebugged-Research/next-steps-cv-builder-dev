import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Search, FileText, Edit, CheckCircle, Eye, Download, Users, Calendar, Target, ChevronLeft, ChevronRight, List } from 'lucide-react';
import ProjectHeader from '../../../components/Common/ProjectHeader';
import api from '../../../services/api';

const PublicationTimeline = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stagesPerPage = 5;

  const timelineStages = [
    {
      id: 0,
      title: "Stage 1",
      duration: "Month 1",
      icon: BookOpen,
      content: {
        overview: "Foundation of research methodology and article types",
        topics: [
          "Introduction to Research",
          "Types of Article's",
          "Purpose of Review Article",
          "Introduction to PICO Chart",
          "Purpose of PICO Chart"
        ]
      }
    },
    {
      id: 1,
      title: "Stage 2",
      duration: "Month 1",
      icon: Target,
      content: {
        overview: "Developing PICO framework and understanding publication process",
        topics: [
          "Framing a title using PICO Chart with examples",
          "Information about Publication Process",
          "Initiation for Review Article topics",
          "Information regarding Next Class"
        ]
      }
    },
    {
      id: 2,
      title: "Stage 3",
      duration: "Month 1",
      icon: Search,
      content: {
        overview: "Search strategy development and database navigation",
        topics: [
          "Introduction to Search Strategy",
          "Purpose of Search Strategy",
          "Introduction to Pubmed Database",
          "Search rules related to Pubmed Database"
        ]
      }
    },
    {
      id: 3,
      title: "Stage 4",
      duration: "Month 1",
      icon: FileText,
      content: {
        overview: "Case reports introduction and practical demonstrations",
        topics: [
          "Introduction to Case Reports",
          "Purpose of Case Reports",
          "Structure of Case Reports",
          "Few Examples",
          "Initiation for Case Report topics",
          "Examples through Demonstration"
        ]
      }
    },
    {
      id: 4,
      title: "Stage 5",
      duration: "Month 1",
      icon: Users,
      content: {
        overview: "Resource access and citation management tools",
        topics: [
          "How to Access Paper's using Paperpanda",
          "Discussion on Students' topics in relation with PICO Chart",
          "Introduction to Reference Citation Manager",
          "Demonstration of Mendeley Citation Manager",
          "Guidelines for Systematic Review Article"
        ]
      }
    },
    {
      id: 5,
      title: "Stage 6",
      duration: "Month 2",
      icon: Users,
      content: {
        overview: "Topic finalization and task distribution",
        topics: [
          "Finalize Review Article Topic",
          "Distribution of Tasks between Students",
          "Discussion on Case Report Topics"
        ]
      }
    },
    {
      id: 6,
      title: "Stage 7",
      duration: "Month 2",
      icon: Edit,
      content: {
        overview: "Case report and systematic review finalization with comprehensive discussion",
        topics: [
          "Finalize Case Report Topic",
          "Finalize Systematic Review Topic",
          "Distribution of Tasks between Students",
          "Discussion on RA, CR & SC"
        ]
      }
    },
    {
      id: 7,
      title: "Stage 8",
      duration: "Month 2",
      icon: Eye,
      content: {
        overview: "Progress monitoring and quality assurance",
        topics: [
          "RA, CR & SC progress monitoring"
        ]
      }
    },
    {
      id: 8,
      title: "Stage 9-12",
      duration: "Month 3",
      icon: FileText,
      content: {
        overview: "Final draft preparation and submission",
        topics: [
          "Preparation & Submissions of final draft (RA, CR & SC)"
        ]
      }
    },
    {
      id: 9,
      title: "Stage 13-16",
      duration: "Month 4",
      icon: CheckCircle,
      content: {
        overview: "Quality review and journal selection",
        topics: [
          "Proof reading plagiarism check grammar corrections selection of suitable journals"
        ]
      }
    },
    {
      id: 10,
      title: "Stage 17-20",
      duration: "Month 5",
      icon: Download,
      content: {
        overview: "Publication follow-up and final processing",
        topics: [
          "Publication status follow-up",
          "Minor/Major revisions",
          "PDF Generation"
        ]
      }
    }
  ];

  useEffect(() => {
    fetchUserPublications();
  }, []);

  const fetchUserPublications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/publications/user/publications');
      
      if (response.data.success) {
        setPublications(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedProject(response.data.data[0]._id);
          const firstProject = response.data.data[0].projects[0];
          if (firstProject) {
            setSelectedProjectId(firstProject._id);
            setActiveStage(firstProject.stage - 1);
            setCurrentPage(Math.floor((firstProject.stage - 1) / stagesPerPage));
          }
        }
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch publications');
      setLoading(false);
    }
  };

  const getStatusForStage = (stageNumber) => {
    if (!selectedProject || !selectedProjectId) return 'pending';
    
    const publication = publications.find(p => p._id === selectedProject);
    if (!publication) return 'pending';

    const project = publication.projects.find(p => p._id === selectedProjectId);
    if (!project) return 'pending';

    const currentStage = project.stage;
    
    if (stageNumber < currentStage) return 'completed';
    if (stageNumber === currentStage) return 'in-progress';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-[#04445E]';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return '✓';
      case 'in-progress': return '◐';
      case 'pending': return '○';
      default: return '○';
    }
  };

  const totalPages = Math.ceil(timelineStages.length / stagesPerPage);
  const currentStages = timelineStages.slice(
    currentPage * stagesPerPage, 
    (currentPage + 1) * stagesPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setActiveStage(currentPage * stagesPerPage + stagesPerPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveStage((currentPage - 1) * stagesPerPage);
    }
  };

  const handleProjectSelect = (publicationId, projectId) => {
    setSelectedProject(publicationId);
    setSelectedProjectId(projectId);
    setShowProjectSelector(false);
    
    const publication = publications.find(p => p._id === publicationId);
    if (publication) {
      const project = publication.projects.find(proj => proj._id === projectId);
      if (project) {
        setActiveStage(project.stage - 1);
        setCurrentPage(Math.floor((project.stage - 1) / stagesPerPage));
      }
    }
  };

  const currentPublication = publications.find(p => p._id === selectedProject);
  const currentProjectData = currentPublication?.projects.find(p => p._id === selectedProjectId);

  const downloadCertificate = (certificateUrl) => {
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04445E]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="text-center py-12">
          <p className="text-gray-600">No publications found. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Project Selector */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Currently Viewing</h3>
            <p className="text-lg font-semibold text-gray-900">{currentProjectData?.name || 'Select a project'}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentPublication?.status === 'active' ? 'bg-yellow-100 text-yellow-700' : 
                currentPublication?.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {currentPublication?.status}
              </span>
              <span className="text-xs text-gray-600">
                Team Size: {currentPublication?.teamSize}
              </span>
              {currentProjectData && (
                <span className="text-xs text-gray-600">
                  Current Stage: {currentProjectData.stage}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowProjectSelector(!showProjectSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-[#04445E] text-white rounded-lg hover:bg-[#033852] transition-colors"
          >
            <List className="w-4 h-4" />
            Select Project
          </button>
        </div>

        {showProjectSelector && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">Your Projects</h4>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {publications.map((publication) => (
                <div key={publication._id}>
                  {publication.projects.map((project) => (
                    <button
                      key={project._id}
                      onClick={() => handleProjectSelect(publication._id, project._id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedProjectId === project._id ? 'bg-blue-50 border-l-4 border-[#04445E]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">{project.name}</h5>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(publication.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {publication.teamSize} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              Stage {project.stage}
                            </span>
                          </div>
                        </div>
                        {selectedProjectId === project._id && (
                          <CheckCircle className="w-5 h-5 text-[#04445E]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Publication Timeline</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#04445E] text-white hover:bg-[#033852]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages - 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#04445E] text-white hover:bg-[#033852]'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="mb-8">
        <div className="relative px-8">
          {/* Background line */}
          <div className="absolute top-8 left-16 right-16 h-1 bg-gray-200 rounded"></div>
          
          {/* Progress line */}
          <div 
            className="absolute top-8 h-1 bg-[#04445E] rounded transition-all duration-500"
            style={{ 
              left: '4rem',
              width: `${(() => {
                if (!currentProjectData) return '0%';
                
                const currentStageNumber = currentProjectData.stage;
                const totalStages = currentStages.length;
                const firstStageNumber = (currentPage * stagesPerPage) + 1;
                const lastStageNumber = firstStageNumber + totalStages - 1;
                
                if (currentStageNumber < firstStageNumber) {
                  return '0%';
                }
                
                if (currentStageNumber > lastStageNumber) {
                  return 'calc(100% - 8rem)';
                }
                
                const relativeStageIndex = currentStageNumber - firstStageNumber;
                
                if (relativeStageIndex === 0) {
                  return '0%';
                }
                
                const segmentWidth = 100 / (totalStages - 1);
                const progressPercent = segmentWidth * relativeStageIndex;
                
                return `calc(${progressPercent}% - ${4 * (1 - progressPercent/100)}rem)`;
              })()}` 
            }}
          ></div>

          <div className="flex justify-between relative">
            {currentStages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = stage.id === activeStage;
              const stageNumber = stage.id + 1;
              const status = getStatusForStage(stageNumber);
              const currentStageNumber = currentProjectData?.stage || 0;
              const isPast = stageNumber < currentStageNumber;
              const isCurrent = stageNumber === currentStageNumber;
              
              return (
                <div key={stage.id} className="flex flex-col items-center min-w-0 flex-1">
                  <button
                    onClick={() => setActiveStage(stage.id)}
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 mb-3 ${
                      isActive 
                        ? 'border-[#04445E] bg-[#04445E] text-white shadow-lg scale-110' 
                        : isPast 
                        ? 'border-green-500 bg-green-500 text-white'
                        : isCurrent
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-500 hover:border-[#04445E] hover:scale-105'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </button>
                  
                  <div className="text-center max-w-20">
                    <div className={`text-sm font-semibold mb-1 ${isActive ? 'text-[#04445E]' : 'text-gray-700'}`}>
                      {stage.title}
                    </div>
                    <div className={`text-xs mb-2 ${isActive ? 'text-[#04445E]' : 'text-gray-500'}`}>
                      {stage.duration}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      status === 'completed' ? 'bg-green-100 text-green-700' :
                      status === 'in-progress' ? 'bg-blue-100 text-[#04445E]' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getStatusIcon(status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {timelineStages.find(s => s.id === activeStage)?.title}
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {currentPublication?.certificate?.url && (
              <button 
                onClick={() => downloadCertificate(currentPublication?.certificate?.url)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#04445E]" />
              Content
            </h4>
            <ul className="space-y-2">
              {timelineStages.find(s => s.id === activeStage)?.content.topics.map((topic, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-[#04445E] rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const NextStepsProjects = () => {
  return (
    <div className="mb-8">
      <PublicationTimeline />
    </div>
  );
};

const SystematicReviews = ({ onBack }) => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/publications/user/publications');
      
      if (response.data.success) {
        setPublications(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const totalProjects = publications.reduce((acc, pub) => acc + pub.numberOfProjects, 0);
  const avgTeamSize = publications.length > 0 
    ? Math.round(publications.reduce((acc, pub) => acc + pub.teamSize, 0) / publications.length) 
    : 0;

  const headerConfig = {
    backgroundImage: '/publications.jpg',  
    title: 'Publications',
    subtitle: 'Collaborate with peers and Next Steps team for publication-ready research',
    stats: [
      { value: '11', label: 'Project Stages' },
      { value: avgTeamSize.toString(), label: 'Avg Team Size' },
      { value: totalProjects.toString(), label: 'Total Projects' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectHeader {...headerConfig} />
        <NextStepsProjects />
      </div>
    </div>
  );
};

export default SystematicReviews;