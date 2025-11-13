import { ApiError } from '../utils/ApiError.js';
import { ConferenceRegistration } from '../models/conferenceRegistration.model.js';
import { WorkshopRegistration } from '../models/workshopRegistration.model.js';
import { EmrTrainingRegistration } from '../models/emrTrainingRegistration.model.js';

export const checkConferenceLimit = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const activeConferences = await ConferenceRegistration.countDocuments({
      user: userId,
      status: 'registered'
    });

    console.log('Conference limit check - Active:', activeConferences);

    if (activeConferences >= 2) {
      throw new ApiError(
        400, 
        'Conference registration limit reached. You can only register for 2 conferences at a time. Please cancel an existing registration first.'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkWorkshopLimit = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const activeWorkshops = await WorkshopRegistration.countDocuments({
      user: userId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeWorkshops >= 1) {
      throw new ApiError(
        400, 
        'Workshop registration limit reached. You can only register for 1 workshop at a time. Please cancel your existing registration first.'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkEmrTrainingLimit = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const activeTrainings = await EmrTrainingRegistration.countDocuments({
      user: userId,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeTrainings >= 1) {
      throw new ApiError(
        400, 
        'EMR training registration limit reached. You can only register for 1 training session at a time. Please cancel your existing registration first.'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const getUserLimitsStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      conferencesCount,
      workshopsCount,
      emrTrainingsCount
    ] = await Promise.all([
      ConferenceRegistration.countDocuments({ user: userId, status: { $in: ['pending', 'confirmed'] } }),
      WorkshopRegistration.countDocuments({ user: userId, status: { $in: ['pending', 'confirmed'] } }),
      EmrTrainingRegistration.countDocuments({ user: userId, status: { $in: ['pending', 'confirmed'] } })
    ]);

    req.userLimits = {
      conferences: {
        current: conferencesCount,
        max: 2,
        available: 2 - conferencesCount,
        canAdd: conferencesCount < 2
      },
      workshops: {
        current: workshopsCount,
        max: 1,
        available: 1 - workshopsCount,
        canAdd: workshopsCount < 1
      },
      emrTraining: {
        current: emrTrainingsCount,
        max: 1,
        available: 1 - emrTrainingsCount,
        canAdd: emrTrainingsCount < 1
      }
    };

    next();
  } catch (error) {
    next(error);
  }
};