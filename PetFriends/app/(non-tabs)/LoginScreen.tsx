import React, { useState, useRef, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Alert, Image, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { loginWithEmail, signUpWithEmail} from '../../utilities/firebaseAuth';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-paper';
import { TextInput as RNTextInput } from 'react-native';
import { FirebaseRecaptcha, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getApp } from 'firebase/app';
import { RecaptchaVerifier } from 'firebase/auth';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

const videoSource =
  '../../assets/intro.mp4';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const passwordRef = useRef<RNTextInput>(null)
  const background = require('../../assets/intro.mp4');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const player = useVideoPlayer(background, player => {
   player.loop = true;
   player.play();
 });
 
 const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
 
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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust animation duration as needed
      useNativeDriver: true, // For better performance
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* ReCAPTCHA Verifier */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig} 
        attemptInvisibleVerification={false} // Set to false for visible reCAPTCHA during testing
      />

   
      {/* Logo */}
   
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
        nativeControls={false}
      />
      
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Your app content */}
      <Image source={require('../../assets/PF-colored.png')} style={styles.logo} />
    </Animated.View>
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

<View style={styles.button}>
      <Button title="Login" color={"white"} onPress={handleLogin} />
      <Button title="Sign Up" color={"white"} onPress={handleSignUp} />
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
    // backgroundColor: '#4CAF50', // Background color
  },
  button: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    color: 'black',

  
  },
  logo: {
    width: 300,
    height: 250,
    marginBottom: 20,
    marginTop: 20,
    // borderColor: 'red',
    // borderWidth: 1
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    // borderColor: 'black',
    // outlineColor: 'black',
    // outline: "1px solid black",
  },
  input: {
    width: 360,
    height: 40,
    // borderWidth: 1,
    // borderColor: '##b7d0cd',
    padding: 7,
    marginBottom: 10,
    // borderRadius: 5,
    // color: '#0a0a0a',  
    // backgroundColor:'#4CAF50',
    
  },
  footer: {
    maxHeight: 10,
    color: 'grey'
  }
});
