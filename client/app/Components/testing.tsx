import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { supabase } from '@/supabaseClient'; // Import your Supabase client

const ImageUploader: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Function to pick or capture an image
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      Alert.alert('Action Cancelled', 'No image was selected.');
    } else if (result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    } else {
      Alert.alert('Error', 'Unable to select an image.');
    }
  };

  const captureImage = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      Alert.alert('Action Cancelled', 'No image was captured.');
    } else if (result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    } else {
      Alert.alert('Error', 'Unable to capture an image.');
    }
  };

  // Function to upload the image to Supabase storage
  const uploadImageToSupabase = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please select or capture an image first.');
      return;
    }

    try {
      // Convert the image URI to a blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Define a unique filename
      const fileName = `images/${Date.now()}.jpg`;

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('your_bucket_name') // Replace with your bucket name
        .upload(fileName, blob, { contentType: 'image/jpeg' });

      if (error) {
        throw error;
      }

      Alert.alert('Success', `Image uploaded successfully: ${data?.path}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="Pick Image" onPress={pickImage} />
        <Button title="Capture Image" onPress={captureImage} />
      </View>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Upload to Supabase" onPress={uploadImageToSupabase} />
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
  buttons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 16,
  },
});

export default ImageUploader;
