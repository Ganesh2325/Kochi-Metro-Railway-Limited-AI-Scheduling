import mongoose from 'mongoose';

const stationSchema = mongoose.Schema({
  stationId: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },

  name: { 
    type: String, 
    required: true, 
    unique: true 
  },

  distanceFromStart: { 
    type: Number, 
    required: true, 
    default: 0
  },

  type: { 
    type: String, 
    enum: ['Terminal', 'Normal', 'Interchange', 'Hub', 'Depot', 'RailConnect', 'MobilityHub'],
    default: 'Normal'
  },

  capacity: {
    type: Number,
    default: 1500 
  },

  peakHourLoad: {
    type: Number,
    default: 0
  },

  location: {
    lat: Number,
    lng: Number
  }

}, { 
  timestamps: true 
});

export default mongoose.model('Station', stationSchema);