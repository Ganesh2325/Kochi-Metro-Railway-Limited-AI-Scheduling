import Train from '../models/Train.js';

export const getTrains = async (req, res) => {
    try {
        const trains = await Train.find({});
        res.json(trains);
    } catch (error) {
        console.error("Error fetching trains:", error);
        res.status(500).json({ message: "Server Error fetching fleet status" });
    }
};

export const updateTrain = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = req.body;
        const train = await Train.findOneAndUpdate(
            { trainId: id }, 
            updateData, 
            { new: true } 
        );

        if (train) {
            res.json(train);
        } else {
            res.status(404).json({ message: "Train not found" });
        }
    } catch (error) {
        console.error("Error updating train:", error);
        res.status(500).json({ message: "Server Error updating train" });
    }
};

export const scheduleMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const train = await Train.findOne({ trainId: id });

        if (train) {
            train.status = 'Maintenance';
            await train.save();
            res.json({ message: `Train ${id} moved to maintenance (${type})`, train });
        } else {
            res.status(404).json({ message: "Train not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error scheduling maintenance" });
    }
};

export const seedTrains = async (req, res) => {
    try {
        await Train.deleteMany({});

        const mockTrains = [
            { 
                trainId: "T-101", 
                status: "Active", 
                currentStation: "S01", 
                mileage: 124000, 
                healthScore: 94 
            },
            { 
                trainId: "T-102", 
                status: "Active", 
                currentStation: "S05", 
                mileage: 135000, 
                healthScore: 91 
            },
            { 
                trainId: "T-103", 
                status: "Maintenance", 
                currentStation: "S05", 
                mileage: 142000, 
                healthScore: 45,
                batteryLevel: "Charging"
            },
            { 
                trainId: "T-104", 
                status: "Active", 
                currentStation: "S15", 
                mileage: 110000, 
                healthScore: 98 
            },
            { 
                trainId: "T-105", 
                status: "Delayed", 
                currentStation: "S09", 
                mileage: 128000, 
                healthScore: 88 
            },
        ];

        const createdTrains = await Train.insertMany(mockTrains);
        res.status(201).json(createdTrains);
    } catch (error) {
        console.error("Error seeding trains:", error);
        res.status(500).json({ message: "Error seeding train data" });
    }
};