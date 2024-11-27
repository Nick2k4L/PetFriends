import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { savePet, fetchPets, uploadPetImage } from '../../utilities/firebaseAuth';
import { getAuth } from 'firebase/auth';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

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

  useEffect(() => {
    if (userId) {
      fetchPets(userId)
        .then(setPets)
        .catch((error) => Alert.alert('Error', error.message));
    }
  }, [userId]);

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };
    
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        Alert.alert('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setPetImage(uri);
      }
    });
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
  
    try {
      let imageUrl: string | undefined = undefined;
      if (petImage) {
        imageUrl = await uploadPetImage(userId, petImage);
      }
      const petData = { id: userId, name: petName, age: petAge, breed: petBreed, weight: petWeight, image: imageUrl };
      await savePet(userId, petData);
      setPets([...pets, petData]);
      setPetName('');
      setPetAge('');
      setPetBreed('');
      setPetWeight('');
      setPetImage('');
      Alert.alert('Success', 'Pet added successfully!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Pet</Text>
      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        value={petName}
        onChangeText={setPetName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={petAge}
        onChangeText={setPetAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={petBreed}
        onChangeText={setPetBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (e.g., 10kg)"
        value={petWeight}
        onChangeText={setPetWeight}
        keyboardType="numeric"
      />
      <Button title="Select Image (Optional)" onPress={pickImage} />
      {petImage ? <Image source={{ uri: petImage }} style={styles.imagePreview} /> : null}
      <Button title="Add Pet" onPress={addPet} />
      <Text style={styles.subtitle}>Your Pets</Text>
      <FlatList
        data={pets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.petItem}>
            {item.image && <Image source={{ uri: item.image }} style={styles.petImage} />}
            <View>
              <Text>Name: {item.name}</Text>
              <Text>Breed: {item.breed}</Text>
              <Text>Weight: {item.weight}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  petImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});
