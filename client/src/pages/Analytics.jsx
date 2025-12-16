import React from 'react';
// Added .jsx extension to ensure resolution in strict environments
import { useMetro } from '../context/MetroContext.jsx';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  Calendar,
  ArrowUpRight,
  PieChart
} from 'lucide-react';

const Analytics = () => {
  // Access live data from the global state
  const { stations, trains } = useMetro();

  // --- MOCK DATA FOR CHARTS ---
  // Data points for the SVG Graph (06:00 to 22:00)
  const hourlyTraffic = [
    10, 25, 60, 95, 80, 55, 45, 40, 50, 65, 90, 100, 85, 50, 30, 15
  ];

  // Calculate live stats from Context
  const activeTrains = trains.filter(t => t.status !== 'Maintenance').length;
  const criticalStations = stations.filter(s => s.load === 'critical').length;
  const highLoadStations = stations.filter(s => s.load === 'high').length;
  const totalSystemLoad = stations.reduce((acc, curr) => {
    // Arbitrary numbers for simulation: critical=1000, high=600, normal=200, low=50
    const loadMap = { critical: 1000, high: 600, normal: 200, low: 50 };
    return acc + (loadMap[curr.load] || 0);
  }, 0);

  // --- SVG CHART GENERATOR ---
  // Converts the hourlyTraffic array into an SVG path string
  const generateChartPath = (data, height, width) => {
    const max = Math.max(...data);
    const stepX = width / (data.length - 1);
    
    // Build the "d" attribute for the path
    let path = `M 0 ${height - (data[0] / max) * height}`;
    data.forEach((point, index) => {
      if (index === 0) return;
      const x = index * stepX;
      const y = height - (point / max) * height;
      // Simple bezier curve smoothing
      const prevX = (index - 1) * stepX;
      const prevY = height - (data[index - 1] / max) * height;
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    });
    return path;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Analytics</h2>
          <p className="text-sm text-slate-500">AI-Driven Performance Metrics & Forecasting</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <Calendar size={18} className="text-slate-400" />
          <div className="text-sm font-semibold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer">
           Today
          </div>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total Passengers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={20} /></div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +12.5%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{totalSystemLoad.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Daily Ridership</p>
        </div>

        {/* Card 2: AI Efficiency */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Zap size={20} /></div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              AI Active
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">18.4%</h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Energy Saved vs Manual</p>
        </div>

        {/* Card 3: Punctuality */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Clock size={20} /></div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              98.2%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{activeTrains}/{trains.length}</h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Active Fleet / Total</p>
        </div>

        {/* Card 4: Critical Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingUp size={20} /></div>
            {criticalStations > 1 ? (
               <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full animate-pulse">
                 High Load
               </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Normal</span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{criticalStations + highLoadStations}</h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Congested Stations</p>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Chart (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Passenger Density Profile</h3>
              <p className="text-sm text-slate-500">Aluva - Thrippunithura Corridor (Hourly)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-teal-500"></span> Actual Load</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-300"></span> Predicted</span>
            </div>
          </div>

          {/* SVG CHART CONTAINER */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
              ))}
              
              {/* The Graph Line */}
              <path 
                d={generateChartPath(hourlyTraffic, 100, 100)} 
                fill="none" 
                stroke="#0d9488" // Teal-600
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-md"
              />
              
              {/* Area under curve (Gradient) */}
              <path 
                d={`${generateChartPath(hourlyTraffic, 100, 100)} L 100 100 L 0 100 Z`} 
                fill="url(#gradient)" 
                opacity="0.2"
              />
              
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>06:00</span>
              <span>10:00</span>
              <span>14:00</span>
              <span>18:00</span>
              <span>22:00</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Station Efficiency & AI Insights */}
        <div className="space-y-6">
          
          {/* Station Efficiency List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <PieChart size={18} className="text-slate-400" /> Station Load
            </h3>
            
            <div className="space-y-4">
              {stations.slice(0, 5).map((station, idx) => {
                // Mock percentage based on load string
                const percentage = station.load === 'critical' ? 95 : station.load === 'high' ? 40 : 75;
                const color = station.load === 'critical' ? 'bg-red-500' : station.load === 'high' ? 'bg-orange-400' : 'bg-teal-500';
                
                return (
                  <div key={station.id}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{station.name}</span>
                      <span className="text-slate-500">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
             {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={64} />
            </div>

            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400 fill-yellow-400" /> AI Forecast
            </h3>
            <p className="text-slate-400 text-xs mb-4 uppercase tracking-wider font-semibold">Next 4 Hours</p>
            
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0"></div>
                <p className="text-slate-300">
                  <span className="text-white font-semibold">17:30 - Rain Expected.</span> 
                  Increase dwell time at <span className="text-yellow-200">Aluva</span> by 20s to accommodate umbrella handling.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                <p className="text-slate-300">
                  Traffic normalizing at <span className="text-emerald-200">CUSAT</span> after 14:00 student dispersal.
                </p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;