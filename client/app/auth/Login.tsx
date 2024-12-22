import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 16 
  },
  title: { 
    fontSize: 48, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontFamily: 'Raleway-Medium',
  },
  label: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    backgroundColor: "#13375F",
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    color: 'white'
    
  },
  input: { 
    borderWidth: 1, 
    padding: 14, 
    marginBottom: 16, 
    borderRadius: 4,
    borderColor: '#13375F'
  },
  loginButton: {
    backgroundColor: "#13375F",
    paddingVertical: 22,
    borderRadius: 6,
    marginTop: 32
  },
  loginText: {
    color: "white",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: "auto"
  }
});

export default Login;
