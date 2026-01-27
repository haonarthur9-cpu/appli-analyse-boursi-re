import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '@/services/finhubApi';

/**
 * Hook pour récupérer les quotes en temps réel
 * - Polling automatique toutes les 10 secondes
 * - Cache de 5 secondes pour éviter les requêtes inutiles
 * - Retry automatique en cas d'erreur
 */
export const useFinhubQuotes = () => {
  return useQuery({
    queryKey: ['finhub', 'quotes'],
    queryFn: fetchQuotes,
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
    staleTime: 5000,         // Données considérées fraîches pendant 5 secondes
    retry: 3,                // Réessayer 3 fois en cas d'erreur
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponentiel
  });
};
