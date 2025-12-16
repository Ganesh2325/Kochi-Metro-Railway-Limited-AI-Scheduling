import express from 'express';
import { 
    getPassengerStats, 
    getHeatmapData 
} from '../controllers/passengerController.js';

const router = express.Router();

router.get('/stats', getPassengerStats);

router.get('/heatmap', getHeatmapData);

export default router;