import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/supabaseClient';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

interface ProjectExperience {
  image: string | null;
  title: string;
  description: string;
}

const ProfileSetup: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectExperience[]>([]);
  const [experience, setExperience] = useState<ProjectExperience[]>([]);
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) throw new Error('User not authenticated.');

        const { data, error } = await supabase
          .from('profiles')
          .select(`
            email,
            username,
            role,
            dob,
            bio,
            profile_image,
            cover_image,
            projects,
            experience
          `)
          .eq('user_id', authToken)
          .single();

        if (error) throw error;

        if (data) {
          setEmail(data.email || '');
          setUsername(data.username || '');
          setRole(data.role || '');
          setDob(data.dob || '');
          setBio(data.bio || '');
          setProfileImage(data.profile_image || null);
          setCoverImage(data.cover_image || null);
          setProjects(data.projects ? JSON.parse(data.projects) : []);
          setExperience(data.experience ? JSON.parse(data.experience) : []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddEntry = (setter: React.Dispatch<React.SetStateAction<ProjectExperience[]>>) => {
    setter((prev) => [...prev, { image: null, title: '', description: '' }]);
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
      const fileName = `${type}/${Date.now()}.jpg`;
      const contentType = 'image/jpeg';

      const { data, error } = await supabase.storage
        .from(type === 'profile-pic' ? 'profile-images' : 'posts')
        .upload(fileName, decode(base64), { contentType });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(type === 'profile-pic' ? 'profile-images' : 'posts')
        .getPublicUrl(fileName);

      return publicUrlData?.publicUrl || uri;
    } catch (error) {
      console.error('Error uploading image:', error);
      return uri;
    }
  };

  const uploadImagesAndSaveProfile = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('User not authenticated.');

      const uploadedProfileImage =
        profileImage && !profileImage.startsWith('https://')
          ? await uploadImage(profileImage, 'profile-pic')
          : profileImage;

      const uploadedCoverImage =
        coverImage && !coverImage.startsWith('https://')
          ? await uploadImage(coverImage, 'profile-pic')
          : coverImage;

      const uploadedProjects = await Promise.all(
        projects.map(async (item) => ({
          ...item,
          image: item.image && !item.image.startsWith('https://') ? await uploadImage(item.image, 'posts') : item.image,
        }))
      );

      const uploadedExperience = await Promise.all(
        experience.map(async (item) => ({
          ...item,
          image: item.image && !item.image.startsWith('https://') ? await uploadImage(item.image, 'posts') : item.image,
        }))
      );

      const { error } = await supabase.from('profiles').upsert({
        user_id: authToken,
        username,
        role,
        dob,
        bio,
        profile_image: uploadedProfileImage,
        cover_image: uploadedCoverImage,
        email,
        projects: JSON.stringify(uploadedProjects),
        experience: JSON.stringify(uploadedExperience),
      });

      if (error) throw error;

      console.log('Profile updated successfully!');
    } catch (error) {
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

      {/* Profile Picture */}
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

      {/* Username */}
      <View style={styles.section}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </View>

      {/* Role */}
      <View style={styles.section}>
        <Text style={styles.label}>Role</Text>
        <TextInput
          style={styles.input}
          value={role}
          onChangeText={setRole}
          placeholder="Enter your role"
        />
      </View>

      {/* Date of Birth */}
      <View style={styles.section}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {/* Bio */}
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

      {/* Projects */}
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
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddEntry(setProjects)}>
          <Text style={styles.addButtonText}>Add Project</Text>
        </TouchableOpacity>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.label}>Experience</Text>
        {experience.map((exp, index) => (
          <View key={index} style={styles.projectContainer}>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={() =>
                handlePickImage((uri) => {
                  const updatedExperience = [...experience];
                  updatedExperience[index].image = uri;
                  setExperience(updatedExperience);
                })
              }
            >
              {exp.image ? (
                <Image source={{ uri: exp.image }} style={styles.projectImage} />
              ) : (
                <Text style={styles.imagePickerText}>Pick Experience Image</Text>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={exp.title}
              onChangeText={(text) => {
                const updatedExperience = [...experience];
                updatedExperience[index].title = text;
                setExperience(updatedExperience);
              }}
              placeholder="Experience Title"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={exp.description}
              onChangeText={(text) => {
                const updatedExperience = [...experience];
                updatedExperience[index].description = text;
                setExperience(updatedExperience);
              }}
              placeholder="Experience Description"
              multiline
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddEntry(setExperience)}>
          <Text style={styles.addButtonText}>Add Experience</Text>
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