import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'expo-router';
import PostItem from '../Components/posts';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Holds user data
  const [posts, setPosts] = useState<any[]>([]); // Holds user's posts
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const router = useRouter();

  const handleEditNav = () => {
    router.push('/Profile/profileSetup'); // Replace with your actual profile setup page route
  };

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken'); // Retrieve authToken from AsyncStorage
      if (!authToken) throw new Error('User not authenticated.');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, bio, created_at, projects, profile_image')
        .eq('user_id', authToken)
        .single();

      if (error) throw error;

      const projects = data.projects ? JSON.parse(data.projects) : [];
      setUser({ ...data, projects }); // Update user state
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const fetchUserPosts = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken'); // Retrieve authToken
      if (!authToken) throw new Error('User not authenticated.');

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', authToken)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setPostsLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading User Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('../../assets/images/backGround.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: user?.profile_image || 'https://xwfgazxfjsoznyemwxeb.supabase.co/storage/v1/object/public/startups/st_a.png',
            }}
            style={styles.profileImage}
          />
        </View>
        <TouchableOpacity onPress={handleEditNav} style={styles.connectButton}>
          <Text style={styles.connectButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        {user?.full_name && <Text style={styles.name}>{user.full_name}</Text>}
        {user?.created_at && <Text style={styles.joined}>Joined {user.created_at}</Text>}
        {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
      </View>

      <View style={styles.postsSection}>
        <Text style={styles.postsTitle}>Your Posts</Text>
        {postsLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : posts.length > 0 ? (
<ScrollView>
  {posts.map((post: any) => (
    <PostItem
      key={post.id}
      postId={post.id}
      profileImage={user?.profile_image}
      userName={user?.username || 'Anonymous'}
      content={post.content}
      postImage={post.image_url}
      createdAt={post.created_at}
      likes={post.likes || 0}
      comments={post.comments || 0}
      onLikeChange={() => {}} // No-op function
      onCommentChange={() => {}} // No-op function
    />
  ))}
</ScrollView>

        ) : (
          <Text>No posts available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    height: '25%',
    width: '100%',
    resizeMode: 'cover',
  },
  header: {
    marginTop: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImageContainer: {
    marginLeft: 20,
    width: 130,
    height: 130,
    borderRadius: 14,
    borderWidth: 5,
    borderColor: 'white',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    marginTop: 15,
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  joined: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
  },
  connectButton: {
    marginRight: 20,
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 35,
    marginTop: 50,
  },
  connectButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  postsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
