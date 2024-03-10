import { auth, createUserWithEmailAndPassword } from "js/firebase.js";
import { showLoggedInView, showLoggedInView } from "js/index.js";

console.log(auth);

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")



/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

function authSignInWithGoogle() {
    console.log("Sign in with Google")
}

function authSignInWithEmail() {
    console.log("Sign in with email and password")
}




function authCreateAccountWithEmail() {
    const email = emailInputEl.value;
    const password = passwordInputEl.value;

    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        showLoggedInView()
        
      })
      .catch((error) => {
        console.error(error.message);
      });
   
    
}
