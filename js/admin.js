
import { collection } from "/js/firebase.js";
import { 
        auth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        onSnapshot,
        db,
        doc
         } 
         from "/js/firebase.js";



const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")





const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const signOutButtonEl = document.getElementById("sign-out")
const createAccountButtonEl = document.getElementById("create-account-btn")

const userGreetingEl = document.getElementById("user-greeting")

const postEl = document.getElementById("blog-section")

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView()
    showUserGreeting(userGreetingEl, user)
    const uid = user.uid;
    
  } else {
    showLoggedOutView()
  }
});



/* === even listeners === */


// signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  authCreateAccountWithEmail();
});
signInButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  authSignInWithEmail();
});

signOutButtonEl.addEventListener("click", function(event) {
  event.preventDefault();
  authSignOut();
})

/* === Functions === */


fetchRealTimeBlogsfromDB();










/* = Functions - Firebase - Authentication = */


function authCreateAccountWithEmail() {
    const email = emailInputEl.value;
    const password = passwordInputEl.value;

    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        
      })
      .catch((error) => {
        console.error(error.message);
      });
   
    
}

function authSignInWithEmail() {
    const email = emailInputEl.value;
    const password = passwordInputEl.value; 

    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    
    console.log("Sign in with email and password")
  })
  .catch((error) => {
    console.error(error.message);
  });
    
}

function authSignOut() {
    signOut(auth).then(() => {
      
  }).catch((error) => {
    console.error(error.message);
  });
}


function displayDate(firebaseDate) {
  if(!firebaseDate) {
    return "Date not available"
  }
  const date = firebaseDate.toDate()
  
  const day = date.getDate()
  const year = date.getFullYear()
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = monthNames[date.getMonth()]

  let hours = date.getHours()
  let minutes = date.getMinutes()
  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes

  return `${day} ${month} ${year} - ${hours}:${minutes}`
}






/* == Functions - UI Functions == */



function showLoggedOutView() {
  hideElement(viewLoggedIn)
  showElement(viewLoggedOut)
  console.log("logged Out view")
}



function showLoggedInView() {
  hideElement(viewLoggedOut)
  showElement(viewLoggedIn)
  console.log("loggedIn  view")
}

function showElement(element) {
  element.style.display = "flex"
  element.style.flexDirection = "column";
 
}

function hideElement(element) {
  element.style.display = "none"
}

function clearInputField(field) {
field.value = ""
}

function clearAuthFields() {
clearInputField(emailInputEl)
clearInputField(passwordInputEl)
}

function showUserGreeting(element, user) {
 
      const displayName = user.displayName;
      
    
      if (displayName) {
          const userFirstName = displayName.split(" ")[0]
          
          element.textContent = `Cześć ${userFirstName}, witaj na swoim profilu "Dieta na co dzień"`
      } else {
          element.textContent = `Cześć, witaj na swoim profilu "Dieta na co dzień"`
      }
}

function fetchRealTimeBlogsfromDB() {
      onSnapshot(collection(db, "blogs"), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          renderPost(postEl, doc.data())
        })
      })
}

function renderPost(postEl, postData) {
  postEl.innerHTML += `
  <div class="blog">
      <h3>${displayDate(postData.createdAt)}</h3>
      <div class="title">${postData.title}</div>
      <div class="article">${postData.article}</div>
  </div>
  `
}

