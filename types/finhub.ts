/**
 * Types et interfaces pour les données Finhub (API boursière)
 */

export interface Quote {
  c: number;   // current_price
  d: number;   // change
  dp: number;  // percent_change
  h: number;   // high
  l: number;   // low
  o: number;   // open
  pc: number;  // previous_close
  t: number;   // timestamp (Unix)
}

export interface QuotesResponse {
  quotes: Record<string, Quote>;
  timestamp: string;
  count: number;
}

export interface HistoricalDataPoint {
  id: number;
  symbol: string;
  current_price: number;
  change: number;
  percent_change: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
  timestamp: string;
  created_at: string;
}

export interface HistoricalDataResponse {
  symbol: string;
  from: string;
  to: string;
  count: number;
  data: HistoricalDataPoint[];
}

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export interface StockSymbolInfo {
  symbol: string;
  name: string;
  logo?: string;
}

// Mapping des symboles vers leurs noms complets
export const STOCK_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  GOOGL: 'Alphabet Inc.',
  MSFT: 'Microsoft Corporation',
  AMZN: 'Amazon.com Inc.',
  TSLA: 'Tesla Inc.',
  META: 'Meta Platforms Inc.',
  NVDA: 'NVIDIA Corporation',
  NFLX: 'Netflix Inc.',
  JPM: 'JPMorgan Chase & Co.',
  V: 'Visa Inc.'
};
