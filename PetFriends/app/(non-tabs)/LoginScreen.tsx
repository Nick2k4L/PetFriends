import React, { useState, useRef } from 'react';
import { View, Button, TouchableOpacity, StyleSheet, Text, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { loginWithEmail, signUpWithEmail} from '../../utilities/firebaseAuth';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-paper';
import { TextInput as RNTextInput } from 'react-native';
import { FirebaseRecaptcha, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getApp } from 'firebase/app';
import { RecaptchaVerifier } from 'firebase/auth';



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const passwordRef = useRef<RNTextInput>(null)
  
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const app = getApp();
  const firebaseConfig = app.options;

  const originalWarn = console.warn;
  console.warn = (message, ...args) => {
    if (message.includes('FirebaseRecaptcha: Support for defaultProps')) {
      return;
    }
    originalWarn(message, ...args);
};
  const handleLogin = async () => {
    if(!recaptchaVerifier.current){
      Alert.alert('Error', 'Problem with recapthcaVerifier');
      return;
    }

    try {
      
      await loginWithEmail(email, password, recaptchaVerifier.current);
    } catch (error) {
      Alert.alert('Login Error', (error as Error).message);
    }
  };

  const handleEnter = async () => {
    if(!recaptchaVerifier.current){
      Alert.alert('Error', 'Problem with recapthcaVerifier');
      return;
    }

    try {
      await loginWithEmail(email, password, recaptchaVerifier.current);
    } catch (error) {

      Alert.alert('Login Error', (error as Error).message);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      Alert.alert('Sign Up Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      {/* ReCAPTCHA Verifier */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig} 
        attemptInvisibleVerification={false} // Set to false for visible reCAPTCHA during testing
      />

      <View style={styles.container}>
        {/* Logo */}
        <Image source={require('../../assets/PF.jpg')} style={styles.logo} />

        {/* Login Form */}

        <KeyboardAvoidingView
        
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.loginContainer}>
          
          <Text style={styles.title}>Sign in</Text>
          <TextInput
            style={styles.input}
            // placeholder="Email                " 
            value={email}
            onChangeText={setEmail}
            autoComplete='email'
            placeholderTextColor={"#0a0a0a"}
            inputMode='email'
            onSubmitEditing={()=>passwordRef.current?.focus() }
            mode='outlined'
            label={'Email Address'}
            
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
            <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signupLink}>Sign Up Here</Text>
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAvoidingView>
        <Text style={styles.footer}>© 2024 S.P.I.N. Limited</Text>
      </View>
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
    marginTop: -50,
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 50,
    gap: 2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#02f4ff',
    width: 360,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#000',
    fontSize: 16,
  },
  signupLink: {
    color: '#02f4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 300,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: 360,
    height: 40,
    // borderWidth: 1,
    // borderColor: '##b7d0cd',
    padding: 8,
    // marginBottom: 10,
    borderRadius: 100,
    // color: '#0a0a0a',  
    backgroundColor:'#f5f5f5',
    
  },
  footer: {
    maxHeight: 10,
    color: 'grey'
  }
});
