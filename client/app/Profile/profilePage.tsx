import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface User {
    name: string;
    joined: string;
    role: string;
    projects: string[];
    bio: string;
    // profileImage: string; 
    // backgroundImage: string; 
  }
  
  const user: User = {
    name: "John Doe",
    joined: "2023-11-15",
    role: "Software Engineer",
    projects: ["Project A", "Project B"],
    bio: "I am a passionate software engineer with a focus on..."
    // profileImage: "path/to/profile/image.jpg", 
    // backgroundImage: "path/to/background/image.jpg" 
  };

const UserProfile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/backGround.png')} 
        style={styles.backgroundImage} 
      />
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../../assets/images/pp.jpg')} 
            style={styles.profileImage} 
          />
        </View>
        <TouchableOpacity style={styles.connectButton}>
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.joined}>Joined {user.joined}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
       </View>
      <View style={styles.projects}>
        <Text style={styles.projectsTitle}>Projects</Text>
        {user.projects.map((project, index) => (
          <View key={index} style={styles.projectContainer}>
            <Image 
              source={require('../../assets/images/company.png')} // Replace with actual project image
              style={styles.projectImage} 
            />
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project}</Text>
              <Text style={styles.projectDescription}>Brief description of the project.</Text> 
            </View>
          </View>
        ))}
      </View>

      {/* Add Posts section here */}
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
    width : '100%', 
    resizeMode: 'cover', 
},
  header: {
    marginTop: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  profileImageContainer: {
    marginLeft : 20,
    width: 130,
    height: 130,
    borderRadius: 14, // Adjust radius as needed
    borderWidth: 5, // Set border width
    borderColor: 'white', // Set border color
    overflow: 'hidden', 
    backgroundColor: 'white', 
  
  
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    marginTop:15,
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
    
    marginRight : 20,
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
});

export default UserProfile;