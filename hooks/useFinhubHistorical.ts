import { useQuery } from '@tanstack/react-query';
import { fetchHistoricalData, getTimeRangeDates } from '@/services/finhubApi';
import { TimeRange } from '@/types';

/**
 * Hook pour récupérer l'historique d'un symbole
 * @param symbol - Symbole boursier (AAPL, GOOGL, etc.)
 * @param timeRange - Période (1h, 24h, 7d, 30d)
 * @param enabled - Activer/désactiver la requête (par défaut true)
 */
export const useFinhubHistorical = (
  symbol: string,
  timeRange: TimeRange = '24h',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['finhub', 'historical', symbol, timeRange],
    queryFn: async () => {
      const { from, to } = getTimeRangeDates(timeRange);
      return fetchHistoricalData(symbol, from, to);
    },
    enabled: enabled && !!symbol, // Ne requêter que si symbol est défini et enabled est true
    staleTime: 60000,              // Données fraîches pendant 1 minute
    retry: 2,
  });
};
