import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import {
  savePet,
  fetchPets,
  uploadPetImage,
  removePet,
} from '../../utilities/firebaseAuth';
import * as ImagePicker from 'expo-image-picker';

export default function PetManagementScreen() {
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petImage, setPetImage] = useState<string | undefined>(undefined);
  
  interface Pet {
    id: string;
    name?: string;
    age?: string;
    breed?: string;
    weight?: string;
    image?: string;
  }
  
  const [pets, setPets] = useState<Pet[]>([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetchPets(userId)
        .then(setPets)
        .catch((error) => Alert.alert('Error', error.message));
    }
  }, [userId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPetImage(result.assets[0].uri);
    }
  };

  const addPet = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
    if (!petName || !petBreed || !petAge || !petWeight) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Check if pet already exists
    const petExists = pets.some(
      (pet) => pet.name?.toLowerCase() === petName.toLowerCase()
    );
    if (petExists) {
      Alert.alert(
        'Error',
        'A pet with this name already exists. Please choose a different name.'
      );
      return;
    }

    try {
      let imageUrl: string | undefined = undefined;
      if (petImage) {
        imageUrl = await uploadPetImage(userId, petImage);
      }
      const petData = {
        id: userId,
        name: petName,
        age: petAge,
        breed: petBreed,
        weight: petWeight,
        image: imageUrl,
      };
      const petData1 = {
        id: userId,
        name: petName,
        age: petAge,
        breed: petBreed,
        weight: petWeight,
      };
      if (imageUrl) {
        await savePet(userId, petData);
        setPets([...pets, petData]);
      } else {
        await savePet(userId, petData1);
        setPets([...pets, petData1]);
      }
      setPetName('');
      setPetAge('');
      setPetBreed('');
      setPetWeight('');
      setPetImage(undefined);
      Alert.alert('Success', 'Pet added successfully!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  // Handle removal of a pet
  const removePets = async () => {
    Alert.prompt(
      'Remove Pet',
      'Enter the name of the pet you want to remove:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: (input) => {
            if (input) {
              const existingPet = pets.find(
                (pet) =>
                  pet.name?.toLowerCase() === input.toLowerCase()
              );
              if (existingPet) {
                try {
                  removePet(userId as string, existingPet.name as string);
                  Alert.alert('Success', 'Pet removed successfully!');
                  router.replace('/PetManagementScreen');
                } catch (error) {
                  Alert.alert('Error', 'Failed to remove pet.');
                }
              } else {
                Alert.alert(
                  'Error',
                  'Could not find a pet with that name.'
                );
              }
            } else {
              Alert.alert('Error', 'You must enter a valid pet name.');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Manager</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor="grey"
        placeholder="Pet Name"
        value={petName}
        onChangeText={setPetName}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        placeholderTextColor="grey"
        value={petBreed}
        onChangeText={setPetBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Age (Years old)"
        placeholderTextColor="grey"
        value={petAge}
        keyboardType="numeric"
        onChangeText={setPetAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (e.g., 10 Pounds)"
        value={petWeight}
        placeholderTextColor="grey"
        onChangeText={setPetWeight}
        keyboardType="numeric"
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={pickImage}
      >
        Select Image (Optional)
      </Button>
      {petImage && (
        <Image source={{ uri: petImage }} style={styles.imagePreview} />
      )}

      <Button
        mode="contained"
        style={styles.button}
        onPress={addPet}
      >
        Add Pet
      </Button>
      {pets.length > 0 && (
        <Button
          mode="contained"
          style={styles.button}
          onPress={removePets}
        >
          Remove a Pet
        </Button>
      )}
      <Text style={styles.subtitle}>Your Pets</Text>
      <FlatList
        data={pets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.petItem}>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.petImage}
              />
            )}
            <View>
              <Text style={styles.petText}>Name: {item.name}</Text>
              <Text style={styles.petText}>Breed: {item.breed}</Text>
              <Text style={styles.petText}>
                Age: {item.age} Years Old
              </Text>
              <Text style={styles.petText}>
                Weight: {item.weight} Pounds
              </Text>
            </View>
          </View>
        )}
      />

      {/* Navigate to Pet Swiper */}
      {pets.length > 0 && (
        <Button
          mode="contained"
          style={styles.doneButton}
          onPress={() => router.replace('/Swiper')}
        >
          Done? Click here!
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E5E5E5', // Consistent background color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 80,
  },
  input: {
    height: 50, // Consistent height
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff', // To match UserManagementScreen
    marginBottom: 15,
  },
  button: {
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#333333', // Consistent button color
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // To match UserManagementScreen inputs
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  petImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
  },
  petText: {
    fontSize: 16,
    marginBottom: 2,
  },
  doneButton: {
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#333333',
  },
});