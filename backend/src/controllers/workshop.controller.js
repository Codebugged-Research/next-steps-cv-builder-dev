import { s3 } from '../middlewares/s3.upload.middleware.js';
import { Workshop } from '../models/workshop.model.js';
import { WorkshopRegistration } from '../models/workshopRegistration.model.js';
import { User } from '../models/users.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createWorkshop = asyncHandler(async (req, res) => {
  const { title, description, type, date, startTime, endTime, location, capacity, instructor } = req.body;

  if (!title || !description || !type || !date || !startTime || !endTime || !location || !capacity || !instructor) {
    throw new ApiError(400, 'All fields are required');
  }

  const workshop = await Workshop.create({
    title,
    description,
    type,
    date,
    startTime,
    endTime,
    location,
    capacity,
    instructor
  });

  return res.status(201).json(
    new ApiResponse(201, workshop, 'Workshop created successfully')
  );
});

const getAllWorkshops = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  let query = {};

  if (month && year) {
    const monthIndex = new Date(Date.parse(month + ' 1, 2000')).getMonth();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);

    query.date = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const workshops = await Workshop.find(query).sort({ date: 1 }).lean();

  const workshopsWithRegistrations = await Promise.all(
    workshops.map(async (workshop) => {
      const registrations = await WorkshopRegistration.find({ workshop: workshop._id })
        .populate('user', 'firstName lastName email fullName')
        .lean();
      
      return {
        ...workshop,
        registeredUsers: registrations
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, workshopsWithRegistrations, 'Workshops fetched successfully')
  );
});

const getWorkshopById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workshop = await Workshop.findById(id).lean();

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  const registrations = await WorkshopRegistration.find({ workshop: id })
    .populate('user', 'firstName lastName email fullName')
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { ...workshop, registeredUsers: registrations }, 'Workshop fetched successfully')
  );
});

const updateWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workshop = await Workshop.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  return res.status(200).json(
    new ApiResponse(200, workshop, 'Workshop updated successfully')
  );
});

const deleteWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workshop = await Workshop.findByIdAndDelete(id);

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  await WorkshopRegistration.deleteMany({ workshop: id });

  await User.updateMany(
    { 'workshopRegistrations.workshop': id },
    { $pull: { workshopRegistrations: { workshop: id } } }
  );

  return res.status(200).json(
    new ApiResponse(200, null, 'Workshop deleted successfully')
  );
});

const getUpcomingWorkshops = asyncHandler(async (req, res) => {
  const currentDate = new Date();

  const workshops = await Workshop.find({
    date: { $gte: currentDate },
    status: 'scheduled'
  })
    .sort({ date: 1 })
    .limit(10)
    .lean();

  const workshopsWithRegistrations = await Promise.all(
    workshops.map(async (workshop) => {
      const registrations = await WorkshopRegistration.find({ workshop: workshop._id })
        .populate('user', 'firstName lastName email fullName')
        .lean();
      
      return {
        ...workshop,
        registeredUsers: registrations
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, workshopsWithRegistrations, 'Upcoming workshops fetched successfully')
  );
});

const registerForWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const existingRegistrations = await WorkshopRegistration.find({ 
    user: userId,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingRegistrations.length > 0) {
    throw new ApiError(400, 'You can only register for one workshop at a time. Please cancel your existing registration first.');
  }

  const workshop = await Workshop.findById(id);

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  const alreadyRegistered = await WorkshopRegistration.findOne({
    workshop: id,
    user: userId
  });

  if (alreadyRegistered) {
    throw new ApiError(400, 'You are already registered for this workshop');
  }

  const confirmedCount = await WorkshopRegistration.countDocuments({
    workshop: id,
    status: 'confirmed'
  });

  if (confirmedCount >= workshop.capacity) {
    throw new ApiError(400, 'Workshop is fully booked');
  }

  if (new Date(workshop.date) < new Date()) {
    throw new ApiError(400, 'Cannot register for past workshops');
  }

  const registration = await WorkshopRegistration.create({
    workshop: id,
    user: userId,
    status: 'pending'
  });

  await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        workshopRegistrations: {
          workshop: id,
          registeredAt: new Date(),
          status: 'pending'
        }
      }
    }
  );

  return res.status(200).json(
    new ApiResponse(200, registration, 'Successfully registered for workshop. Waiting for admin confirmation.')
  );
});

const getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const registrations = await WorkshopRegistration.find({ user: userId })
    .populate('workshop', 'title description type date startTime endTime location capacity instructor status')
    .sort({ registeredAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, registrations, 'Registrations fetched successfully')
  );
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const userId = req.user._id;

  const registration = await WorkshopRegistration.findOne({
    _id: registrationId,
    user: userId
  });

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  await WorkshopRegistration.findByIdAndDelete(registrationId);

  await User.findByIdAndUpdate(
    userId,
    { $pull: { workshopRegistrations: { workshop: registration.workshop } } }
  );

  return res.status(200).json(
    new ApiResponse(200, null, 'Registration cancelled successfully')
  );
});

const confirmRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const adminId = req.user._id;

  const registration = await WorkshopRegistration.findById(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.status === 'confirmed') {
    throw new ApiError(400, 'Registration already confirmed');
  }

  const workshop = await Workshop.findById(registration.workshop);

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  const confirmedCount = await WorkshopRegistration.countDocuments({
    workshop: registration.workshop,
    status: 'confirmed'
  });

  if (confirmedCount >= workshop.capacity) {
    throw new ApiError(400, 'Workshop capacity reached');
  }

  registration.status = 'confirmed';
  registration.confirmedAt = new Date();
  registration.confirmedBy = adminId;
  await registration.save();

  await User.updateOne(
    { _id: registration.user, 'workshopRegistrations.workshop': registration.workshop },
    { 
      $set: { 
        'workshopRegistrations.$.status': 'confirmed',
        'workshopRegistrations.$.confirmedAt': new Date()
      } 
    }
  );

  return res.status(200).json(
    new ApiResponse(200, registration, 'Registration confirmed successfully')
  );
});

const rejectRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const adminId = req.user._id;

  const registration = await WorkshopRegistration.findById(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  registration.status = 'rejected';
  registration.rejectedAt = new Date();
  registration.rejectedBy = adminId;
  await registration.save();

  await User.updateOne(
    { _id: registration.user, 'workshopRegistrations.workshop': registration.workshop },
    { 
      $set: { 
        'workshopRegistrations.$.status': 'rejected',
        'workshopRegistrations.$.rejectedAt': new Date()
      } 
    }
  );

  return res.status(200).json(
    new ApiResponse(200, registration, 'Registration rejected successfully')
  );
});

const getPendingRegistrations = asyncHandler(async (req, res) => {
  const registrations = await WorkshopRegistration.find({ status: 'pending' })
    .populate('workshop', 'title type date location capacity')
    .populate('user', 'firstName lastName email fullName')
    .sort({ registeredAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, registrations, 'Pending registrations fetched successfully')
  );
});

const uploadCertificate = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const adminId = req.user._id;

  if (!req.file) {
    throw new ApiError(400, 'Certificate file is required');
  }

  const registration = await WorkshopRegistration.findById(registrationId);

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
    { _id: registration.user, 'workshopRegistrations.workshop': registration.workshop },
    { 
      $set: { 
        'workshopRegistrations.$.certificate': req.file.location
      } 
    }
  );

  return res.status(200).json(
    new ApiResponse(200, registration, 'Certificate uploaded successfully to AWS S3')
  );
});

const deleteCertificate = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;

  const registration = await WorkshopRegistration.findById(registrationId);

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
    { _id: registration.user, 'workshopRegistrations.workshop': registration.workshop },
    { 
      $set: { 
        'workshopRegistrations.$.certificate': null
      } 
    }
  );

  return res.status(200).json(
    new ApiResponse(200, registration, 'Certificate deleted successfully from AWS S3')
  );
});


export {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop,
  getUpcomingWorkshops,
  registerForWorkshop,
  getUserRegistrations,
  cancelRegistration,
  confirmRegistration,
  rejectRegistration,
  getPendingRegistrations,
  uploadCertificate,
  deleteCertificate
};