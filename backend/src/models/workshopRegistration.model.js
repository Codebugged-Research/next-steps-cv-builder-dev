import mongoose from 'mongoose';

const workshopRegistrationSchema = new mongoose.Schema({
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
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
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

workshopRegistrationSchema.index({ workshop: 1, user: 1 }, { unique: true });
workshopRegistrationSchema.index({ status: 1 });
workshopRegistrationSchema.index({ registeredAt: -1 });

export const WorkshopRegistration = mongoose.model('WorkshopRegistration', workshopRegistrationSchema);