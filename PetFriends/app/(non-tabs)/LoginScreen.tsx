import React, { useState, useRef } from 'react';
import { View, Button, StyleSheet, Text, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { loginWithEmail, signUpWithEmail} from '../../utilities/firebaseAuth';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-paper';

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
      await signUpWithEmail(email, password);
      router.replace('/PetManagementScreen')
    } catch (error) {
      await loginWithEmail(email, password);
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
        // placeholder="Email                " 
        value={email}
        onChangeText={setEmail}
        autoComplete='email'
        placeholderTextColor={"#0a0a0a"}
        inputMode='email'
        onSubmitEditing={()=>passwordRef.current.focus()}
        mode='outlined'
        label={'Email'}
        
      />
      <TextInput
        style={styles.input}
        // placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={"#0a0a0a"}
        ref={passwordRef}
        onSubmitEditing={handleEnter}
        mode='outlined'
        label='Password'
        activeUnderlineColor={'transparent'}
        underlineColor='transparent'
        
      />

<View style={styles.button}>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} />
</View>
      </KeyboardAvoidingView>
      <Text style={styles.footer}>© 2024 S.P.I.N. Limited</Text>
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
    width: 300,
    // borderWidth: 1,
    // borderColor: '##b7d0cd',
    padding: 8,
    // marginBottom: 10,
    // borderRadius: 5,
    // color: '#0a0a0a',  
    backgroundColor:'#b7d0cd',
    
  },
  footer: {
    bottom: -10,
    color: 'grey'
  }
});
