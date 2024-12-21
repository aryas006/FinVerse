import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { Icon } from 'react-native-elements';

type PostItemProps = {
  profileImage: string;
  userName: string;
  content: string;
  postImage: string | null;
  createdAt: string;
  likes: number;
  comments: number;
};

const PostItem: React.FC<PostItemProps> = ({
  profileImage,
  userName,
  content,
  postImage,
  createdAt,
  likes,
  comments,
}) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleHeartPress = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleCommentPress = () => {
    setIsModalVisible(true);
  };

  const handleCommentSubmit = () => {
    console.log('Submitted Comment:', commentText);
    setCommentText('');
    setIsModalVisible(false);
  };

  const handleCommentCancel = () => {
    setCommentText('');
    setIsModalVisible(false);
  };

  return (

    <View style={styles.postContainer}>
      <Link href={{
        pathname: '/(tabs)/post/[id]',
        params: {
          id: '1',
          profileImage: profileImage,
          userName: userName,
          content: content,
          postImage: postImage,
          createdAt: createdAt,
          likes: likes,
          comments: comments,
        },
      }}>
        <View style={styles.header}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {userName || 'Anonymous'}{' '}
              <Text style={styles.timeAgo}>· {new Date(createdAt).toLocaleDateString()}</Text>
            </Text>
          </View>
        </View>
      </Link>

      <Text style={styles.content}>{content}</Text>
      {postImage && <Image source={{ uri: postImage }} style={styles.postImage} />}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCommentPress}>
          <Icon name="comment-outline" type="material-community" color="#657786" size={20} />
          <Text style={styles.iconText}>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleHeartPress}>
          <Icon
            name={isHeartFilled ? 'heart' : 'heart-outline'}
            type="material-community"
            color={isHeartFilled ? '#E0245E' : '#657786'}
            size={20}
          />
          <Text style={styles.iconText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share-variant-outline" type="material-community" color="#657786" size={20} />
        </TouchableOpacity>
      </View>

      {/* Comment Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCommentCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={handleCommentCancel} color="#657786" />
              <Button title="Submit" onPress={handleCommentSubmit} color="#1DA1F2" />
            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    padding: 15,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#14171A',
  },
  timeAgo: {
    fontSize: 12,
    color: '#657786',
  },
  content: {
    fontSize: 15,
    color: '#14171A',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    marginBottom: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  iconText: {
    fontSize: 13,
    color: '#657786',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    width: '100%',
    bottom: 0,

  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: '#e1e8ed',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default PostItem;
