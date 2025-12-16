import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  Clock,
  Menu,
  AlertTriangle
} from 'lucide-react';
import { getUser, clearAuth } from '../../utils/auth';

const Header = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'High load at Edapally Station' },
    { id: 2, type: 'alert', text: 'Train T-24 maintenance due' },
  ]);
  const user = getUser();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Control Room Overview';
      case '/live-map':
        return 'Live Metro Network';
      case '/schedule-manager':
        return 'AI Train Scheduler';
      case '/fleet-status':
        return 'Rolling Stock Status';
      case '/analytics':
        return 'Passenger Load Analytics';
      case '/settings':
        return 'System Configuration';
      default:
        return 'KMRL Dashboard';
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 pl-10 md:pl-0">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-900 text-teal-400 px-3 py-1.5 rounded-md font-mono text-sm shadow-inner">
          <Clock size={16} />
          <span className="font-semibold tracking-wider">{formatTime(currentTime)}</span>
        </div>

        <div className="relative group cursor-pointer">
          <div className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative">
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>

          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
            <div className="p-3 border-b border-slate-100 font-semibold text-xs text-slate-500 uppercase">
              System Alerts
            </div>
            <div className="py-1">
              {notifications.map(note => (
                <div key={note.id} className="px-4 py-3 hover:bg-slate-50 flex items-start gap-3 border-b border-slate-50 last:border-0">
                  <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">{note.text}</p>
                    <p className="text-xs text-slate-400 mt-1">Just now</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700">
            <User size={18} />
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-sm font-medium text-slate-700 leading-none">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold mt-1">KMRL</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
