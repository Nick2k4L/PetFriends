import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { fetchAllPets } from './firebaseAuth'; // Ensure fetchAllPets is fetching data from all users' pets
import { getAuth } from 'firebase/auth';

export default function DogSwipeScreen() {
  const [dogs, setDogs] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Fetch dog profiles from Firestore
    const fetchDogProfiles = async () => {
      try {
        const allUsersDogs = await fetchAllPets(); // Fetch pets from all users
        const filteredDogs = allUsersDogs.filter((dog) => dog.userId !== userId); // Exclude current user's dogs
        setDogs(filteredDogs);
      } catch (error) {
        console.error("Error fetching dog profiles:", error);
        Alert.alert("Error", "Failed to load dog profiles.");
      }
    };

    fetchDogProfiles();
  }, []);

  const handleSwipeRight = (index) => {
    const dog = dogs[index];
    console.log("Invited to play:", dog.name);
    Alert.alert("Invite Sent", `You invited ${dog.name} to play!`);
  };

  const handleSwipeLeft = (index) => {
    const dog = dogs[index];
    console.log("Declined:", dog.name);
  };

  return (
    <View style={styles.container}>
      {dogs.length > 0 ? (
        <Swiper
          cards={dogs}
          renderCard={(dog) => (
            <View style={styles.card}>
              <Image source={{ uri: dog.image }} style={styles.image} />
              <Text style={styles.name}>{dog.name}</Text>
              <Text style={styles.breed}>{dog.breed}</Text>
              <Text style={styles.weight}>Weight: {dog.weight}</Text>
            </View>
          )}
          onSwipedRight={(cardIndex) => handleSwipeRight(cardIndex)}
          onSwipedLeft={(cardIndex) => handleSwipeLeft(cardIndex)}
          cardIndex={0}
          backgroundColor="#f8f9fa"
          stackSize={3}
        />
      ) : (
        <Text style={styles.noDogsText}>No dogs available right now!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  breed: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
  },
  weight: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  noDogsText: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
  },
});