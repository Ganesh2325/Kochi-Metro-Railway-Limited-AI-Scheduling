import React, { useState } from 'react';
import { 
  Calendar, 
  RotateCcw, 
  Zap, 
  CheckCircle2
} from 'lucide-react';

const INITIAL_SCHEDULE = [
  { 
    id: 'T-101', 
    name: 'Train 101 (Alstom)', 
    trips: [
      { id: 1, start: '06:00', end: '07:15', route: 'Aluva - Petta', status: 'completed' },
      { id: 2, start: '07:30', end: '08:45', route: 'Petta - Aluva', status: 'active' },
      { id: 3, start: '09:15', end: '10:30', route: 'Aluva - Petta', status: 'scheduled' }, 
      { id: 4, start: '11:00', end: '12:15', route: 'Petta - Aluva', status: 'scheduled' }
    ]
  },
  { 
    id: 'T-102', 
    name: 'Train 102 (Alstom)', 
    trips: [
      { id: 5, start: '06:15', end: '07:30', route: 'Aluva - Petta', status: 'completed' },
      { id: 6, start: '07:45', end: '09:00', route: 'Petta - Aluva', status: 'active' },
      { id: 7, start: '09:30', end: '10:45', route: 'Aluva - Petta', status: 'scheduled' }
    ]
  },
  { 
    id: 'T-103', 
    name: 'Train 103 (Maintenance)', 
    trips: [
      { id: 8, start: '08:00', end: '11:00', route: 'Muttom Yard', status: 'maintenance' }
    ]
  },
  { 
    id: 'T-104', 
    name: 'Train 104 (Alstom)', 
    trips: [
      { id: 9, start: '06:30', end: '07:45', route: 'Aluva - Petta', status: 'completed' },
      { id: 10, start: '08:00', end: '09:15', route: 'Petta - Aluva', status: 'delayed' },
      { id: 11, start: '10:00', end: '11:15', route: 'Aluva - Petta', status: 'scheduled' } 
    ]
  },

   { 
    id: 'T-105', 
    name : 'Train 105 (Running)', 
    trips: [
      { id: 12, start: '07:30', end: '07:45', route: 'Aluva - Muttom', status: 'completed' },
      { id: 13, start: '08:00', end: '09:15', route: 'Petta - Aluva', status: 'delayed' },
      { id: 14, start: '10:00', end: '11:15', route: 'Aluva - Kaloor', status: 'scheduled' } 
    ]
  }
];

const timeToPx = (time) => {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = (h * 60 + m) - (6 * 60); 
  return totalMinutes * 3;
};

