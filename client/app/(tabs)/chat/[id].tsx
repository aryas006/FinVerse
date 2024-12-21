import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the back button icon
import { supabase } from '@/supabaseClient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const { id } = useLocalSearchParams(); // Use useLocalSearchParams for query params
  const router = useRouter(); // Use router for navigation
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user's ID from local storage
  useEffect(() => {
    const fetchUserId = async () => {
        const storedUserId = "60fa5087-bb09-4240-ba82-0d05e5ae1785";
        // const storedUserId = await AsyncStorage.getItem('authToken');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.error('User ID not found in local storage');
      }
    };
    fetchUserId();
  }, []);

  // Fetch messages and set up real-time subscriptions
  useEffect(() => {
    if (!id || !userId) return;

    // Fetch messages between the current user and the recipient
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('message-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          if (
            (newMessage.sender_id === userId && newMessage.receiver_id === id) ||
            (newMessage.sender_id === id && newMessage.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Properly clean up subscription
    };
  }, [id, userId]);

  const fetchMessages = async () => {
    if (!id || !userId) return;
  
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${userId})`
      )
      .order('timestamp', { ascending: true });
  
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };
  

  const sendMessage = async () => {
    if (!newMessage || !userId || !id) return;

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: userId,
        receiver_id: id,
        content: newMessage,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender_id === userId ? styles.sent : styles.received,
            ]}
          >
            <Text 
            style={[
                styles.messageBubble,
                item.sender_id === userId ? styles.messageTextWhite : styles.messageText,
            ]}
            >{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messages}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    backgroundColor: '#4a90e2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 52,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  messages: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 20,
    maxWidth: '75%',
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#4a90e2',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    padding: 2
  },
  messageTextWhite: {
    fontSize: 16,
    color: "#fff",
    padding: 2
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 20,
  },
});
