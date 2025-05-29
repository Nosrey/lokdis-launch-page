// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, get, set } from "firebase/database";
import { 
  getAuth, 
  signInAnonymously, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithCredential 
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK9c10v2pVjPo5MxTNxqVIKEAKoYWOC8U",
  authDomain: "lokdis-app.firebaseapp.com",
  databaseURL: "https://lokdis-app-default-rtdb.firebaseio.com",
  projectId: "lokdis-app",
  storageBucket: "lokdis-app.firebasestorage.app",
  messagingSenderId: "492376810046",
  appId: "1:492376810046:web:6e5104ff0f8b630384a76f",
  measurementId: "G-MJ3GRBLKK7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider for additional scopes
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Function to handle anonymous authentication
export const authenticateAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
    console.log("Anonymous auth successful:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("Error during anonymous authentication:", error);
    throw error;
  }
};

// Function to handle Google authentication
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log("Google auth successful:", user.uid);
    return { user, token, credential };
  } catch (error) {
    console.error("Error during Google authentication:", error);
    throw error;
  }
};

// Function to get birthdate from Firebase (if exists)
export const getBirthdateFromFirebase = async (uid) => {
  try {
    const birthdateRef = ref(database, `users/${uid}/birthdate`);
    const snapshot = await get(birthdateRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error getting birthdate:", error);
    return null;
  }
};

// Function to store birthdate in Firebase
export const storeBirthdateInFirebase = async (uid, birthdate) => {
  try {
    const birthdateRef = ref(database, `users/${uid}/birthdate`);
    await set(birthdateRef, birthdate);
    console.log("Birthdate stored successfully");
    return true;
  } catch (error) {
    console.error("Error storing birthdate:", error);
    return false;
  }
};

// Export any Firebase services you'll use throughout the app
// Example:
// export const auth = getAuth(app);
// export const db = getFirestore(app); 