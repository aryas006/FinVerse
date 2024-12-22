import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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

      const authSession = data?.session;
      const authId = data.user.id;
      const username = data.user.user_metadata?.username;

      if (authSession) {
        await AsyncStorage.setItem('authToken', authId);
        await AsyncStorage.setItem('username', username || '');

        Alert.alert('Login Successful', 'You are now logged in.');
        router.push('/Feed/home');
      } else {
        throw new Error('Session not found');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please login to continue</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <Text style={styles.signUpText} onPress={() => router.push('/auth/Signup')}>Sign up</Text>
      </Text>
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
  label: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    fontSize: 14,
    color: '#13375F',
    marginBottom: 4,
  },
  input: {
    width: '90%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#dcdfe3',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButton: {
    width: '90%',
    backgroundColor: '#13375F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 16,
    fontSize: 14,
    color: '#4F4F4F',
  },
  signUpText: {
    color: '#13375F',
    fontWeight: '600',
  },
});

export default Login;
