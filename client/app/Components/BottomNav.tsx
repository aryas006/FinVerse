import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();

  const handleNavigate = (screen : any) => {
    router.push(screen);
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => handleNavigate('/Feed/home')}> 
        <MaterialCommunityIcons name="home" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate('/(tabs)/discover')}> 
        <MaterialCommunityIcons name="leaf" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate('/Components/postCreator')}> 
        <MaterialCommunityIcons name="plus-box" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate('/search')}> 
        <MaterialCommunityIcons name="magnify" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate('/Profile/profilePage')}> 
        <MaterialCommunityIcons name="account" size={24} color="black" />
      </TouchableOpacity>
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
    bottom: 0,
  },
});

export default BottomNav;