import mongoose from "mongoose";

const conferenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    modality: {
        type: String,
        enum: ['Physical', 'Virtual', 'Physical & Virtual'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    dates: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brochureLink: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        enum: ['medical', 'research', 'clinical', 'academic', 'workshop', 'pharmaceutical', 'nursing', 'neurology', 'biomedical'],
        default: 'medical'
    },
    year: {
        type: Number,
        default: 2025
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Conference = mongoose.model("Conference", conferenceSchema);