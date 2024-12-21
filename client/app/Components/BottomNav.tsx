import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();
  const segments = useSegments();

  const handleNavigate = (screen: string) => {
    router.push(screen as any);
  };

  const NavItem = ({ name, screen, icon }: { name: string; screen: string; icon: string }) => {
    const isActive = segments[0] === screen.split('/')[1];

    return (
      <TouchableOpacity
        onPress={() => handleNavigate(screen)}
        accessibilityLabel={name}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name={icon as any} size={28} color={isActive ? '#6200ee' : 'black'} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bottomNav}>
      <NavItem name="Home" screen="/Feed/home" icon="home" />
      <NavItem name="Funding Hub" screen="/fundingHub" icon="cash" />
      <NavItem name="Discover" screen="/(tabs)/discover" icon="leaf" />
      <NavItem name="Create Post" screen="/Components/postCreator" icon="plus-box" />
      <NavItem name="Search" screen="/search" icon="magnify" />
      <NavItem name="Profile" screen="/Profile/profilePage" icon="account" />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 80,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default BottomNav;
