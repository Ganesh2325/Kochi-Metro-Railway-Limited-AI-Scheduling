import React, { useState, useEffect } from 'react';
import { 
  TrainFront, 
  MapPin, 
  Users, 
  AlertCircle, 
  ArrowDown, 
  ArrowUp,
  Info 
} from 'lucide-react';

const STATIONS = [
  { id: 'S01', name: 'Aluva', type: 'Terminal', load: 'normal' },
  { id: 'S02', name: 'Pulinchodu', type: 'Normal', load: 'low' },
  { id: 'S03', name: 'Companypady', type: 'Normal', load: 'low' },
  { id: 'S04', name: 'Ambattukavu', type: 'Normal', load: 'low' },
  { id: 'S05', name: 'Muttom', type: 'Depot', load: 'normal' },
  { id: 'S06', name: 'Kalamassery', type: 'Normal', load: 'normal' },
  { id: 'S07', name: 'Cochin Univ. (CUSAT)', type: 'Normal', load: 'high' }, 
  { id: 'S08', name: 'Pathadipalam', type: 'Normal', load: 'low' },
  { id: 'S09', name: 'Edapally', type: 'Interchange', load: 'critical' }, 
  { id: 'S10', name: 'Changampuzha Park', type: 'Normal', load: 'normal' },
  { id: 'S11', name: 'Palarivattom', type: 'Normal', load: 'high' },
  { id: 'S12', name: 'JLN Stadium', type: 'Normal', load: 'high' },
  { id: 'S13', name: 'Kaloor', type: 'Normal', load: 'high' },
  { id: 'S14', name: 'Town Hall', type: 'Normal', load: 'normal' },
  { id: 'S15', name: 'M.G Road', type: 'Hub', load: 'critical' }, 
  { id: 'S16', name: 'Maharajas College', type: 'Normal', load: 'high' },
  { id: 'S17', name: 'Ernakulam South', type: 'RailConnect', load: 'critical' },
  { id: 'S18', name: 'Kadavanthra', type: 'Normal', load: 'normal' },
  { id: 'S19', name: 'Elamkulam', type: 'Normal', load: 'low' },
  { id: 'S20', name: 'Vyttila', type: 'MobilityHub', load: 'critical' },
  { id: 'S21', name: 'Thaikoodam', type: 'Normal', load: 'low' },
  { id: 'S22', name: 'Petta', type: 'Normal', load: 'normal' },
  { id: 'S23', name: 'Vadakkekotta', type: 'Normal', load: 'low' },
  { id: 'S24', name: 'SN Junction', type: 'Normal', load: 'normal' },
  { id: 'S25', name: 'Thrippunithura', type: 'Terminal', load: 'high' }
];

