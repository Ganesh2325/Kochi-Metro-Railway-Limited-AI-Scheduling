import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrainFront,
  CalendarClock,
  BarChart3,
  Map,
  Settings,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { title: "Control Room", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Live Metro Map", path: "/live-map", icon: <Map size={20} /> },
    { title: "AI Scheduler", path: "/schedule-manager", icon: <CalendarClock size={20} />, highlight: true },
    { title: "Fleet Status", path: "/fleet-status", icon: <TrainFront size={20} /> },
    { title: "Analytics & Load", path: "/analytics", icon: <BarChart3 size={20} /> },
    { title: "Book a Train", path: "/book-train", icon: <Ticket size={20} /> },
    { title: "Logout", path: "/signup", icon: <LogOut size={20} /> },
  ];

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-teal-700 text-white rounded-md shadow-lg hover:bg-teal-800 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <aside
        className={`
          fixed md:relative z-40 h-screen bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out border-r border-slate-700
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700 bg-slate-950">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center shrink-0 font-bold text-white">K</div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wide text-teal-400">KMRL AI</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Scheduler</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                ${isActive ? 'bg-teal-600/20 text-teal-400 border-l-4 border-teal-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:pl-4 border-l-4 border-transparent'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <span className={`${item.highlight ? 'text-teal-400 group-hover:animate-pulse' : ''}`}>{item.icon}</span>
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.title}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                  {item.title}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
