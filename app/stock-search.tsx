import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StockData } from '@/types';

const StockSearchScreen = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width - 40;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');
  
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [stock1, setStock1] = useState<StockData | null>(null);
  const [stock2, setStock2] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulation de recherche avec données mock
  const searchStock = async (query: string): Promise<StockData | null> => {
    // Simuler un appel API avec délai
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const stockDatabase: Record<string, StockData> = {
      'AAPL': {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 182.50,
        change: 2.30,
        changePercent: 1.27,
        data: [170, 175, 180, 178, 185, 190, 188, 195, 192, 198, 180, 182.50]
      },
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
      },
      'META': {
        symbol: 'META',
        name: 'Meta Platforms Inc.',
        price: 312.40,
        change: -2.80,
        changePercent: -0.89,
        data: [300, 305, 310, 315, 318, 320, 315, 312, 308, 310, 315, 312.40]
      },
      'NVDA': {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        price: 456.70,
        change: 12.50,
        changePercent: 2.81,
        data: [400, 420, 430, 440, 450, 455, 460, 455, 450, 458, 445, 456.70]
      },
      'JPM': {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        price: 145.80,
        change: 0.90,
        changePercent: 0.62,
        data: [140, 142, 143, 144, 145, 146, 147, 145, 144, 146, 145, 145.80]
      }
    };

    const upperQuery = query.toUpperCase();
    return stockDatabase[upperQuery] || null;
  };

  const handleSearch = async (query: string, stockNumber: 1 | 2) => {
    if (!query.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un symbole d\'action');
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchStock(query.trim());
      if (result) {
        if (stockNumber === 1) {
          setStock1(result);
        } else {
          setStock2(result);
        }
      } else {
        Alert.alert('Non trouvé', `Aucune action trouvée pour le symbole: ${query}`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rechercher l\'action');
    } finally {
      setIsLoading(false);
    }
  };

  const compareStocks = () => {
    if (stock1 && stock2) {
      router.push({
        pathname: '/compare-result',
        params: {
          stock1: JSON.stringify(stock1),
          stock2: JSON.stringify(stock2)
        }
      });
    } else {
      Alert.alert('Erreur', 'Veuillez rechercher deux actions pour les comparer');
    }
  };

  const renderStockCard = (stock: StockData | null, title: string) => {
    if (!stock) {
      return (
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.emptyText, { color: textColor, opacity: 0.6 }]}>
            Aucune action sélectionnée
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.symbol, { color: tint }]}>{stock.symbol}</Text>
        <Text style={[styles.name, { color: textColor, opacity: 0.8 }]}>{stock.name}</Text>
        <Text style={[styles.price, { color: 'white' }]}>${stock.price.toFixed(2)}</Text>
        <Text style={[
          styles.change,
          { color: stock.change >= 0 ? '#34C759' : '#FF3B30' }
        ]}>
          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Recherche d'Actions</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Action 1</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: '#3C3C3E', 
                color: 'white' 
              }]}
              value={search1}
              onChangeText={setSearch1}
              placeholder="Symbole (ex: AAPL)"
              placeholderTextColor="#8E8E93"
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: tint }]}
              onPress={() => handleSearch(search1, 1)}
              disabled={isLoading}
            >
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Action 2</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: '#3C3C3E', 
                color: 'white' 
              }]}
              value={search2}
              onChangeText={setSearch2}
              placeholder="Symbole (ex: GOOGL)"
              placeholderTextColor="#8E8E93"
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: tint }]}
              onPress={() => handleSearch(search2, 2)}
              disabled={isLoading}
            >
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {renderStockCard(stock1, 'Première Action')}
          {renderStockCard(stock2, 'Deuxième Action')}
        </View>

        <TouchableOpacity
          style={[styles.compareButton, { backgroundColor: '#34C759' }]}
          onPress={compareStocks}
          disabled={!stock1 || !stock2}
        >
          <Text style={styles.compareButtonText}>Comparer les Actions</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: textColor }]}>Actions Disponibles:</Text>
          <Text style={[styles.infoText, { color: textColor, opacity: 0.7 }]}>
            AAPL, GOOGL, MSFT, TSLA, AMZN, META, NVDA, JPM
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    gap: 15
  },
  backButton: {
    padding: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 20
  },
  searchSection: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10
  },
  searchInput: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    fontSize: 16
  },
  searchButton: {
    padding: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 25
  },
  card: {
    flex: 1,
    backgroundColor: '#3C3C3E',
    padding: 15,
    borderRadius: 12,
    minHeight: 120
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  name: {
    fontSize: 12,
    marginBottom: 8
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },
  change: {
    fontSize: 14
  },
  compareButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25
  },
  compareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  infoSection: {
    padding: 15,
    backgroundColor: '#3C3C3E',
    borderRadius: 12
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20
  }
};

export default StockSearchScreen;