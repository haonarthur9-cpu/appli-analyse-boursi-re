import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  data: number[];
}

const StockComparison = () => {
  const screenWidth = Dimensions.get('window').width - 30;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');
  
  const [stock1Symbol, setStock1Symbol] = useState('GOOGL');
  const [stock2Symbol, setStock2Symbol] = useState('MSFT');
  const [comparisonMode, setComparisonMode] = useState<'buy' | 'sell'>('buy');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  
  const stocks: Record<string, Stock> = {
    'GOOGL': {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.50,
      change: 2.30,
      changePercent: 1.64,
      data: [135, 138, 140, 137, 142, 145, 143, 148, 146, 150, 141, 142.50]
    },
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 378.90,
      change: -1.20,
      changePercent: -0.32,
      data: [365, 370, 375, 380, 382, 378, 385, 390, 388, 385, 380, 378.90]
    },
    'TSLA': {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 245.60,
      change: 8.40,
      changePercent: 3.54,
      data: [220, 225, 230, 235, 240, 238, 242, 248, 250, 248, 240, 245.60]
    },
    'AMZN': {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 155.30,
      change: 3.10,
      changePercent: 2.04,
      data: [145, 148, 150, 152, 154, 156, 153, 158, 160, 157, 152, 155.30]
    }
  };

  const stock1 = stocks[stock1Symbol] || stocks['GOOGL'];
  const stock2 = stocks[stock2Symbol] || stocks['MSFT'];

  const getRecommendation = () => {
    if (comparisonMode === 'buy') {
      return stock1.changePercent > stock2.changePercent ? stock1 : stock2;
    } else {
      return stock1.changePercent < stock2.changePercent ? stock1 : stock2;
    }
  };

  const recommendation = getRecommendation();

  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        data: stock1.data,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: stock2.data,
        color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
        strokeWidth: 2,
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
      r: '3',
      strokeWidth: '1',
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(800)}
      layout={Layout}
      style={{ 
        backgroundColor, 
      paddingVertical: 12,
        borderRadius: 16, 
        marginVertical: 20,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 400
      }}
    >
      <Text style={{ 
        color: textColor, 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15 
      }}>
        Comparateur d'Actions
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
        <TouchableOpacity
          style={[
            { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
            comparisonMode === 'buy' ? { backgroundColor: '#34C759' } : { backgroundColor: '#3C3C3E' }
          ]}
          onPress={() => setComparisonMode('buy')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Achat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
            comparisonMode === 'sell' ? { backgroundColor: '#FF3B30' } : { backgroundColor: '#3C3C3E' }
          ]}
          onPress={() => setComparisonMode('sell')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Vente</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: textColor, fontSize: 14, marginBottom: 5 }}>Action 1:</Text>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3C3C3E',
              padding: 10,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onPress={() => setShowDropdown1(true)}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>{stock1Symbol}</Text>
            <Text style={{ color: '#8E8E93' }}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: textColor, fontSize: 14, marginBottom: 5 }}>Action 2:</Text>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3C3C3E',
              padding: 10,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onPress={() => setShowDropdown2(true)}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>{stock2Symbol}</Text>
            <Text style={{ color: '#8E8E93' }}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 15, marginBottom: 15 }}>
          <View style={{ backgroundColor: '#3C3C3E', padding: 15, borderRadius: 12, minWidth: 140 }}>
            <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: 'bold' }}>{stock1.symbol}</Text>
            <Text style={{ color: textColor, fontSize: 12, opacity: 0.7 }}>{stock1.name}</Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginVertical: 5 }}>${stock1.price}</Text>
            <Text style={{ 
              color: stock1.change >= 0 ? '#34C759' : '#FF3B30', 
              fontSize: 14 
            }}>
              {stock1.change >= 0 ? '+' : ''}{stock1.change} ({stock1.changePercent >= 0 ? '+' : ''}{stock1.changePercent}%)
            </Text>
          </View>

          <View style={{ backgroundColor: '#3C3C3E', padding: 15, borderRadius: 12, minWidth: 140 }}>
            <Text style={{ color: '#FF3B30', fontSize: 16, fontWeight: 'bold' }}>{stock2.symbol}</Text>
            <Text style={{ color: textColor, fontSize: 12, opacity: 0.7 }}>{stock2.name}</Text>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginVertical: 5 }}>${stock2.price}</Text>
            <Text style={{ 
              color: stock2.change >= 0 ? '#34C759' : '#FF3B30', 
              fontSize: 14 
            }}>
              {stock2.change >= 0 ? '+' : ''}{stock2.change} ({stock2.changePercent >= 0 ? '+' : ''}{stock2.changePercent}%)
            </Text>
          </View>
        </View>
      </ScrollView>

      <LineChart
        data={chartData}
        width={Math.min(screenWidth, 360)}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: 'center'
        }}
      />

      <View style={{ 
        backgroundColor: comparisonMode === 'buy' ? '#34C75920' : '#FF3B3020', 
        padding: 15, 
        borderRadius: 12, 
        marginTop: 15,
        borderLeftWidth: 4,
        borderLeftColor: comparisonMode === 'buy' ? '#34C759' : '#FF3B30'
      }}>
        <Text style={{ 
          color: textColor, 
          fontSize: 16, 
          fontWeight: 'bold',
          marginBottom: 5
        }}>
          Recommandation de {comparisonMode === 'buy' ? 'achat' : 'vente'}:
        </Text>
        <Text style={{ 
          color: tint, 
          fontSize: 18, 
          fontWeight: 'bold' 
        }}>
          {recommendation.symbol} - {recommendation.name}
        </Text>
        <Text style={{ 
          color: textColor, 
          fontSize: 14, 
          marginTop: 5,
          opacity: 0.8
        }}>
          Performance: {recommendation.changePercent >= 0 ? '+' : ''}{recommendation.changePercent}%
        </Text>
      </View>
      <StockNews />

      {/* Dropdown pour Action 1 */}
      <Modal
        visible={showDropdown1}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown1(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown1(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#2C2C2E', borderRadius: 12, padding: 20, minWidth: 200 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Choisir une action</Text>
              {Object.keys(stocks).map(symbol => (
                <TouchableOpacity
                  key={symbol}
                  style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#3C3C3E' }}
                  onPress={() => {
                    setStock1Symbol(symbol);
                    setShowDropdown1(false);
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 14 }}>{symbol} - {stocks[symbol].name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Dropdown pour Action 2 */}
      <Modal
        visible={showDropdown2}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown2(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown2(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#2C2C2E', borderRadius: 12, padding: 20, minWidth: 200 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Choisir une action</Text>
              {Object.keys(stocks).map(symbol => (
                <TouchableOpacity
                  key={symbol}
                  style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#3C3C3E' }}
                  onPress={() => {
                    setStock2Symbol(symbol);
                    setShowDropdown2(false);
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 14 }}>{symbol} - {stocks[symbol].name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
        </TouchableWithoutFeedback>
      </Modal>
    </Animated.View>
  );
};

const StockNews = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const newsArticles = [
    {
      id: 1,
      title: "Apple annonce des résultats records au Q4 2024",
      summary: "Les ventes d'iPhone dépassent les attentes avec une croissance de 8%",
      source: "Financial Times",
      time: "Il y a 2 heures",
      impact: "positive",
      relatedStock: "AAPL"
    },
    {
      id: 2,
      title: "Tesla fait face à une concurrence accrue en Chine",
      summary: "Les fabricants locaux réduisent les prix, impactant les marges de Tesla",
      source: "Reuters",
      time: "Il y a 4 heures",
      impact: "negative",
      relatedStock: "TSLA"
    },
    {
      id: 3,
      title: "Microsoft investit 10 milliards dans l'IA quantique",
      summary: "Nouveau partenariat avec des laboratoires de recherche européens",
      source: "Bloomberg",
      time: "Il y a 6 heures",
      impact: "positive",
      relatedStock: "MSFT"
    },
    {
      id: 4,
      title: "Amazon lance un nouveau service de livraison par drone",
      summary: "Déploiement prévu dans 50 villes américaines d'ici fin 2024",
      source: "WSJ",
      time: "Il y a 8 heures",
      impact: "positive",
      relatedStock: "AMZN"
    },
    {
      id: 5,
      title: "Google face à une enquête antitrust en Europe",
      summary: "La Commission européenne s'inquiète de la position dominante dans la publicité",
      source: "Reuters",
      time: "Il y a 12 heures",
      impact: "negative",
      relatedStock: "GOOGL"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return '#34C759';
      case 'negative': return '#FF3B30';
      default: return '#FF9500';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return '↑';
      case 'negative': return '↓';
      default: return '→';
    }
  };

  return (
    <View style={{ 
      backgroundColor, 
      borderRadius: 16, 
      paddingVertical: 20,
      marginVertical: 20 
    }}>
      <Text style={{ 
        color: textColor, 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15 
      }}>
        📈 Actualités Boursières
      </Text>
      
      <Text style={{ 
        color: textColor, 
        fontSize: 14, 
        opacity: 0.7, 
        marginBottom: 15 
      }}>
        Dernières nouvelles qui impactent les marchés
      </Text>

      <ScrollView 
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      >
        {newsArticles.map(article => (
          <View 
            key={article.id}
            style={{
              backgroundColor: '#3C3C3E',
              padding: 15,
              borderRadius: 12,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: getImpactColor(article.impact)
            }}
          >
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 8
            }}>
              <Text style={{ 
                color: textColor, 
                fontSize: 16, 
                fontWeight: '600',
                flex: 1,
                marginRight: 10
              }}>
                {article.title}
              </Text>
              <View style={{ 
                backgroundColor: getImpactColor(article.impact) + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6
              }}>
                <Text style={{ 
                  color: getImpactColor(article.impact),
                  fontSize: 16,
                  fontWeight: 'bold'
                }}>
                  {getImpactIcon(article.impact)}
                </Text>
              </View>
            </View>
            
            <Text style={{ 
              color: textColor, 
              fontSize: 14, 
              opacity: 0.8,
              marginBottom: 8
            }}>
              {article.summary}
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ 
                  color: tint, 
                  fontSize: 12,
                  fontWeight: '600'
                }}>
                  {article.relatedStock}
                </Text>
                <Text style={{ 
                  color: textColor, 
                  fontSize: 12,
                  opacity: 0.6
                }}>
                  {article.source}
                </Text>
              </View>
              <Text style={{ 
                color: textColor, 
                fontSize: 12,
                opacity: 0.5
              }}>
                {article.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Text style={{ 
        color: textColor, 
        fontSize: 12, 
        opacity: 0.5, 
        textAlign: 'center',
        marginTop: 10
      }}>
        Les actualités sont mises à jour en temps réel
      </Text>
    </View>
  );
};

export default StockComparison;