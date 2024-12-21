import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { supabase } from '@/supabaseClient';
import { BlurView } from 'expo-blur'; // Import BlurView
import PostItem from '../Components/posts';
import BottomNav from '../Components/BottomNav';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { useRouter } from 'expo-router';

const FeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleProfileNavigation = () => {
    router.push('/Profile/profilePage'); // Replace '/profile' with your actual profile page route
  };

  const defaultProfileImageUrl = 'https://xwfgazxfjsoznyemwxeb.supabase.co/storage/v1/object/public/startups/st_a.png';

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile image for each post based on user_id
      const postsWithImages = await Promise.all(data.map(async (post: any) => {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('profile_image')
          .eq('user_id', post.user_id)
          .single();

        if (profileError) {
         
          post.profile_image = defaultProfileImageUrl; // Default to anonymous image
        } else {
          post.profile_image = profileData?.profile_image || defaultProfileImageUrl;
        }

        return post;
      }));

      setPosts(postsWithImages);
      setLoading(false);
    } catch (error) {
     
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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
        
        <TouchableOpacity onPress={handleProfileNavigation}>
        <Image
          source={require('../../assets/images/pp.jpg')}
          style={styles.profileIcon}
        />
       </TouchableOpacity>
      </BlurView>
      <ScrollView contentContainerStyle={styles.feedContainer}>
        {posts.length === 0 ? (
          <Text>No posts available</Text>
        ) : (
          posts.map((post: any) => (
            <React.Fragment key={post.id}>
              <PostItem
                profileImage={post.profile_image} // Use the fetched profile image URL
                userName={post.username || 'Anonymous'} // Default to 'Anonymous' if no username
                content={post.content}
                postImage={post.image_url}
                createdAt={post.created_at}
                likes={post.likes || 0}
                comments={post.comments || 0}
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
    position: "absolute", // Use absolute positioning
    top: 0,
    zIndex: 1, // Ensure it stays above other content
  },
  feedContainer: {
    padding: 15,
    paddingTop: 120, // Add padding to prevent overlap with the navbar
    paddingBottom: 100, // Add padding to prevent overlap with the bottom nav
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedPage;
