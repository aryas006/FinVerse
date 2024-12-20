import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { supabase } from '@/supabaseClient';
import PostItem from '../Components/posts';

const FeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
    <ScrollView contentContainerStyle={styles.feedContainer}>
      {posts.length === 0 ? (
        <Text>No posts available</Text>
      ) : (
        posts.map((post: any) => (
          <PostItem
            key={post.id}
            profileImage={post.profile_image}
            userName={post.user_id}
            content={post.content}
            postImage={post.image_url}
            createdAt={post.created_at}
            likes={post.likes || 0}
            comments={post.comments || 0}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedPage;
