import { fetchLatestNews, fetchNewsHistory } from '@/services/newsApi';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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
 */
export const useInfiniteNews = () => {
  return useInfiniteQuery({
    queryKey: ['news', 'infinite'],
    queryFn: ({ pageParam = 0 }) => fetchNewsHistory(20, pageParam),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};
