/**
 * Types et interfaces pour les données boursières
 */

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  data: number[];
}

export interface PredictionData {
  current: number[];
  predicted: number[];
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  targetPrice: number;
  timeframe: string;
}

export interface StockOpportunity {
  symbol: string;
  name: string;
  potential: string;
  risk: 'low' | 'medium' | 'high';
  recommendation: 'buy' | 'hold' | 'sell';
}

export interface NewsArticle {
  title: string;
  source: string;
  time: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface MarketMetrics {
  volatility: number;
  volume: number;
  marketCap: string;
  peRatio?: number;
  dividendYield?: number;
}

export type TrendType = 'bullish' | 'bearish' | 'neutral';
export type RiskLevel = 'low' | 'medium' | 'high';
export type RecommendationType = 'buy' | 'hold' | 'sell';
export type ImpactType = 'positive' | 'negative' | 'neutral';
