import mongoose from 'mongoose';
const passengerLogSchema = mongoose.Schema({
  stationId: { 
    type: String, 
    required: true,
    index: true
  }, 

  count: { 
    type: Number, 
    required: true 
  }, 

  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },

  isPeak: { 
    type: Boolean, 
    default: false 
  }, 

  dayOfWeek: {
    type: String,
   default: () => new Date().toLocaleDateString('en-US', { weekday: 'long' })
  }

}, { 
  timestamps: true 
});

export default mongoose.model('PassengerLog', passengerLogSchema);