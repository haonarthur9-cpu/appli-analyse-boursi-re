/**
 * Types et interfaces pour les actualités boursières
 */

export interface NewsArticle {
  source: string;           // Format: "Bloomberg (AAPL)"
  title: string;
  description: string;
  url: string;
  image_url?: string;
  published_at: string;     // ISO 8601
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

export type StockSymbol = 'AAPL' | 'GOOGL' | 'MSFT' | 'AMZN' | 'TSLA' |
                          'META' | 'NVDA' | 'NFLX' | 'JPM' | 'V';

export const STOCK_SYMBOLS: StockSymbol[] = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
  'META', 'NVDA', 'NFLX', 'JPM', 'V'
];

// Couleurs par symbole
export const SYMBOL_COLORS: Record<StockSymbol, string> = {
  AAPL: '#007AFF',
  GOOGL: '#4285F4',
  MSFT: '#00A4EF',
  AMZN: '#FF9900',
  TSLA: '#CC0000',
  META: '#0668E1',
  NVDA: '#76B900',
  NFLX: '#E50914',
  JPM: '#0070CD',
  V: '#1A1F71',
};

// Émojis par symbole
export const SYMBOL_EMOJIS: Record<StockSymbol, string> = {
  AAPL: '🍎',
  GOOGL: '🔍',
  MSFT: '💻',
  AMZN: '📦',
  TSLA: '⚡',
  META: '👥',
  NVDA: '🎮',
  NFLX: '🎬',
  JPM: '🏦',
  V: '💳',
};
