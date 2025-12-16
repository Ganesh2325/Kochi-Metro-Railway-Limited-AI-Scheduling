import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

dotenv.config();

import connectDB from './config/db.js';

import scheduleRoutes from './routes/scheduleRoutes.js';
import trainRoutes from './routes/trainRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import stationRoutes from './routes/stationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from "./routes/ticketRoutes.js";

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is missing in .env file');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn('  JWT_SECRET is not set. Using a default dev secret. Set JWT_SECRET in .env for production.');
}

connectDB();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/schedule', scheduleRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/passenger', passengerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/tickets", ticketRoutes);


app.get('/signup', (req, res) => {
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Signup</title></head>
<body style="font-family: Arial, Helvetica, sans-serif; padding:24px;">
  <h2>Signup</h2>
  <form method="POST" action="/signup">
    <label>Name:<br/><input name="name" required minlength="2"/></label><br/><br/>
    <label>Email:<br/><input name="email" type="email" required/></label><br/><br/>
    <label>Password:<br/><input name="password" type="password" required minlength="6"/></label><br/><br/>
    <button type="submit">Create account</button>
  </form>
  <p>Already have an account? <a href="/login">Login</a></p>
</body>
</html>`;
  res.send(html);
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).send('Missing fields');

  try {
    const User = (await import('./models/User.js')).default;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send('Email already registered');

    const user = new User({ name, email, password });
    await user.save();

    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'dev_jwt_secret_change_me', {
      expiresIn: '7d',
    });

    res.cookie('kmrl_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    const clientIndex = path.resolve(process.cwd(), 'client', 'index.html');
    const devTarget = 'http://localhost:5173/dashboard';
    const prodDist = path.resolve(process.cwd(), 'client', 'dist');

    const redirectTarget = fs.existsSync(prodDist) ? '/dashboard' : devTarget;
    return res.redirect(redirectTarget);
  } catch (err) {
    console.error('Signup server error:', err);
    return res.status(500).send('Server error');
  }
});

app.get('/login', (req, res) => {
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Login</title></head>
<body style="font-family: Arial, Helvetica, sans-serif; padding:24px;">
  <h2>Login</h2>
  <form method="POST" action="/login">
    <label>Email:<br/><input name="email" type="email" required/></label><br/><br/>
    <label>Password:<br/><input name="password" type="password" required minlength="6"/></label><br/><br/>
    <button type="submit">Log in</button>
  </form>
  <p>New here? <a href="/signup">Create an account</a></p>
</body>
</html>`;
  res.send(html);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).send('Missing fields');

  try {
    const User = (await import('./models/User.js')).default;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Invalid credentials');

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).send('Invalid credentials');

    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'dev_jwt_secret_change_me', {
      expiresIn: '7d',
    });

    res.cookie('kmrl_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    const prodDist = path.resolve(process.cwd(), 'client', 'dist');
    const devTarget = 'http://localhost:5173/dashboard';
    const redirectTarget = fs.existsSync(prodDist) ? '/dashboard' : devTarget;
    return res.redirect(redirectTarget);
  } catch (err) {
    console.error('Login server error:', err);
    return res.status(500).send('Server error');
  }
});

const clientDistPath = path.resolve(process.cwd(), 'client', 'dist');
const clientIndexPath = path.resolve(process.cwd(), 'client', 'index.html');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else if (fs.existsSync(clientIndexPath)) {
  app.get('/', (req, res) => res.redirect('http://localhost:5173/signup'));
  app.get('/health', (req, res) => res.status(200).send('KMRL API is running'));
} else {
  app.get('/', (req, res) => res.status(200).send('KMRL AI Scheduling Engine is Running...'));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`\n Server started on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` API Base URL: http://localhost:${PORT}`);
  });
});
