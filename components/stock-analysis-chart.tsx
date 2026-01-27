import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PredictionData {
  current: number[];
  predicted: number[];
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  targetPrice: number;
  timeframe: string;
}

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

  // Combine current and predicted data for visualization
  const allData = [...analysis.current, ...analysis.predicted];
  const currentIndex = analysis.current.length - 1;

  // Créer des labels mensuels cohérents
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


const StockOpportunity = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const opportunities = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      currentPrice: 456.70,
      targetPrice: 520.00,
      potential: '+13.9%',
      confidence: 85,
      reason: 'Demande croissante en IA et data centers',
      timeframe: '6 mois',
      risk: 'Modéré'
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      currentPrice: 178.50,
      targetPrice: 225.00,
      potential: '+26.1%',
      confidence: 72,
      reason: 'Gagne des parts de marché sur Intel',
      timeframe: '9 mois',
      risk: 'Élevé'
    },
    {
      symbol: 'CRM',
      name: 'Salesforce Inc.',
      currentPrice: 245.30,
      targetPrice: 285.00,
      potential: '+16.2%',
      confidence: 68,
      reason: 'Croissance du cloud et CRM intégré',
      timeframe: '12 mois',
      risk: 'Modéré'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Faible': return '#34C759';
      case 'Modéré': return '#FF9500';
      case 'Élevé': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  return (
    <View style={{ 
      backgroundColor, 
      padding: 12, 
      borderRadius: 16, 
      marginVertical: 12 
    }}>
      <Text style={{ 
        color: textColor, 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 12 
      }}>
        🎯 Opportunités d'Investissement
      </Text>
      
      <Text style={{ 
        color: textColor, 
        fontSize: 14, 
        opacity: 0.7, 
        marginBottom: 15 
      }}>
        Actions avec fort potentiel de croissance
      </Text>
      
      <Text style={{ 
        color: textColor, 
        fontSize: 14, 
        opacity: 0.7, 
        marginBottom: 20
    
      }}>
        Actions avec fort potentiel de croissance
      </Text>

      {opportunities.map((opp, index) => (
        <View 
          key={opp.symbol}
          style={{
            backgroundColor: '#3C3C3E',
            padding: 12,
            borderRadius: 12,
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: '#34C759'
          }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: 10
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ 
                color: tint, 
                fontSize: 18, 
                fontWeight: 'bold' 
              }}>
                {opp.symbol}
              </Text>
              <Text style={{ 
                color: textColor, 
                fontSize: 14, 
                opacity: 0.8 
              }}>
                {opp.name}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ 
                color: 'white', 
                fontSize: 16, 
                fontWeight: 'bold' 
              }}>
                ${opp.currentPrice}
              </Text>
              <Text style={{ 
                color: '#34C759', 
                fontSize: 14, 
                fontWeight: '600' 
              }}>
                {opp.potential}
              </Text>
            </View>
          </View>

          <View style={{ 
            backgroundColor: 'rgba(52, 199, 89, 0.1)',
            padding: 8,
            borderRadius: 8,
            marginBottom: 10
          }}>
            <Text style={{ 
              color: textColor, 
              fontSize: 13, 
              opacity: 0.9,
              lineHeight: 18
            }}>
              💡 {opp.reason}
            </Text>
          </View>

          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <View>
                <Text style={{ 
                  color: textColor, 
                  fontSize: 11, 
                  opacity: 0.6 
                }}>
                  Objectif
                </Text>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 14, 
                  fontWeight: '600' 
                }}>
                  ${opp.targetPrice}
                </Text>
              </View>
              <View>
                <Text style={{ 
                  color: textColor, 
                  fontSize: 11, 
                  opacity: 0.6 
                }}>
                  Confiance
                </Text>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 14, 
                  fontWeight: '600' 
                }}>
                  {opp.confidence}%
                </Text>
              </View>
              <View>
                <Text style={{ 
                  color: textColor, 
                  fontSize: 11, 
                  opacity: 0.6 
                }}>
                  Horizon
                </Text>
                <Text style={{ 
                  color: 'white', 
                  fontSize: 14, 
                  fontWeight: '600' 
                }}>
                  {opp.timeframe}
                </Text>
              </View>
            </View>
            <View style={{ 
              backgroundColor: getRiskColor(opp.risk) + '20',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6
            }}>
              <Text style={{ 
                color: getRiskColor(opp.risk),
                fontSize: 12,
                fontWeight: '600'
              }}>
                {opp.risk}
              </Text>
            </View>
          </View>
        </View>
      ))}

        <View style={{
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF'
      }}>
        <Text style={{ 
          color: textColor, 
          fontSize: 12, 
          opacity: 0.8,
          lineHeight: 16
        }}>
          ⚠️ Ces estimations sont basées sur l'analyse technique et les tendances du marché. 
          Les performances passées ne garantissent pas les résultats futurs. 
          Faites vos propres recherches avant d'investir.
        </Text>
      </View>
    </View>
  );
};

