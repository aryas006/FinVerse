import React from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';

interface NavItemProps {
  name: string;
  screen: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem = ({ name, screen, icon, isActive, onPress }: NavItemProps) => {
  // Animation value for scaling effect
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  // Animation for the label opacity
  const labelOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isActive ? 1.2 : 1,
        useNativeDriver: true,
        friction: 7,
      }),
      Animated.timing(labelOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      const feedback = require('expo-haptics');
      feedback.impactAsync(feedback.ImpactFeedbackStyle.Light);
    }

    // Trigger press animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: isActive ? 1.2 : 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityLabel={name}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      style={styles.navItem}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={30}
          color={isActive ? '#6200ee' : '#757575'}
        />
      </Animated.View>
      <Animated.Text
        style={[
          styles.label,
          {
            opacity: labelOpacity,
            color: isActive ? '#6200ee' : '#757575',
          },
        ]}
      >
        {name}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const BottomNav = () => {
  const router = useRouter();
  const segments: string[] = useSegments();
  const insets = useSafeAreaInsets();

  const handleNavigate = (screen: string) => {
    router.push(screen as any);
  };

  const navItems = [
    { name: 'Home', screen: '/Feed/home', icon: 'home' },
    { name: 'Funding', screen: '/fundingHub', icon: 'cash' },
    { name: 'Create', screen: '/Components/postCreator', icon: 'plus-circle' },
    { name: 'Discover', screen: '/(tabs)/discover', icon: 'compass' },
    { name: 'Search', screen: '/search', icon: 'magnify' },
  ];

  return (
    <View style={[styles.bottomNav]}>
      {navItems.map((item) => (
        <NavItem
          key={item.screen}
          {...item}
          isActive={segments.includes(item.screen)}
          onPress={() => handleNavigate(item.screen)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: 16,

    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});

export default BottomNav;