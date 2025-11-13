import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stage: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    default: 1,
    required: true
  },
  stageHistory: [{
    stage: {
      type: Number,
      required: true
    },
    movedAt: {
      type: Date,
      default: Date.now
    },
    movedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, { _id: true });

const publicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1
  },
  numberOfProjects: {
    type: Number,
    required: true,
    min: 1
  },
  projects: [projectSchema],
  certificate: {
    url: {
      type: String
    },
    key: {
      type: String
    },
    uploadedAt: {
      type: Date
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, { 
  timestamps: true 
});

publicationSchema.index({ user: 1 });
publicationSchema.index({ userEmail: 1 });
publicationSchema.index({ status: 1 });
publicationSchema.index({ 'projects.stage': 1 });

publicationSchema.pre('save', function(next) {
  if (this.projects.length !== this.numberOfProjects) {
    next(new Error('Number of projects must match the numberOfProjects field'));
  }
  next();
});

export const Publication = mongoose.model('Publication', publicationSchema);