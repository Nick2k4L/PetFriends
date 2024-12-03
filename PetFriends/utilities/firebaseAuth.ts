import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, collectionGroup, getDocs, query, orderBy, where, getDoc, addDoc, Timestamp, QuerySnapshot, deleteDoc} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, reload, signOut, multiFactor, RecaptchaVerifier, User, PhoneAuthProvider, PhoneMultiFactorGenerator, PhoneAuthCredential, PhoneMultiFactorAssertion, signInWithPhoneNumber, 
  updatePhoneNumber, ApplicationVerifier, signInWithCredential, getMultiFactorResolver, MultiFactorError, 
  MultiFactorResolver, FactorId, MultiFactorInfo, MultiFactorSession,
  PhoneInfoOptions} from 'firebase/auth';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { router, useRouter } from 'expo-router';
import { useState } from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
//import ReCAPTCHA from 'react-native-recaptcha-v2';





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


interface ParkVisit {
  id?: string;         // Optional ID for the Firestore document
  latitude: number;    // Latitude of the park
  longitude: number;   // Longitude of the park
  duration: number;    // Visit duration in minutes
  user: string;        // User ID of the visitor
  timestamp: Date;     // Timestamp of the visit
}


// const [phoneNumber, setPhoneNumber] = useState(""); 
// const [code, setCode] = useState("");
// const [confirm, setConfirm] = useState("");



// export const handleSendCode = async (user: User) {
//   try {
//     const result = await signInWithPhoneNumber(auth, user.phoneNumber as string);
//     Alert.alert('Code Sent', 'Please check your messages...');
//     return result;



//   } catch(error) {
//     Alert.alert('Error', 'Failed to send verification code');
//   }
// }

// export const handleConfirmationCode = async(code: string){
//   try{

//   }catch(error){

//   }


// }

const promptForPhoneNumber = () => {
  return new Promise<string>((resolve, reject) => {
    Alert.prompt(
      'Multi-Factor Authentication',
      'Please input your phone number before continuing',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            Alert.alert('Error', 'User cancelled');
            reject(new Error('User cancelled'));
          },
        },
        {
          text: 'Submit',
          onPress: (input) => {
            if (!input || !/^\+?[0-9]{10,15}$/.test(input)) {
              Alert.alert('Invalid Input', 'Please enter a valid phone number.');
              reject(new Error('Invalid phone number'));
            } else {
              resolve(input);
            }
          },
        },
      ],
      'plain-text',
      '', // Default value
      'phone-pad' // Keyboard type
    );
  });
};


const promptForVerificationCode = () => {
  return new Promise<string>((resolve, reject) => {
    Alert.prompt(
      'Verification Code',
      'Please input your verification code',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            Alert.alert('Error', 'User cancelled');
            reject(new Error('User cancelled'));
          },
        },
        {
          text: 'Submit',
          onPress: (input) => {
            if (!input || !/^[0-9]{6}$/.test(input)) {
              Alert.alert('Invalid Input', 'Please enter a valid 6-digit code.');
              reject(new Error('Invalid verification code'));
            } else {
              resolve(input);
            }
          },
        },
      ],
      'plain-text',
      '', // Default value
      'number-pad' // Keyboard type
    );
  });
};



export const joinPlaydate = async (parkVisitId: string, userId: string): Promise<void> => {
  try {
    const parkVisitRef = doc(db, 'parks', parkVisitId); // Use the 'parks' collection
    const parkVisitSnapshot = await getDoc(parkVisitRef);

    if (parkVisitSnapshot.exists()) {
      const parkVisitData = parkVisitSnapshot.data();
      const participants = parkVisitData.participants || [];

      if (!participants.includes(userId)) {
        await setDoc(
          parkVisitRef,
          { participants: [...participants, userId] },
          { merge: true } // Merge with existing data
        );
        console.log('User joined park visit:', parkVisitId);
        Alert.alert('Success', 'You have joined the playdate!');
      } else {
        Alert.alert('Error', 'User already joined this park visit.');
        console.log('User already joined this park visit.');
      }
    } else {
      throw new Error(`Park visit does not exist: ${parkVisitId}`);
    }
  } catch (error) {
    console.error('Error joining park visit:', error);
    throw error;
  }
};


