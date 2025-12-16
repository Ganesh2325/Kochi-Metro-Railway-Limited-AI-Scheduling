import express from 'express';
import { 
    getTrains, 
    updateTrain, 
    scheduleMaintenance, 
    seedTrains 
} from '../controllers/trainController.js';

const router = express.Router();

router.get('/status', getTrains);

router.post('/seed', seedTrains);

router.put('/:id', updateTrain);

router.post('/:id/maintenance', scheduleMaintenance);

export default router;