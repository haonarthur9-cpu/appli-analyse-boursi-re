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

export type StockSymbol = 
  // USA
  'AAPL' | 'GOOGL' | 'MSFT' | 'AMZN' | 'TSLA' |
  'META' | 'NVDA' | 'NFLX' | 'JPM' | 'V' |
  // Europe
  'LVMH' | 'ASML' | 'SAP' | 'OR' | 'SIE' | 'MC';

export const STOCK_SYMBOLS: StockSymbol[] = [
  // USA
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
  'META', 'NVDA', 'NFLX', 'JPM', 'V',
  // Europe
  'LVMH', 'ASML', 'SAP', 'OR', 'SIE', 'MC'
];

// Couleurs par symbole
export const SYMBOL_COLORS: Record<StockSymbol, string> = {
  // USA
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
  // Europe
  LVMH: '#C4A572',  // Or/Luxe
  ASML: '#0066CC',  // Bleu tech
  SAP: '#0FAAFF',   // Bleu SAP
  OR: '#FFD700',    // Or L'Oréal
  SIE: '#009999',   // Vert Siemens
  MC: '#C4A572',    // Or/Luxe (même que LVMH)
};

// Émojis par symbole
export const SYMBOL_EMOJIS: Record<StockSymbol, string> = {
  // USA
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
  // Europe
  LVMH: '👜',      // LVMH - Luxe
  ASML: '💎',      // ASML - Semi-conducteurs
  SAP: '📊',       // SAP - Logiciels
  OR: '💄',        // L'Oréal - Cosmétiques
  SIE: '⚙️',       // Siemens - Industrie
  MC: '🏬',        // Autres luxe
};
