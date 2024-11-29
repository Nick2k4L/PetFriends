import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, collectionGroup, getDocs, query, orderBy, where, getDoc, addDoc, Timestamp, QuerySnapshot} from 'firebase/firestore';
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

interface Notification {
  id: string;          // Firestore document ID
  userId: string;      // ID of the user this notification belongs to
  message: string;     // Notification message
  timestamp: Date;     // Notification timestamp
  seen: boolean;       // Whether the notification has been seen
}




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
    await setDoc(petDoc, { ...petData, ownerId: userId });
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

// Save swipe to Firestore
export const saveSwipe = async (
  swiperId: string,
  swipedPetId: string,
  swipedPetOwnerId: string
) => {
  try {
    await addDoc(collection(db, 'swipes'), {
      swiperId,
      swipedPetId,
      swipedPetOwnerId,
      timestamp: Timestamp.now(),
    });
    console.log("Swipe saved:", { swiperId, swipedPetId, swipedPetOwnerId });
  } catch (error) {
    console.error("Error saving swipe:", error);
    throw error;
  }
};

// Check for mutual swipe
export const checkForMutualSwipe = async (
  currentUserId: string,
  swipedPetId: string
) => {
  try {
    const mutualSwipeQuery = query(
      collection(db, 'swipes'),
      where('swiperId', '==', swipedPetId),
      where('swipedPetId', '==', currentUserId)
    );
    const mutualSwipeSnapshot = await getDocs(mutualSwipeQuery);

    return !mutualSwipeSnapshot.empty; // Return true if a mutual swipe exists
  } catch (error) {
    console.error("Error checking for mutual swipe:", error);
    throw error;
  }
};

// Add notification for a user
export const addNotification = async (
  userId: string,
  message: string
) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      timestamp: Timestamp.now(),
      seen: false,
    });
    console.log("Notification added for user:", userId);
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
};

export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const querySnapshot = await getDocs(
      query(notificationsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'))
    );

    // Map Firestore documents to the Notification interface
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Ensure the data matches the Notification interface
      return {
        id: doc.id,
        userId: data.userId,
        message: data.message,
        timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to JS Date
        seen: data.seen,
      } as Notification;
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

