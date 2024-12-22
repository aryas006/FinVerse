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
  const [username, setUsername] = useState<string>(''); // Store username
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigation = useNavigation(); // Initialize navigation

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', authToken)
          .single();
        if (error) {
          console.error('Error fetching user data:', error.message);
          Alert.alert('Error', 'Failed to fetch user data.');
        } else {
          setUserId(authToken);
          setUsername(data?.username || 'Anonymous');
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
      { user_id: userId, username: username, content, image_url: imageUrl },
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>What's on your mind?</Text>
        <TextInput
          style={styles.input}
          placeholder="Write something..."
          multiline
          value={content}
          onChangeText={setContent}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          placeholder="Loading..."
          value={username || 'Loading...'}
          editable={false}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
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
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
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
