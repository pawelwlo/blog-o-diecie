import { getDoc, doc } from "js/firebase.js";



function renderSinglePost(titleEl, publishedEl, imageEl, articleEl, postData) {
  
  try {
    // Set the content of title element
    titleEl.innerHTML = postData.title;

    // Set the content of published element
    publishedEl.innerHTML = `opublikowano dnia - ${displayDate(postData.createdAt)}`;

    // Set the background image of the image element
    imageEl.style.backgroundImage = `url(${postData.bannerImage})`;

    // Set the content of article element
    articleEl.innerHTML = postData.article;
  } catch (error) {
    console.error("Error rendering single post:", error);
  }
}

function fetchSingleBlogFromDB(blogID) {
  const titleEl = document.querySelector('.title');
  const publishedEl = document.querySelector('.published span'); // Corrected selector
  const imageEl = document.querySelector('.image');
  const articleEl = document.querySelector('.article');

  const blogRef = doc(db, "blogs", blogID);

  getDoc(blogRef)
      .then((doc) => {
          if (doc.exists()) {
              renderSinglePost(titleEl, publishedEl, imageEl, articleEl, doc.data());
          } else {
              console.log("No such document!");
          }
      })
      .catch((error) => {
          console.log("Error getting document:", error);
      });
}


document.addEventListener("DOMContentLoaded", () => {
  // Get the necessary HTML elements
  const titleEl = document.querySelector('.title');
  const publishedEl = document.querySelector('.published span');
  const articleEl = document.querySelector('.article');
  const bannerEl = document.querySelector('.banner');

  // Check if the "czytaj" button exists on the page
  const readMoreButton = document.getElementById("czytaj");
  if (readMoreButton) {
    // Add a click event listener to the "czytaj" button
    readMoreButton.addEventListener("click", (event) => {
      event.preventDefault();
      
      // Extract the blog post ID from the button's href attribute
      const blogID = doc.id;

      // Reference to the blog post in Firebase
      const blogRef = doc(db, "blogs", blogID);

      // Fetch the blog post data from Firebase
      getDoc(blogRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();

            // Display the blog post content
            titleEl.textContent = data.title;
            publishedEl.textContent = `opublikowano dnia - ${displayDate(data.publishedAt)}`;
            articleEl.innerHTML = data.article;
            bannerEl.style.backgroundImage = `url(${data.bannerImage})`;
          } else {
            console.error("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    });
  }


function displayDate(firebaseDate) {
  if (!firebaseDate) {
    return "Date not available";
  }
  const date = firebaseDate.toDate();

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];

  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day} ${month} ${year} - ${hours}:${minutes}`;
}
});
