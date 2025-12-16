import React from 'react';
import { useMetro } from '../context/MetroContext.jsx';
import LiveMap from '../components/dashboard/LiveMap.jsx';
import ConflictAlert from '../components/dashboard/ConflictAlert.jsx';
import LoadHeatmap from '../components/dashboard/LoadHeatmap.jsx';
import { 
  Zap, 
  TrainFront, 
  Wifi,
  CircleDot 
} from 'lucide-react';


const Dashboard = () => {
  const { trains, alerts, isAiActive } = useMetro();
  const activeTrains = trains.filter(t => t.status !== 'Maintenance').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const systemHealth = 'Active';

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col gap-6">
      
      {/* TOP ROW: System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: System Health */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</p>
            <h3 className="text-lg font-bold text-emerald-600">{systemHealth}</h3>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <CircleDot size={24} />
          </div>
        </div>

        {/* Card 2: Active Fleet */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Fleet</p>
            <h3 className="text-lg font-bold text-slate-800">
              {activeTrains} <span className="text-slate-400 text-sm font-medium">/ {trains.length} Trains</span>
            </h3>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <TrainFront size={24} />
          </div>
        </div>

        {/* Card 3: AI Optimizer */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Scheduler</p>
            <h3 className={`text-lg font-bold ${isAiActive ? 'text-purple-600' : 'text-slate-600'}`}>
              {isAiActive ? 'Optimizing...' : 'Standby'}
            </h3>
          </div>
          <div className={`p-2 rounded-lg ${isAiActive ? 'bg-purple-100 text-purple-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
            <Zap size={24} className={isAiActive ? 'fill-purple-600' : ''} />
          </div>
        </div>

        {/* Card 4: Network Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sensor Network</p>
            <h3 className="text-lg font-bold text-teal-600">Online</h3>
          </div>
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
            <Wifi size={24} />
          </div>
        </div>

      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* LEFT COLUMN (2/3 width): The Live Map */}
        <div className="lg:col-span-2 h-[600px] lg:h-auto rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white relative">
            {/* LiveMap handles its own headers and scrolling */}
            <LiveMap />
        </div>

        {/* RIGHT COLUMN (1/3 width): Alerts & Stats */}
        <div className="flex flex-col gap-6 h-full">
          
          {/* Top Right: Conflict Alerts (Priority) */}
          <div className="flex-1 min-h-[300px]">
            <ConflictAlert />
          </div>

          {/* Bottom Right: Passenger Load Heatmap */}
          <div className="flex-1 min-h-[300px]">
            <LoadHeatmap />
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Dashboard;