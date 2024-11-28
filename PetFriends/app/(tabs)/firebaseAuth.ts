import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKRE3nu2VmQMD360N-sARfH4qwFMQHADM",
  authDomain: "petfriends-f4e4f.firebaseapp.com",
  projectId: "petfriends-f4e4f",
  storageBucket: "gs://petfriends-f4e4f.firebasestorage.app",
  messagingSenderId: "83001307905",
  appId: "1:271333370479:ios:350d0d2a53915bbde5bb9a",
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Log initialization
console.log("Firebase initialized");

// User authentication
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Save pet to Firestore
export const savePet = async (userId: string, petData: any) => {
  try {
    const petsRef = collection(db, `users/${userId}/pets`);
    const petDoc = doc(petsRef); // Generate a new document
    await setDoc(petDoc, petData);
    console.log("Pet saved:", petData);
  } catch (error) {
    console.error("Error saving pet:", error);
    throw error;
  }
};

// Fetch pets for a specific user
export const fetchPets = async (userId: string) => {
  try {
    const petsRef = collection(db, `users/${userId}/pets`);
    const petsSnapshot = await getDocs(petsRef);
    const pets = petsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched pets for user:", userId, pets);
    return pets;
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
};

// Fetch all pets (for swiper functionality)
export const fetchAllPets = async () => {
    console.log("Returning dummy data...");
    return [
      {
        id: "1",
        name: "Buddy",
        breed: "Golden Retriever",
        weight: "25lbs",
        image: "https://dogtime.com/wp-content/uploads/sites/12/2024/03/GettyImages-1285465107-e1710251441662.jpg",
      },
      {
        id: "2",
        name: "Max",
        breed: "Labrador",
        weight: "30lbs",
        image: "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFicmFkb3IlMjByZXRyaWV2ZXJ8ZW58MHx8MHx8fDA%3D",
      },
      {
        id: "3",
        name: "Pluto",
        breed: "Black Labrador",
        weight: "35lbs",
        image: "https://media.discordapp.net/attachments/1231112157144289320/1307614872967843890/image.jpg?ex=673af2c0&is=6739a140&hm=533f3f7d9795d001f108fc90051cbb3ed22f7a5b75849151ca2ccf723152b2ea&=&width=762&height=1196",
      },
    ];
  };
  

// Upload pet image to Firebase Storage
export const uploadPetImage = async (userId: string, fileUri: string) => {
  try {
    const timestamp = Date.now();
    const imageRef = ref(storage, `users/${userId}/pets/${timestamp}.jpg`);
    console.log("Uploading image to path:", imageRef.fullPath);

    const response = await fetch(fileUri);
    if (!response.ok) {
      throw new Error("Failed to fetch image from URI.");
    }

    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(imageRef);
    console.log("Image uploaded. URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
