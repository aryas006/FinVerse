import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageUploader from './ImageUploader'; // Import the ImageUploader component
import { supabase } from '@/supabaseClient'; // your client

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(''); // User ID, empty = anonymous
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

    const user = userId || 'anonymous'; // Default to anonymous if no user ID

    // Insert the post into the 'posts' table
    const { error } = await supabase
      .from('posts')
      .insert([
        { user_id: user, content, image_url: imageUrl }
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

      <TextInput
        style={styles.input}
        placeholder="User ID (Optional)"
        value={userId}
        onChangeText={setUserId}
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