// Fetch all park visits from Firestore
export const fetchParkVisits = async (): Promise<ParkVisit[]> => {
  try {
    const parksRef = collection(db, 'parks');
    const parksSnapshot = await getDocs(parksRef);
    const parks = parksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(), // Convert Firestore timestamp to JS Date
    })) as ParkVisit[];
    console.log('Fetched park visits:', parks);
    return parks;
  } catch (error) {
    console.error('Error fetching park visits:', error);
    throw error;
  }
};

// Add a new park visit to Firestore
export const addParkVisit = async (visit: ParkVisit): Promise<void> => {
  try {
    const parksRef = collection(db, 'parks');
    await addDoc(parksRef, {
      ...visit,
      timestamp: Timestamp.fromDate(new Date(visit.timestamp)), // Convert Date to Firestore Timestamp
    });
    console.log('Park visit added:', visit);
  } catch (error) {
    console.error('Error adding park visit:', error);
    throw error;
  }
};



// Log initialization
console.log("Firebase initialized");

// User authentication

// User authentication
export const signUpWithEmail = async (email: string, password: string) => {
  try{
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await sendEmailVerification(userCredential.user); // sends an email verification email to the user
    Alert.alert('Verification email sent. Please check your inbox. Then Press Sign in!'); // will give them an alert 
    
    console.log("User signed up:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};


export const loginWithEmail = async (email: string, password: string, recaptchaVerifier: ApplicationVerifier) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // grabbing the user 
    const countryCode = '+1';
    //const verificationCode = '';
    //user.multiFactor
    
    await reload(user); // ensuring we are getting the latest with email verified or not.

    const userFactors = multiFactor(user).enrolledFactors; // This checks if the user is enrolled in any factors yet
    console.log('user factors', userFactors); // tells the console the factors

    if(userFactors.length === 0){ // if the length is zero, then we know they are not enrolled
     

      // Prompt for phone number
      const phoneNumber = await promptForPhoneNumber(); // this lets the user dial in a number
      console.log("Phone number entered:", phoneNumber);

      // Initiate phone verification with multiFactorSession
      const multiFactorUser = multiFactor(user); // Grabbing the user for MFA
      const multiFactorSession = await multiFactorUser.getSession(); // Getting the current session
      console.log("Obtained multiFactorSession:", multiFactorSession);

      const phoneProvider = new PhoneAuthProvider(auth); // new phone provider
      

      // Create phoneInfoOptions with phoneNumber and session. Bundles them together for us
      const phoneInfoOptions = {
        phoneNumber: countryCode + phoneNumber, // Add the US country code for now
        session: multiFactorSession, // our session
      };

      let verificationId: string; // ensure that it is a string
      try {
        verificationId = await phoneProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier); // verifying the phoneNumber
        console.log("Verification ID obtained:", verificationId);
      } catch (verifyError) {
        console.error("Error during phone number verification:", verifyError);
        Alert.alert('Verification Error', 'Failed to send verification code. Please try again.');
        throw verifyError;
      }

      // Prompt user for verification code
      const verificationCode = await promptForVerificationCode(); // Ask the user for a verification code
      console.log("Verification code entered:", verificationCode);

      // Create a PhoneAuthCredential with the code
      let phoneCredential: PhoneAuthCredential;
      try {
        phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode); // Authenticate that Credential
        console.log("PhoneAuthCredential created.");
      } catch (credentialError) {
        console.error("Error creating PhoneAuthCredential:", credentialError);
        Alert.alert('Credential Error', 'Failed to create credentials. Please try again.');
        throw credentialError;
      }

      // Create a PhoneMultiFactorAssertion
      let assertion;
      try {
        assertion = PhoneMultiFactorGenerator.assertion(phoneCredential); // Crearte the multifactor assertion
        console.log("PhoneMultiFactorAssertion created.");
      } catch (assertionError) {
        console.error("Error creating PhoneMultiFactorAssertion:", assertionError);
        Alert.alert('Assertion Error', 'Failed to create assertion. Please try again.');
        throw assertionError;
      }

      // Enroll the second factor with a display name
      try {
        await multiFactorUser.enroll(assertion, "Phone Number"); // enroll the user into 2FA
        console.log("Phone number enrolled as second factor.");
        Alert.alert('Success', 'Phone number verified and added as a second factor.');
        await setDoc(doc(db, 'users', user.uid), {
          phoneNumber: countryCode + phoneNumber
        }, { merge: true });
        console.log("Phone number stored in Firestore.");
      } catch (enrollError) {
        console.error("Error during second factor enrollment:", enrollError);
        Alert.alert('Enrollment Error', 'Failed to enroll phone number as a second factor.');
        throw enrollError;
      }


    }
    else
    {
      // User is already enrolled in MFA
      console.log('User has MFA');
      const phoneProvider = new PhoneAuthProvider(auth); // new phone provider
      //const phoneNumber = await promptForPhoneNumber();
      const verificationId = await phoneProvider.verifyPhoneNumber(user.phoneNumber as string, recaptchaVerifier);
      const verificationCode = await promptForVerificationCode();

      try {
        const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
        await signInWithCredential(auth, phoneCredential);
        console.log("Signed in with MFA");
      } catch(error) {
        console.error("Error signing in with MFA:", error);
        // Handle error, e.g., display an error message to the user
      }
    }
    

    const petsUserHas = fetchPets(user.uid); // seeing if the user has any pets or not, determines where they go after sign in!

    if(user.emailVerified && (await petsUserHas).length > 0) // checking to see if the user has any pets associated with it!
    {
      router.replace('/Swiper'); // So if the email is verified and we have pets we will jump into the swiper screen / default
    }
    else if(user.emailVerified && (await petsUserHas).length == 0) // if the email is verified and we have no pets, then we know they are a first time user
    {
      router.replace('/PetManagementScreen'); // redirect them into the pet management screen.
    }
    else if (!user.emailVerified) // if they have not verified their email.
    {
      Alert.alert(
        'Email Not Verified',
        'Please verify your email before logging in.',
        [
          { text: 'Resend Verification Email', onPress: () => sendEmailVerification(user) }, // resend the notification of course.
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      // Sign out the user
      await signOut(auth); 
    }

    console.log("User signed in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) 
  {
    console.log(error);
    if (error.code === 'auth/multi-factor-auth-required') {
      
      try {
        const resolver = getMultiFactorResolver(auth, error);
        const phoneHint = resolver.hints.find(hint => hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID);

        if (!phoneHint) {
          Alert.alert('MFA Error', 'No suitable multi-factor authentication method found.');
          throw error;
        }

        const phoneInfoOptions: PhoneInfoOptions = {
          multiFactorHint: phoneHint,
          session: resolver.session
        };

        const phoneAuthProvider = new PhoneAuthProvider(auth);

        const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        const code = await promptForVerificationCode();
        console.log("Verification code for MFA:", code);

        if (verificationId) {
          const cred = PhoneAuthProvider.credential(verificationId, code);
          const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
          console.log("MultiFactorAssertion created:", multiFactorAssertion);

          // Complete sign-in with the assertion
          const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
          console.log("MFA sign-in successful:", userCredential);

          const user = userCredential.user;

          const petsUserHas = fetchPets(user.uid); // seeing if the user has any pets or not, determines where they go after sign in!


          if(user.emailVerified && (await petsUserHas).length > 0) // checking to see if the user has any pets associated with it!
          {
            router.replace('/Swiper'); // So if the email is verified and we have pets we will jump into the swiper screen / default
          }
          else if(user.emailVerified && (await petsUserHas).length == 0) // if the email is verified and we have no pets, then we know they are a first time user
          {
            router.replace('/PetManagementScreen'); // redirect them into the pet management screen.
          }

          // Optionally, you can return the user here
          return userCredential.user;
        }

      } catch (mfaError) {
        console.error("Error completing multi-factor sign-in:", mfaError);
        Alert.alert('MFA Sign-In Error', 'Failed to complete multi-factor sign-in.');
        throw mfaError;
      }

    } 
    else{
    console.error("Error signing in:", error);
    }
    throw error;
    console.log("we are in here");
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

export const removePet = async (userId : string, petName: string) =>
{
  try {
    // 1. Get a reference to the collection of pets for the user
    const petsRef = collection(db, `users/${userId}/pets`);

    // 2. Query the collection to find the pet with the matching name
    const querySnapshot = await getDocs(query(petsRef, where("name", "==", petName)));

    // 3. If a pet with the matching name is found, delete it
    if (!querySnapshot.empty) {
      const petDoc = querySnapshot.docs[0];
      await deleteDoc(petDoc.ref);
      console.log("Pet Deleted:", petName);
    } else {
      console.log("No pet found with name:", petName);
    }
  } catch (error) {
    console.error("Error deleting Pet:", error);
    throw error;
  }
}

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

function getPhoneNumberFromFirestore(uid: any) {
  throw new Error('Function not implemented.');
}


