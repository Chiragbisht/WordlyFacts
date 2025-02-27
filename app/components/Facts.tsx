import React from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator
} from 'react-native';
import { FactWithCategory } from '../services/geminiService';

interface FactsProps {
  facts: FactWithCategory[];
  isLoading: boolean;
}

// Enhanced distinct colors for each category
const categoryStyles: Record<string, {bg: string, textColor: string}> = {
  Science: { bg: '#e3f2fd', textColor: '#0d47a1' },    // Blue
  Tech: { bg: '#e0f7fa', textColor: '#006064' },       // Cyan
  History: { bg: '#fff8e1', textColor: '#ff6f00' },    // Yellow/Amber
  Economics: { bg: '#f3e5f5', textColor: '#6a1b9a' },  // Purple
  Medicine: { bg: '#e8f5e9', textColor: '#1b5e20' },   // Green
  General: { bg: '#f5f5f5', textColor: '#424242' },    // Grey
  Info: { bg: '#fff3e0', textColor: '#e65100' },       // Orange
  Error: { bg: '#ffebee', textColor: '#c62828' }       // Red
};

const Facts: React.FC<FactsProps> = ({ facts, isLoading }) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6fd8" />
        <Text style={styles.loadingText}>Loading facts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {facts.length === 0 ? (
        <Text style={styles.loadingText}>No facts available</Text>
      ) : (
        facts.map((fact, index) => {
          const style = categoryStyles[fact.category] || categoryStyles.General;
          
          return (
            <View 
              key={`fact-${index}`} 
              style={[
                styles.factContainer, 
                { backgroundColor: style.bg }
              ]}
            >
              {/* Fact text with reduced bottom margin */}
              <Text style={styles.factText}>{fact.text}</Text>
              
              {/* Footer without separator line and reduced top spacing */}
              <View style={styles.factFooter}>
                <View style={styles.rightSection}>
                  <Text style={[
                    styles.categoryText, 
                    { color: style.textColor }
                  ]}>
                    {fact.category}
                  </Text>
                  {fact.isIndian && <Text style={styles.indianFlag}>🇮🇳</Text>}
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  factContainer: {
    borderRadius: 12,
    padding: 18,
    paddingBottom: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  factText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 4, // Reduced margin between text and footer
  },
  factFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // Removed borderTopWidth
    // Removed paddingTop
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10, // Made slightly smaller
    fontWeight: '500',
    marginRight: 4,
    opacity: 0.7, // Made slightly more subtle
  },
  indianFlag: {
    fontSize: 11, // Made slightly smaller
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  }
});

export default Facts;
