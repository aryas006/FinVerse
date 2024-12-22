import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';
import { useLocalSearchParams, useRouter } from 'expo-router';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Holds user data
  const [loading, setLoading] = useState(true);

  const { id } = useLocalSearchParams(); // Use useLocalSearchParams for query params

  const router = useRouter();
  
    const handleeditNav = () => {
      router.push('/Profile/profileSetup'); // Replace '/profile' with your actual profile page route
    };

    const fetchUserData = async () => {
        try {
          const authToken = AsyncStorage.getItem('authToken') // Retrieve authToken from useLocalSearchParams
          if (!authToken) throw new Error("User not authenticated.");
      
          const { data, error } = await supabase
            .from("profiles")
            .select("username, full_name, bio, created_at, projects, profile_image")
            .eq("user_id", id)
            .single();
      
          if (error) throw error;
      
          console.log("Fetched data from profiles table:", data);
      
          // Parse projects, handling null or invalid JSON
          let projects = [];
          if (data.projects) {
            try {
              projects = typeof data.projects === "string" ? JSON.parse(data.projects) : data.projects;
            } catch (error) {
              console.warn("Invalid JSON in projects field:", error);
              projects = [];
            }
          }
      
          setUser({ ...data, projects }); // Update user state with parsed projects
        } catch (error) {
          console.error("Error fetching user data:", error);
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

  const handleFollow = async () => {
    try {
      // Fetch the logged-in user's ID from AsyncStorage
      const currentUserId = await AsyncStorage.getItem('authToken');
      if (!currentUserId) {
        throw new Error('User not authenticated.');
      }
  
      // Fetch the current followers of the user being viewed
      const { data, error } = await supabase
        .from('profiles')
        .select('followers')
        .eq('user_id', id) // `id` is the profile being viewed
        .single();
  
      if (error) {
        console.error('Error fetching followers:', error);
        throw new Error('Unable to fetch followers. Please try again.');
      }
  
      let updatedFollowers = data.followers || [];
  
      // Check if the user is already in the followers array
      if (updatedFollowers.includes(currentUserId)) {
        Alert.alert('Info', 'You are already following this user.');
        return;
      }
  
      // Add the current user's ID to the followers array
      updatedFollowers.push(currentUserId);
  
      // Update the followers array in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ followers: updatedFollowers })
        .eq('user_id', id);
  
      if (updateError) {
        console.error('Error updating followers:', updateError);
        throw new Error('Unable to follow user. Please try again.');
      }
  
      Alert.alert('Success', 'You are now following this user!');
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
  
      // Handle unknown error type safely
      if (error instanceof Error) {
        errorMessage = error.message; // Extract the message if it's an Error
      } else if (typeof error === 'string') {
        errorMessage = error; // Handle string errors (unlikely in most cases)
      }
  
      console.error('Error following user:', error);
      Alert.alert('Error', errorMessage);
    }
  };
  
  
  
  const handleConnect = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem("authUserId"); // Get current logged-in user's ID
      if (!currentUserId) throw new Error("User not authenticated.");
  
      const { data, error } = await supabase
        .from("profiles")
        .select("connections")
        .eq("user_id", id) // `id` is the profile being viewed
        .single();
  
      if (error) throw error;
  
      let updatedConnections = data.connections || [];
      if (!updatedConnections.includes(currentUserId)) {
        updatedConnections.push(currentUserId); // Add current user ID to connections array
      }
  
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ connections: updatedConnections })
        .eq("user_id", id);
  
      if (updateError) throw updateError;
  
      Alert.alert("Success", "Connection request sent successfully!");
    } catch (error) {
      console.error("Error connecting with user:", error);
      Alert.alert("Error", "Unable to send connection request. Please try again later.");
    }
  };
  
  const handleMessage = () => {
    router.push(`/chat/${id}`); // Push to chat page with the profile ID
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
              style={styles.stickyBackButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
      <Image 
        source={require('../../../assets/images/backGround.png')} 
        style={styles.backgroundImage} 
      />
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={
              user.profile_image
                ? { uri: user.profile_image }
                : require('../../../assets/images/pp.jpg') // Default profile image
            }
            style={styles.profileImage} 
          />
        </View>
        <View style={styles.buttons}>
            <TouchableOpacity onPress={handleFollow} style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Follow</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handleConnect} style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={handleMessage} style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Message</Text>
            </TouchableOpacity>
        </View>
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
  buttons: {
    flexDirection: "row"
  },
  header: {
    marginTop: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stickyBackButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    paddingVertical: 12,
    paddingTop: 52,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
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
    backgroundColor: 'rgb(0, 72, 113)',
    padding: 10,
    borderRadius: 12,
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
