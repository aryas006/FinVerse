import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, Animated } from 'react-native';
import { useRouter } from 'expo-router';
export default function App() {
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const logoTranslateY = React.useRef(new Animated.Value(-50)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();
  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        delay: 500,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        delay: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ translateY: logoTranslateY }],
          ...styles.logoContainer,
        }}
      >
        <Image
          source={require('../../../assets/images/logo.jpg')} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.title}>FinVerse</Text>
      </Animated.View>

      {/* <Animated.Text
        style={{ opacity: textOpacity, ...styles.description }}
      >
        Your financial universe at your fingertips. Experience seamless management and growth for your wealth with FinVerse.
      </Animated.Text> */}

      <Animated.View
        style={{ opacity: buttonOpacity, ...styles.buttonContainer }}
      >
        <TouchableOpacity style={styles.primaryButton} onPress={()=>{router.push('/auth/Login')}}> 
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 FinVerse. All Rights Reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(90deg, #3b82f6, #9333ea, #ec4899)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: "auto"
  },
  primaryButtonText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    borderColor: 'white',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'white',
  },
});
