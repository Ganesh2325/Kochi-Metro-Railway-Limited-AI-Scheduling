import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      ticketId,
      passenger,
      age,
      gender,
      from,
      to,
      date,
      fare,
      qrValue,
    } = req.body;

    if (
      !ticketId ||
      !passenger ||
      !age ||
      !gender ||
      !from ||
      !to ||
      !date ||
      !fare
    ) {
      return res.status(400).json({ message: 'Missing booking fields' });
    }

    const ticket = await Ticket.create({
      ticketId,
      passenger,
      age,
      gender,
      from,
      to,
      date,
      fare,
      qrValue,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Ticket create error:', error);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
});

export default router;
