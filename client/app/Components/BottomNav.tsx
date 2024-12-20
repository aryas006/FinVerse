import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BottomNav = () => {
  return (
    <View style={styles.bottomNav}>
      <MaterialCommunityIcons name="home" size={24} color="black" />
      <MaterialCommunityIcons name="leaf" size={24} color="black" />
      <MaterialCommunityIcons name="plus-box" size={24} color="black" />
      <MaterialCommunityIcons name="magnify" size={24} color="black" />
      <MaterialCommunityIcons name="account" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    paddingHorizontal: 20,
    bottom: 0,
    
   
  },
});

export default BottomNav;