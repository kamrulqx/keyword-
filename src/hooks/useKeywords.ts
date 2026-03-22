import { useState, useEffect } from 'react';
import { Keyword } from '../types';
import { supabase } from '../lib/supabase';

export function useKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('dateAdded', { ascending: false });

      if (error) throw error;
      setKeywords(data || []);
    } catch (e) {
      console.error('Error fetching keywords:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const addKeyword = async (keyword: Omit<Keyword, 'id' | 'dateAdded' | 'postedWebsites' | 'difficulty' | 'cpc'>) => {
    const newKeyword = {
      keyword: keyword.keyword,
      volume: keyword.volume,
      results: keyword.results,
      category: keyword.category,
      status: keyword.status,
      dateAdded: new Date().toISOString(),
      postedWebsites: [],
      difficulty: Math.floor(Math.random() * 100),
      cpc: Number((Math.random() * 5).toFixed(2)),
    };

    try {
      const { data, error } = await supabase
        .from('keywords')
        .insert([newKeyword])
        .select();

      if (error) throw error;
      if (data) {
        setKeywords([data[0], ...keywords]);
      }
    } catch (e) {
      console.error('Error adding keyword:', e);
    }
  };

  const deleteKeyword = async (id: string) => {
    try {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setKeywords(keywords.filter(k => k.id !== id));
    } catch (e) {
      console.error('Error deleting keyword:', e);
    }
  };

  const updateKeyword = async (id: string, updates: Partial<Keyword>) => {
    try {
      const { error } = await supabase
        .from('keywords')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setKeywords(keywords.map(k => k.id === id ? { ...k, ...updates } : k));
    } catch (e) {
      console.error('Error updating keyword:', e);
    }
  };

  return { keywords, loading, addKeyword, deleteKeyword, updateKeyword };
}
