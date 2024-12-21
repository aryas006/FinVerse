import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'expo-router';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Holds user data
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  
    const handleeditNav = () => {
      router.push('/Profile/profileSetup'); // Replace '/profile' with your actual profile page route
    };

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken'); // Retrieve authToken from AsyncStorage
      if (!authToken) throw new Error('User not authenticated.');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, bio, created_at, projects, profile_image')
        .eq('user_id', authToken)
        .single();

      if (error) throw error;

      // Parse the projects JSON string into a JavaScript array
      const projects = data.projects ? JSON.parse(data.projects) : [];

      setUser({ ...data, projects }); // Update user state with parsed projects
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading User Profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading profile. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/backGround.png')} 
        style={styles.backgroundImage} 
      />
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={
              user.profile_image
                ? { uri: user.profile_image }
                : require('../../assets/images/pp.jpg') // Default profile image
            }
            style={styles.profileImage} 
          />
        </View>
        <TouchableOpacity onPress={handleeditNav} style={styles.connectButton}>
          <Text style={styles.connectButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.joined}>Joined {user.joined_at}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
      <View style={styles.projects}>
        <Text style={styles.projectsTitle}>Projects</Text>
        {user.projects && user.projects.length > 0 ? (
          user.projects.map((project: any, index: number) => (
            <View key={index} style={styles.projectContainer}>
              <Image 
                source={{ uri: project.image }} 
                style={styles.projectImage} 
              />
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.title}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No projects available.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    height: '25%',
    width: '100%', 
    resizeMode: 'cover', 
  },
  header: {
    marginTop: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImageContainer: {
    marginLeft: 20,
    width: 130,
    height: 130,
    borderRadius: 14,
    borderWidth: 5,
    borderColor: 'white',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    marginTop: 15,
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  joined: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5, 
  },
  bio: {
    fontSize: 14,
  },
  connectButton: {
    marginRight: 20,
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 35,
    marginTop: 50,
  },
  connectButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  projects: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  projectsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  projectImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
