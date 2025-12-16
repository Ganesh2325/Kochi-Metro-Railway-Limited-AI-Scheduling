import express from 'express';
import { getStations, updateStationStats, seedStations, seedStationsFromFile } from '../controllers/stationController.js';

const router = express.Router();

router.get('/', getStations);

router.put('/:id', updateStationStats);

router.post('/seed', seedStations);

router.post('/seed/default', seedStationsFromFile);

export default router;

