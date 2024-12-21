import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Storing the authentication ID (session) and username in AsyncStorage
      const authSession = data?.session;
      const authId = data.user.id;
      const username = data.user.user_metadata?.username; // Assuming username is stored in user metadata

      if (authSession) {
        await AsyncStorage.setItem('authToken', authId);  // Storing user id as 'authToken'
        await AsyncStorage.setItem('username', username || '');  // Storing username

        Alert.alert('Login Successful', 'You are now logged in.');
        
        router.push('/Feed/home'); // Navigate to the profile setup screen
      } else {
        throw new Error('Session not found');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 4 },
});

export default Login;
