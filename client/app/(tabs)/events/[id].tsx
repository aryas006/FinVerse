import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BottomNav from '@/app/Components/BottomNav';
import { useNavigation, useRouter } from 'expo-router';



const Events: React.FC = ({ }) => {
  const router = useRouter();
  const navigation = useNavigation();
  const eventData = [
    {
      id: '1',
      date: 'Tomorrow/Wednesday',
      title: 'Art Class',
      artist: 'Artist',
      time: 'Today, 2:00 pm',
      image: 'https://via.placeholder.com/100', // Replace with actual URL
    },
    {
      id: '2',
      date: 'Jul 31/Wednesday',
      title: 'Framer Web MasterClass',
      artist: 'Framer',
      time: 'Today, 2:00 pm',
      image: 'https://via.placeholder.com/100', // Replace with actual URL
    },
    {
      id: '3',
      date: 'Jun 2/Tuesday',
      title: 'Framer Web MasterClass',
      artist: 'Framer',
      time: 'Today, 2:00 pm',
      image: 'https://via.placeholder.com/100', // Replace with actual URL
    },
  ];

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventContainer}
      onPress={() => router.push(`/?id=${item.id}`)}
    >
      <View style={styles.eventContainer}>
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        <View style={styles.eventDetails}>
          <Text style={styles.eventDate}>{item.date}</Text>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventArtist}>{item.artist}</Text>
          <Text style={styles.eventTime}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={{
        color: '#000',
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 40
      }}
        onPress={() => navigation.goBack()}
      >
        Back
      </Text>
      {/* Scrollable Content */}
      <ScrollView style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://via.placeholder.com/400', // Replace with actual header image URL
            }}
            style={styles.headerImage}
          />
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Art Class</Text>
          <Text style={styles.description}>
            Art classes provide individuals with the opportunity to learn, practice, and refine artistic skills in
            various mediums and styles. They cater to a wide range of interests, skill levels, and age groups, from
            children exploring creativity to professional artists seeking to deepen their expertise.
          </Text>
        </View>

        {/* Events Section */}
        <FlatList
          data={eventData}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          style={styles.eventList}
        />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNav />
      </View>
    </View>
  );
};

type Event = {
  id: string;
  date: string;
  title: string;
  artist: string;
  time: string;
  image: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    marginBottom: 60, // Space for the BottomNav to avoid overlapping
  },
  header: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  subscribeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  subscribeText: {
    color: '#fff',
    fontWeight: '600',
  },
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  eventList: {
    marginTop: 10,
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  eventDetails: {
    flex: 1,
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
  },
  eventArtist: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: '#777',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Events;
