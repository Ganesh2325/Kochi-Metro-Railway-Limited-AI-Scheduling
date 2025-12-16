import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
const JWT_EXPIRES = '7d';

const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      const user = new User({ name, email, password });
      await user.save();

      const token = createToken(user);

      return res.status(201).json({ token, name: user.name, email: user.email });
    } catch (err) {
      console.error('Auth register error:', err);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      const token = createToken(user);

      return res.status(200).json({ token, name: user.name, email: user.email });
    } catch (err) {
      console.error('Auth login error:', err);
      return res.status(500).json({ message: 'Server error during login' });
    }
  }
);

export default router;
