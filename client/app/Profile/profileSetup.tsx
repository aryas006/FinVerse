import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, Animated } from 'react-native'; // Added Picker
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY, STORAGE_URL } from '@/supabaseClient'; // Make sure this is the correct path
import { useRouter } from 'expo-router';

const router = useRouter();

const ProfileSetup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null); // Store role_id
  const [roles, setRoles] = useState<{ id: number, name: string }[]>([]); // Store list of roles
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [publicImageUrl, setPublicImageUrl] = useState<string>('');
  const scaleAnim = useRef(new Animated.Value(0)).current;
 

  // Fetch roles from the roles table
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from('roles').select('*');
      if (error) {
        throw new Error('Error fetching roles');
      }
      setRoles(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Fetch auth ID and user email using AsyncStorage and Supabase Auth
  const fetchUserData = async () => {
    try {
      const authId = await AsyncStorage.getItem('authToken');
      if (authId) {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          throw new Error('Error fetching user data from Supabase');
        }
        if (data?.user) {
          setContactEmail(data.user.email || '');
        }
      } else {
        throw new Error('Auth ID not found in AsyncStorage');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchRoles(); // Fetch roles on mount
    fetchUserData(); // Fetch user data on mount
  }, []);

 
  const uploadImage = async (): Promise<string | null> => {
    if (!profileImage) {
      alert('Please select an image first!');
      return null;
    }
  
    try {
      setUploading(true);
  
      // Fetch the image file from the local URI
      const response = await fetch(profileImage);
      const blob = await response.blob();
  
      // Generate a unique file name for the image
      const fileName = `${Date.now()}_profile_image.jpg`;
      console.log(fileName);
  
      // The correct Supabase storage URL for uploading the image to the 'profile-images' bucket
      const uploadUrl = `https://xwfgazxfjsoznyemwxeb.supabase.co/storage/v1/object/profile-images/public/${fileName}`;
  
      // Perform the upload request
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`, // Ensure the correct API key
          'Content-Type': 'image/jpeg', // Set the content type of the uploaded image
        },
        body: blob,
      });
  
      // Check if the upload was successful
      if (uploadResponse.ok) {
        setUploadStatus('Image uploaded successfully!');
  
        // Construct the public URL for the uploaded image
        const publicUrl = `https://xwfgazxfjsoznyemwxeb.supabase.co/storage/v1/object/public/profile-images/${fileName}`;
        console.log('Public URL:', publicUrl);
        return publicUrl;
      } else {
        setUploadStatus('Failed to upload image');
        console.error('Upload error', uploadResponse.status);
        return null;
      }
    } catch (error) {
      setUploadStatus('Network error during upload');
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  
  
  const handleProfileSubmit = async () => {
    if (!name || !contactEmail || !roleId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      // Upload the image and get the public URL
      const uploadedImageUrl = await uploadImage();
  
      if (!uploadedImageUrl) {
        Alert.alert('Error', 'Image upload failed. Please try again.');
        return;
      }
  
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw new Error('User not authenticated');
      }
  
      const user = data?.user;
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      // Insert or update the user profile details in the 'users' table
      const { error: dbError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name,
          contact_email: contactEmail,
          role_id: roleId,
          profile_image: uploadedImageUrl, // Use the returned public URL
        });
  
      if (dbError) throw dbError;
  
      Alert.alert('Profile Setup Successful');
      router.push('/home'); // Navigate to the home screen after profile setup
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };
  
  
  

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log(result.assets[0].uri);
      setProfileImage(result.assets[0].uri); // Store the image URI
    } else {
      Alert.alert('Error', 'Image selection was canceled');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Email"
        value={contactEmail}
        onChangeText={setContactEmail}
        editable={false} // Prevent manual editing since email is fetched from Supabase
      />
      
      {/* Profile Image */}
      <Button title="Pick a Profile Image" onPress={handleImagePick} />
    

      {/* Role Selection (Dropdown) */}
      <Text>Select Role:</Text>
      <Picker
        selectedValue={roleId}
        onValueChange={(itemValue : any) => setRoleId(itemValue)}
      >
        {roles.map(role => (
          <Picker.Item key={role.id} label={role.name} value={role.id} />
        ))}
      </Picker>
      {profileImage && (
  <Image
    source={{ uri: profileImage }}
    style={{ width: 100, height: 100, borderRadius: 50 }}
  />
)}

      <Button title="Save Profile" onPress={handleProfileSubmit} />
      {uploading && <Text>Uploading...</Text>}
      {uploadStatus && <Text>{uploadStatus}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 4 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginTop: 16, marginBottom: 16 },
});

export default ProfileSetup;
