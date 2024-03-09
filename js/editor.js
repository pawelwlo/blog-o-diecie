import { auth } from "/js/firebase.js";
import {
  db,
  collection,
  addDoc,
  serverTimestamp,
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
  setDoc,
  doc
} from "/js/firebase.js";

const bannerPicUpload = document.getElementById("banner-upload");
const blogTitle = document.getElementById("title");
const article = document.getElementById("article");
const publishButton = document.getElementById("publish-btn");
const user = auth.currentUser;
const banner = document.querySelector(".banner");
const uploadInput = document.querySelector('#image-upload');
let bannerPath;
const storage = getStorage();
const storageRef = ref(storage);

bannerPicUpload.addEventListener("change", function (event) {
  event.preventDefault();
  uploadImage(event);
});

publishButton.addEventListener("click", function (event) {
  event.preventDefault();
  publishBlog();
});

uploadInput.addEventListener('change', function (event) {
  event.preventDefault();
  uploadArticleImage(event);
});

async function uploadImage(event) {
  const file = event.target.files[0];

  if (file) {
    const timestamp = new Date().getTime();
    const filename = `file_${timestamp}_${file.name}`;
    const fileRef = ref(storageRef, filename);

    try {
      await uploadBytes(fileRef, file);
      console.log('File uploaded successfully!');

      const downloadURL = await getDownloadURL(fileRef);
      bannerPath = downloadURL;
      banner.style.backgroundImage = `url("${bannerPath}")`;
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  }
}

function publishBlog() {
  const postBody = article.value;
  const postTitle = blogTitle.value;

  if (postBody) {
    if (bannerPath) {
      addPostToDB(postTitle, postBody, bannerPath, user);
      console.log("Blog published");
      clearInputField(article);
      clearInputField(blogTitle);
      clearInputField(banner);
      swal("Twój wpis bloga został opublikowany!");

      // Split the postBody into paragraphs and append to the article
      appendParagraphsToArticle(postBody);
    } else {
      alert("Dodaj baner do bloga przed publikacją.");
    }
  }
}

function appendParagraphsToArticle(text) {
  const ele = article; // Assuming 'article' is an HTML element

  // Split text into paragraphs and list items
  const lines = text.split("\n").filter(item => item.length);

  // Detect and append paragraphs or list items to the article
  let isInList = false;
  let listItems = [];

  lines.forEach(line => {
    if (line.trim().startsWith("* ")) {
      // Treat as list item
      isInList = true;
      listItems.push(line.trim().substring(2)); // Remove "* " prefix
    } else {
      // Treat as paragraph
      if (isInList) {
        // End the previous list if applicable
        ele.innerHTML += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
        listItems = [];
        isInList = false;
      }

      // Check for image markdown and replace with <img> tag
      const imageRegex = /!\[([^\]]*)]\(([^)]*)\)/g;
      let match;
      let lastIndex = 0;

      while ((match = imageRegex.exec(line)) !== null) {
        const altText = match[1];
        const imageURL = match[2];
        const imgTag = `<img src="${imageURL}" alt="${altText}" class="article-image">`;
        ele.innerHTML += line.substring(lastIndex, match.index) + imgTag;
        lastIndex = match.index + match[0].length;
      }

      // Append the remaining text after processing images
      ele.innerHTML += line.substring(lastIndex) + '<br>';
    }
  });

  // Handle the remaining list items, if any
  if (isInList) {
    ele.innerHTML += `<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`;
  }
}

function insertImageIntoArticle(imageURL) {
  const cursorPosition = article.selectionStart; // Get the current cursor position
  const articleText = article.value;

  // Insert the image URL at the cursor position
  const newArticleText =
    articleText.substring(0, cursorPosition) +
    `![Alt Text](${imageURL})` +
    articleText.substring(cursorPosition);

  // Update the article's value with the new text
  article.value = newArticleText;
}

async function addPostToDB() {
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      title: `${blogTitle.value}`,
      article: `${article.value}`,
      bannerImage: bannerPath,
      articleImage: downloadURL,
      createdAt: serverTimestamp(),
    });

    const blogID = docRef.id;
    console.log("Document written with ID: ", blogID);

    // Update the document with the correct blogID
    await setDoc(doc(db, "blogs", blogID), { id: blogID }, { merge: true });
  } catch (error) {
    console.error(error.message);
  }
}

function clearInputField(field) {
  if (field === banner) {
    field.style.backgroundImage = '';
  } else {
    field.value = "";
  }
}

async function uploadArticleImage(event) {
  const file = event.target.files[0];

  if (file) {
    const timestamp = new Date().getTime();
    const filename = `file_${timestamp}_${file.name}`;
    const fileRef = ref(storageRef, filename);

    try {
      await uploadBytes(fileRef, file);
      console.log('File uploaded successfully!');

      const downloadURL = await getDownloadURL(fileRef);

      // Insert the image URL at the current cursor position in the article
      insertImageIntoArticle(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  }
}


