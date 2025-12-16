import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  MoreHorizontal,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const SCHEDULE_DATA = [
  { id: 101, trainId: 'T-101', route: 'Aluva - Petta', dep: '06:00', arr: '07:15', status: 'Completed', aiReason: '-' },
  { id: 102, trainId: 'T-102', route: 'Aluva - Petta', dep: '06:15', arr: '07:30', status: 'Completed', aiReason: '-' },
  { id: 103, trainId: 'T-104', route: 'Aluva - Petta', dep: '06:30', arr: '07:45', status: 'Completed', aiReason: '-' },
  { id: 104, trainId: 'T-101', route: 'Petta - Aluva', dep: '07:30', arr: '08:45', status: 'Active', aiReason: '-' },
  { id: 105, trainId: 'T-102', route: 'Petta - Aluva', dep: '07:45', arr: '09:00', status: 'Active', aiReason: '-' },
  { id: 106, trainId: 'T-104', route: 'Petta - Aluva', dep: '08:00', arr: '09:15', status: 'Delayed', aiReason: 'Signal error at Vyttila (+12m)' },
  { id: 107, trainId: 'T-101', route: 'Aluva - Petta', dep: '09:00', arr: '10:15', status: 'Optimized', aiReason: 'Gap Reduction (High Demand)' },
  { id: 108, trainId: 'T-104', route: 'Aluva - Petta', dep: '09:30', arr: '10:45', status: 'Optimized', aiReason: 'Delay Recovery Strategy' },
  { id: 109, trainId: 'T-105', route: 'Aluva - Petta', dep: '09:45', arr: '11:00', status: 'Scheduled', aiReason: '-' },
  { id: 110, trainId: 'T-102', route: 'Aluva - Petta', dep: '09:30', arr: '10:45', status: 'Cancelled', aiReason: 'Maintenance Re-routing' },
];

const TimeTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredData = SCHEDULE_DATA.filter(item => {
    const matchesSearch = item.trainId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Delayed': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Optimized': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'Completed': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800">Generated Manifest</h3>
          <p className="text-xs text-slate-500">Live operational data synced with AI Scheduler</p>
        </div>

        <div className="flex flex-1 max-w-lg justify-end gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Train or Route..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Delayed">Delayed</option>
              <option value="Optimized">AI Optimized</option>
              <option value="Completed">Completed</option>
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg border border-transparent hover:border-teal-100 transition-colors" title="Export CSV">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 border-b border-slate-200">Train ID</th>
              <th className="px-6 py-3 border-b border-slate-200">Route</th>
              <th className="px-6 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 group">
                <div className="flex items-center gap-1">
                  Schedule (Dep - Arr) <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50" />
                </div>
              </th>
              <th className="px-6 py-3 border-b border-slate-200">Status</th>
              <th className="px-6 py-3 border-b border-slate-200 text-purple-700">
                <div className="flex items-center gap-1">
                  <Zap size={14} className="fill-purple-200" /> AI Log
                </div>
              </th>
              <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                    {row.trainId}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {row.route}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    {row.dep} - {row.arr}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(row.status)}`}>
                      {row.status === 'Optimized' && <Zap size={10} className="mr-1 fill-current" />}
                      {row.status === 'Delayed' && <AlertCircle size={10} className="mr-1" />}
                      {row.status === 'Completed' && <CheckCircle2 size={10} className="mr-1" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {row.aiReason !== '-' ? (
                      <span className="text-purple-700 font-medium bg-purple-50 px-2 py-1 rounded">
                        {row.aiReason}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                  <p className="text-sm">No schedule entries found matching your filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500 font-medium">
        <div>Showing 1-{filteredData.length} of {SCHEDULE_DATA.length} entries</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">Next</button>
        </div>
      </div>

    </div>
  );
};

export default TimeTable;