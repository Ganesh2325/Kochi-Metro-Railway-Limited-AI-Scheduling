import React from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  Clock 
} from 'lucide-react';

const LoadHeatmap = () => {
  const stationData = [
    { name: 'Aluva', load: 45, capacity: 600, trend: 'stable' },
    { name: 'CUSAT', load: 78, capacity: 500, trend: 'rising' }, 
    { name: 'Edapally', load: 92, capacity: 800, trend: 'rising' }, 
    { name: 'M.G Road', load: 88, capacity: 750, trend: 'falling' },
    { name: 'Vyttila', load: 65, capacity: 1000, trend: 'stable' },
    { name: 'Tripunithura', load: 30, capacity: 450, trend: 'rising' },
  ];

  const getBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-400';
    return 'bg-teal-500';
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'rising': return <TrendingUp size={14} className="text-red-500" />;
      case 'falling': return <TrendingDown size={14} className="text-emerald-500" />;
      default: return <Minus size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Passenger Load</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time Turnstile Data</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">12,405</div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Pax</div>
        </div>
      </div>

      <div className="flex-1 p-6 flex items-end justify-between gap-2 min-h-[180px]">
        {stationData.map((station, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
       
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-12 bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
              {station.load}% Capacity ({Math.round(station.capacity * (station.load/100))} pax)
            </div>

            <div className="w-full bg-slate-100 rounded-t-lg relative h-32 overflow-hidden flex items-end">
              <div 
                className={`w-full transition-all duration-1000 ease-out rounded-t-lg opacity-90 group-hover:opacity-100 ${getBarColor(station.load)}`}
                style={{ height: `${station.load}%` }}
              ></div>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-600 truncate w-12 md:w-16 text-center mx-auto">
                {station.name.split(' ')[0]} 
              </p>
              <div className="flex justify-center mt-1">
                {getTrendIcon(station.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Clock size={16} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">
              AI Forecast
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on weather patterns, evening peak at <span className="font-bold text-slate-800">Edapally</span> is expected to start 15 mins early (16:45).
            </p>
            <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full w-[75%]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>Current Load</span>
              <span>Predicted Peak (95%)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoadHeatmap;