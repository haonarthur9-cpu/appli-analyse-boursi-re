import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

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

export default StockOpportunity;
