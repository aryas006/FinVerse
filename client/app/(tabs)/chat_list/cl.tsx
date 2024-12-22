import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface ChatPreview {
  id: string;
  username: string;
  lastMessage: string;
}

export default function ChatList() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('authToken');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.error('User ID not found in local storage');
      }
    };
    fetchUserId();
  }, []);

  // Fetch chat previews
  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        // Fetch messages where the user is either the sender or receiver
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('timestamp', { ascending: false });

        if (messagesError) throw messagesError;

        // Extract unique chat partners and fetch their profiles
        const uniqueChats: { [key: string]: ChatPreview } = {};
        for (const message of messages) {
          const partnerId =
            message.sender_id === userId ? message.receiver_id : message.sender_id;

          // Skip if already processed
          if (uniqueChats[partnerId]) continue;

          // Fetch profile for the partner
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('user_id', partnerId)
            .single();

          if (profileError) throw profileError;

          uniqueChats[partnerId] = {
            id: partnerId,
            username: profile.username,
            lastMessage: message.content,
          };
        }

        // Convert uniqueChats object to an array
        setChats(Object.values(uniqueChats));
      } catch (err) {
        console.error('Error fetching chat previews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerTitle}>Back</Text>  
        </TouchableOpacity>
        {/* <Ionicons name="chatbubble" size={24} color="#fff" /> */}
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <View style={styles.chatInfo}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.chatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc',
    // marginTop: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingVertical: 20,
    paddingTop: 64,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});
