import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image } from 'react-native';
import { loginWithEmail, signUpWithEmail } from '../utilities/firebaseAuth';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Error', (error as Error).message);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      navigation.navigate('PetManagement');
    } catch (error) {
      Alert.alert('Sign Up Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/PF.jpg')} style={styles.logo} />

      {/* Login Form */}
      <Text style={styles.title}>Welcome </Text>
      <TextInput
        style={styles.input}
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#b7d0cd', // Background color
  },
  logo: {
    width: 300,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    textDecorationColor: '#000000',
  
  }
});
