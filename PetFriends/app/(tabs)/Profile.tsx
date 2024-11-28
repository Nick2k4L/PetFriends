import React from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logOut } from '@/utilities/firebaseAuth';
import { useRouter } from 'expo-router';






export default function ProfileScreen() {
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await logOut;
      router.replace('/LoginScreen');
    } catch (error) {
      Alert.alert('Login Error', (error as Error).message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Logout" onPress={handleSignout}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});