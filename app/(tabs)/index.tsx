import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, Layout, SlideInRight, useSharedValue } from 'react-native-reanimated';

import StockComparison from '@/components/apple-stock-chart';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import StockAnalysisChart from '@/components/stock-analysis-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000', dark: '#000000' }}
      headerImage={
        <Animated.Image
          source={require('@/assets/images/bull-market.png')}
          style={[
            styles.headerImage,
            {
              transform: [{ scale }],
            }
          ]}
          resizeMode="cover"
          entering={FadeIn.duration(1000)}
        />
      }>

      
      
<Animated.View 
        entering={FadeInDown.duration(800).delay(200)}
        layout={Layout}
      >
        <ThemedView style={styles.titleContainer}>
          <Animated.View 
            entering={SlideInRight.duration(600).delay(400)}
            style={styles.logoContainer}
          >
            <Animated.Text style={styles.logoText}>
              <Animated.Text style={[styles.logoMRKT, { color: tint }]}>MRKT</Animated.Text>
              <Animated.Text style={[styles.logoNews, { color: textColor }]}>News</Animated.Text>
            </Animated.Text>
          </Animated.View>
        </ThemedView>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.duration(800).delay(600)}>
        <ThemedView style={styles.descriptionContainer}>
          <ThemedText style={styles.descriptionText}>
            📈 Votre application de trading intelligent qui analyse les tendances du marché,
            compare les performances des actions et fournit des prédictions basées sur
            des indicateurs techniques pour vous aider à prendre des décisions d'investissement éclairées.
          </ThemedText>
        </ThemedView>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(800).delay(800)}>
        <TouchableOpacity
          style={[styles.compareButton, { backgroundColor: 'black' }]}
          onPress={() => router.push('/stock-search')}
        >
          <Ionicons name="git-compare" size={24} color="white" />
          <ThemedText style={styles.compareButtonText}>
            Comparer des Actions
          </ThemedText>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(800).delay(1000)}>
        <StockComparison />
      </Animated.View>
      <Animated.View entering={FadeInUp.duration(800).delay(1200)}>
        <StockAnalysisChart />
      </Animated.View>
      
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerImage: {
    height: '140%',
    width: '100%',
    position: 'absolute',
    left: '0%',
    right: '0%',
    top: '5%',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoMRKT: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  logoNews: {
    fontSize: 38,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  descriptionContainer: {
    padding: 12,
    backgroundColor: 'rgba(60, 60, 62, 0.3)',
    borderRadius: 16,
    marginVertical: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginVertical: 12,
    gap: 10,
  },
  compareButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
