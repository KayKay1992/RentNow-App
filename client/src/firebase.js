// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: "rentnow-fbcbd.firebaseapp.com",
  projectId: "rentnow-fbcbd",
  storageBucket: "rentnow-fbcbd.appspot.com",
  messagingSenderId: "817822015951",
  appId: "1:817822015951:web:de58c8098374e36bd572ba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);