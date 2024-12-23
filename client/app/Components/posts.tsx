import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Share,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { supabase } from '@/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PostItemProps = {
  postId: number;
  profileImage: string;
  userName: string;
  content: string;
  postImage: string | null;
  createdAt: string;
  likes: number;
  comments: number;
  onLikeChange: (postId: number, newLikes: number) => void; // Callback to update likes dynamically
  onCommentChange: (postId: number, newComments: number) => void; // Callback to update comments dynamically
};

const PostItem: React.FC<PostItemProps> = ({
  postId,
  profileImage,
  userName,
  content,
  postImage,
  createdAt,
  likes,
  comments,
  onLikeChange,
  onCommentChange,


}) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Check if the post is liked by the user when the component mounts
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (user) {
          const userId = user.id;

          const { data: likeData, error } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', userId);

          if (error) {
            console.error('Error checking like status:', error);
            return;
          }

          setIsHeartFilled(likeData.length > 0);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkIfLiked();
  }, [postId]);

  const handleHeartPress = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (user) {
        const userId = user.id;

        const { data: likeData, error } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error checking like status:', error);
          return;
        }

        if (likeData.length === 0) {
          const { error: insertError } = await supabase
            .from('likes')
            .insert([{ post_id: postId, user_id: userId }]);

          if (insertError) {
            console.error('Error inserting like:', insertError);
            return;
          }

          const newLikesCount = likes + 1;
          const { error: updateError } = await supabase
            .from('posts')
            .update({ likes: newLikesCount })
            .eq('id', postId);

          if (updateError) {
            console.error('Error updating like count:', updateError);
            return;
          }

          onLikeChange(postId, newLikesCount);
          setIsHeartFilled(true);
        } else if (likeData.length === 1) {
          const { error: deleteError } = await supabase
            .from('likes')
            .delete()
            .match({ id: likeData[0].id });

          if (deleteError) {
            console.error('Error deleting like:', deleteError);
            return;
          }

          const newLikesCount = Math.max(likes - 1, 0);
          const { error: updateError } = await supabase
            .from('posts')
            .update({ likes: newLikesCount })
            .eq('id', postId);

          if (updateError) {
            console.error('Error updating like count:', updateError);
            return;
          }

          onLikeChange(postId, newLikesCount);
          setIsHeartFilled(false);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleCommentPress = () => {
    setIsModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        const { error } = await supabase.from('comments').insert([
          {
            post_id: postId,
            user_id: authToken,
            content: commentText,
          },
        ]);

        if (error) {
          console.error('Error submitting comment:', error);
          return;
        }

        // Fetch updated comments count
        const { data: commentsData, error: fetchError } = await supabase
          .from('comments')
          .select('id', { count: 'exact' })
          .eq('post_id', postId);

        if (fetchError) {
          console.error('Error fetching comments count:', fetchError);
          return;
        }

        const newCommentsCount = commentsData?.length || 0;

        // Update the comments count in the posts table
        const { error: updateError } = await supabase
          .from('posts')
          .update({ comments: newCommentsCount })
          .eq('id', postId);

        if (updateError) {
          console.error('Error updating comments count:', updateError);
          return;
        }

        // Update UI
        onCommentChange(postId, newCommentsCount);
        setCommentText('');
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Error handling comment submission:', error);
    }
  };

  const handleCommentCancel = () => {
    setCommentText('');
    setIsModalVisible(false);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this post on FinVerse!',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      // console.error('Error sharing:', error.message);
    }
  };



  return (
    <View style={styles.postContainer}>
      <Link
        href={{
          pathname: '/(tabs)/post/[id]',
          params: {
            id: postId,
            profileImage: profileImage,
            userName: userName,
            content: content,
            postImage: postImage,
            createdAt: createdAt,
            likes: likes,
            comments: comments,
          },
        }}
      >
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
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
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
    </View >
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
    marginBottom: 20,
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
    marginTop: 12,
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
