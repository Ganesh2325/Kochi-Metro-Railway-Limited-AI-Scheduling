import Station from '../models/Station.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stationSeedData = require('../data/kmrlStations.json');

export const getStations = async (req, res) => {
    try {
        const stations = await Station.find({}).sort({ distanceFromStart: 1 });
        
        if (stations) {
            res.json(stations);
        } else {
            res.status(404).json({ message: "Stations not found" });
        }
    } catch (error) {
        console.error("Error fetching stations:", error);
        res.status(500).json({ message: "Server Error fetching stations" });
    }
};

export const updateStationStats = async (req, res) => {
    try {
        const { id } = req.params; 
        const { peakHourLoad, status } = req.body;

        let station = await Station.findOne({ stationId: id });
        
        if (!station) {
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                station = await Station.findById(id);
            }
        }

        if (station) {
            if (peakHourLoad !== undefined) station.peakHourLoad = peakHourLoad;
            const updatedStation = await station.save();
            res.json(updatedStation);
        } else {
            res.status(404).json({ message: "Station not found" });
        }
    } catch (error) {
        console.error("Error updating station:", error);
        res.status(500).json({ message: "Server Error updating station" });
    }
};

export const seedStations = async (req, res) => {
    try {
        const { stations } = req.body;
        
        if (!stations || !Array.isArray(stations)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        await Station.deleteMany({});
        const createdStations = await Station.insertMany(stations);
        
        res.status(201).json(createdStations);
    } catch (error) {
        res.status(500).json({ message: "Error seeding stations" });
    }
};

export const seedStationsFromFile = async (_req, res) => {
    try {
        const mapped = stationSeedData.map(s => ({
            stationId: s.id,
            name: s.name,
            distanceFromStart: s.distance,
            type: s.type
        }));

        await Station.deleteMany({});
        const created = await Station.insertMany(mapped);
        res.status(201).json({ message: 'Stations seeded from file', count: created.length });
    } catch (error) {
        console.error('Error seeding default stations', error);
        res.status(500).json({ message: "Error seeding stations from file" });
    }
};