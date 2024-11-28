import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, collectionGroup, getDocs, query, orderBy} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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

export const logOut = async () => {
  try{
    await signOut(auth);

    console.log("User signed out.");

  } catch (error){
    console.error("Error signing out:", error);
    console.log("Unable to log out.")
  }
}

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
    try{
      const petsQuery = query(collectionGroup(db,'pets')); // This will search the database based of of name 
      const querySnap = await getDocs(petsQuery); // This will execute the query
      const petsMap = querySnap.docs.map(doc => ({id: doc.id, ...doc.data(),}));
      console.log("Fetched all pets: ", petsMap);
      return petsMap
    }
    catch (error){
      console.error("Error fetching pets: ", error);
      throw error;
    }
    
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
