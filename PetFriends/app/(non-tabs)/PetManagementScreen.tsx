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
import { useNavigation } from '@react-navigation/native';
import { savePet, fetchPets, uploadPetImage } from '../../utilities/firebaseAuth';
import { getAuth } from 'firebase/auth';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { router, useRouter } from 'expo-router';

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
  const navigation = useNavigation();

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
  
    try {
      let imageUrl: string | undefined = undefined;
      if (petImage) {
        imageUrl = await uploadPetImage(userId, petImage);
      }
      const petData = { id: userId, name: petName, age: petAge, breed: petBreed, weight: petWeight, image: imageUrl };
      const petData1 = { id: userId, name: petName, age: petAge, breed: petBreed, weight: petWeight};
      if(imageUrl)
      {
        await savePet(userId, petData);
        setPets([...pets, petData]);
      }
      else
      {
        await savePet(userId, petData1);
        setPets([...pets, petData1]);
      }
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
        placeholderTextColor="black"
        placeholder="Pet Name"
        value={petName}
        onChangeText={setPetName}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        placeholderTextColor="black"
        value={petBreed}
        onChangeText={setPetBreed}
      />
       <TextInput
        style={styles.input}
        placeholder="Age (Years old)"
        placeholderTextColor="black"
        value={petAge}
        keyboardType="numeric"
        onChangeText={setPetAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (e.g., 10 Pounds)"
        value={petWeight}
        placeholderTextColor="black"
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
              <Text>Age: {item.age + " Years Old"}</Text>
              <Text>Weight: {item.weight + " Pounds"}</Text>
            </View>
          </View>
        )}
      />
       {/* Navigate to Pet Swiper */}
       {pets.length > 0 && (
          <Button title="Done? Click here!" onPress={() => router.replace('/Swiper')} />
      )}
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
