import { createRequire } from 'module';
import Station from '../models/Station.js';
import Train from '../models/Train.js';
import Schedule from '../models/Schedule.js';
import PassengerLog from '../models/PassengerLog.js';
import { generateOptimizedSchedule } from '../services/aiScheduler.js';

const require = createRequire(import.meta.url);
const stationSeedData = require('../data/kmrlStations.json');

const mockTrains = [
  { trainId: "T-101", status: "Active", currentStation: "S01", mileage: 124000, healthScore: 94 },
  { trainId: "T-102", status: "Active", currentStation: "S05", mileage: 135000, healthScore: 91 },
  { trainId: "T-103", status: "Maintenance", currentStation: "S05", mileage: 142000, healthScore: 45, batteryLevel: "Charging" },
  { trainId: "T-104", status: "Active", currentStation: "S15", mileage: 110000, healthScore: 98 },
  { trainId: "T-105", status: "Delayed", currentStation: "S09", mileage: 128000, healthScore: 88 },
];

const mockPassengerLogs = [
  { stationId: 'S09', count: 720 },
  { stationId: 'S15', count: 830 },
  { stationId: 'S01', count: 410 },
  { stationId: 'S20', count: 950 },
  { stationId: 'S07', count: 620 },
];

export const seedAll = async (_req, res) => {
  try {
    const stationsMapped = stationSeedData.map(s => ({
      stationId: s.id,
      name: s.name,
      distanceFromStart: s.distance,
      type: s.type,
    }));
    await Station.deleteMany({});
    const stations = await Station.insertMany(stationsMapped);

    await Train.deleteMany({});
    const trains = await Train.insertMany(mockTrains);

  
    const activeTrains = trains.filter(t => t.status !== 'Maintenance');
    const optimizedTrips = generateOptimizedSchedule(activeTrains, 1.2);
    await Schedule.deleteMany({});
    const schedule = await Schedule.create({
      date: new Date().toISOString().split('T')[0],
      trips: optimizedTrips,
      efficiencyScore: Math.round(90 + Math.random() * 8),
      conflictsResolved: Math.floor(Math.random() * 5) + 1
    });

    await PassengerLog.deleteMany({});
    const passengerLogs = await PassengerLog.insertMany(mockPassengerLogs);

    res.status(201).json({
      message: 'Seed complete',
      counts: {
        stations: stations.length,
        trains: trains.length,
        scheduleTrips: schedule.trips.length,
        passengerLogs: passengerLogs.length,
      }
    });
  } catch (err) {
    console.error('Seed error', err);
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
};

