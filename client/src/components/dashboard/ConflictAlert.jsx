import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Zap,
  ArrowRight
} from 'lucide-react';

const ConflictAlert = () => {
  const [conflicts, setConflicts] = useState([
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
    },
    {
      id: 3,
      severity: 'warning',
      type: 'Maintenance Due',
      location: 'Rolling Stock T-112',
      message: 'Exceeded daily running quota (450km).',
      aiAction: 'Schedule swap at Muttom Depot',
      timestamp: '09:30:00'
    }
  ]);

  const resolveConflict = (id) => {
    setConflicts(current => current.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Safety & Conflicts</h3>
            <p className="text-xs text-slate-500 font-medium">
              {conflicts.length} Active {conflicts.length === 1 ? 'Alert' : 'Alerts'} Detected
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
          conflicts.length > 0 
            ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${conflicts.length > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          {conflicts.length > 0 ? 'ATTENTION REQUIRED' : 'SYSTEM NOMINAL'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
        {conflicts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-3">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-slate-800 font-semibold">All Systems Clear</h4>
            <p className="text-sm text-slate-500 mt-1">AI optimization is active. No scheduling conflicts detected.</p>
          </div>
        ) : (
          conflicts.map((conflict) => (
            <div 
              key={conflict.id} 
              className={`
                relative p-4 rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md group
                ${conflict.severity === 'critical' ? 'border-l-4 border-l-red-500 border-slate-200' : 'border-l-4 border-l-amber-400 border-slate-200'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    conflict.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {conflict.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{conflict.timestamp}</span>
                </div>
                <button 
                  onClick={() => resolveConflict(conflict.id)}
                  className="text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <h4 className="font-semibold text-slate-800 text-sm mb-1">
                {conflict.message}
              </h4>
              <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <MapPinIcon size={12} /> {conflict.location}
              </p>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2">
                <div className="flex items-center gap-1.5 text-teal-700 text-xs font-bold mb-1">
                  <Zap size={12} className="fill-teal-700" />
                  AI Recommendation
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 font-medium">
                    {conflict.aiAction}
                  </p>
                  <button 
                    onClick={() => resolveConflict(conflict.id)}
                    className="
                      text-[10px] bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1.5 
                      rounded-md font-semibold transition-colors flex items-center gap-1 shadow-sm
                    "
                  >
                    Auto-Resolve <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-6 py-3 bg-white border-t border-slate-100 text-[10px] text-slate-400 font-medium uppercase tracking-wider flex justify-between">
        <span>Scanned: 25 Stations</span>
        <span>Monitoring: 12 Trains</span>
      </div>
    </div>
  );
};

const MapPinIcon = ({ size }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default ConflictAlert;