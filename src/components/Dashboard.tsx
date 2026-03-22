import React, { useMemo } from 'react';
import { Keyword } from '../types';
import { formatNumber, cn } from '../lib/utils';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Zap, Download, MoreHorizontal } from 'lucide-react';

interface DashboardProps {
  keywords: Keyword[];
  onGenerateAI: () => void;
  onAddClick: () => void;
  onTabChange: (tab: string) => void;
}

export function Dashboard({ keywords, onGenerateAI, onAddClick, onTabChange }: DashboardProps) {
  const stats = useMemo(() => {
    const total = keywords.length;
    const avgVol = total > 0 ? Math.round(keywords.reduce((acc, k) => acc + k.volume, 0) / total) : 0;
    
    // Group by category for chart
    const categoryData: Record<string, number> = {};
    keywords.forEach(k => {
      categoryData[k.category] = (categoryData[k.category] || 0) + k.volume;
    });
    
    const chartData = Object.entries(categoryData)
      .map(([name, value]) => ({ name: name.substring(0, 3).toUpperCase(), value, fullName: name }))
      .slice(0, 7);

    // Find top performer
    const topPerformer = keywords.length > 0 
      ? [...keywords].sort((a, b) => b.volume - a.volume)[0]
      : null;

    return { total, avgVol, chartData, topPerformer };
  }, [keywords]);

  const recentKeywords = useMemo(() => 
    [...keywords].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 5)
  , [keywords]);

  const handleExport = () => {
    if (keywords.length === 0) return;
    const headers = ['Keyword', 'Volume', 'Difficulty', 'CPC', 'Results', 'Category', 'Status', 'Date Added'];
    const csvContent = [
      headers.join(','),
      ...keywords.map(k => [
        `"${k.keyword}"`,
        k.volume,
        k.difficulty,
        k.cpc,
        k.results,
        k.category,
        k.status,
        k.dateAdded
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `keywords_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-slate-900">Editorial Pulse</h2>
        <p className="text-slate-500">Curating your semantic footprint with precision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Semantic Keywords</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-slate-900">{stats.total.toLocaleString()}</span>
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg mb-1">+14.2%</span>
              </div>
            </div>
          </div>
          
          <div className="h-[240px] w-full">
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatNumber(value), 'Volume']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === stats.chartData.length - 1 ? '#2563eb' : '#dbeafe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 font-medium">
                Add keywords to see analytics
              </div>
            )}
          </div>
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Search Volume</p>
                <p className="text-3xl font-bold text-slate-900">{formatNumber(stats.avgVol)}</p>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-blue-200">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3">Growth Insight</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                {stats.topPerformer 
                  ? `Your keywords in the "${stats.topPerformer.category}" category have increased their authority by 24% this week.`
                  : "Start adding keywords to get personalized growth insights for your editorial strategy."}
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors">
                Explore Trends
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Zap size={120} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={onAddClick}
              className="w-full flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-left group"
            >
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100">
                <Users size={20} />
              </div>
              <span className="font-semibold text-slate-700">New Keyword Batch</span>
            </button>
            <button 
              onClick={onGenerateAI}
              className="w-full flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-left group"
            >
              <div className="p-2 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100">
                <Zap size={20} />
              </div>
              <span className="font-semibold text-slate-700">Generate AI Topics</span>
            </button>
            <button 
              onClick={handleExport}
              className="w-full flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-left group"
            >
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-slate-100">
                <Download size={20} />
              </div>
              <span className="font-semibold text-slate-700">Export Editorial Report</span>
            </button>
          </div>
        </div>

        {/* Recent Keywords */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent High-Authority Keywords</h3>
            <button 
              onClick={() => onTabChange('keyword-list')}
              className="text-blue-600 text-xs font-bold hover:underline"
            >
              View All List
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keyword</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volume</th>
                    <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</th>
                    <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">CPC</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentKeywords.length > 0 ? (
                    recentKeywords.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 truncate max-w-[100px] sm:max-w-none">{k.keyword}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 bg-slate-100 px-2 py-0.5 rounded w-fit">{k.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{formatNumber(k.volume)}</td>
                        <td className="hidden sm:table-cell px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  k.difficulty > 70 ? "bg-red-500" : k.difficulty > 40 ? "bg-blue-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${k.difficulty}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-sm font-medium text-slate-600">${k.cpc.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                        No keywords added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
