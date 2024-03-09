// Import the functions you need from the SDKs you need
import { initializeApp 
        } 
          from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, 
          createUserWithEmailAndPassword, 
          signInWithEmailAndPassword, 
          signOut,
          onAuthStateChanged,

        } 
          from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAnalytics 
        } 
          from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

import { 
        getFirestore, 
        collection, 
        addDoc,
        serverTimestamp,
        onSnapshot,
        doc,
        setDoc,
        getDoc,
        getDocs
      } 
      from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

import {getStorage, 
        ref, 
        uploadBytes, 
        getDownloadURL
      }
      from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_NCnVwDkr1DWyF40TNLPiArwGNLxw1Gk",
  authDomain: "blog-dieta-68ca8.firebaseapp.com",
  projectId: "blog-dieta-68ca8",
  storageBucket: "blog-dieta-68ca8.appspot.com",
  messagingSenderId: "140192968686",
  appId: "1:140192968686:web:4c71d02ceeed91bacae8ff",
  measurementId: "G-ES2HV8QJSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export{
        auth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        signOut,
        onAuthStateChanged,
        db,
        collection, 
        addDoc,
        serverTimestamp,
        onSnapshot,
        doc,
        app,
        setDoc,
        getStorage,
        ref, 
        uploadBytes, 
        getDownloadURL,
        getDocs,
        getDoc

      };