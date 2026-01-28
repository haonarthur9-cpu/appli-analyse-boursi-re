/**
 * Types et interfaces pour les actualités boursières
 */

export interface NewsArticle {
  id?: number;
  source: string;
  title: string;
  description: string;
  url: string;
  image_url?: string;
  published_at: string;
  created_at?: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  timestamp: string;
  count: number;
}

export interface NewsHistoryResponse {
  articles: NewsArticle[];
  count: number;
  total: number;
  limit: number;
  offset: number;
}

export type NewsSource = 'Les Échos' | 'Boursorama';

export const NEWS_SOURCES: NewsSource[] = ['Les Échos', 'Boursorama'];
