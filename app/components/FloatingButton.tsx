import React from 'react';
import { 
  TouchableOpacity, StyleSheet, ActivityIndicator, 
  Animated, Easing 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingButtonProps {
  onPress: () => void;
  isRefreshing?: boolean;
  icon?: string;
  color?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  isRefreshing = false,
  icon = 'refresh-outline',
  color = '#ffffff'
}) => {
  // Animation for rotation
  const spinValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isRefreshing]);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isRefreshing && styles.refreshing
      ]} 
      onPress={onPress}
      disabled={isRefreshing}
    >
      {isRefreshing ? (
        <ActivityIndicator color={color} size="small" />
      ) : (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name={icon as any} size={24} color={color} />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4a6fd8',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: 'rgba(74, 111, 216, 0.7)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  refreshing: {
    backgroundColor: '#3a59b7'
  }
});

export default FloatingButton;
