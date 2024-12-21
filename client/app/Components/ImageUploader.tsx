import React, { useState, useEffect } from 'react';
import { View, Image, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/supabaseClient';

type ImageUploaderProps = {
  type: 'profile-pic' | 'posts'; // Type of image to upload
  imageUri: string | null; // URI of the image to upload
  onUpload: (url: string) => void; // Callback to return the uploaded image URL
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ type, imageUri, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (imageUri) {
      uploadImageToSupabase();
    }
  }, [imageUri]); // Trigger upload whenever imageUri changes

  const uploadImageToSupabase = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    setIsUploading(true); // Show loader during upload
    try {
      // Convert image to Base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

      const fileName = `${type}/${Date.now()}.${imageUri.split('.').pop()}`; // Use the original file extension
      const contentType = 'image/jpeg'; // We assume image/jpeg for simplicity, adjust if necessary

      // Upload to Supabase storage using decode(base64)
      const { data, error } = await supabase.storage
        .from(type === 'profile-pic' ? 'profile-pics' : 'posts')
        .upload(fileName, decode(base64), {
          contentType: contentType,
        });

      if (error) {
        throw error;
      }

      // Fetch the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from(type === 'profile-pic' ? 'profile-pics' : 'posts')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        onUpload(publicUrlData.publicUrl); // Return the public URL via callback
      } else {
        throw new Error('Failed to fetch public URL.');
      }
    } catch (error: any) {
      Alert.alert('Upload Error', error.message);
    } finally {
      setIsUploading(false); // Hide loader after upload
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {isUploading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 16,
  },
  loader: {
    marginVertical: 16,
  },
  placeholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
});

export default ImageUploader;
