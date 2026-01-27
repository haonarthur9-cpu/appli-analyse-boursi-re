import axios from 'axios';
import { QuotesResponse, HistoricalDataResponse } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.time-flow.tech';

// Configuration axios avec timeout et headers par défaut
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Récupère les quotes en temps réel pour les 10 symboles principaux
 * Les données sont mises à jour toutes les 10 secondes côté backend
 */
export const fetchQuotes = async (): Promise<QuotesResponse> => {
  try {
    const response = await apiClient.get<QuotesResponse>('/finhub/quotes');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Erreur lors de la récupération des données boursières'
      );
    }
    throw error;
  }
};

/**
 * Récupère l'historique des données pour un symbole spécifique
 * @param symbol - Symbole boursier (AAPL, GOOGL, etc.)
 * @param from - Date de début au format RFC3339 (optionnel, par défaut 24h avant)
 * @param to - Date de fin au format RFC3339 (optionnel, par défaut maintenant)
 */
export const fetchHistoricalData = async (
  symbol: string,
  from?: string,
  to?: string
): Promise<HistoricalDataResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('symbol', symbol.toUpperCase());
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    const response = await apiClient.get<HistoricalDataResponse>(
      `/finhub/historical?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        `Erreur lors de la récupération de l'historique pour ${symbol}`
      );
    }
    throw error;
  }
};

/**
 * Utilitaire pour générer les dates RFC3339 selon la période
 */
export const getTimeRangeDates = (range: '1h' | '24h' | '7d' | '30d'): { from: string; to: string } => {
  const now = new Date();
  const to = now.toISOString();

  let from: Date;
  switch (range) {
    case '1h':
      from = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }

  return {
    from: from.toISOString(),
    to
  };
};