const EuropeanStocks = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const europeanStocks = [
    {
      symbol: 'ASML',
      name: 'ASML Holding NV',
      country: '🇳🇱 Pays-Bas',
      currentPrice: 745.20,
      change: +5.80,
      changePercent: '+0.78%',
      sector: 'Semi-conducteurs',
      reason: 'Demande mondiale en puces électroniques'
    },
    {
      symbol: 'SAP',
      name: 'SAP SE',
      country: '🇩🇪 Allemagne',
      currentPrice: 185.45,
      change: -2.30,
      changePercent: '-1.23%',
      sector: 'Logiciel d\'entreprise',
      reason: 'Transition vers le cloud et IA intégrée'
    },
    {
      symbol: 'LVMH',
      name: 'LVMH Moët Hennessy',
      country: '🇫🇷 France',
      currentPrice: 712.80,
      change: +8.20,
      changePercent: '+1.16%',
      sector: 'Luxe',
      reason: 'Reprise du tourisme et consommation premium'
    },
    {
      symbol: 'NESN',
      name: 'Nestlé S.A.',
      country: '🇨🇭 Suisse',
      currentPrice: 108.65,
      change: +0.95,
      changePercent: '+0.88%',
      sector: 'Agroalimentaire',
      reason: 'Marques fortes et présence mondiale'
    }
  ];

  return (
    <View style={{ 
      backgroundColor, 
      padding: 12, 
      borderRadius: 16, 
      marginVertical: 12 
    }}>
      <Text style={{ 
        color: textColor, 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 12 
      }}>
        🇪🇺 Bourse Européenne
      </Text>
      
      <Text style={{ 
        color: textColor, 
        fontSize: 14, 
        opacity: 0.7, 
        marginBottom: 15 
      }}>
        Principales actions des marchés européens
      </Text>

      {europeanStocks.map((stock, index) => (
        <View 
          key={stock.symbol}
          style={{
            backgroundColor: '#3C3C3E',
            padding: 12,
            borderRadius: 12,
            marginBottom: 10,
            borderLeftWidth: 3,
            borderLeftColor: stock.change >= 0 ? '#34C759' : '#FF3B30'
          }}
        >
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: 8
          }}>
            <View style={{ flex: 1 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: 8,
                marginBottom: 4
              }}>
                <Text style={{ 
                  color: tint, 
                  fontSize: 16, 
                  fontWeight: 'bold' 
                }}>
                  {stock.symbol}
                </Text>
                <Text style={{ 
                  color: textColor, 
                  fontSize: 12,
                  opacity: 0.7
                }}>
                  {stock.country}
                </Text>
              </View>
              <Text style={{ 
                color: textColor, 
                fontSize: 13, 
                opacity: 0.8 
              }}>
                {stock.name}
              </Text>
              <Text style={{ 
                color: textColor, 
                fontSize: 12, 
                opacity: 0.6,
                marginTop: 2
              }}>
                {stock.sector}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ 
                color: 'white', 
                fontSize: 16, 
                fontWeight: 'bold' 
              }}>
                €{stock.currentPrice}
              </Text>
              <Text style={{ 
                color: stock.change >= 0 ? '#34C759' : '#FF3B30', 
                fontSize: 14, 
                fontWeight: '600' 
              }}>
                {stock.changePercent}
              </Text>
            </View>
          </View>

          <View style={{
            backgroundColor: 'rgba(0, 122, 255, 0.1)',
            padding: 8,
            borderRadius: 6
          }}>
            <Text style={{ 
              color: textColor, 
              fontSize: 12, 
              opacity: 0.9,
              lineHeight: 16
            }}>
              💼 {stock.reason}
            </Text>
          </View>
        </View>
      ))}

      <View style={{
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF'
      }}>
        <Text style={{ 
          color: textColor, 
          fontSize: 12, 
          opacity: 0.8,
          lineHeight: 16
        }}>
          🏛️ Marchés européens : CAC 40, DAX, FTSE 100, SMI, AEX, IBEX 35. 
          Horaires : 9h-17h30 (CET). Les actions sont cotées en Euros.
        </Text>
      </View>
    </View>
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