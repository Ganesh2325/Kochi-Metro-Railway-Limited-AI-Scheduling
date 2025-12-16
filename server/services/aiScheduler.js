import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stations = require('../data/kmrlStations.json');

const PEAK_HOURS = [8, 9, 10, 17, 18, 19]; 
const MIN_HEADWAY_PEAK = 5; 
const MIN_HEADWAY_OFFPEAK = 12; 
const TRIP_DURATION = 75; 
const TURNAROUND_TIME = 10; 
const toMins = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const toTime = (mins) => {
    const normalized = mins % 1440;
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * The Main Optimization Function
 * @param {Array} availableTrains - List of active train objects
 * @param {Number} passengerLoadFactor - Multiplier (e.g., 1.5 = 50% more crowded)
 * @returns {Array} - List of optimized trip objects
 */
export const generateOptimizedSchedule = (availableTrains, passengerLoadFactor = 1.0) => {
    console.log(` AI Engine: optimizing for ${availableTrains.length} trains with load factor ${passengerLoadFactor}`);
    
    let schedule = [];
    let currentTime = toMins("06:00"); 
    const endTime = toMins("22:00");   

    let trainIndex = 0;
    while (currentTime < endTime) {
        const currentHour = Math.floor(currentTime / 60);
        const isPeak = PEAK_HOURS.includes(currentHour);
        
        let dynamicHeadway = isPeak ? MIN_HEADWAY_PEAK : MIN_HEADWAY_OFFPEAK;
       
        if (passengerLoadFactor > 1.2 && isPeak) {
            dynamicHeadway = Math.max(3, dynamicHeadway - 2); 
        }


        if (trainIndex >= availableTrains.length) {
            trainIndex = 0; 
        }
        const assignedTrain = availableTrains[trainIndex];

        const tripDown = {
            trainId: assignedTrain.trainId,
            tripId: `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            route: "Aluva - Thrippunithura",
            startTime: toTime(currentTime),
            endTime: toTime(currentTime + TRIP_DURATION),
            status: "Scheduled",
            aiOptimized: true,
            optimizationReason: isPeak 
                ? `Peak Hour Demand (Gap: ${dynamicHeadway}m)` 
                : "Energy Conservation Mode"
        };
        schedule.push(tripDown);

        const returnStartTime = currentTime + TRIP_DURATION + TURNAROUND_TIME;
        const tripUp = {
            trainId: assignedTrain.trainId,
            tripId: `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            route: "Thrippunithura - Aluva",
            startTime: toTime(returnStartTime),
            endTime: toTime(returnStartTime + TRIP_DURATION),
            status: "Scheduled",
            aiOptimized: true,
            optimizationReason: "Turnaround Optimization"
        };
        schedule.push(tripUp);


        currentTime += dynamicHeadway;
        trainIndex++;
    }

    console.log(` AI Engine: Generation Complete. Created ${schedule.length} trips.`);
    return schedule;
};