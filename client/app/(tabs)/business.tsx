import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Modal,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  profileLink: string;
  image: string;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  time: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'CEO',
    profileLink: 'https://example.com/johndoe',
    image: '../../assets/images/image 1.png',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'CTO',
    profileLink: 'https://example.com/janesmith',
    image: '../../assets/images/image 1.png',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    role: 'Co-founder',
    profileLink: 'https://example.com/alicejohnson',
    image: '../../assets/images/image 1.png',
  },
];

const jobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'TechCorp',
    time: 'Today, 2:00 pm',
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Designify',
    time: 'Today, 4:00 pm',
  },
  {
    id: '3',
    title: 'Data Analyst',
    company: 'DataWorld',
    time: 'Tomorrow, 10:00 am',
  },
];

const Business = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out Framer, a powerful design and prototyping tool: https://framer.com',
      });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const handleFollow = () => {
    setModalVisible(false);
    Alert.alert('Followed', 'You are now following this startup!');
  };

  const handleConnect = () => {
    setModalVisible(false);
    Alert.alert('Connection Request Sent', 'You have sent a connection request!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Background Image */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../assets/images/event_bg.png')} // Corrected background image path
          style={styles.backgroundImage}
        />
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/image 1.png')} // Corrected logo image path
          style={styles.logo}
        />
        <Text style={styles.title}>Framer</Text>
        <Text style={styles.description}>
          Framer is a powerful web-based design and prototyping tool widely used by
          designers and developers to create interactive, high-fidelity
          prototypes for websites, mobile apps, and other digital experiences.
        </Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Fund</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.actionText}>More</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.location}>Location: Mumbai, Maharashtra</Text>
      </View>

      {/* Modal for More Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>More Options</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleFollow}>
              <Text style={styles.modalButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleConnect}>
              <Text style={styles.modalButtonText}>Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Followers Section */}
      <View style={styles.followersSection}>
        <Text style={styles.followersText}>12.3K Followers</Text>
      </View>

      {/* Mission and Vision Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mission and Vision</Text>
        <Text style={styles.sectionContent}>
          Our mission is to empower businesses by providing cutting-edge
          fintech solutions that drive innovation and inclusivity. Our vision
          is to be the leading platform for fintech collaborations worldwide.
        </Text>
      </View>

      {/* Team Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Information</Text>
        {teamMembers.map((member) => (
          <View key={member.id} style={styles.teamMemberContainer}>
            <Image source={require('../../assets/images/image 1.png')} style={styles.teamMemberImage} />
            <View style={styles.teamMemberDetails}>
              <Text style={styles.teamMemberText}>{`${member.name} - ${member.role}`}</Text>
              <View style={styles.teamActionsContainer}>
                <TouchableOpacity style={styles.teamActionButton} onPress={() => Alert.alert('Follow', `You followed ${member.name}`)}>
                  <Text style={styles.teamActionText}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.teamActionButton} onPress={() => Alert.alert('Connect', `You sent a connection request to ${member.name}`)}>
                  <Text style={styles.teamActionText}>Connect</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 19.076,
            longitude: 72.8777,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{ latitude: 19.076, longitude: 72.8777 }}
            title="Framer"
            description="Location of Framer office in Mumbai."
          />
        </MapView>
      </View>

      {/* Job Opportunities Section */}
      <View style={styles.jobOpportunitiesSection}>
        <Text style={styles.sectionTitle}>Open Job Opportunities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jobScrollContainer}>
          {jobPostings.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <Image source={require('../../assets/images/image 1.png')} style={styles.jobImage} />
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>{job.company}</Text>
                <Text style={styles.jobTime}>{job.time}</Text>
                <TouchableOpacity style={styles.applyButton} onPress={() => Alert.alert('Apply', `You applied for ${job.title}`)}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50, // Added padding to shift everything down
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 300, // Increased height for better fit
    zIndex: -1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
  followersSection: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  followersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  teamMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  teamMemberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  teamMemberDetails: {
    flex: 1,
  },
  teamMemberText: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 5,
  },
  teamActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  teamActionButton: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  teamActionText: {
    color: '#fff',
    fontSize: 14,
  },
  jobOpportunitiesSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  jobScrollContainer: {
    marginTop: 10,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginRight: 15,
    padding: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  jobImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  jobDetails: {
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  jobCompany: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  jobTime: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  mapContainer: {
    height: 250,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default Business;
