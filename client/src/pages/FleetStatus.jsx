import React, { useState } from 'react';
import { useMetro } from '../context/MetroContext.jsx';
import { TrainFront, Wrench, AlertTriangle, CheckCircle2, Gauge, Battery, Calendar, Search, ArrowUpRight } from 'lucide-react';

const FleetStatus = () => {
  const { trains } = useMetro();
  const [filter, setFilter] = useState('All');

  const fleetData = trains.map((train, index) => ({
    ...train,
    model: 'Alstom Metropolis',
    commissionDate: '2017-06-19',
    mileage: 124000 + (index * 5420),
    healthScore: (train.status === 'Maintenance' ? 45 : 94) - (index * 2),
    batteryLevel: train.status === 'Maintenance' ? 'Charging' : '98%',
    nextService: train.status === 'Maintenance' ? 'In Progress' : `${15 + index} Days`,
  }));

  const inService = fleetData.filter(t => t.status !== 'Maintenance').length;
  const filteredFleet = filter === 'All' ? fleetData : fleetData.filter(t => t.status === filter);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div><h2 className="text-2xl font-bold text-slate-800">Rolling Stock Status</h2><p className="text-sm text-slate-500">Real-time Asset Health & Maintenance Logs</p></div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {['All', 'On Time', 'Delayed', 'Maintenance'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${filter === f ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-blue-50 rounded-lg text-blue-600"><TrainFront size={28} /></div><div><p className="text-xs font-bold text-slate-400 uppercase">Fleet Availability</p><h3 className="text-2xl font-bold text-slate-800">{inService} / {fleetData.length}</h3></div></div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 size={28} /></div><div><p className="text-xs font-bold text-slate-400 uppercase">Avg. Health</p><h3 className="text-2xl font-bold text-slate-800">92%</h3></div></div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Wrench size={28} /></div><div><p className="text-xs font-bold text-slate-400 uppercase">Maintenance</p><h3 className="text-2xl font-bold text-slate-800">1 Unit</h3></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFleet.map((train) => (
          <div key={train.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
              <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">{train.id.split('-')[1]}</div><div><h3 className="font-bold text-slate-800">{train.id}</h3><p className="text-xs text-slate-500">{train.model}</p></div></div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${train.status === 'On Time' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{train.status}</span>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-2">
              <div className="flex items-start gap-3"><Gauge size={18} className="text-slate-400" /><div><p className="text-[10px] text-slate-400 uppercase font-bold">Mileage</p><p className="text-sm font-semibold text-slate-700">{train.mileage.toLocaleString()} km</p></div></div>
              <div className="flex items-start gap-3"><Battery size={18} className="text-slate-400" /><div><p className="text-[10px] text-slate-400 uppercase font-bold">Battery</p><p className="text-sm font-semibold text-slate-700">{train.batteryLevel}</p></div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FleetStatus;