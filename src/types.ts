export interface Keyword {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  results: number;
  category: string;
  status: 'tracked' | 'untracked' | 'opportunity';
  dateAdded: string;
  postedWebsites: string[];
}

export type SortOption = 'highest_volume' | 'lowest_volume' | 'highest_difficulty' | 'lowest_difficulty' | 'newest' | 'oldest';
