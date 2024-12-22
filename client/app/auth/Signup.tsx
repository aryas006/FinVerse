import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
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
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw error;
      }

      const user = data?.user;

      if (user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              email: user.email,
              username,
              dob,
              password,
              user_id: user.id,
              full_name: '',
              profile_image: '',
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
        router.push('/auth/Login');
      } else {
        throw new Error('User not found in the response');
      }
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mail ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={dob}
          onChangeText={setDob}
        />
      </View>

      <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#13375F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4F4F4F',
    marginBottom: 24,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#13375F',
    marginBottom: 4,
  },
  input: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#dcdfe3',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupButton: {
    width: '90%',
    backgroundColor: '#13375F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Signup;
