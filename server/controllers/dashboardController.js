import Station from '../models/Station.js';
import Train from '../models/Train.js';
import Schedule from '../models/Schedule.js';
import PassengerLog from '../models/PassengerLog.js';
import User from '../models/User.js';

export const getSummary = async (_req, res) => {
  try {
    const [
      stationCount,
      trainCount,
      activeTrains,
      maintenanceTrains,
      scheduleCount,
      latestSchedule,
      passengerLogCount,
      userCount
    ] = await Promise.all([
      Station.countDocuments(),
      Train.countDocuments(),
      Train.countDocuments({ status: { $ne: 'Maintenance' } }),
      Train.countDocuments({ status: 'Maintenance' }),
      Schedule.countDocuments(),
      Schedule.findOne().sort({ createdAt: -1 }),
      PassengerLog.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      stations: stationCount,
      trains: {
        total: trainCount,
        active: activeTrains,
        maintenance: maintenanceTrains,
      },
      schedules: {
        total: scheduleCount,
        latestDate: latestSchedule?.date || null,
        latestId: latestSchedule?._id || null,
      },
      passengers: {
        logs: passengerLogCount,
      },
      users: userCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary', error);
    res.status(500).json({ message: 'Error fetching dashboard summary' });
  }
};

