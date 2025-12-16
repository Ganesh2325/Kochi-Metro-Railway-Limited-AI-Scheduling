import React, { createContext, useState, useEffect, useContext } from 'react';


const MetroContext = createContext();
const STATIONS = [
  { id: 'S01', name: 'Aluva', type: 'Terminal', load: 'normal' },
  { id: 'S02', name: 'Pulinchodu', type: 'Normal', load: 'low' },
  { id: 'S03', name: 'Companypady', type: 'Normal', load: 'low' },
  { id: 'S04', name: 'Ambattukavu', type: 'Normal', load: 'low' },
  { id: 'S05', name: 'Muttom', type: 'Depot', load: 'normal' },
  { id: 'S06', name: 'Kalamassery', type: 'Normal', load: 'normal' },
  { id: 'S07', name: 'CUSAT', type: 'Normal', load: 'high' },
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

const INITIAL_TRAINS = [
  { id: 'T-101', stationIndex: 0, progress: 0, direction: 'down', status: 'On Time', route: 'Aluva - Petta' },
  { id: 'T-104', stationIndex: 8, progress: 50, direction: 'down', status: 'Delayed', route: 'Aluva - Petta' },
  { id: 'T-202', stationIndex: 14, progress: 20, direction: 'up', status: 'On Time', route: 'Petta - Aluva' },
  { id: 'T-305', stationIndex: 24, progress: 0, direction: 'up', status: 'On Time', route: 'Petta - Aluva' },
  { id: 'T-306', stationIndex: 4, progress: 0, direction: 'middle', status: 'Running', route: 'Petta - Aluva' },
];

const INITIAL_ALERTS = [
  {
    id: 1,
    severity: 'critical',
    type: 'Headway Violation',
    location: 'Edapally - Palarivattom Section',
    message: 'Train T-104 and T-105 are too close (< 90 sec gap).',
    aiAction: 'Hold T-105 at Edapally for 45s',
    timestamp: '10:42:05'
  },
  {
    id: 2,
    severity: 'warning',
    type: 'Platform Overlap',
    location: 'M.G Road (Platform 2)',
    message: 'Incoming Train T-202 assigned to occupied platform.',
    aiAction: 'Reroute T-202 to Platform 1',
    timestamp: '10:41:50'
  }
];

export const MetroProvider = ({ children }) => {
  const [stations, setStations] = useState(STATIONS);
  const [trains, setTrains] = useState(INITIAL_TRAINS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isAiActive, setIsAiActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrains(currentTrains => currentTrains.map(train => {
        if (train.status === 'Maintenance' || train.status === 'Held') return train;

        let newProgress = train.progress + 5;
        let newIndex = train.stationIndex;
        let newDirection = train.direction;

        if (newProgress >= 100) {
          newProgress = 0;
          if (train.direction === 'down') {
            newIndex += 1;
            if (newIndex >= STATIONS.length - 1) {
                newDirection = 'up'; 
            }
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

    return () => clearInterval(timer);
  }, []);

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const runOptimization = () => {
    setIsAiActive(true);
    
    setTimeout(() => {
        setTrains(prev => prev.map(t => 
            t.id === 'T-104' ? { ...t, status: 'Recovering' } : t
        ));
        
        setAlerts(prev => [{
            id: Date.now(),
            severity: 'success',
            type: 'Optimization Complete',
            location: 'System Wide',
            message: 'AI successfully adjusted headway for peak traffic.',
            aiAction: 'Schedule Updated',
            timestamp: new Date().toLocaleTimeString()
        }, ...prev]);

    }, 1500);
  };

  const updateStationLoad = (stationId, newLoadLevel) => {
      setStations(prev => prev.map(s => 
          s.id === stationId ? { ...s, load: newLoadLevel } : s
      ));
  };

  return (
    <MetroContext.Provider value={{
      stations,
      trains,
      alerts,
      isAiActive,
      resolveAlert,
      runOptimization,
      updateStationLoad
    }}>
      {children}
    </MetroContext.Provider>
  );
};

export const useMetro = () => {
  const context = useContext(MetroContext);
  if (!context) {
    throw new Error('useMetro must be used within a MetroProvider');
  }
  return context;
};

export default MetroContext;