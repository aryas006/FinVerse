import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageUploader from '../Components/ImageUploader'; // Import the ImageUploader component
import { supabase } from '@/supabaseClient'; // your client
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState<string>(''); // User ID will be fetched based on the authToken
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigation = useNavigation(); // Initialize navigation

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        setUserId(authToken); // Save user ID
      }
    } catch (error) {
      console.error('Error fetching authToken:', error);
      Alert.alert('Error', 'Failed to retrieve authToken.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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

  const postToSupabase = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Content cannot be empty!');
      return;
    }

    const { error } = await supabase.from('posts').insert([
      { user_id: userId, content, image_url: imageUrl },
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
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.title}>Create Post</Text>

        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          multiline
          value={content}
          onChangeText={setContent}
        />

        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        {imageUri && (
          <>
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <ImageUploader
              type="posts"
              imageUri={imageUri}
              onUpload={(url) => setImageUrl(url)}
            />
          </>
        )}

        <TouchableOpacity onPress={postToSupabase} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    marginRight: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 8,

    justifyContent: 'center', 
    alignItems: 'center', 
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  postButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreatePost;
