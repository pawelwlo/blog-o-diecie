import { db } from "/js/firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// let blogID = decodeURI(location.pathname.split("/").pop());
let pathSegments = location.pathname.split("/").filter(segment => segment !== "");
let blogID = pathSegments[pathSegments.length - 1];

console.log("Original path:", location.pathname);
console.log("Path segments:", pathSegments);
console.log("Extracted blogID:", blogID);
let docRef = doc(db, "blogs", blogID);


getDoc(docRef)
  .then((doc) => {
    if (doc.exists()) {
        
      const data = doc.data();
      setupBlog(data);
    // } else {
    //   location.replace("/");
    }
  })
  .catch((error) => {
    console.error("Error getting document:", error);
  });

const setupBlog = (data) => {
  const banner = document.querySelector('.banner');
  const blogTitle = document.querySelector('.title');
  const titleTag = document.querySelector('title');
  const publish = document.querySelector('.published');
  titleTag.innerHTML = blogTitle.innerHTML = data.title;
  publish.innerHTML = data.publishedAt;


 
    banner.style.backgroundImage = `url(${data.bannerImage})`;
    
    const article = document.querySelector('.article');
    addArticle(article, data.article);

};


const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);
    console.log(data);

    data.forEach(item => {
        if(item[0] == '#') {
            let hCount = 0;
            let i = 0;
            while(item[i] == '#') {
                hCount++;
                i++
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        else if(item[0] == "!" && item[1] == "[") {
            let separator;

            for(let i = 0; i <= item.length; i++) {
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")") {
                    separator = i;
                }
            }
            let alt = item.slice(1, separator);
            let src = item.slice(separator + 2, item.length -1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        }
        
        else {
            ele.innerHTML += `<p>${item}</p>`;
        }
        
    });

}