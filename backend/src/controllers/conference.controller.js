import { Conference } from '../models/conference.model.js';
import { ConferenceRegistration } from '../models/conferenceRegistration.model.js';
import { User } from '../models/users.model.js';

export const createConference = async (req, res) => {
    try {
        const conference = await Conference.create(req.body);
        res.status(201).json({
            success: true,
            data: conference,
            message: "Conference created successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllConferences = async (req, res) => {
    try {
        const { category, isActive = true } = req.query;
        const filter = { isActive };
        
        if (category) {
            filter.category = category;
        }

        const conferences = await Conference.find(filter)
            .sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            data: conferences,
            count: conferences.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getConferenceById = async (req, res) => {
    try {
        const conference = await Conference.findById(req.params.id);
        
        if (!conference) {
            return res.status(404).json({
                success: false,
                message: "Conference not found"
            });
        }

        res.status(200).json({
            success: true,
            data: conference
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateConference = async (req, res) => {
    try {
        const conference = await Conference.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!conference) {
            return res.status(404).json({
                success: false,
                message: "Conference not found"
            });
        }

        res.status(200).json({
            success: true,
            data: conference,
            message: "Conference updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteConference = async (req, res) => {
    try {
        const conference = await Conference.findByIdAndDelete(req.params.id);

        if (!conference) {
            return res.status(404).json({
                success: false,
                message: "Conference not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Conference deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUpcomingConferences = async (req, res) => {
    try {
        const currentDate = new Date();
        const conferences = await Conference.find({
            startDate: { $gte: currentDate },
            isActive: true
        }).sort({ startDate: 1 }).limit(10);

        res.status(200).json({
            success: true,
            data: conferences,
            count: conferences.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const registerForConference = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const conference = await Conference.findById(id);
        if (!conference) {
            return res.status(404).json({
                success: false,
                message: 'Conference not found'
            });
        }

        if (!conference.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This conference is no longer available for registration'
            });
        }

        const existingRegistration = await ConferenceRegistration.findOne({
            user: userId,
            conference: id,
            status: 'registered'
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this conference'
            });
        }

        const cancelledRegistration = await ConferenceRegistration.findOne({
            user: userId,
            conference: id,
            status: 'cancelled'
        });

        if (cancelledRegistration) {
            await ConferenceRegistration.deleteOne({ _id: cancelledRegistration._id });
        }

        const registration = await ConferenceRegistration.create({
            user: userId,
            conference: id,
            userInfo: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                medicalSchool: user.medicalSchool,
                graduationYear: user.graduationYear
            },
            conferenceInfo: {
                name: conference.name,
                location: conference.location,
                dates: conference.dates,
                month: conference.month,
                modality: conference.modality,
                brochureLink: conference.brochureLink
            },
            registeredAt: new Date(),
            status: 'registered'
        });

        await User.findByIdAndUpdate(
            userId,
            { $push: { conferenceRegistrations: registration._id } }
        );

        return res.status(201).json({
            success: true,
            message: 'Successfully registered for the conference',
            data: registration
        });
    } catch (error) {
        console.error('Error registering for conference:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to register for conference',
            error: error.message
        });
    }
};

export const getUserRegistrations = async (req, res) => {
    try {
        const userId = req.user._id;

        const registrations = await ConferenceRegistration.find({ 
            user: userId,
            status: 'registered'
        })
            .sort({ registeredAt: -1 });

        return res.status(200).json({
            success: true,
            data: registrations,
            count: registrations.length
        });
    } catch (error) {
        console.error('Error fetching user registrations:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations',
            error: error.message
        });
    }
};

export const cancelRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user._id;

        const registration = await ConferenceRegistration.findOne({
            _id: registrationId,
            user: userId,
            status: 'registered'
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }
        await ConferenceRegistration.deleteOne({ _id: registrationId });

        await User.findByIdAndUpdate(
            userId,
            { $pull: { conferenceRegistrations: registrationId } }
        );

        return res.status(200).json({
            success: true,
            message: 'Registration cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling registration:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel registration',
            error: error.message
        });
    }
};