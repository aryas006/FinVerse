import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/supabaseClient';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

interface Project {
  image: string | null;
  title: string;
  description: string;
}

const ProfileSetup: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState<string>('');
  const [headline, setHeadline] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) throw new Error('User not authenticated.');

        const { data, error } = await supabase
          .from('users')
          .select('email, name, headline, bio, profile_image, projects')
          .eq('id', authToken)
          .single();

        if (error) throw error;

        if (data) {
          setEmail(data.email || '');
          setName(data.name || '');
          setHeadline(data.headline || '');
          setBio(data.bio || '');
          setProfileImage(data.profile_image || null);
          setProjects(data.projects ? JSON.parse(data.projects) : []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddProject = () => {
    setProjects([...projects, { image: null, title: '', description: '' }]);
  };

  const handlePickImage = async (onUploadCallback: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onUploadCallback(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string, type: 'profile-pic' | 'posts') => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const fileName = `${type}/${Date.now()}.jpg`; // Creating a file name based on the timestamp
      const contentType = 'image/jpeg'; // Assuming the image is jpeg

      const { data, error } = await supabase.storage
        .from(type === 'profile-pic' ? 'profile-images' : 'posts')
        .upload(fileName, decode(base64), {
          contentType: contentType,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(type === 'profile-pic' ? 'profile-images' : 'posts')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      } else {
        throw new Error('Failed to fetch public URL.');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return uri; // Return the URI as a fallback
    }
  };

  const uploadImagesAndSaveProfile = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('User not authenticated.');

      let uploadedProfileImage = profileImage;

      // Upload profile image if selected
      if (profileImage && !profileImage.startsWith('https://')) {
        uploadedProfileImage = await uploadImage(profileImage, 'profile-pic');
      }

      // Upload project images
      const uploadedProjects = await Promise.all(
        projects.map(async (project) => {
          let uploadedImage = project.image;

          if (project.image && !project.image.startsWith('https://')) {
            uploadedImage = await uploadImage(project.image, 'posts');
          }

          return {
            ...project,
            image: uploadedImage,
          };
        })
      );

      // Save profile data to Supabase
      const { error } = await supabase.from('users').upsert({
        id: authToken,
        name,
        headline,
        bio,
        profile_image: uploadedProfileImage,
        email,
        projects: JSON.stringify(uploadedProjects),
      });

      if (error) throw error;

      console.log('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error uploading images or saving profile:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Setup Your Profile</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Profile Picture</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => handlePickImage((uri) => setProfileImage(uri))}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePickerText}>Pick a Profile Picture</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Headline</Text>
        <TextInput
          style={styles.input}
          value={headline}
          onChangeText={setHeadline}
          placeholder="Add a professional headline"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          placeholder="Write a short bio"
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Projects</Text>
        {projects.map((project, index) => (
          <View key={index} style={styles.projectContainer}>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={() =>
                handlePickImage((uri) => {
                  const updatedProjects = [...projects];
                  updatedProjects[index].image = uri;
                  setProjects(updatedProjects);
                })
              }
            >
              {project.image ? (
                <Image source={{ uri: project.image }} style={styles.projectImage} />
              ) : (
                <Text style={styles.imagePickerText}>Pick Project Image</Text>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={project.title}
              onChangeText={(text) => {
                const updatedProjects = [...projects];
                updatedProjects[index].title = text;
                setProjects(updatedProjects);
              }}
              placeholder="Project Title"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={project.description}
              onChangeText={(text) => {
                const updatedProjects = [...projects];
                updatedProjects[index].description = text;
                setProjects(updatedProjects);
              }}
              placeholder="Project Description"
              multiline
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
          <Text style={styles.addButtonText}>Add Project</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={uploadImagesAndSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  imagePicker: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#007bff',
    fontSize: 16,
  },
  profileImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  projectContainer: {
    marginBottom: 16,
  },
  projectImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 4,
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ProfileSetup;
