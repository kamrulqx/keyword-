import React, { useState, useEffect } from 'react';
import { X, Info, AlertCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyword } from '../types';
import { cn } from '../lib/utils';

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (keyword: any) => void;
  onUpdate?: (id: string, updates: any) => void;
  editingKeyword?: Keyword | null;
  existingCategories: string[];
}

export function AddKeywordModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  onUpdate, 
  editingKeyword, 
  existingCategories 
}: AddKeywordModalProps) {
  const [keyword, setKeyword] = useState('');
  const [volume, setVolume] = useState('');
  const [results, setResults] = useState('');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState<'tracked' | 'opportunity'>('tracked');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingKeyword) {
      setKeyword(editingKeyword.keyword);
      setVolume(editingKeyword.volume.toString());
      setResults(editingKeyword.results.toString());
      setCategory(editingKeyword.category);
      setStatus(editingKeyword.status);
    } else {
      setKeyword('');
      setVolume('');
      setResults('');
      setCategory('General');
      setStatus('tracked');
    }
    setError('');
  }, [editingKeyword, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!keyword.trim()) return setError('Keyword is required');
    
    const volNum = parseInt(volume.toString().replace(/,/g, ''));
    if (isNaN(volNum)) return setError('Valid volume is required');
    
    const resNum = parseInt(results.toString().replace(/,/g, ''));
    if (isNaN(resNum)) return setError('Valid results count is required');

    const data = {
      keyword: keyword.trim(),
      volume: volNum,
      results: resNum,
      category,
      status
    };

    if (editingKeyword && onUpdate) {
      onUpdate(editingKeyword.id, data);
    } else {
      onAdd(data);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    {editingKeyword ? <Info size={24} /> : <Plus size={24} />}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-2xl font-bold text-slate-900">{editingKeyword ? 'Edit Keyword' : 'Add Keyword'}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Editorial Intelligence</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Keyword</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Minimalist UI Trends"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Volume</label>
                    <input 
                      type="text"
                      required
                      placeholder="12,500"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Results</label>
                    <input 
                      type="text"
                      required
                      placeholder="45.2M"
                      value={results}
                      onChange={(e) => setResults(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none cursor-pointer"
                    >
                      {existingCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      {!existingCategories.includes('General') && <option value="General">General</option>}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <div className="flex p-1 bg-slate-50 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setStatus('tracked')}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-bold rounded-xl transition-all uppercase tracking-wider",
                          status === 'tracked' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        Tracked
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus('opportunity')}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-bold rounded-xl transition-all uppercase tracking-wider",
                          status === 'opportunity' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        Opportunity
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button 
                    type="submit"
                    className="w-full sm:flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    {editingKeyword ? 'Save Changes' : 'Add Keyword'}
                  </button>
                  <button 
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-4 text-slate-500 font-bold hover:text-slate-900 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div className="p-6 bg-slate-50 flex items-start gap-3">
              <div className="p-1 bg-blue-100 text-blue-600 rounded-md mt-0.5">
                <Info size={14} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                Keywords are stored locally on your device. Data is processed by the editorial engine in real-time.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
