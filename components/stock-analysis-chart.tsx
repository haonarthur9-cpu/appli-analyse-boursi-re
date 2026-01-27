import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PredictionData } from '@/types';
import StockOpportunity from './stock-opportunity';
import EuropeanStocks from './european-stocks';

const StockAnalysisChart = () => {
  const screenWidth = Dimensions.get('window').width - 30;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [analysis, setAnalysis] = useState<PredictionData | null>(null);

  const stockData: Record<string, PredictionData> = {
    'AAPL': {
      current: [175, 178, 180, 182, 179, 185, 187, 182, 185, 183, 188, 186],
      predicted: [189, 192, 195, 198, 202, 205, 208, 210, 215, 218, 222, 225],
      trend: 'bullish',
      confidence: 78,
      targetPrice: 225,
      timeframe: '3 mois'
    },
    'TSLA': {
      current: [245, 248, 242, 238, 235, 240, 238, 242, 245, 243, 248, 245],
      predicted: [242, 238, 235, 232, 228, 225, 222, 220, 218, 215, 212, 210],
      trend: 'bearish',
      confidence: 65,
      targetPrice: 210,
      timeframe: '3 mois'
    },
    'MSFT': {
      current: [375, 378, 382, 380, 385, 388, 385, 390, 388, 392, 395, 390],
      predicted: [395, 398, 400, 402, 405, 408, 410, 412, 415, 418, 420, 425],
      trend: 'bullish',
      confidence: 82,
      targetPrice: 425,
      timeframe: '3 mois'
    },
    'GOOGL': {
      current: [140, 142, 145, 143, 146, 144, 148, 150, 148, 152, 155, 153],
      predicted: [155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166],
      trend: 'bullish',
      confidence: 70,
      targetPrice: 166,
      timeframe: '3 mois'
    }
  };

  useEffect(() => {
    setAnalysis(stockData[selectedStock]);
  }, [selectedStock]);

  if (!analysis) return null;

  const allData = [...analysis.current, ...analysis.predicted];

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const futureMonths = ['J+1', 'J+2', 'J+3', 'J+4', 'J+5', 'J+6', 'J+7', 'J+8', 'J+9', 'J+10', 'J+11', 'J+12'];

  const chartData = {
    labels: [...months, ...futureMonths].slice(0, allData.length),
    datasets: [
      {
        data: allData,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return '#34C759';
      case 'bearish': return '#FF3B30';
      default: return '#FF9500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return '🚀';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'Haussière';
      case 'bearish': return 'Baissière';
      default: return 'Neutre';
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      style={{
        backgroundColor,
        borderRadius: 16,
        marginVertical: 20,
        alignSelf: 'center',
        width: '100%',
      }}
    >
      <Text style={{
        color: textColor,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
      }}>
        📊 Analyse Prédictive
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {Object.keys(stockData).map(symbol => (
            <TouchableOpacity
              key={symbol}
              style={{
                backgroundColor: selectedStock === symbol ? tint : '#3C3C3E',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                minWidth: 70,
                alignItems: 'center'
              }}
              onPress={() => setSelectedStock(symbol)}
            >
              <Text style={{
                color: selectedStock === symbol ? '#000000' : 'white',
                fontSize: 14,
                fontWeight: selectedStock === symbol ? 'bold' : 'normal'
              }}>
                {symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={{
        backgroundColor: '#3C3C3E',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <View>
          <Text style={{
            color: textColor,
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            {selectedStock}
          </Text>
          <Text style={{
            color: textColor,
            fontSize: 12,
            opacity: 0.7
          }}>
            Actuel: ${analysis.current[analysis.current.length - 1]}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            color: getTrendColor(analysis.trend),
            fontSize: 14,
            fontWeight: 'bold'
          }}>
            {getTrendIcon(analysis.trend)} {getTrendText(analysis.trend)}
          </Text>
          <Text style={{
            color: 'white',
            fontSize: 12,
            opacity: 0.8
          }}>
            Cible: ${analysis.targetPrice}
          </Text>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={Math.min(screenWidth, 360)}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: 'center'
        }}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={false}
      />

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        backgroundColor: '#3C3C3E',
        paddingVertical: 12,
        borderRadius: 12
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            color: getTrendColor(analysis.trend),
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            {analysis.confidence}%
          </Text>
          <Text style={{
            color: textColor,
            fontSize: 12,
            opacity: 0.7
          }}>
            Confiance
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            {analysis.timeframe}
          </Text>
          <Text style={{
            color: textColor,
            fontSize: 12,
            opacity: 0.7
          }}>
            Horizon
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            color: analysis.targetPrice > analysis.current[analysis.current.length - 1] ? '#34C759' : '#FF3B30',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            {analysis.targetPrice > analysis.current[analysis.current.length - 1] ? '+' : ''}{((analysis.targetPrice - analysis.current[analysis.current.length - 1]) / analysis.current[analysis.current.length - 1] * 100).toFixed(1)}%
          </Text>
          <Text style={{
            color: textColor,
            fontSize: 12,
            opacity: 0.7
          }}>
            Potentiel
          </Text>
        </View>
      </View>

      <View style={{
        marginTop: 15,
        backgroundColor: getTrendColor(analysis.trend) + '20',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: getTrendColor(analysis.trend)
      }}>
        <Text style={{
          color: textColor,
          fontSize: 12,
          opacity: 0.8,
          lineHeight: 16
        }}>
          📊 Analyse basée sur les indicateurs techniques, le volume de trading et les tendances historiques.
          Les prédictions sont estimées avec {analysis.confidence}% de confiance sur {analysis.timeframe}.
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
      }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#007AFF',
            marginBottom: 4
          }} />
          <Text style={{
            color: textColor,
            fontSize: 10,
            opacity: 0.7
          }}>
            Historique
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#FF9500',
            marginBottom: 4
          }} />
          <Text style={{
            color: textColor,
            fontSize: 10,
            opacity: 0.7
          }}>
            Actuel
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: getTrendColor(analysis.trend),
            marginBottom: 4
          }} />
          <Text style={{
            color: textColor,
            fontSize: 10,
            opacity: 0.7
          }}>
            Prédiction
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function StockAnalysisScreen() {
  return (
    <>
      <StockAnalysisChart />
      <StockOpportunity />
      <EuropeanStocks />
    </>
  );
}
