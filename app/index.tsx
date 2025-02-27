import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  Platform, StatusBar, Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Facts from './components/Facts';
import FloatingButton from './components/FloatingButton';
import { getFactsForToday, FactWithCategory } from './services/geminiService';

export default function App() {
  const [facts, setFacts] = useState<FactWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  useEffect(() => {
    loadFacts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }, []);

  const loadFacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const todaysFacts = await getFactsForToday();
      setFacts(todaysFacts);
    } catch (err) {
      setError('Failed to fetch facts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const todaysFacts = await getFactsForToday();
      setFacts(todaysFacts);
    } catch (err) {
      setError('Failed to refresh facts. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor="#4a6fd8" barStyle="light-content" />
      
      <LinearGradient
        colors={['#4a6fd8', '#334daa']}
        style={styles.header}
      >
        <Text style={styles.title}>Wordly Facts</Text>
        <Text style={styles.dateText}>On This Day • {formattedDate}</Text>
      </LinearGradient>
      
      <View style={styles.spacer} />
      
      <Animated.View 
        style={[styles.contentContainer, { opacity: fadeAnim }]}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <Facts facts={facts} isLoading={isLoading || refreshing} />
          )}
        </ScrollView>
      </Animated.View>
      
      <FloatingButton 
        onPress={handleRefresh}
        isRefreshing={refreshing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dateText: {
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
  },
  spacer: {
    height: 15,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  errorText: {
    color: '#e53935',
    textAlign: 'center',
    fontSize: 16,
  },
});
