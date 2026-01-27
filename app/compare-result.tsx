import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StockData } from '@/types';

const CompareResultScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const screenWidth = Dimensions.get('window').width - 40;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  // Parse les données des actions depuis les paramètres
  const stock1: StockData = params.stock1 ? JSON.parse(params.stock1 as string) : null;
  const stock2: StockData = params.stock2 ? JSON.parse(params.stock2 as string) : null;

  if (!stock1 || !stock2) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          Erreur: Données de comparaison manquantes
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: tint }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMetricComparison = (label: string, value1: string | number, value2: string | number, winner: 1 | 2 | 0) => {
    return (
      <View style={styles.metricRow}>
        <View style={[styles.metricCell, winner === 1 && styles.winnerCell]}>
          <Text style={[styles.metricValue, { color: winner === 1 ? '#34C759' : textColor }]}>
            {value1}
          </Text>
        </View>
        <View style={styles.metricLabelCell}>
          <Text style={[styles.metricLabel, { color: textColor, opacity: 0.7 }]}>{label}</Text>
        </View>
        <View style={[styles.metricCell, winner === 2 && styles.winnerCell]}>
          <Text style={[styles.metricValue, { color: winner === 2 ? '#34C759' : textColor }]}>
            {value2}
          </Text>
        </View>
      </View>
    );
  };

  const determineWinner = (val1: number, val2: number): 1 | 2 | 0 => {
    if (val1 > val2) return 1;
    if (val2 > val1) return 2;
    return 0;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Comparaison</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* En-têtes des actions */}
        <View style={styles.stockHeaders}>
          <View style={styles.stockHeader}>
            <Text style={[styles.stockSymbol, { color: tint }]}>{stock1.symbol}</Text>
            <Text style={[styles.stockName, { color: textColor, opacity: 0.7 }]} numberOfLines={1}>
              {stock1.name}
            </Text>
            <Text style={[styles.stockPrice, { color: textColor }]}>
              ${stock1.price.toFixed(2)}
            </Text>
            <Text style={[
              styles.stockChange,
              { color: stock1.change >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              {stock1.change >= 0 ? '+' : ''}{stock1.change.toFixed(2)} ({stock1.changePercent >= 0 ? '+' : ''}{stock1.changePercent}%)
            </Text>
          </View>

          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { color: tint }]}>VS</Text>
          </View>

          <View style={styles.stockHeader}>
            <Text style={[styles.stockSymbol, { color: tint }]}>{stock2.symbol}</Text>
            <Text style={[styles.stockName, { color: textColor, opacity: 0.7 }]} numberOfLines={1}>
              {stock2.name}
            </Text>
            <Text style={[styles.stockPrice, { color: textColor }]}>
              ${stock2.price.toFixed(2)}
            </Text>
            <Text style={[
              styles.stockChange,
              { color: stock2.change >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              {stock2.change >= 0 ? '+' : ''}{stock2.change.toFixed(2)} ({stock2.changePercent >= 0 ? '+' : ''}{stock2.changePercent}%)
            </Text>
          </View>
        </View>

        {/* Graphiques comparatifs */}
        <View style={styles.chartsContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Performance sur 12 mois</Text>

          <View style={styles.chartWrapper}>
            <Text style={[styles.chartLabel, { color: tint }]}>{stock1.symbol}</Text>
            <LineChart
              data={{
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                  data: stock1.data
                }]
              }}
              width={screenWidth}
              height={200}
              chartConfig={{
                backgroundColor: '#1E1E1E',
                backgroundGradientFrom: '#1E1E1E',
                backgroundGradientTo: '#1E1E1E',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#007AFF'
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={styles.chartWrapper}>
            <Text style={[styles.chartLabel, { color: tint }]}>{stock2.symbol}</Text>
            <LineChart
              data={{
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                  data: stock2.data
                }]
              }}
              width={screenWidth}
              height={200}
              chartConfig={{
                backgroundColor: '#1E1E1E',
                backgroundGradientFrom: '#1E1E1E',
                backgroundGradientTo: '#1E1E1E',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#34C759'
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Tableau comparatif */}
        <View style={styles.comparisonTable}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Métriques Comparatives</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { color: tint }]}>{stock1.symbol}</Text>
            <Text style={[styles.tableHeaderText, { color: textColor }]}>Métrique</Text>
            <Text style={[styles.tableHeaderText, { color: tint }]}>{stock2.symbol}</Text>
          </View>

          {renderMetricComparison(
            'Prix actuel',
            `$${stock1.price.toFixed(2)}`,
            `$${stock2.price.toFixed(2)}`,
            determineWinner(stock1.price, stock2.price)
          )}

          {renderMetricComparison(
            'Variation',
            `${stock1.change >= 0 ? '+' : ''}${stock1.change.toFixed(2)}`,
            `${stock2.change >= 0 ? '+' : ''}${stock2.change.toFixed(2)}`,
            determineWinner(stock1.change, stock2.change)
          )}

          {renderMetricComparison(
            'Variation %',
            `${stock1.changePercent >= 0 ? '+' : ''}${stock1.changePercent}%`,
            `${stock2.changePercent >= 0 ? '+' : ''}${stock2.changePercent}%`,
            determineWinner(stock1.changePercent, stock2.changePercent)
          )}

          {renderMetricComparison(
            'Prix max (12M)',
            `$${Math.max(...stock1.data).toFixed(2)}`,
            `$${Math.max(...stock2.data).toFixed(2)}`,
            determineWinner(Math.max(...stock1.data), Math.max(...stock2.data))
          )}

          {renderMetricComparison(
            'Prix min (12M)',
            `$${Math.min(...stock1.data).toFixed(2)}`,
            `$${Math.min(...stock2.data).toFixed(2)}`,
            determineWinner(Math.min(...stock1.data), Math.min(...stock2.data))
          )}

          {renderMetricComparison(
            'Volatilité',
            `${((Math.max(...stock1.data) - Math.min(...stock1.data)) / Math.min(...stock1.data) * 100).toFixed(1)}%`,
            `${((Math.max(...stock2.data) - Math.min(...stock2.data)) / Math.min(...stock2.data) * 100).toFixed(1)}%`,
            0
          )}
        </View>

        {/* Recommandation */}
        <View style={styles.recommendationSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Analyse</Text>
          <View style={[styles.recommendationBox, { backgroundColor: '#3C3C3E' }]}>
            <Ionicons name="information-circle" size={24} color={tint} />
            <Text style={[styles.recommendationText, { color: textColor, opacity: 0.8 }]}>
              {stock1.changePercent > stock2.changePercent
                ? `${stock1.symbol} montre une meilleure performance récente avec une variation de ${stock1.changePercent}% contre ${stock2.changePercent}% pour ${stock2.symbol}.`
                : `${stock2.symbol} montre une meilleure performance récente avec une variation de ${stock2.changePercent}% contre ${stock1.changePercent}% pour ${stock1.symbol}.`
              }
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.newComparisonButton, { backgroundColor: tint }]}
          onPress={() => router.back()}
        >
          <Text style={styles.newComparisonButtonText}>Nouvelle Comparaison</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 20,
    paddingTop: 50,
    gap: 15
  },
  headerBackButton: {
    padding: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const
  },
  content: {
    flex: 1,
    padding: 20
  },
  stockHeaders: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 30
  },
  stockHeader: {
    flex: 1,
    alignItems: 'center' as const
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 4
  },
  stockName: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center' as const
  },
  stockPrice: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginBottom: 4
  },
  stockChange: {
    fontSize: 14
  },
  vsContainer: {
    paddingHorizontal: 15
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold' as const
  },
  chartsContainer: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 15
  },
  chartWrapper: {
    marginBottom: 20
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
    marginLeft: 5
  },
  chart: {
    borderRadius: 16
  },
  comparisonTable: {
    marginBottom: 30
  },
  tableHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 15,
    paddingHorizontal: 10
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    flex: 1,
    textAlign: 'center' as const
  },
  metricRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12
  },
  metricCell: {
    flex: 1,
    alignItems: 'center' as const
  },
  metricLabelCell: {
    flex: 1.2,
    alignItems: 'center' as const
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500' as const
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 'bold' as const
  },
  winnerCell: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderRadius: 8,
    padding: 8
  },
  recommendationSection: {
    marginBottom: 30
  },
  recommendationBox: {
    flexDirection: 'row' as const,
    padding: 15,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start' as const
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  newComparisonButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center' as const,
    marginBottom: 30
  },
  newComparisonButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center' as const,
    marginTop: 100
  },
  backButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center' as const,
    marginTop: 20,
    marginHorizontal: 20
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold' as const
  }
};

export default CompareResultScreen;
