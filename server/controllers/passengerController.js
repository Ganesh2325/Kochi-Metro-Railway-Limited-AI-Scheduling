import PassengerLog from '../models/PassengerLog.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stations = require('../data/kmrlStations.json');

export const logPassengerData = async (req, res) => {
    try {
        const { stationId, count } = req.body;

        if (!stationId || count === undefined) {
            return res.status(400).json({ message: "Station ID and Count are required" });
        }
        const PEAK_THRESHOLD = 800; 
        const isPeak = count > PEAK_THRESHOLD;

        const logEntry = await PassengerLog.create({
            stationId,
            count,
            isPeak
        });

        res.status(201).json({
            message: "Data logged successfully",
            data: logEntry
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPassengerStats = async (req, res) => {
    try {
        const logs = await PassengerLog.find()
            .sort({ createdAt: -1 })
            .limit(50);
            
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHeatmapData = async (req, res) => {
    try {
        const heatmap = await PassengerLog.aggregate([
            { $sort: { createdAt: -1 } },
            { $group: {
                _id: "$stationId",
                latestCount: { $first: "$count" },
                lastUpdate: { $first: "$createdAt" }
            }}
        ]);
        const enrichedData = heatmap.map(item => {
            const stationInfo = stations.find(s => s.id === item._id);
            return {
                stationId: item._id,
                name: stationInfo ? stationInfo.name : "Unknown",
                load: item.latestCount,
                status: item.latestCount > 800 ? 'critical' : item.latestCount > 500 ? 'high' : 'normal'
            };
        });

        res.json(enrichedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};