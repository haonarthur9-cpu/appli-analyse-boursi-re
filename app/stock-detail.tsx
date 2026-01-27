import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFinhubQuotes } from '@/hooks/useFinhubQuotes';
import { useFinhubHistorical } from '@/hooks/useFinhubHistorical';
import { STOCK_NAMES, TimeRange } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Animated, { FadeIn } from 'react-native-reanimated';

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7J' },
  { value: '30d', label: '30J' },
];

export default function StockDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const symbol = (params.symbol as string)?.toUpperCase() || '';

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');

  const { data: quotesData } = useFinhubQuotes();
  const { data: historicalData, isLoading: isLoadingHistory } = useFinhubHistorical(
    symbol,
    selectedRange,
    !!symbol
  );

  const quote = quotesData?.quotes?.[symbol];
  const stockName = STOCK_NAMES[symbol] || symbol;
  const isPositive = (quote?.d || 0) >= 0;
  const changeColor = isPositive ? '#00C853' : '#D32F2F';

  const screenWidth = Dimensions.get('window').width - 40;

  // Préparer les données du graphique
  const chartData = React.useMemo(() => {
    if (!historicalData?.data || historicalData.data.length === 0) {
      return null;
    }

    const data = historicalData.data;
    const prices = data.map(d => d.current_price);

    // Limiter le nombre de labels selon la période
    const maxLabels = 8;
    const step = Math.ceil(data.length / maxLabels);
    const labels = data
      .filter((_, index) => index % step === 0)
      .map(d => {
        const date = new Date(d.timestamp);
        if (selectedRange === '1h' || selectedRange === '24h') {
          return format(date, 'HH:mm', { locale: fr });
        } else {
          return format(date, 'dd/MM', { locale: fr });
        }
      });

    return {
      labels,
      datasets: [
        {
          data: prices,
          color: (opacity = 1) => (isPositive ? `rgba(0, 200, 83, ${opacity})` : `rgba(211, 47, 47, ${opacity})`),
          strokeWidth: 3,
        },
      ],
    };
  }, [historicalData, selectedRange, isPositive]);

  const chartConfig = {
    backgroundColor: '#1E1E1E',
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: isPositive ? '#00C853' : '#D32F2F',
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  if (!quote) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Chargement...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>{symbol}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stock Info Card */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={[styles.infoCard, { backgroundColor: '#1E1E1E' }]}
        >
          <View style={[styles.symbolBadge, { backgroundColor: tint + '20' }]}>
            <Text style={[styles.symbolText, { color: tint }]}>{symbol}</Text>
          </View>

          <Text style={[styles.stockName, { color: textColor, opacity: 0.8 }]}>
            {stockName}
          </Text>

          <Text style={[styles.currentPrice, { color: textColor }]}>
            ${quote.c.toFixed(2)}
          </Text>

          <View style={styles.changeRow}>
            <Ionicons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={24}
              color={changeColor}
            />
            <Text style={[styles.changeText, { color: changeColor }]}>
              {isPositive ? '+' : ''}{quote.d.toFixed(2)} ({isPositive ? '+' : ''}{quote.dp.toFixed(2)}%)
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Stock Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Ouverture</Text>
              <Text style={[styles.detailValue, { color: textColor }]}>
                ${quote.o.toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Haut</Text>
              <Text style={[styles.detailValue, { color: '#00C853' }]}>
                ${quote.h.toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bas</Text>
              <Text style={[styles.detailValue, { color: '#D32F2F' }]}>
                ${quote.l.toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Clôture préc.</Text>
              <Text style={[styles.detailValue, { color: textColor }]}>
                ${quote.pc.toFixed(2)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Time Range Selector */}
        <Animated.View
          entering={FadeIn.duration(600).delay(100)}
          style={styles.rangeSelector}
        >
          {TIME_RANGES.map(range => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.rangeButton,
                selectedRange === range.value && [
                  styles.rangeButtonActive,
                  { backgroundColor: tint }
                ],
                { backgroundColor: '#2C2C2E' }
              ]}
              onPress={() => setSelectedRange(range.value)}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  selectedRange === range.value && styles.rangeButtonTextActive,
                  { color: selectedRange === range.value ? '#000' : textColor }
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Chart */}
        <Animated.View
          entering={FadeIn.duration(600).delay(200)}
          style={[styles.chartCard, { backgroundColor: '#1E1E1E' }]}
        >
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: textColor }]}>
              Historique
            </Text>
            {isLoadingHistory && (
              <ActivityIndicator size="small" color={tint} />
            )}
          </View>

          {isLoadingHistory ? (
            <View style={styles.chartLoading}>
              <ActivityIndicator size="large" color={tint} />
            </View>
          ) : chartData ? (
            <LineChart
              data={chartData}
              width={screenWidth}
              height={240}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              withDots={false}
            />
          ) : (
            <View style={styles.chartEmpty}>
              <Ionicons name="analytics-outline" size={48} color="#8E8E93" />
              <Text style={[styles.chartEmptyText, { color: textColor, opacity: 0.6 }]}>
                Aucune donnée disponible pour cette période.
              </Text>
              <Text style={[styles.chartEmptyText, { color: textColor, opacity: 0.5, fontSize: 12 }]}>
                Le backend collecte les données depuis peu. Essayez une période plus longue (7J ou 30J).
              </Text>
            </View>
          )}

          {historicalData && (
            <View style={styles.chartFooter}>
              <Text style={styles.chartFooterText}>
                {historicalData.count} points de données
              </Text>
              <Text style={styles.chartFooterText}>
                Du {format(new Date(historicalData.from), 'dd/MM HH:mm', { locale: fr })} au{' '}
                {format(new Date(historicalData.to), 'dd/MM HH:mm', { locale: fr })}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Info Box */}
        <Animated.View
          entering={FadeIn.duration(600).delay(300)}
          style={[styles.infoBox, { backgroundColor: 'rgba(0, 122, 255, 0.1)', borderLeftColor: tint }]}
        >
          <Ionicons name="information-circle-outline" size={20} color={tint} />
          <Text style={[styles.infoBoxText, { color: textColor, opacity: 0.8 }]}>
            Les données sont mises à jour en temps réel toutes les 10 secondes.
            Les variations peuvent différer des valeurs officielles.
          </Text>
        </Animated.View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  symbolBadge: {
    width: 72,
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stockName: {
    fontSize: 16,
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  changeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#3C3C3E',
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  rangeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rangeButtonActive: {
    // backgroundColor sera défini dynamiquement
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rangeButtonTextActive: {
    color: '#000',
  },
  chartCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartLoading: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartEmpty: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  chartEmptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  chartFooter: {
    marginTop: 12,
    gap: 4,
    alignItems: 'center',
  },
  chartFooterText: {
    fontSize: 11,
    color: '#8E8E93',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderLeftWidth: 4,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
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
});
