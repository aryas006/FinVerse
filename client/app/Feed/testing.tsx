import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageUploader from '../Components/ImageUploader'; // Import the ImageUploader component
import { supabase } from '@/supabaseClient'; // your client
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState<string>(''); // User ID will be fetched based on the authToken
  const [username, setUsername] = useState<string>(''); // Store username
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Function to fetch the username from profiles based on authToken
  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        // Fetch user details from profiles table based on the authToken
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', authToken)
          .single(); // Ensure you get only one result

        if (error) {
          console.error('Error fetching user data:', error.message);
          Alert.alert('Error', 'Failed to fetch user data.');
        } else {
          setUserId(authToken); // Set the userId (UUID) from authToken
          setUsername(data?.username || 'Anonymous'); // Set the username
        }
      }
    } catch (error) {
      console.error('Error fetching authToken:', error);
      Alert.alert('Error', 'Failed to retrieve authToken.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access the gallery is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to post the content and image URL to Supabase
  const postToSupabase = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Content cannot be empty!');
      return;
    }

    // Insert the post into the 'posts' table with username and authToken (userId)
    const { error } = await supabase
      .from('posts')
      .insert([
        { user_id: userId, username: username, content, image_url: imageUrl }
      ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Post created successfully!');
      setContent('');
      setImageUri(null);
      setImageUrl(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        multiline
        value={content}
        onChangeText={setContent}
      />

      {/* The username is now dynamically set */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username || 'Loading...'}
        editable={false} // Username is fetched and displayed but not editable
      />

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Button title="Pick an Image" onPress={pickImage} />
      </TouchableOpacity>

      {imageUri && (
        <ImageUploader
          type="posts"
          imageUri={imageUri}
          onUpload={(url) => setImageUrl(url)} // Get the image URL after upload
        />
      )}

      <Button title="Post" onPress={postToSupabase} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  button: {
    marginBottom: 16,
  },
});

export default CreatePost;
