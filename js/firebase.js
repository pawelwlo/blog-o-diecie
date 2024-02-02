
 

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
 
 
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBRkumXWdsx_YER65uUDLyw0YYdRyn-2CE",
    authDomain: "diet-blog-b8ca5.firebaseapp.com",
    databaseURL: "https://diet-blog-b8ca5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "diet-blog-b8ca5",
    storageBucket: "diet-blog-b8ca5.appspot.com",
    messagingSenderId: "1086895413120",
    appId: "1:1086895413120:web:9159ecdebe13c4b29f9365",
    measurementId: "G-DJXKKYQTW3"
  };



  // Use this to initialize the firebase App
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const analytics = getAnalytics(app);
  
  export {db};


