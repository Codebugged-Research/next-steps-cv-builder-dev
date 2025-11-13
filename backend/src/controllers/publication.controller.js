import { s3 } from '../middlewares/s3.upload.middleware.js';
import { Publication } from '../models/publication.model.js';
import { User } from '../models/users.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createPublication = asyncHandler(async (req, res) => {
  const { userName, userEmail, teamSize, numberOfProjects, projects } = req.body;
  const userId = req.user._id;

  if (!userName || !userEmail || !teamSize || !numberOfProjects || !projects) {
    throw new ApiError(400, 'All fields are required');
  }

  if (!Array.isArray(projects) || projects.length !== numberOfProjects) {
    throw new ApiError(400, `Projects array must contain exactly ${numberOfProjects} projects`);
  }

  const invalidProjects = projects.filter(p => !p.name || !p.name.trim());
  if (invalidProjects.length > 0) {
    throw new ApiError(400, 'All projects must have a name');
  }

  const initializedProjects = projects.map(project => ({
    name: project.name,
    stage: project.stage || 1,
    stageHistory: [{
      stage: project.stage || 1,
      movedAt: new Date(),
      movedBy: userId
    }]
  }));

  const publication = await Publication.create({
    user: userId,
    userName,
    userEmail,
    teamSize,
    numberOfProjects,
    projects: initializedProjects
  });

  const populatedPublication = await Publication.findById(publication._id)
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email');

  return res.status(201).json(
    new ApiResponse(201, populatedPublication, 'Publication created successfully')
  );
});

const getAllPublications = asyncHandler(async (req, res) => {
  const { status, stage } = req.query;
  
  let query = {};

  if (status) {
    query.status = status;
  }

  if (stage) {
    query['projects.stage'] = parseInt(stage);
  }

  const publications = await Publication.find(query)
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, publications, 'Publications fetched successfully')
  );
});

const getPublicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const publication = await Publication.findById(id)
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email')
    .lean();

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  return res.status(200).json(
    new ApiResponse(200, publication, 'Publication fetched successfully')
  );
});

const getUserPublications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const publications = await Publication.find({ user: userId })
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, publications, 'User publications fetched successfully')
  );
});

const updatePublication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userName, userEmail, teamSize, status } = req.body;

  const updateData = {};
  
  if (userName) updateData.userName = userName;
  if (userEmail) updateData.userEmail = userEmail;
  if (teamSize) updateData.teamSize = teamSize;
  if (status) updateData.status = status;

  const publication = await Publication.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email');

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  return res.status(200).json(
    new ApiResponse(200, publication, 'Publication updated successfully')
  );
});

const deletePublication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const publication = await Publication.findById(id);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  if (publication.certificate && publication.certificate.key) {
    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: publication.certificate.key
      }).promise();
    } catch (error) {
      console.error('Error deleting certificate from S3:', error);
    }
  }

  await Publication.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, null, 'Publication deleted successfully')
  );
});

const updateProjectStage = asyncHandler(async (req, res) => {
  const { id, projectId } = req.params;
  const { stage } = req.body;
  const adminId = req.user._id;

  if (!stage || ![1, 2, 3, 4, 5, 6, 7].includes(parseInt(stage))) {
    throw new ApiError(400, 'Stage must be between 1 and 7');
  }

  const publication = await Publication.findById(id);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  const project = publication.projects.id(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  project.stage = parseInt(stage);
  
  project.stageHistory.push({
    stage: parseInt(stage),
    movedAt: new Date(),
    movedBy: adminId
  });

  await publication.save();

  const updatedPublication = await Publication.findById(id)
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email');

  return res.status(200).json(
    new ApiResponse(200, updatedPublication, 'Project stage updated successfully')
  );
});

const updateProjectName = asyncHandler(async (req, res) => {
  const { id, projectId } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Project name is required');
  }

  const publication = await Publication.findById(id);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  const project = publication.projects.id(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  project.name = name;
  await publication.save();

  const updatedPublication = await Publication.findById(id)
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email');

  return res.status(200).json(
    new ApiResponse(200, updatedPublication, 'Project name updated successfully')
  );
});

const getPublicationsByStage = asyncHandler(async (req, res) => {
  const { stage } = req.params;

  const stageNum = parseInt(stage);
  if (![1, 2, 3, 4, 5, 6, 7].includes(stageNum)) {
    throw new ApiError(400, 'Stage must be between 1 and 7');
  }

  const publications = await Publication.find({
    'projects.stage': stageNum,
    status: 'active'
  })
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, publications, `Publications with stage ${stage} projects fetched successfully`)
  );
});

const uploadCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;

  if (!req.file) {
    throw new ApiError(400, 'Certificate file is required');
  }

  const publication = await Publication.findById(id);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  if (publication.certificate && publication.certificate.key) {
    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: publication.certificate.key
      }).promise();
    } catch (error) {
      console.error('Error deleting old certificate from S3:', error);
    }
  }

  publication.certificate = {
    url: req.file.location,
    key: req.file.key,
    uploadedAt: new Date(),
    uploadedBy: adminId
  };

  await publication.save();

  const updatedPublication = await Publication.findById(id)
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email')
    .populate('certificate.uploadedBy', 'firstName lastName email');

  return res.status(200).json(
    new ApiResponse(200, updatedPublication, 'Certificate uploaded successfully to AWS S3')
  );
});

const deleteCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const publication = await Publication.findById(id);

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  if (publication.certificate && publication.certificate.key) {
    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: publication.certificate.key
      }).promise();
    } catch (error) {
      console.error('Error deleting certificate from S3:', error);
      throw new ApiError(500, 'Failed to delete certificate from AWS S3');
    }
  }

  publication.certificate = undefined;
  await publication.save();

  const updatedPublication = await Publication.findById(id)
    .populate('user', 'firstName lastName email fullName')
    .populate('projects.stageHistory.movedBy', 'firstName lastName email');

  return res.status(200).json(
    new ApiResponse(200, updatedPublication, 'Certificate deleted successfully from AWS S3')
  );
});

const getPublicationStats = asyncHandler(async (req, res) => {
  const stats = await Publication.aggregate([
    {
      $facet: {
        statusCount: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        stageDistribution: [
          { $unwind: '$projects' },
          { $group: { _id: '$projects.stage', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ],
        totalPublications: [
          { $count: 'count' }
        ],
        averageTeamSize: [
          { $group: { _id: null, avgTeamSize: { $avg: '$teamSize' } } }
        ],
        averageProjects: [
          { $group: { _id: null, avgProjects: { $avg: '$numberOfProjects' } } }
        ]
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, stats[0], 'Publication statistics fetched successfully')
  );
});

export {
  createPublication,
  getAllPublications,
  getPublicationById,
  getUserPublications,
  updatePublication,
  deletePublication,
  updateProjectStage,
  updateProjectName,
  getPublicationsByStage,
  uploadCertificate,
  deleteCertificate,
  getPublicationStats
};