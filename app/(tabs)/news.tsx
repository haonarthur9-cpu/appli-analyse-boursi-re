import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useInfiniteNews } from '@/hooks/useNews';
import { NewsCard } from '@/components/news-card';
import { SourceFilter } from '@/components/source-filter';
import { NewsArticle } from '@/types/news';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function NewsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const [selectedSource, setSelectedSource] = useState<string | undefined>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isRefetching,
    error,
  } = useInfiniteNews(selectedSource);

  const articles = React.useMemo(
    () => data?.pages.flatMap((page) => page.articles) ?? [],
    [data]
  );

  const handleArticlePress = async (article: NewsArticle) => {
    try {
      const canOpen = await Linking.canOpenURL(article.url);
      if (canOpen) {
        await Linking.openURL(article.url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir ce lien');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ouverture du lien');
    }
  };

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <NewsCard article={item} onPress={() => handleArticlePress(item)} />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
        <Ionicons name="newspaper-outline" size={64} color={textColor} style={{ opacity: 0.3 }} />
        <Text style={[styles.emptyTitle, { color: textColor }]}>
          Aucune actualité disponible
        </Text>
        <Text style={[styles.emptySubtitle, { color: textColor, opacity: 0.6 }]}>
          {selectedSource
            ? `Aucun article trouvé pour ${selectedSource}`
            : 'Les actualités seront bientôt disponibles'}
        </Text>
      </Animated.View>
    );
  };

  const renderError = () => (
    <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
      <Ionicons name="alert-circle-outline" size={64} color="#D32F2F" style={{ opacity: 0.6 }} />
      <Text style={[styles.emptyTitle, { color: textColor }]}>
        Erreur de chargement
      </Text>
      <Text style={[styles.emptySubtitle, { color: textColor, opacity: 0.6 }]}>
        {error instanceof Error ? error.message : 'Une erreur est survenue'}
      </Text>
    </Animated.View>
  );

  if (error && !data) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            📰 Actualités
          </Text>
        </View>
        {renderError()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          📰 Actualités Boursières
        </Text>
        {articles.length > 0 && (
          <View style={[styles.badge, { backgroundColor: tint + '20' }]}>
            <Text style={[styles.badgeText, { color: tint }]}>
              {data?.pages[0]?.total || articles.length}
            </Text>
          </View>
        )}
      </View>

      {/* Source Filter */}
      <SourceFilter selected={selectedSource} onChange={setSelectedSource} />

      {/* News List */}
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={tint}
            colors={[tint]}
          />
        }
        contentContainerStyle={articles.length === 0 && styles.emptyContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* Loading overlay on first load */}
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor }]}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Chargement des actualités...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
