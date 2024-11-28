import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { loginWithEmail, signUpWithEmail} from '../../utilities/firebaseAuth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const passwordRef = useRef(null);

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      router.replace('/Swiper');
    } catch (error) {
      Alert.alert('Login Error', (error as Error).message);
    }
  };

  const handleEnter = async () => {
    try {
      await handleSignUp();
      router.replace('/PetManagementScreen')
    } catch (error) {
      handleLogin();
      router.replace('/Swiper');
      Alert.alert('Login Error', (error as Error).message);

    }
  };

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      router.replace('/PetManagementScreen');
    } catch (error) {
      Alert.alert('Sign Up Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/PF.jpg')} style={styles.logo} />

      {/* Login Form */}

      <KeyboardAvoidingView
      
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
        
      <Text style={styles.title}>Welcome </Text>
      <TextInput
        style={styles.input}
        placeholder="Email                " 
        value={email}
        onChangeText={setEmail}
        autoComplete='email'
        placeholderTextColor={"#0a0a0a"}
        onSubmitEditing={()=>passwordRef.current.focus()}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={"#0a0a0a"}
        ref={passwordRef}
        onSubmitEditing={handleEnter}
        
      />

<View style={styles.button}>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} />
</View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#b7d0cd', // Background color
  },
  button: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
  },
  logo: {
    width: 300,
    height: 250,
    marginBottom: 20,
    marginTop: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: '##b7d0cd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#0a0a0a',    
  }
});
