import express from 'express';
import { 
    logPassengerData, 
    getPassengerStats, 
    getHeatmapData 
} from '../controllers/passengerController.js';

const router = express.Router();
router.post('/log', logPassengerData);

router.get('/stats', getPassengerStats);

router.get('/heatmap', getHeatmapData);

export default router;