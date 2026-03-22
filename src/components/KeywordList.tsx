import React, { useState, useMemo } from 'react';
import { Keyword, SortOption } from '../types';
import { formatNumber, cn } from '../lib/utils';
import { Filter, Calendar, LayoutGrid, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, X } from 'lucide-react';

interface KeywordListProps {
  keywords: Keyword[];
  onDelete: (id: string) => void;
  onEdit?: (keyword: Keyword) => void;
  onAddClick: () => void;
  searchQuery: string;
}

export function KeywordList({ keywords, onDelete, onEdit, onAddClick, searchQuery }: KeywordListProps) {
  const [sort, setSort] = useState<SortOption>('highest_volume');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  const itemsPerPage = 10;

  const categories = useMemo(() => {
    const cats = new Set(keywords.map(k => k.category));
    return Array.from(cats);
  }, [keywords]);

  const filteredKeywords = useMemo(() => {
    return keywords
      .filter(k => {
        const matchesSearch = k.keyword.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || k.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || k.category === categoryFilter;
        
        let matchesDate = true;
        if (dateFilter === 'last-7') {
          const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
          matchesDate = new Date(k.dateAdded) >= sevenDaysAgo;
        } else if (dateFilter === 'last-30') {
          const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
          matchesDate = new Date(k.dateAdded) >= thirtyDaysAgo;
        }

        return matchesSearch && matchesStatus && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        if (sort === 'highest_volume') return b.volume - a.volume;
        if (sort === 'lowest_volume') return a.volume - b.volume;
        if (sort === 'highest_difficulty') return b.difficulty - a.difficulty;
        if (sort === 'lowest_difficulty') return a.difficulty - b.difficulty;
        if (sort === 'newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        if (sort === 'oldest') return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        return 0;
      });
  }, [keywords, searchQuery, statusFilter, categoryFilter, dateFilter, sort]);

  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);
  const paginatedKeywords = filteredKeywords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setSort('highest_volume');
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900">Keyword Inventory</h2>
          <p className="text-slate-500 max-w-2xl">
            Manage your editorial assets. Curate high-intent phrases and track competitive performance across your publishing domains.
          </p>
        </div>
        <button 
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={18} />
          Add Keyword
        </button>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <div className="relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none flex items-center gap-2 pl-10 pr-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 cursor-pointer outline-none"
            >
              <option value="all">All Status</option>
              <option value="tracked">Tracked</option>
              <option value="opportunity">Opportunity</option>
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative group">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none flex items-center gap-2 pl-10 pr-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 cursor-pointer outline-none"
            >
              <option value="all">Any Date</option>
              <option value="last-7">Last 7 Days</option>
              <option value="last-30">Last 30 Days</option>
            </select>
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative group">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none flex items-center gap-2 pl-10 pr-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 cursor-pointer outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <LayoutGrid size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {(statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all') && (
            <button 
              onClick={resetFilters}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title="Reset Filters"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Sort By</span>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-transparent text-sm font-bold text-blue-600 outline-none cursor-pointer"
          >
            <option value="highest_volume">Highest Volume</option>
            <option value="lowest_volume">Lowest Volume</option>
            <option value="highest_difficulty">Highest Difficulty</option>
            <option value="lowest_difficulty">Lowest Difficulty</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 sm:px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keyword</th>
                <th className="px-4 sm:px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volume</th>
                <th className="hidden md:table-cell px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</th>
                <th className="hidden lg:table-cell px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted Websites</th>
                <th className="px-4 sm:px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedKeywords.length > 0 ? (
                paginatedKeywords.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 sm:px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[120px] sm:max-w-none">{k.keyword}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{k.category}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6 text-sm font-medium text-slate-600">{formatNumber(k.volume)}</td>
                    <td className="hidden md:table-cell px-8 py-6 text-sm font-medium text-slate-600">{k.results.toLocaleString()}</td>
                    <td className="hidden lg:table-cell px-8 py-6">
                      <div className="flex items-center -space-x-2">
                        {k.postedWebsites.length > 0 ? (
                          k.postedWebsites.map((url, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden" title={url}>
                              <img src={`https://www.google.com/s2/favicons?domain=${url}&sz=32`} alt="" className="w-4 h-4" referrerPolicy="no-referrer" />
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-300">No websites</span>
                        )}
                        {k.postedWebsites.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{k.postedWebsites.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onEdit?.(k)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Keyword"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(k.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Keyword"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <LayoutGrid size={32} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-900">No keywords found</p>
                        <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
                      </div>
                      <button 
                        onClick={resetFilters}
                        className="mt-2 flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredKeywords.length)} of {filteredKeywords.length} keywords
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
