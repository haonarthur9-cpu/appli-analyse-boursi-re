import axios from 'axios';
import { NewsResponse, NewsHistoryResponse } from '@/types/news';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.time-flow.tech';

// Configuration axios pour les actualités
const newsClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Récupère les dernières actualités depuis le cache
 * Les données sont rafraîchies toutes les 30 minutes côté backend
 * @param limit - Nombre d'articles à récupérer (défaut: 20, max: 100)
 */
export const fetchLatestNews = async (limit = 20): Promise<NewsResponse> => {
  try {
    const response = await newsClient.get<NewsResponse>('/news', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Erreur lors de la récupération des actualités'
      );
    }
    throw error;
  }
};

/**
 * Récupère l'historique des actualités avec pagination
 * @param limit - Nombre d'articles par page (défaut: 50, max: 200)
 * @param offset - Décalage pour la pagination (défaut: 0)
 * @param source - Filtre par source ("Les Échos", "Boursorama")
 */
export const fetchNewsHistory = async (
  limit = 50,
  offset = 0,
  source?: string
): Promise<NewsHistoryResponse> => {
  try {
    const params: Record<string, string | number> = { limit, offset };
    if (source) {
      params.source = source;
    }

    const response = await newsClient.get<NewsHistoryResponse>('/news/history', {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Erreur lors de la récupération de l\'historique'
      );
    }
    throw error;
  }
};
