import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import { Button } from 'react-native-paper';
import { logOut } from '@/utilities/firebaseAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {

  const router = useRouter();

  const handleManagePets = () => {
    // Navigate to Manage Pets screen
    router.push('/PetManagementScreen');
  };

  const handleManageAccount = () => {
    // Navigate to Manage Account screen
    //router.push('/ManageAccountScreen');
  };

  const handleSignout = async () => {
    try {
      await logOut();
      router.replace('/LoginScreen');
    } catch (error) {
      Alert.alert('Logout Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Center</Text>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          buttonColor="#333333"
          onPress={() => {
            router.replace('/ProfileManagementScreen');
          }}
        >
          Account Management
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          buttonColor="#333333"
          onPress={() => {
            router.replace('/PetManagementScreen'); // redirect them into the pet management screen.
          }}
        >
          Pet Management
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          buttonColor="#333333"
          onPress={() => {
            // Handle FAQs
          }}
        >
          FAQs
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    
    top: 255,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    // flex: 900, // Takes up the remaining vertical space
    justifyContent: 'space-between', // Evenly space the buttons vertically
    alignItems: 'center',
    width: '265%',
    paddingTop: 170,
    position: 'absolute',
  },
  button: {
    width: '40%', // Button width relative to the screen
    aspectRatio: 5, // Ensures the button is square
    justifyContent: 'center', // Centers the text inside the button
    marginBottom: 20, // Add space below the button
    borderRadius: 1, // Removes rounded corners for squared edges
  },
});
