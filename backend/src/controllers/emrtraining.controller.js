import { s3 } from '../middlewares/s3.upload.middleware.js';
import { EmrTrainingRegistration } from '../models/emrTrainingRegistration.model.js';
import { User } from '../models/users.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerForTraining = asyncHandler(async (req, res) => {
  const { month, sessionTime } = req.body;
  const userId = req.user._id;

  if (!month) {
    throw new ApiError(400, 'Month is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const existingRegistrations = await EmrTrainingRegistration.find({ 
    user: userId,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingRegistrations.length > 0) {
    throw new ApiError(400, 'You can only register for one training session at a time. Please cancel your existing registration first.');
  }

  const alreadyRegistered = await EmrTrainingRegistration.findOne({
    user: userId,
    month,
    year: 2025,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (alreadyRegistered) {
    throw new ApiError(400, 'You are already registered for this date');
  }

  const registration = await EmrTrainingRegistration.create({
    user: userId,
    month,
    year: 2025,
    sessionTime: sessionTime || '2:00 PM - 5:00 PM',
    status: 'pending'
  });

  await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        emrTrainingRegistrations: {
          month,
          year: 2025,
          registeredAt: new Date(),
          status: 'pending'
        }
      }
    }
  );

  const populatedRegistration = await EmrTrainingRegistration
    .findById(registration._id)
    .populate('user', 'firstName lastName email fullName phone medicalSchool');

  return res.status(201).json(
    new ApiResponse(201, populatedRegistration, 'Successfully registered for EMR training. Waiting for admin confirmation.')
  );
});

const getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const registrations = await EmrTrainingRegistration
    .find({ user: userId })
    .sort({ registeredAt: -1 })
    .populate('user', 'firstName lastName email fullName')
    .populate('confirmedBy', 'firstName lastName fullName')
    .lean();

  return res.status(200).json(
    new ApiResponse(200, registrations, 'Registrations fetched successfully')
  );
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const userId = req.user._id;

  const registration = await EmrTrainingRegistration.findOne({
    _id: registrationId,
    user: userId
  });

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.status === 'confirmed') {
    throw new ApiError(400, 'Cannot cancel confirmed registrations. Please contact admin.');
  }

  await EmrTrainingRegistration.findByIdAndDelete(registrationId);

  await User.findByIdAndUpdate(
    userId,
    { 
      $pull: { 
        emrTrainingRegistrations: { 
          month: registration.month,
          date: registration.date,
          year: registration.year
        } 
      } 
    }
  );

  return res.status(200).json(
    new ApiResponse(200, null, 'Registration cancelled successfully')
  );
});

const getAllRegistrations = asyncHandler(async (req, res) => {
  const { status, month, date, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (month) filter.month = month;
  if (date) filter.date = parseInt(date);

  const skip = (page - 1) * limit;

  const registrations = await EmrTrainingRegistration
    .find(filter)
    .sort({ registeredAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'firstName lastName email fullName phone medicalSchool graduationYear')
    .populate('confirmedBy', 'firstName lastName fullName')
    .populate('rejectedBy', 'firstName lastName fullName')
    .lean();

  const total = await EmrTrainingRegistration.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200, 
      {
        registrations,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      },
      'Registrations fetched successfully'
    )
  );
});

const confirmRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const { zoomLink, adminNotes } = req.body;
  const adminId = req.user._id;

  const registration = await EmrTrainingRegistration.findById(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.status === 'confirmed') {
    throw new ApiError(400, 'Registration already confirmed');
  }

  if (registration.status !== 'pending') {
    throw new ApiError(400, `Cannot confirm registration with status: ${registration.status}`);
  }

  registration.status = 'confirmed';
  registration.confirmedAt = new Date();
  registration.confirmedBy = adminId;
  registration.zoomLink = zoomLink;
  registration.adminNotes = adminNotes;

  await registration.save();

  await User.updateOne(
    { 
      _id: registration.user, 
      'emrTrainingRegistrations.month': registration.month,
      'emrTrainingRegistrations.date': registration.date,
      'emrTrainingRegistrations.year': registration.year
    },
    { 
      $set: { 
        'emrTrainingRegistrations.$.status': 'confirmed',
        'emrTrainingRegistrations.$.confirmedAt': new Date()
      } 
    }
  );

  const updatedRegistration = await EmrTrainingRegistration
    .findById(registrationId)
    .populate('user', 'firstName lastName email fullName phone medicalSchool')
    .populate('confirmedBy', 'firstName lastName fullName');

  return res.status(200).json(
    new ApiResponse(200, updatedRegistration, 'Registration confirmed successfully')
  );
});

const rejectRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const { rejectionReason } = req.body;
  const adminId = req.user._id;

  if (!rejectionReason) {
    throw new ApiError(400, 'Rejection reason is required');
  }

  const registration = await EmrTrainingRegistration.findById(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.status !== 'pending') {
    throw new ApiError(400, `Cannot reject registration with status: ${registration.status}`);
  }

  registration.status = 'rejected';
  registration.rejectedAt = new Date();
  registration.rejectedBy = adminId;
  registration.rejectionReason = rejectionReason;

  await registration.save();

  await User.updateOne(
    { 
      _id: registration.user, 
      'emrTrainingRegistrations.month': registration.month,
      'emrTrainingRegistrations.date': registration.date,
      'emrTrainingRegistrations.year': registration.year
    },
    { 
      $set: { 
        'emrTrainingRegistrations.$.status': 'rejected',
        'emrTrainingRegistrations.$.rejectedAt': new Date()
      } 
    }
  );

  const updatedRegistration = await EmrTrainingRegistration
    .findById(registrationId)
    .populate('user', 'firstName lastName email fullName phone medicalSchool')
    .populate('rejectedBy', 'firstName lastName fullName');

  return res.status(200).json(
    new ApiResponse(200, updatedRegistration, 'Registration rejected successfully')
  );
});

const markAsCompleted = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const { attendanceMarked } = req.body;

  const registration = await EmrTrainingRegistration.findById(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.status !== 'confirmed') {
    throw new ApiError(400, 'Can only mark confirmed registrations as completed');
  }

  registration.status = 'completed';
  registration.completedAt = new Date();
  registration.attendanceMarked = attendanceMarked || false;

  await registration.save();

  await User.updateOne(
    { 
      _id: registration.user, 
      'emrTrainingRegistrations.month': registration.month,
      'emrTrainingRegistrations.date': registration.date,
      'emrTrainingRegistrations.year': registration.year
    },
    { 
      $set: { 
        'emrTrainingRegistrations.$.status': 'completed',
        'emrTrainingRegistrations.$.completedAt': new Date()
      } 
    }
  );

  const updatedRegistration = await EmrTrainingRegistration
    .findById(registrationId)
    .populate('user', 'firstName lastName email fullName');

  return res.status(200).json(
    new ApiResponse(200, updatedRegistration, 'Registration marked as completed')
  );
});

const getPendingRegistrations = asyncHandler(async (req, res) => {
  const registrations = await EmrTrainingRegistration
    .find({ status: 'pending' })
    .populate('user', 'firstName lastName email fullName phone medicalSchool')
    .sort({ registeredAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, registrations, 'Pending registrations fetched successfully')
  );
});

const getRegistrationStats = asyncHandler(async (req, res) => {
  const stats = await EmrTrainingRegistration.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const monthlyStats = await EmrTrainingRegistration.aggregate([
    {
      $group: {
        _id: { month: '$month', year: '$year' },
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        confirmed: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': 1 } }
  ]);

  return res.status(200).json(
    new ApiResponse(
      200, 
      {
        statusStats: stats,
        monthlyStats
      },
      'Statistics fetched successfully'
    )
  );
});

const uploadCertificate = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const adminId = req.user._id;

  if (!req.file) {
    throw new ApiError(400, 'Certificate file is required');
  }

  const registration = await EmrTrainingRegistration.findById(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.certificate && registration.certificate.key) {
    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: registration.certificate.key
      }).promise();
    } catch (error) {
      console.error('Error deleting old certificate from S3:', error);
    }
  }

  registration.certificate = {
    url: req.file.location,
    key: req.file.key,
    uploadedAt: new Date(),
    uploadedBy: adminId
  };

  await registration.save();

  await User.updateOne(
    { 
      _id: registration.user, 
      'emrTrainingRegistrations.month': registration.month,
      'emrTrainingRegistrations.date': registration.date,
      'emrTrainingRegistrations.year': registration.year
    },
    { 
      $set: { 
        'emrTrainingRegistrations.$.certificate': req.file.location
      } 
    }
  );

  return res.status(200).json(
    new ApiResponse(200, registration, 'Certificate uploaded successfully to AWS S3')
  );
});

const deleteCertificate = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;

  const registration = await EmrTrainingRegistration.findById(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.certificate && registration.certificate.key) {
    try {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: registration.certificate.key
      }).promise();
    } catch (error) {
      console.error('Error deleting certificate from S3:', error);
      throw new ApiError(500, 'Failed to delete certificate from AWS S3');
    }
  }

  registration.certificate = undefined;
  await registration.save();

  await User.updateOne(
    { 
      _id: registration.user, 
      'emrTrainingRegistrations.month': registration.month,
      'emrTrainingRegistrations.date': registration.date,
      'emrTrainingRegistrations.year': registration.year
    },
    { 
      $set: { 
        'emrTrainingRegistrations.$.certificate': null
      } 
    }
  );

  return res.status(200).json(
    new ApiResponse(200, registration, 'Certificate deleted successfully from AWS S3')
  );
});

export {
  registerForTraining,
  getUserRegistrations,
  cancelRegistration,
  getAllRegistrations,
  confirmRegistration,
  rejectRegistration,
  markAsCompleted,
  getPendingRegistrations,
  getRegistrationStats,
  uploadCertificate,
  deleteCertificate
};