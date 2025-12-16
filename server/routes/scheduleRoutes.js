import express from 'express';
import { 
    getSchedule, 
    runAiOptimization, 
    updateTripStatus 
} from '../controllers/scheduleController.js';

const router = express.Router();
router.get('/', getSchedule);
router.post('/optimize', runAiOptimization);
router.put('/trip/:id', updateTripStatus);

export default router;