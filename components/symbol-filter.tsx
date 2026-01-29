import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { STOCK_SYMBOLS, StockSymbol, SYMBOL_EMOJIS } from '@/types/news';

interface SymbolFilterProps {
  selected?: StockSymbol;
  onChange: (symbol?: StockSymbol) => void;
}

export const SymbolFilter: React.FC<SymbolFilterProps> = ({ selected, onChange }) => {
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({ light: '#F0F0F0', dark: '#2C2C2E' }, 'background');

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Option "Tous" */}
        <TouchableOpacity
          style={[
            styles.chip,
            { backgroundColor: !selected ? tint : cardBackground },
          ]}
          onPress={() => onChange(undefined)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              { color: !selected ? '#000' : textColor },
            ]}
          >
            Tous
          </Text>
        </TouchableOpacity>

        {/* Options par symbole */}
        {STOCK_SYMBOLS.map((symbol) => {
          const isSelected = selected === symbol;
          const emoji = SYMBOL_EMOJIS[symbol];

          return (
            <TouchableOpacity
              key={symbol}
              style={[
                styles.chip,
                { backgroundColor: isSelected ? tint : cardBackground },
              ]}
              onPress={() => onChange(symbol)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? '#000' : textColor },
                ]}
              >
                {emoji} {symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
