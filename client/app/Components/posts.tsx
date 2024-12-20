import React,{useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const PostItem = () => {
   const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartPress = () => {
    setIsHeartFilled(!isHeartFilled);
  };  

  return (
    <View style={styles.postContainer}>
      {/* Header - Profile Image and User Info */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/prof.png')}  // Static profile image
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.timeAgo}>2 hours ago</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.content}>
        This is a sample post! It can contain text, links, or images.
      </Text>
      <Image
        source={require('../../assets/images/post.png')} // Static content image
        style={styles.postImage}
      />

      {/* Footer - Engagement Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="comment-text-outline" type="material-community" color="gray" size={24} />
          <Text style={styles.iconText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleHeartPress}>
          <Icon name={isHeartFilled ? 'heart' : 'heart-outline'} type="material-community" color={isHeartFilled ? 'red' : 'gray'} size={24} />
          <Text style={styles.iconText}>23</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share-variant" type="material-community" color="gray" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="upload" type="material-community" color="gray" size={24} />
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    marginTop : 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Adds shadow for Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular profile image
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
  },
});

export default PostItem;
