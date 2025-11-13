import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    medicalSchool: {
        type: String,
        required: true
    },
    graduationYear: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    hipaaAgreement: {
        isSigned: {
            type: Boolean,
            default: false
        },
        signedAt: {
            type: Date,
            default: null
        },
        ipAddress: {
            type: String,
            default: null
        },
        version: {
            type: String,
            default: '1.0'
        }
    },
    workshopRegistrations: [{
        workshop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workshop'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'rejected'],
            default: 'pending'
        },
        confirmedAt: Date,
        rejectedAt: Date,
        certificate: String
    }],
    conferenceRegistrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConferenceRegistration'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.signHipaaAgreement = function (ipAddress) {
    this.hipaaAgreement.isSigned = true;
    this.hipaaAgreement.signedAt = new Date();
    this.hipaaAgreement.ipAddress = ipAddress;
    return this.save();
};

export const User = mongoose.model("User", userSchema);