const GanttChart = () => {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const runAiOptimization = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const optimizedSchedule = schedule.map(train => {
        if (train.id === 'T-101') {
          const newTrips = [...train.trips];
          newTrips[2] = { ...newTrips[2], start: '09:00', end: '10:15', status: 'optimized' };
          newTrips[3] = { ...newTrips[3], start: '10:30', end: '11:45', status: 'optimized' };
          return { ...train, trips: newTrips };
        }
        if (train.id === 'T-104') {
          const newTrips = [...train.trips];
          newTrips[2] = { ...newTrips[2], start: '09:30', end: '10:45', status: 'optimized' };
          return { ...train, trips: newTrips };
        }
        return train;
      });

      setSchedule(optimizedSchedule);
      setIsOptimized(true);
      setIsProcessing(false);
    }, 1500); 
  };

  const resetSchedule = () => {
    setSchedule(INITIAL_SCHEDULE);
    setIsOptimized(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
      
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-slate-500" />
            Master Schedule (Blue Line)
          </h3>
          <p className="text-xs text-slate-500">
            {isOptimized ? 'AI Optimized Sequence Active' : 'Standard Static Timetable Loaded'}
          </p>
        </div>

        <div className="flex gap-3">
          {isOptimized ? (
            <button 
              onClick={resetSchedule}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw size={16} /> Reset
            </button>
          ) : (
            <button 
              onClick={runAiOptimization}
              disabled={isProcessing}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all
                ${isProcessing ? 'bg-slate-400 cursor-wait' : 'bg-purple-600 hover:bg-purple-700 hover:shadow-md'}
              `}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Zap size={16} className="fill-white" /> Run AI Optimization
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto relative custom-scrollbar">

        <div className="sticky top-0 z-10 flex min-w-[1200px] border-b border-slate-200 bg-white h-10 items-center">
          <div className="w-48 shrink-0 border-r border-slate-100 bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase flex items-center h-full">
            Train ID
          </div>
          <div className="flex-1 relative h-full">
            {[6, 7, 8, 9, 10, 11, 12].map(hour => (
              <div 
                key={hour} 
                className="absolute top-0 bottom-0 border-l border-slate-100 flex items-center pl-1 text-[10px] text-slate-400 font-mono font-medium"
                style={{ left: `${(hour - 6) * 60 * 3}px` }} 
              >
                {hour < 10 ? `0${hour}` : hour}:00
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-[1200px]">
          {schedule.map((train, index) => (
            <div key={train.id} className="flex h-16 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group relative">
              
              <div className="w-48 shrink-0 border-r border-slate-100 p-3 flex flex-col justify-center sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                <span className="font-bold text-sm text-slate-700">{train.id}</span>
                <span className="text-[10px] text-slate-400 truncate">{train.name.split('(')[1].replace(')', '')}</span>
              </div>

              <div className="flex-1 relative my-auto h-full">
                
                {[6, 7, 8, 9, 10, 11, 12].map(hour => (
                  <div 
                    key={hour} 
                    className="absolute top-0 bottom-0 border-l border-dashed border-slate-100"
                    style={{ left: `${(hour - 6) * 60 * 3}px` }} 
                  ></div>
                ))}

                {train.trips.map(trip => {
                  const left = timeToPx(trip.start);
                  const width = timeToPx(trip.end) - left;
                  
                  let blockStyle = "bg-teal-500 hover:bg-teal-600";
                  if (trip.status === 'completed') blockStyle = "bg-slate-300 opacity-60";
                  if (trip.status === 'delayed') blockStyle = "bg-amber-500 stripe-amber"; // Imagine a CSS stripe class
                  if (trip.status === 'maintenance') blockStyle = "bg-slate-200 border-2 border-dashed border-slate-300 text-slate-500";
                  if (trip.status === 'optimized') blockStyle = "bg-purple-500 hover:bg-purple-600 shadow-lg ring-2 ring-purple-200";

                  return (
                    <div
                      key={trip.id}
                      className={`
                        absolute h-8 top-4 rounded-md text-[10px] font-bold text-white flex items-center justify-center px-2 cursor-pointer transition-all duration-500
                        ${blockStyle}
                      `}
                      style={{ 
                        left: `${left}px`, 
                        width: `${width}px` 
                      }}
                      title={`${trip.route} (${trip.start} - ${trip.end})`}
                    >
                      {width > 50 && (
                        <span className="truncate drop-shadow-md">
                          {trip.status === 'maintenance' ? 'MAINTENANCE' : trip.route}
                        </span>
                      )}
                      
                      {trip.status === 'optimized' && (
                        <div className="absolute -top-1 -right-1 bg-white text-purple-600 rounded-full p-0.5 shadow-sm">
                          <Zap size={8} className="fill-purple-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-0 pointer-events-none opacity-50"
          style={{ left: `${timeToPx('10:42') + 192}px` }}
        >
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
        </div>

      </div>

      <div className="h-10 border-t border-slate-200 bg-slate-50 flex items-center px-6 gap-6 text-[10px] font-bold uppercase text-slate-500">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-teal-500 rounded-sm"></span> Active Trip</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> Delayed</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-purple-500 rounded-sm"></span> AI Optimized</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></span> Completed</div>
        <div className="flex items-center gap-1.5 ml-auto text-purple-700">
          {isOptimized && <><CheckCircle2 size={12} /> Schedule Efficiency Increased by 18%</>}
        </div>
      </div>

    </div>
  );
};

export default GanttChart;