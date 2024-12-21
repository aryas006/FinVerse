import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'expo-router';

const Signup = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      // Sign up with email and password using Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw error;
      }

      const user = data?.user;

      if (user) {
        // Inserting user data into the profiles table
        const { error: insertError } = await supabase
          .from('profiles')  // Updated table name
          .insert([
            {
              email: user.email,
              username,
              dob,
              password,
              user_id: user.id,  // Storing user_id
              full_name: '',  // Optional, you can add more fields if needed
              profile_image: '', // Optional, you can set default empty or null
              connections: [],
              followers: [],
              projects: [],
              experience: []
            },
          ]);

        if (insertError) {
          throw insertError;
        }

        Alert.alert('Signup Successful', 'Please log in.');
        router.push('/auth/Login'); // Navigate to login page after signup
      } else {
        throw new Error('User not found in the response');
      }
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 4 },
});

export default Signup;
