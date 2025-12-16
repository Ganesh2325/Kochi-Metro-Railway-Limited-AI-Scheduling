import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    passenger: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    qrValue: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
