
import { collection } from "/js/firebase.js";
import { 
        auth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        onSnapshot,
        db,
        doc,
        getDoc
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

// const singleBlog = document.querySelector(".blog")
// const readButton = document.getElementById("czytaj")



/* === Main Code === */

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView();
    showUserGreeting(userGreetingEl, user);
    
    const uid = user.uid;
  } else {
    showLoggedOutView();
  }
});



/* === event listeners === */


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


fetchRealTimeBlogsfromDB();




// document.addEventListener("click", function (event) {
//   if (event.target.classList.contains("btn") && event.target.classList.contains("dark")) {
//     event.preventDefault();
//     const blogLink = event.target.getAttribute("href");
//     const blogID = blogLink.substring(blogLink.lastIndexOf('/') + 1);

//     if (blogID) {
//       console.log("Valid blogID:", blogID);
//       fetchSingleBlogFromDB(blogID);
//     } else {
//       console.error("Invalid blogID:", blogID);
//     }
//   }
// });


/* === Functions === */













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
  const postEl = document.getElementById("blog-section");
  const postElLog = document.getElementById("blog-section-log");
  // Clear the content of postEl before rendering new posts
  postEl.innerHTML = "";
  postElLog.innerHTML = "";
  onSnapshot(collection(db, "blogs"), (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      renderPost(postEl, postElLog, doc.data());
      console.log(doc.id);
    });
  });
}

function renderPost(postEl, postElLog, postData) {
  const shortenedArticle = postData.article.length > 100
    ? postData.article.substring(0, 100) + '...'
    : postData.article;

  const blogID = postData.id; 
  const blogContainer = document.createElement('div');
  blogContainer.classList.add('blog');
  blogContainer.innerHTML = `
    <h5>Post dodany dnia: ${displayDate(postData.createdAt)}</h5>
    <div class="image">
      <img src="${postData.bannerImage} alt="Banner Image">
    </div><br>
    <div class="title">${postData.title}</div><br>
    <div class="article">${shortenedArticle}</div><br>
    <button class="btn dark czytaj-button" href="blog-post">czytaj</button>
  `;

  postEl.appendChild(blogContainer);
  postElLog.appendChild(blogContainer.cloneNode(true));

  
  const czytajButton = blogContainer.querySelector('.czytaj-button');
  czytajButton.addEventListener('click', () => fetchSingleBlogFromDB(blogID));
}




function renderSinglePost(titleEl, publishedEl, imageEl, articleEl, postData) {
  
  try {
    
    

  
    publishedEl.innerHTML = `Post dodany dnia - ${displayDate(postData.createdAt)}`;

    
    imageEl.innerHTML = `<img src="${postData.bannerImage} alt="Banner Image">`;
  
    titleEl.innerHTML = postData.title;
    
    articleEl.innerHTML = postData.article;
  } catch (error) {
    console.error("Error rendering single post:", error);
  }
}

function fetchSingleBlogFromDB(blogID) {
  
  const publishedEl = document.querySelector('.published');
  const imageEl = document.querySelector('.imageBlog');
  const titleEl = document.querySelector('.title');
  const articleEl = document.querySelector('.article');

  const blogRef = doc(db, "blogs", blogID);

  getDoc(blogRef)
    .then((doc) => {
      if (doc.exists()) {
        renderSinglePost(titleEl, publishedEl, imageEl, articleEl, doc.data());
        const singleBlogSection = document.querySelector('.blog-post');
        singleBlogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

export {fetchRealTimeBlogsfromDB,
renderPost};