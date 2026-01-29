import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchLatestNews, fetchNewsHistory } from '@/services/newsApi';

/**
 * Extrait le symbole boursier depuis une source
 * Exemple: "Bloomberg (AAPL)" => "AAPL"
 */
export const extractSymbol = (source: string): string | null => {
  const match = source.match(/\(([A-Z]+)\)$/);
  return match ? match[1] : null;
};

/**
 * Extrait le nom de la source (sans le symbole)
 * Exemple: "Bloomberg (AAPL)" => "Bloomberg"
 */
export const extractSourceName = (source: string): string => {
  return source.split(' (')[0];
};

/**
 * Hook pour récupérer les dernières actualités
 * Les données sont rafraîchies automatiquement toutes les 5 minutes
 */
export const useLatestNews = (limit = 20) => {
  return useQuery({
    queryKey: ['news', 'latest', limit],
    queryFn: () => fetchLatestNews(limit),
    refetchInterval: 5 * 60 * 1000, // Refetch toutes les 5 minutes
    staleTime: 2 * 60 * 1000, // Données fraîches pendant 2 minutes
    retry: 2,
  });
};

/**
 * Hook pour récupérer l'historique avec pagination
 */
export const useNewsHistory = (limit = 50, offset = 0, source?: string) => {
  return useQuery({
    queryKey: ['news', 'history', limit, offset, source],
    queryFn: () => fetchNewsHistory(limit, offset, source),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook pour le scroll infini des actualités
 * @param symbol - Symbole boursier optionnel pour filtrer (ex: "AAPL")
 */
export const useInfiniteNews = (symbol?: string) => {
  // Construire le filtre de source si un symbole est sélectionné
  // Le backend filtre par source, donc on passe "(SYMBOLE)"
  const sourceFilter = symbol ? `(${symbol})` : undefined;

  return useInfiniteQuery({
    queryKey: ['news', 'infinite', symbol],
    queryFn: ({ pageParam = 0 }) => fetchNewsHistory(20, pageParam, sourceFilter),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};
