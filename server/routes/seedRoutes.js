import express from 'express';
import { seedAll } from '../controllers/seedController.js';

const router = express.Router();

router.post('/all', seedAll);

export default router;