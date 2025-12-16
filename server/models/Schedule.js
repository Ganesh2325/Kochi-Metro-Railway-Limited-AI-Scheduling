import mongoose from 'mongoose';

const tripSchema = mongoose.Schema({
  trainId: { 
    type: String, 
    required: true 
  },

  tripId: { 
    type: String, 
    required: true 
  },

  route: { 
    type: String, 
    default: "Aluva - Thrippunithura" 
  },

  startTime: { 
    type: String, 
    required: true 
  }, 

  endTime: { 
    type: String, 
    required: true 
  },

  status: { 
    type: String, 
    enum: ['Scheduled', 'Active', 'Completed', 'Delayed', 'Cancelled'],
    default: 'Scheduled' 
  },

  aiOptimized: { 
    type: Boolean, 
    default: false 
  },

  optimizationReason: { 
    type: String,
    default: "Standard Schedule" 
  }
});

const scheduleSchema = mongoose.Schema({
  date: { 
    type: String, 
    required: true,
    unique: true
  },

  trips: [tripSchema],
  efficiencyScore: { 
    type: Number,
    default: 0 
  },

  conflictsResolved: { 
    type: Number, 
    default: 0 
  }, 

  generatedAt: {
    type: Date,
    default: Date.now
  }

}, { 
  timestamps: true 
});

export default mongoose.model('Schedule', scheduleSchema);