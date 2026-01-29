import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NewsArticle, SYMBOL_COLORS, SYMBOL_EMOJIS, StockSymbol } from '@/types/news';
import { extractSymbol, extractSourceName } from '@/hooks/useNews';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

interface NewsCardProps {
  article: NewsArticle;
  onPress: () => void;
}

export const NewsCard = React.memo<NewsCardProps>(({ article, onPress }) => {
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({ light: '#FFFFFF', dark: '#1E1E1E' }, 'background');

  const symbol = extractSymbol(article.source) as StockSymbol | null;
  const sourceName = extractSourceName(article.source);
  const symbolColor = symbol ? SYMBOL_COLORS[symbol] : '#666666';
  const symbolEmoji = symbol ? SYMBOL_EMOJIS[symbol] : '';

  const relativeTime = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(article.published_at), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return 'Date inconnue';
    }
  }, [article.published_at]);

  const hasImage = !!article.image_url;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header with symbol badge and time */}
      <View style={styles.header}>
        <View style={[styles.symbolBadge, { backgroundColor: symbolColor }]}>
          <Text style={styles.symbolText}>
            {symbol} {symbolEmoji}
          </Text>
        </View>
        <Text style={[styles.time, { color: textColor, opacity: 0.6 }]}>
          {relativeTime}
        </Text>
      </View>

      {/* Content with image and text */}
      <View style={styles.content}>
        {hasImage ? (
          <Image
            source={{ uri: article.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: symbolColor + '15' }]}>
            <Ionicons name="newspaper" size={32} color={symbolColor} style={{ opacity: 0.5 }} />
          </View>
        )}

        <View style={styles.textContent}>
          {/* Source name */}
          <Text style={[styles.source, { color: textColor, opacity: 0.5 }]}>
            {sourceName.toUpperCase()}
          </Text>

          {/* Title */}
          <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
            {article.title}
          </Text>

          {/* Description */}
          {article.description && (
            <Text
              style={[styles.description, { color: textColor, opacity: 0.7 }]}
              numberOfLines={3}
            >
              {article.description}
            </Text>
          )}
        </View>
      </View>

      {/* External link icon */}
      <View style={styles.linkIcon}>
        <Ionicons name="open-outline" size={16} color={textColor} style={{ opacity: 0.4 }} />
      </View>
    </TouchableOpacity>
  );
});

NewsCard.displayName = 'NewsCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symbolText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  source: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  linkIcon: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