const LiveMap = () => {
  const [trains, setTrains] = useState([
    { id: 'T-101', stationIndex: 0, progress: 0, direction: 'down', status: 'On Time' }, 
    { id: 'T-104', stationIndex: 8, progress: 50, direction: 'down', status: 'Delayed' }, 
    { id: 'T-202', stationIndex: 14, progress: 20, direction: 'up', status: 'On Time' },  
    { id: 'T-305', stationIndex: 24, progress: 0, direction: 'up', status: 'On Time' }, 
  ]);

  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(currentTrains => currentTrains.map(train => {
        let newProgress = train.progress + 5;
        let newIndex = train.stationIndex;
        let newDirection = train.direction;

        if (newProgress >= 100) {
          newProgress = 0;
          if (train.direction === 'down') {
            newIndex += 1;
            if (newIndex >= STATIONS.length - 1) newDirection = 'up'; 
          } else {
            newIndex -= 1;
            if (newIndex <= 0) newDirection = 'down';
          }
        }

        return {
          ...train,
          stationIndex: newIndex,
          progress: newProgress,
          direction: newDirection
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getLoadColor = (load) => {
    switch(load) {
      case 'critical': return 'bg-red-500 border-red-200 text-red-600';
      case 'high': return 'bg-orange-400 border-orange-200 text-orange-600';
      case 'low': return 'bg-teal-400 border-teal-200 text-teal-600';
      default: return 'bg-emerald-500 border-emerald-200 text-emerald-600';
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-full relative">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="text-teal-600" />
              Blue Line Live Status
            </h2>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Normal Load</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400"></span> Heavy</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critical</span>
            </div>
          </div>

          <div className="relative pl-12 pr-4 space-y-0">
            <div className="absolute left-[3.25rem] top-4 bottom-4 w-1.5 bg-slate-200 rounded-full z-0"></div>

            {STATIONS.map((station, index) => {
              const trainsHere = trains.filter(t => t.stationIndex === index);

              return (
                <div key={station.id} className="relative z-10 min-h-[80px] group">
                  <div 
                    onClick={() => setSelectedStation(station)}
                    className={`
                      absolute left-0 w-6 h-6 rounded-full border-4 z-20 cursor-pointer transition-transform hover:scale-125
                      ${getLoadColor(station.load).replace('text-', 'border-white ')} 
                      ${selectedStation?.id === station.id ? 'ring-4 ring-teal-200 scale-125' : ''}
                    `}
                  ></div>
                  <div className="ml-10 pt-0.5 flex items-start justify-between cursor-pointer" onClick={() => setSelectedStation(station)}>
                    <div>
                      <h3 className={`font-semibold text-sm ${station.load === 'critical' ? 'text-red-600' : 'text-slate-700'}`}>
                        {station.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{station.type}</p>
                    </div>
                    
                    {station.load === 'critical' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 animate-pulse">
                        <Users size={10} /> High Traffic
                      </span>
                    )}
                  </div>

                  {trainsHere.map(train => (
                    <div 
                      key={train.id}
                      className="absolute left-[1.6rem] transition-all duration-1000 ease-linear z-30 flex items-center gap-2"
                      style={{ 
                        top: `${train.progress}%`, 
                        transform: 'translateY(-50%)'
                      }}
                    >
                      <div className={`
                        p-1.5 rounded-lg shadow-lg text-white text-xs font-bold flex items-center gap-1
                        ${train.direction === 'down' ? 'bg-teal-600' : 'bg-blue-600'}
                      `}>
                        <TrainFront size={14} />
                        <span>{train.id}</span>
                        {train.direction === 'down' ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                      </div>

                      {train.status !== 'On Time' && (
                        <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                          <AlertCircle size={10} /> {train.status}
                        </div>
                      )}
                    </div>
                  ))}

                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-80 bg-white border-l border-slate-200 p-6 shadow-xl z-20 overflow-y-auto">
        {selectedStation ? (
          <div className="animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedStation.name}</h3>
            <span className={`text-xs px-2 py-1 rounded font-semibold uppercase ${getLoadColor(selectedStation.load)} bg-opacity-10`}>
              Current Status: {selectedStation.load} Load
            </span>

            <div className="mt-6 space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-teal-700 font-semibold mb-2 text-sm">
                  <Info size={16} /> AI Prediction
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based on historical data (Friday 6 PM), passenger density at <strong>{selectedStation.name}</strong> is expected to increase by 40% in the next 15 minutes.
                </p>
                <div className="mt-3 bg-teal-100 text-teal-800 text-xs px-3 py-2 rounded font-medium text-center">
                  Recommended Action: Decrease Headway
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-100 rounded shadow-sm">
                    <div className="text-slate-500 text-[10px]">Avg Wait</div>
                    <div className="text-lg font-bold text-slate-800">4m 30s</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded shadow-sm">
                    <div className="text-slate-500 text-[10px]">Pax Density</div>
                    <div className="text-lg font-bold text-slate-800">1.2/m²</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Upcoming Trains</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                    <span className="font-semibold text-slate-700">T-104 (To Petta)</span>
                    <span className="text-emerald-600 font-mono">2 min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                    <span className="font-semibold text-slate-700">T-108 (To Aluva)</span>
                    <span className="text-emerald-600 font-mono">7 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
            <MapPin size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Select a station on the map to view AI analytics and real-time passenger data.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default LiveMap;