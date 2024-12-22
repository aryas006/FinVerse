import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PostItem from '@/app/Components/posts';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Holds user data
  const [posts, setPosts] = useState<any[]>([]); // Holds user's posts
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const { id } = useLocalSearchParams(); // Use useLocalSearchParams for query params
  const router = useRouter();

  const handleEditNav = () => {
    router.push('/Profile/profileSetup'); // Replace with your actual profile setup page route
  };

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, bio, created_at, projects, profile_image')
        .eq('user_id', id)
        .single();

      if (error) throw error;

      // Parse the projects JSON string into a JavaScript array
      const projects = data.projects ? JSON.parse(data.projects) : [];
      setUser({ ...data, projects }); // Update user state with parsed projects
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', id)
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
  }, [id]);

  const handleFollow = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('authToken');
      if (!currentUserId) throw new Error('User not authenticated.');

      const { data, error } = await supabase
        .from('profiles')
        .select('followers')
        .eq('user_id', id)
        .single();

      if (error) throw error;

      const updatedFollowers = data.followers || [];
      if (updatedFollowers.includes(currentUserId)) {
        Alert.alert('Info', 'You are already following this user.');
        return;
      }

      updatedFollowers.push(currentUserId);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ followers: updatedFollowers })
        .eq('user_id', id);

      if (updateError) throw updateError;

      Alert.alert('Success', 'You are now following this user!');
    } catch (error) {
      console.error('Error following user:', error);
      Alert.alert('Error', 'Unable to follow user. Please try again.');
    }
  };

  const handleMessage = () => {
    router.push(`/chat/${id}`); // Push to chat page with the profile ID
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading User Profile...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Sticky Back Button */}
      <TouchableOpacity
        style={styles.stickyBackButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Profile Details */}
      <ScrollView style={styles.container}>
        <Image
          source={require('../../../assets/images/backGround.png')}
          style={styles.backgroundImage}
        />
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: user?.profile_image || 'https://via.placeholder.com/150',
              }}
              style={styles.profileImage}
            />
          </View>
          <TouchableOpacity onPress={handleFollow} style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Follow</Text>
            </TouchableOpacity>
          {/* <TouchableOpacity onPress={handleEditNav} style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Edit</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.userInfo}>
          {user?.full_name && <Text style={styles.name}>{user.full_name}</Text>}
          {user?.created_at && (
            <Text style={styles.joined}>Joined {new Date(user.created_at).toDateString()}</Text>
          )}
          {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        {/* Projects Section */}
        <View style={styles.projects}>
          <Text style={styles.projectsTitle}>Projects</Text>
          {user?.projects && user.projects.length > 0 ? (
            user.projects.map((project: any, index: number) => (
              <View key={index} style={styles.projectContainer}>
                {project.image && (
                  <Image
                    source={{ uri: project.image }}
                    style={styles.projectImage}
                  />
                )}
                <View style={styles.projectInfo}>
                  {project.title && (
                    <Text style={styles.projectName}>{project.title}</Text>
                  )}
                  {project.description && (
                    <Text style={styles.projectDescription}>
                      {project.description}
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text>No projects available.</Text>
          )}
        </View>

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <Text style={styles.postsTitle}>Your Posts</Text>
          {postsLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : posts.length > 0 ? (
            posts.map((post: any) => (
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
            ))
          ) : (
            <Text>No posts available.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    height: 220,
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
    backgroundColor: 'rgb(0, 72, 113)',
    padding: 10,
    borderRadius: 35,
    marginTop: 50,
  },
  connectButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  projects: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  projectsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  projectImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 4,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: 'gray',
  },
  postsSection: {
    marginVertical: 20,
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
  stickyBackButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    paddingVertical: 12,
    paddingTop: 52,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default UserProfile;
