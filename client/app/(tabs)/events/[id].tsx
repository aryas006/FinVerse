import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import BottomNav from '@/app/Components/BottomNav';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { supabase } from '@/supabaseClient';

const Events: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Fetch the event ID from the route parameters
  const [eventData, setEventData] = useState<any>(null); // Holds the event data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Function to fetch event details from the database
  const fetchEvent = async () => {
    try {
      setLoading(true); // Start loading

      const { data, error } = await supabase
        .from('events')
        .select('id, event_date_time, description, event_name, schedules')
        .eq('id', id) // Fetch the event by ID
        .single();

      if (error) throw error;

      // Format the schedules for easier rendering
      const formattedSchedules = (data.schedules || []).map((schedule: any) => {
        return Object.entries(schedule).map(([time, name]) => ({
          time,
          name,
        }));
      }).flat();

      setEventData({
        id: data.id.toString(),
        date: new Date(data.event_date_time).toLocaleDateString(),
        time: new Date(data.event_date_time).toLocaleTimeString(),
        title: data.event_name || 'Untitled Event',
        description: data.description || 'No description available.',
        schedules: formattedSchedules,
        image: 'https://via.placeholder.com/100', // Placeholder for now
      });
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch event details when the component mounts
  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  // Render a single schedule
  const renderSchedule = ({ item }: { item: { time: string; name: string } }) => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleTime}>{new Date(item.time).toLocaleString()}</Text>
      <Text style={styles.scheduleTitle}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: '#000',
          fontSize: 16,
          padding: 10,
          backgroundColor: '#f9f9f9',
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          marginTop: 40,
        }}
        onPress={() => router.back()}
      >
        Back
      </Text>

      {loading ? (
        // Show a loader while fetching data
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading event details...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={{
                uri: eventData?.image, // Replace with actual header image URL
              }}
              style={styles.headerImage}
            />
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{eventData?.title}</Text>
            <Text style={styles.description}>{eventData?.description}</Text>
          </View>

          {/* Schedules Section */}
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Schedules</Text>
            {eventData?.schedules && eventData.schedules.length > 0 ? (
              <FlatList
                data={eventData.schedules}
                renderItem={renderSchedule}
                keyExtractor={(item) => item.time} // Using time as key
                style={styles.eventList}
              />
            ) : (
              <Text style={styles.emptyText}>No schedules available.</Text>
            )}
          </View>
        </ScrollView>
      )}

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNav />
      </View>
    </View>
  );
};

type Schedule = {
  time: string;
  name: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scheduleSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduleContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#888',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  eventList: {
    marginTop: 10,
    paddingHorizontal: 20,
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
