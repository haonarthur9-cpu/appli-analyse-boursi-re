import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

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

export default StockNews;
