import mongoose from 'mongoose';

const trainSchema = mongoose.Schema({
  trainId: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },

  model: { 
    type: String, 
    default: "Alstom Metropolis" 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Maintenance', 'Standby', 'Delayed', 'On Time'], 
    default: 'Active' 
  },

  currentStation: { 
    type: String, 
    default: "S05" 
  },

  direction: {
    type: String,
    enum: ['down', 'up'],
    default: 'down'
  },

  capacity: { 
    type: Number, 
    default: 975
  },

  mileage: { 
    type: Number, 
    default: 0 
    },

  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },

  batteryLevel: {
    type: String,
    default: "100%"
  },

  lastMaintenance: { 
    type: Date,
    default: Date.now
  }

}, { 
  timestamps: true
});

export default mongoose.model('Train', trainSchema);