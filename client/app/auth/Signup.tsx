import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'expo-router';

const Signup = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      // Sign up with email and password using Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
  
      if (error) {
        throw error;
      }
  
      // Access the user object from the response's 'data' field
      const user = data?.user;
  
      if (user) {
        // Assuming '1' is the ID for the default role 'individual' in the roles table
        const defaultRoleId = 1;  // Adjust this based on your roles table

        // After successful signup, insert user details into the 'users' table
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email,
              role_id: defaultRoleId,  // Insert the role ID, not the 'role' field
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
