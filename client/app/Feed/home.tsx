import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { supabase } from '@/supabaseClient';
import { BlurView } from 'expo-blur';
import PostItem from '../Components/posts';
import BottomNav from '../Components/BottomNav';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ppImage, setPPImage] = useState<string | null>(null);
  const router = useRouter();

  const handleProfileNavigation = () => {
    router.push('/Profile/profilePage');
  };

  const auth = AsyncStorage.getItem("authToken");

  const fetchPP = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken'); // Get the user's auth token
      if (!authToken) throw new Error('User not authenticated.');

      const { data, error } = await supabase
        .from('profiles')
        .select('profile_image')
        .eq('user_id', authToken)
        .single();

      if (error) throw error;

      setPPImage(data?.profile_image || defaultProfileImageUrl);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setPPImage(defaultProfileImageUrl); // Fallback to default image on error
    }
  };

  const defaultProfileImageUrl = 'https://xwfgazxfjsoznyemwxeb.supabase.co/storage/v1/object/public/startups/st_a.png';

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithDetails = await Promise.all(data.map(async (post: any) => {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('profile_image')
          .eq('user_id', post.user_id)
          .single();

        if (profileError) {
          post.profile_image = defaultProfileImageUrl;
        } else {
          post.profile_image = profileData?.profile_image || defaultProfileImageUrl;
        }

        // Fetch the likes count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);

        post.likes = likesCount || 0;

        // Fetch the comments count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);

        post.comments = commentsCount || 0;

        return post;
      }));

      setPosts(postsWithDetails);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleLikeChange = (postId: number, newLikes: number) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, likes: newLikes } : post));
  };

  const handleCommentChange = (postId: number, newComments: number) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, comments: newComments } : post));
  };

  useEffect(() => {
    fetchPosts();
    fetchPP();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Posts...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <BlurView intensity={50} tint="light" style={styles.topNavBar}>
        <Text style={styles.header}>Home</Text>
        <View style={styles.topOps}>
          <TouchableOpacity style={styles.chatIcon} onPress={() => router.push('/chat_list/cl')}>
            <Ionicons name="chatbubble" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfileNavigation}>
          <Image source={{ uri: ppImage || defaultProfileImageUrl }} style={styles.profileIcon} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView contentContainerStyle={styles.feedContainer}>
        {posts.length === 0 ? (
          <Text>No posts available</Text>
        ) : (
          posts.map((post: any) => (
            <React.Fragment key={post.id}>
              <PostItem
                postId={post.id}
                profileImage={post.profile_image}
                userName={post.username || 'Anonymous'}
                content={post.content}
                postImage={post.image_url}
                createdAt={post.created_at}
                likes={post.likes || 0}
                comments={post.comments || 0}
                onLikeChange={handleLikeChange}
                onCommentChange={handleCommentChange}
              />
              <Divider />
            </React.Fragment>
          ))
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: 'black',
  },
  profileIcon: {
    height: 34,
    width: 34,
    borderRadius: 100,
  },
  topNavBar: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingVertical: 20,
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  topOps: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  chatIcon: {
    padding: 6,
    backgroundColor: "#13375F",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100
  },
  feedContainer: {
    padding: 15,
    paddingTop: 120,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedPage;
