import React, { useState } from 'react';
import GanttChart from '../components/scheduling/GanttChart.jsx';
import TimeTable from '../components/scheduling/TimeTable.jsx';
import { 
  LayoutList, 
  CalendarClock, 
  Zap, 
  History 
} from 'lucide-react';

/**
 * ScheduleManager.jsx
 * Location: client/src/pages/ScheduleManager.jsx
 * Description: The core workspace for AI Train Scheduling.
 * * Features:
 * - Switches between Visual (Gantt) and Tabular (TimeTable) views.
 * - Displays high-level optimization stats.
 */

const ScheduleManager = () => {
  const [activeView, setActiveView] = useState('timeline'); // 'timeline' | 'list'

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarClock className="text-teal-600" size={28} />
            AI Schedule Manager
          </h2>
          <p className="text-sm text-slate-500">
            Automated Induction Planning for KMRL Blue Line
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveView('timeline')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all
              ${activeView === 'timeline' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
            `}
          >
            <CalendarClock size={16} /> Timeline View
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all
              ${activeView === 'list' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
            `}
          >
            <LayoutList size={16} /> Detailed Manifest
          </button>
        </div>
      </div>

      {/* AI METRICS BANNER */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <Zap size={24} className="text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Optimization Engine Active</h3>
            <p className="text-teal-200 text-sm">
              Algorithm: <span className="text-white font-mono">Genetic-v4.2</span> • Last Run: <span className="text-white font-mono">10:42 AM</span>
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold">14%</div>
            <div className="text-xs text-teal-300 uppercase tracking-wider">Gap Reduced</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-teal-300 uppercase tracking-wider">Conflicts Resolved</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-h-[500px]">
        {activeView === 'timeline' ? (
          /* Gantt Chart Component (Visual) */
          <div className="h-full animate-in fade-in duration-500">
            <GanttChart />
          </div>
        ) : (
          /* Table Component (Data) */
          <div className="h-full animate-in fade-in duration-500">
            <TimeTable />
          </div>
        )}
      </div>

    </div>
  );
};

export default ScheduleManager;