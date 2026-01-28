import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { NEWS_SOURCES, NewsSource } from '@/types/news';

interface SourceFilterProps {
  selected?: string;
  onChange: (source?: string) => void;
}

export const SourceFilter: React.FC<SourceFilterProps> = ({ selected, onChange }) => {
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const options = ['Toutes', ...NEWS_SOURCES];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {options.map((option) => {
        const isSelected = option === 'Toutes' ? !selected : selected === option;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              isSelected && { backgroundColor: tint },
              !isSelected && { backgroundColor: '#2C2C2E' },
            ]}
            onPress={() => onChange(option === 'Toutes' ? undefined : option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                { color: isSelected ? '#000' : textColor },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
