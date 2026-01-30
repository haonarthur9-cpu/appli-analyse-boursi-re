import { NewsCard } from '@/components/news-card';
import { SymbolFilter } from '@/components/symbol-filter';
import { useThemeColor } from '@/hooks/use-theme-color';
import { extractSymbol, useInfiniteNews } from '@/hooks/useNews';
import { NewsArticle, StockSymbol, SYMBOL_COLORS, SYMBOL_EMOJIS } from '@/types/news';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function NewsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const [selectedSymbol, setSelectedSymbol] = useState<StockSymbol | undefined>();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Charger tous les articles
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isRefetching,
    error,
  } = useInfiniteNews();

  // Aplatir toutes les pages d'articles
  const articles = React.useMemo(
    () => data?.pages.flatMap((page) => page.articles) ?? [],
    [data]
  );

  // Filtrer côté client par symbole
  const filteredArticles = React.useMemo(() => {
    if (!selectedSymbol) return articles;
    
    return articles.filter((article) => {
      const symbol = extractSymbol(article.source);
      return symbol === selectedSymbol;
    });
  }, [articles, selectedSymbol]);

  const handleArticlePress = (article: NewsArticle) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const handleOpenInBrowser = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir ce lien');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ouverture du lien');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedArticle(null), 300);
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
          {selectedSymbol
            ? `Aucun article trouvé pour ${selectedSymbol}`
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
            📰 Market News
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
        <View>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            📰 Market News
          </Text>
          {filteredArticles.length > 0 && (
            <Text style={[styles.subtitle, { color: textColor, opacity: 0.6 }]}>
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
              {selectedSymbol && ` pour ${selectedSymbol}`}
            </Text>
          )}
        </View>
      </View>

      {/* Symbol Filter */}
      <SymbolFilter selected={selectedSymbol} onChange={setSelectedSymbol} />

      {/* News List */}
      <FlatList
        data={filteredArticles}
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
        contentContainerStyle={filteredArticles.length === 0 && styles.emptyContainer}
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

      {/* Modal pour afficher l'article */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalContainer, { backgroundColor }]}>
          {/* Header du modal */}
          <View style={[styles.modalHeader, { borderBottomColor: '#3C3C3E' }]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
            >
              <Ionicons name="close-circle" size={32} color={textColor} />
            </TouchableOpacity>
            
            <View style={{ flex: 1 }} />
          </View>

          {/* Contenu de l'article */}
          {selectedArticle && (
            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Image principale */}
              {selectedArticle.image_url ? (
                <Image
                  source={{ uri: selectedArticle.image_url }}
                  style={styles.modalHeroImage}
                  contentFit="cover"
                  transition={300}
                />
              ) : (
                <View style={[styles.modalHeroImage, styles.modalHeroPlaceholder]}>
                  <Ionicons name="newspaper" size={64} color={textColor} style={{ opacity: 0.3 }} />
                </View>
              )}

              {/* Badge symbole et métadonnées */}
              <View style={styles.modalMetaSection}>
                {(() => {
                  const symbol = extractSymbol(selectedArticle.source);
                  const symbolColor = symbol ? SYMBOL_COLORS[symbol as StockSymbol] : '#666666';
                  const symbolEmoji = symbol ? SYMBOL_EMOJIS[symbol as StockSymbol] : '';
                  
                  return (
                    <View style={[styles.modalSymbolBadge, { backgroundColor: symbolColor }]}>
                      <Text style={styles.modalSymbolText}>
                        {symbol} {symbolEmoji}
                      </Text>
                    </View>
                  );
                })()}

                <View style={styles.modalMetaInfo}>
                  <Text style={[styles.modalSourceText, { color: textColor, opacity: 0.6 }]}>
                    {selectedArticle.source.split(' (')[0].toUpperCase()}
                  </Text>
                  <Text style={[styles.modalDateText, { color: textColor, opacity: 0.5 }]}>
                    {new Date(selectedArticle.published_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>

              {/* Titre de l'article */}
              <Text style={[styles.modalTitle, { color: textColor }]}>
                {selectedArticle.title}
              </Text>

              {/* Description/Contenu */}
              {selectedArticle.description && (
                <View style={styles.modalContentSection}>
                  <Text style={[styles.modalContentText, { color: textColor }]}>
                    {selectedArticle.description}
                  </Text>
                </View>
              )}

              {/* Note d'information */}
              <View style={[styles.modalInfoBox, { backgroundColor: tint + '15', borderLeftColor: tint }]}>
                <Ionicons name="information-circle" size={20} color={tint} />
                <Text style={[styles.modalInfoText, { color: textColor }]}>
                  Ceci est un aperçu de l'article. Pour lire le contenu complet avec tous les détails, ouvrez l'article dans votre navigateur.
                </Text>
              </View>

              {/* Bouton lire l'article complet */}
              <TouchableOpacity
                style={[styles.modalReadFullButton, { backgroundColor: tint }]}
                onPress={() => handleOpenInBrowser(selectedArticle.url)}
                activeOpacity={0.8}
              >
                <Ionicons name="open-outline" size={24} color="#000" />
                <Text style={styles.modalReadFullText}>
                  Lire l'article complet sur le site
                </Text>
              </TouchableOpacity>

              {/* Lien de l'article */}
              <TouchableOpacity 
                onPress={() => handleOpenInBrowser(selectedArticle.url)}
                style={[styles.modalUrlBox, { backgroundColor: '#2C2C2E' }]}
                activeOpacity={0.7}
              >
                <Ionicons name="link" size={18} color={tint} />
                <Text 
                  style={[styles.modalUrlText, { color: tint }]} 
                  numberOfLines={1}
                >
                  {selectedArticle.url}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={tint} />
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    paddingBottom: 40,
  },
  modalHeroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#2C2C2E',
  },
  modalHeroPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMetaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalSymbolBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalSymbolText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalMetaInfo: {
    flex: 1,
    gap: 4,
  },
  modalSourceText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  modalDateText: {
    fontSize: 12,
    fontWeight: '400',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalContentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  modalContentText: {
    fontSize: 17,
    lineHeight: 28,
    opacity: 0.9,
    letterSpacing: 0.2,
  },
  modalInfoBox: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  modalInfoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  modalReadFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  modalReadFullText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  modalUrlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  modalUrlText: {
    flex: 1,
    fontSize: 13,
    opacity: 0.8,
  },
});
