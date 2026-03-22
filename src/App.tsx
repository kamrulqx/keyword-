import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { KeywordList } from './components/KeywordList';
import { AddKeywordModal } from './components/AddKeywordModal';
import { useKeywords } from './hooks/useKeywords';
import { Keyword } from './types';
import { cn } from './lib/utils';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { keywords, loading, addKeyword, deleteKeyword, updateKeyword } = useKeywords();

  const existingCategories = React.useMemo(() => {
    const cats = new Set(keywords.map(k => k.category));
    return Array.from(cats);
  }, [keywords]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddKeyword = (data: any) => {
    addKeyword(data);
    setToast({ message: 'Keyword added successfully!', type: 'success' });
  };

  const handleUpdateKeyword = (id: string, updates: any) => {
    updateKeyword(id, updates);
    setToast({ message: 'Keyword updated successfully!', type: 'success' });
    setEditingKeyword(null);
  };

  const handleEditKeyword = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setIsModalOpen(true);
  };

  const handleDeleteKeyword = (id: string) => {
    deleteKeyword(id);
    setToast({ message: 'Keyword deleted successfully!', type: 'success' });
  };

  const handleGenerateAI = () => {
    const topics = [
      'future of generative AI in healthcare',
      'sustainable fashion trends 2025',
      'remote workspace design ideas',
      'minimalist web design principles',
      'organic skincare for sensitive skin',
      'best mechanical keyboards for coding',
      'eco-friendly home architecture',
      'modern saas dashboard ui kit',
      'top seo strategies for 2024',
      'content marketing for small business'
    ];
    
    // Pick 3 random topics that aren't already in keywords
    const existingKeywords = new Set(keywords.map(k => k.keyword.toLowerCase()));
    const newTopics = topics
      .filter(t => !existingKeywords.has(t.toLowerCase()))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (newTopics.length === 0) {
      setToast({ message: 'All AI topics already in your list!', type: 'error' });
      return;
    }
    
    newTopics.forEach(topic => {
      addKeyword({
        keyword: topic,
        volume: Math.floor(Math.random() * 20000) + 1000,
        results: Math.floor(Math.random() * 50000000) + 500000,
        category: existingCategories[Math.floor(Math.random() * existingCategories.length)] || 'General',
        status: 'opportunity'
      });
    });
    
    setToast({ message: `Generated ${newTopics.length} AI keyword ideas!`, type: 'success' });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Sidebar 
        activeTab={activeTab === 'add-keyword' ? 'keyword-list' : activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'add-keyword') {
            setIsModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <Header 
          onMenuClick={() => setIsMobileOpen(true)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              keywords={keywords} 
              onGenerateAI={handleGenerateAI} 
              onAddClick={() => { setEditingKeyword(null); setIsModalOpen(true); }} 
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === 'keyword-list' && (
            <KeywordList 
              keywords={keywords} 
              onDelete={handleDeleteKeyword} 
              onEdit={handleEditKeyword}
              onAddClick={() => { setEditingKeyword(null); setIsModalOpen(true); }}
              searchQuery={searchQuery}
            />
          )}
        </main>
      </div>

      <AddKeywordModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingKeyword(null); }} 
        onAdd={handleAddKeyword}
        onUpdate={handleUpdateKeyword}
        editingKeyword={editingKeyword}
        existingCategories={existingCategories}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200]"
          >
            <div className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border",
              toast.type === 'success' ? "bg-slate-900 text-white border-slate-800" : "bg-red-600 text-white border-red-500"
            )}>
              <div className={cn(
                "p-1 rounded-lg",
                toast.type === 'success' ? "bg-blue-600" : "bg-red-700"
              )}>
                {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold">{toast.message}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {toast.type === 'success' ? 'Database updated' : 'Operation failed'}
                </p>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
