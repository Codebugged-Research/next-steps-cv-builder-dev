import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['BLS', 'ACLS'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  instructor: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, { 
  timestamps: true 
});

workshopSchema.index({ date: 1, type: 1 });

workshopSchema.virtual('registrations', {
  ref: 'WorkshopRegistration',
  localField: '_id',
  foreignField: 'workshop'
});

export const Workshop = mongoose.model('Workshop', workshopSchema);