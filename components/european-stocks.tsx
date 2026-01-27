import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

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

export default EuropeanStocks;
