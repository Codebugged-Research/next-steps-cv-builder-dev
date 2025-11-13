import { VirtualAccessRequest } from '../models/emrTrainingRegistration.model.js';
import { User } from '../models/users.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const requestVirtualAccess = asyncHandler(async (req, res) => {
  const { requestType } = req.body;
  const userId = req.user._id;

  if (!requestType || !['emr', 'rcm'].includes(requestType)) {
    throw new ApiError(400, 'Valid request type (emr or rcm) is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const existingRequest = await VirtualAccessRequest.findOne({
    user: userId,
    requestType,
    status: { $in: ['pending', 'approved'] }
  });

  if (existingRequest) {
    if (existingRequest.status === 'approved') {
      throw new ApiError(400, 'You already have approved access');
    }
    throw new ApiError(400, 'You already have a pending access request');
  }

  const accessRequest = await VirtualAccessRequest.create({
    user: userId,
    userName: user.fullName || `${user.firstName} ${user.lastName}`,
    userEmail: user.email,
    requestType,
    status: 'pending'
  });

  const populatedRequest = await VirtualAccessRequest
    .findById(accessRequest._id)
    .populate('user', 'firstName lastName email fullName phone medicalSchool');

  return res.status(201).json(
    new ApiResponse(201, populatedRequest, 'Access request submitted successfully. Awaiting admin approval.')
  );
});

const getUserAccessRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { requestType } = req.query;

  const filter = { user: userId };
  if (requestType) {
    filter.requestType = requestType;
  }

  const requests = await VirtualAccessRequest
    .find(filter)
    .sort({ requestedAt: -1 })
    .populate('processedBy', 'firstName lastName fullName')
    .lean();

  return res.status(200).json(
    new ApiResponse(200, requests, 'Access requests fetched successfully')
  );
});

const getAllAccessRequests = asyncHandler(async (req, res) => {
  const { status, requestType, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (requestType) filter.requestType = requestType;

  const skip = (page - 1) * limit;

  const requests = await VirtualAccessRequest
    .find(filter)
    .sort({ requestedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'firstName lastName email fullName phone medicalSchool graduationYear')
    .populate('processedBy', 'firstName lastName fullName')
    .lean();

  const total = await VirtualAccessRequest.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        requests,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      },
      'Access requests fetched successfully'
    )
  );
});

const getPendingAccessRequests = asyncHandler(async (req, res) => {
  const { requestType } = req.query;
  const filter = { status: 'pending' };

  if (requestType) {
    filter.requestType = requestType;
  }

  const requests = await VirtualAccessRequest
    .find(filter)
    .populate('user', 'firstName lastName email fullName phone medicalSchool')
    .sort({ requestedAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, requests, 'Pending access requests fetched successfully')
  );
});

const approveAccessRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { adminNotes } = req.body;
  const adminId = req.user._id;

  const request = await VirtualAccessRequest.findById(requestId);

  if (!request) {
    throw new ApiError(404, 'Access request not found');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, `Cannot approve request with status: ${request.status}`);
  }

  request.status = 'approved';
  request.processedAt = new Date();
  request.processedBy = adminId;
  request.adminNotes = adminNotes;

  await request.save();

  const updatedRequest = await VirtualAccessRequest
    .findById(requestId)
    .populate('user', 'firstName lastName email fullName phone medicalSchool')
    .populate('processedBy', 'firstName lastName fullName');

  return res.status(200).json(
    new ApiResponse(200, updatedRequest, 'Access request approved successfully')
  );
});

const rejectAccessRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { rejectionReason } = req.body;
  const adminId = req.user._id;

  if (!rejectionReason) {
    throw new ApiError(400, 'Rejection reason is required');
  }

  const request = await VirtualAccessRequest.findById(requestId);

  if (!request) {
    throw new ApiError(404, 'Access request not found');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, `Cannot reject request with status: ${request.status}`);
  }

  request.status = 'rejected';
  request.processedAt = new Date();
  request.processedBy = adminId;
  request.rejectionReason = rejectionReason;

  await request.save();

  const updatedRequest = await VirtualAccessRequest
    .findById(requestId)
    .populate('user', 'firstName lastName email fullName phone medicalSchool')
    .populate('processedBy', 'firstName lastName fullName');

  return res.status(200).json(
    new ApiResponse(200, updatedRequest, 'Access request rejected successfully')
  );
});

const getAccessRequestStats = asyncHandler(async (req, res) => {
  const stats = await VirtualAccessRequest.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const typeStats = await VirtualAccessRequest.aggregate([
    {
      $group: {
        _id: '$requestType',
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        approved: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
        }
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        statusStats: stats,
        typeStats
      },
      'Statistics fetched successfully'
    )
  );
});

export {
  requestVirtualAccess,
  getUserAccessRequest,
  getAllAccessRequests,
  getPendingAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  getAccessRequestStats
};