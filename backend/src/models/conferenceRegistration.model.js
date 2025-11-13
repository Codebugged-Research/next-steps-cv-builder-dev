import mongoose from "mongoose";

const conferenceRegistrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
        required: true
    },
    userInfo: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            default: ''
        },
        medicalSchool: {
            type: String,
            default: ''
        },
        graduationYear: {
            type: String,
            default: ''
        }
    },
    conferenceInfo: {
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            default: ''
        },
        dates: {
            type: String,
            default: ''
        },
        month: {
            type: String,
            default: ''
        },
        modality: {
            type: String,
            default: ''
        },
        brochureLink: {
            type: String,
            default: ''
        },
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['registered', 'cancelled', 'attended'],
        default: 'pending'
    }
}, {
    timestamps: true
});

conferenceRegistrationSchema.index({ user: 1, conference: 1 }, { unique: true });

export const ConferenceRegistration = mongoose.model('ConferenceRegistration', conferenceRegistrationSchema);