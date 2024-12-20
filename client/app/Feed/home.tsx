import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import BottomNav from '../Components/BottomNav'
const home = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Home</Text>
      </View>

      <View style={styles.bNav}>
      <BottomNav/>
      </View>
      
    </View>
  )
}

export default home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  title : {
    fontSize : 30,
    paddingLeft : 20,
  },
  bNav : {
    position: 'absolute', // Use absolute positioning
    bottom: 0,
    left: 0,
    right: 0,
    
   
  }
})