import React from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ onMenuClick, searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-500"
        >
          <Menu size={20} />
        </button>
        
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <Settings size={20} />
        </button>
        <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 hidden sm:block">Keyword Manager</span>
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
            KM
          </div>
        </div>
      </div>
    </header>
  );
}
