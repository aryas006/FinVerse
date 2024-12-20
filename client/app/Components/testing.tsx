import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const MyComponent = () => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartPress = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  return (
    <View style={styles.container}>
      <Icon name="comment-text-outline" type="material-community" color="gray" size={24} />
      <Icon name={isHeartFilled ? 'heart' : 'heart-outline'} type="material-community" color={isHeartFilled ? 'red' : 'gray'} size={24} onPress={handleHeartPress} />
      <Icon name="share-variant" type="material-community" color="gray" size={24} />
      <Icon name="upload" type="material-community" color="gray" size={24} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
});

export default MyComponent;