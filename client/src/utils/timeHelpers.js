/**
 * timeHelpers.js
 * Location: client/src/utils/timeHelpers.js
 * Description: Utility functions for time manipulation in the KMRL AI Scheduler.
 * * Features:
 * - Parsing/Formatting "HH:MM" strings
 * - Calculating durations and overlaps for conflict detection
 * - Train headway calculations
 */

// Constants for Metro Operation Hours (06:00 AM to 10:00 PM)
export const OPS_START_HOUR = 6;
export const OPS_END_HOUR = 22;

/**
 * Converts a time string "HH:MM" to total minutes from midnight.
 * @param {string} timeStr - Format "09:30"
 * @returns {number} - Total minutes (e.g., 570)
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Converts total minutes from midnight to "HH:MM" string.
 * @param {number} totalMinutes 
 * @returns {string} - Format "09:30"
 */
export const minutesToTime = (totalMinutes) => {
  // Handle day rollover (modulo 1440 minutes in a day)
  const normalizedMinutes = totalMinutes % 1440; 
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Adds a duration (in minutes) to a start time.
 * Used for calculating Arrival Time based on Departure + Travel Time.
 * @param {string} startTime - "06:00"
 * @param {number} durationMins - 75
 * @returns {string} - "07:15"
 */
export const addMinutes = (startTime, durationMins) => {
  const startMins = timeToMinutes(startTime);
  return minutesToTime(startMins + durationMins);
};

/**
 * Calculates the duration between two time strings in minutes.
 * @param {string} start - "06:00"
 * @param {string} end - "07:15"
 * @returns {number} - 75
 */
export const getDuration = (start, end) => {
  return timeToMinutes(end) - timeToMinutes(start);
};

/**
 * Checks if two time ranges overlap.
 * Critical for the AI Conflict Detection System to prevent platform collisions.
 * @param {string} start1 - Start of Train A
 * @param {string} end1 - End of Train A
 * @param {string} start2 - Start of Train B
 * @param {string} end2 - End of Train B
 * @returns {boolean} - True if overlap exists
 */
export const isOverlapping = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  // Standard overlap logic: Max(start) < Min(end)
  return Math.max(s1, s2) < Math.min(e1, e2);
};

export const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

/**
 * AI Helper: Calculates the "Headway" (gap) between two trains.
 * If the gap is less than the safety threshold (e.g., 5 mins), it flags a warning.
 * @param {string} t1Arrival - Arrival of previous train
 * @param {string} t2Departure - Departure of current train
 * @returns {object} - { gap: number, isSafe: boolean }
 */
export const calculateHeadway = (t1Arrival, t2Departure) => {
  const gap = getDuration(t1Arrival, t2Departure);
  const SAFETY_THRESHOLD = 5; // Minimum 5 mins between trains
  
  return {
    gapMinutes: gap,
    isSafe: gap >= SAFETY_THRESHOLD
  };
};

export default {
  timeToMinutes,
  minutesToTime,
  addMinutes,
  getDuration,
  isOverlapping,
  getCurrentTimestamp,
  calculateHeadway
};