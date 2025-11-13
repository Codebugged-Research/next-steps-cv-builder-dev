import mongoose from 'mongoose';

const emrTrainingRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  year: {
    type: Number,
    required: true,
    default: 2025
  },
  sessionTime: {
    type: String,
    required: true,
    default: '2:00 PM - 5:00 PM'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  zoomLink: {
    type: String
  },
  adminNotes: {
    type: String
  },
  attendanceMarked: {
    type: Boolean,
    default: false
  },
  certificate: {
    url: String,
    key: String,
    uploadedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, { 
  timestamps: true 
});

const virtualAccessRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    enum: ['emr', 'rcm'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

emrTrainingRegistrationSchema.index({ user: 1, month: 1, date: 1, year: 1 }, { unique: true });
emrTrainingRegistrationSchema.index({ status: 1 });
emrTrainingRegistrationSchema.index({ registeredAt: -1 });

virtualAccessRequestSchema.index({ user: 1, requestType: 1 });
virtualAccessRequestSchema.index({ status: 1 });
virtualAccessRequestSchema.index({ requestedAt: -1 });
virtualAccessRequestSchema.index({ userEmail: 1 });

export const EmrTrainingRegistration = mongoose.model('EmrTrainingRegistration', emrTrainingRegistrationSchema);
export const VirtualAccessRequest = mongoose.model('VirtualAccessRequest', virtualAccessRequestSchema);