import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFinhubQuotes } from '@/hooks/useFinhubQuotes';
import { STOCK_NAMES, Quote } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

export default function MarketScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const { data, isLoading, error, refetch, isRefetching } = useFinhubQuotes();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStockPress = (symbol: string) => {
    router.push({
      pathname: '/stock-detail',
      params: { symbol }
    });
  };

  const renderStockCard = (symbol: string, quote: Quote, index: number) => {
    const isPositive = quote.d >= 0;
    const changeColor = isPositive ? '#00C853' : '#D32F2F';
    const stockName = STOCK_NAMES[symbol] || symbol;

    return (
      <Animated.View
        key={symbol}
        entering={FadeInDown.duration(600).delay(index * 50)}
        layout={Layout.springify()}
      >
        <TouchableOpacity
          style={[styles.stockCard, { backgroundColor: '#1E1E1E' }]}
          onPress={() => handleStockPress(symbol)}
          activeOpacity={0.7}
        >
          <View style={styles.stockCardLeft}>
            <View style={[styles.symbolBadge, { backgroundColor: tint + '20' }]}>
              <Text style={[styles.symbolText, { color: tint }]}>{symbol}</Text>
            </View>
            <View style={styles.stockInfo}>
              <Text style={[styles.stockName, { color: textColor }]} numberOfLines={1}>
                {stockName}
              </Text>
              <Text style={[styles.stockPrice, { color: textColor }]}>
                ${quote.c.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.stockCardRight}>
            <View style={styles.changeContainer}>
              <Ionicons
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={20}
                color={changeColor}
              />
              <Text style={[styles.changeValue, { color: changeColor }]}>
                {isPositive ? '+' : ''}{quote.d.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.percentBadge, { backgroundColor: changeColor + '20' }]}>
              <Text style={[styles.percentText, { color: changeColor }]}>
                {isPositive ? '+' : ''}{quote.dp.toFixed(2)}%
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#8E8E93" style={styles.chevron} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isLoading && !data) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Chargement des données boursières...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#D32F2F" />
          <Text style={[styles.errorTitle, { color: textColor }]}>
            Erreur de connexion
          </Text>
          <Text style={[styles.errorMessage, { color: textColor, opacity: 0.7 }]}>
            {error instanceof Error ? error.message : 'Impossible de charger les données'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: tint }]}
            onPress={() => refetch()}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const quotes = data?.quotes || {};
  const sortedSymbols = Object.keys(quotes).sort();
  const lastUpdate = data?.timestamp ? new Date(data.timestamp) : new Date();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: textColor }]}>Market Watch</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.liveIndicator, { backgroundColor: '#00C853' }]} />
            <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
              Données en temps réel
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: '#2C2C2E' }]}
          onPress={onRefresh}
          disabled={isRefetching}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={tint}
            style={isRefetching ? { transform: [{ rotate: '180deg' }] } : {}}
          />
        </TouchableOpacity>
      </View>

      {/* Last update timestamp */}
      <View style={styles.timestampContainer}>
        <Ionicons name="time-outline" size={14} color="#8E8E93" />
        <Text style={styles.timestampText}>
          Mis à jour: {format(lastUpdate, 'HH:mm:ss', { locale: fr })}
        </Text>
      </View>

      {/* Stock list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tint}
            colors={[tint]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {sortedSymbols.length > 0 ? (
          sortedSymbols.map((symbol, index) =>
            renderStockCard(symbol, quotes[symbol], index)
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="analytics-outline" size={64} color="#8E8E93" />
            <Text style={[styles.emptyText, { color: textColor, opacity: 0.6 }]}>
              Aucune donnée disponible
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Données fournies par Finhub API
          </Text>
          <Text style={styles.footerText}>
            {sortedSymbols.length} symboles actifs
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  timestampText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stockCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symbolBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  stockPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stockCardRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  percentText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
