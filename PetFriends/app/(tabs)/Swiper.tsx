import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, SafeAreaView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { fetchAllPets } from '../../utilities/firebaseAuth'; // Ensure fetchAllPets is fetching data from all users' pets
import { getAuth } from 'firebase/auth';
import { saveSwipe, checkForMutualSwipe, addNotification } from '../../utilities/firebaseAuth';

// Define a TypeScript interface for Pet
interface Pet {
  id: string;
  name: string;
  age: string;
  breed: string;
  weight: string;
  image: string;
  ownerId: string;
}

export default function DogSwipeScreen() {
   const [dogs, setDogs] = useState<Pet[]>([]);
  //const [dogs, setDogs] =  useState([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Fetch dog profiles from Firestore
    const fetchDogProfiles = async () => {
      try {
        const allUsersDogs = await fetchAllPets(); // Fetch pets from all users
        console.log("User Dogs: ", allUsersDogs);
        const filteredDogs = allUsersDogs.filter((dog) => dog.id !== userId); // Exclude current user's dogs        
        setDogs(filteredDogs as Pet[]);
      } catch (error) {
        console.error("Error fetching dog profiles:", error);
        Alert.alert("Error", "Failed to load dog profiles.");
      }
    };

    fetchDogProfiles();
  }, []);



  const handleSwipeRight = async (index: number) => {
    const dog = dogs[index];
    const currentUserId = userId; // Your logged-in user's ID
    const swipedPetOwnerId = dog.ownerId; // Correctly fetching ownerId from the `Pet` object
  
    console.log("Invited to play:", dog.name);
  
    try {
      // Save the swipe
      await saveSwipe(currentUserId as string, dog.id, swipedPetOwnerId);
  
      // Check for mutual swipe
      const isMutual = await checkForMutualSwipe(currentUserId as string, dog.id);
  
      if (isMutual) {
        console.log(`It's a match with ${dog.name}!`);
        await addNotification(
          currentUserId as string,
          `You matched with ${dog.name} for a playdate!`
        );
        await addNotification(
          swipedPetOwnerId,
          `You matched with a pet owned by ${currentUserId} for a playdate!`
        );
        Alert.alert("It's a Match!", `You and ${dog.name} are ready for a playdate!`);
      } else {
        Alert.alert("Invite Sent", `You invited ${dog.name} to play!`);
      }
    } catch (error) {
      console.error("Error handling swipe right:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  const handleSwipeLeft = (index: number) => {
    const dog = dogs[index];
    console.log("Declined:", dog.name);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
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
            
            stackSize={3}
            containerStyle={styles.container}
          />
        ) : (
          <Text style={styles.noDogsText}>No dogs available right now!</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#E5E5E5',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '15%',
    paddingBottom: 50,
    
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
    marginTop: -27,
    maxHeight: '83%',
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
    justifyContent: 'center',
    marginTop: 350,
  },
});
