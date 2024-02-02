import { db } from "/js/firebase.js";
import { doc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const blogSection = document.querySelector('.blog-section');

getDocs(collection(db, "blogs")).then((snapshot) => {
    snapshot.forEach((blog) => {
        if (blog.id !== decodeURI(location.pathname.split("/").pop())) {
            createBlog(blog);
        }
    });
});

const createBlog = (blog) => {
    const data = blog.data();
    blogSection.innerHTML += `
        <div class="blog-card">
            <img src="${data.bannerImage}" class="blog-image" alt="">
            <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
            <p class="blog-overview">${data.article.substring(0, 150) + '...'}</p>
            <a href="/${blog.id}" class="btn dark">czytaj</a>            
        </div>
    `;
};

// var slideshows = document.querySelectorAll('[data-component="slideshow"]');
// slideshows.forEach(initSlideShow);

// function initSlideShow(slideshow) {
//     var slides = slideshow.querySelectorAll('[role="list"] .slide');
//     var index = 0, time = 5000;
//     slides[index].classList.add('active');

//     function showSlide() {
//         slides[index].classList.remove('active');
//         index = (index + 1) % slides.length;
//         slides[index].classList.add('active');
//         setTimeout(showSlide, time);
//     }

//     setTimeout(showSlide, time);
// }


let list = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let dots = document.querySelectorAll('.slider .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');


let active = 0;
let lenghthItems = items.length - 1;

next.onclick = function() {
    if(active + 1 > lenghthItems) {
        active = 0;
    }else {
        active = active + 1;
    }
    reloadSlider();
}

prev.onclick = function() {
    if(active - 1 < 0){
        active = lenghthItems;
    }else{
        active = active -1;
    }
    reloadSlider();
}

let refreshSlider = setInterval(() => {next.click()}, 3000);

function reloadSlider() {
    let checkLeft = items[active].offsetLeft;
    list.style.left = -checkLeft + 'px';

    let lastActiveDot = document.querySelector('.slider .dots li.active');
    lastActiveDot.classList.remove('active');
    dots[active].classList.add('active');
    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => {next.click()}, 3000);
}

dots.forEach((li, key) => {
    li.addEventListener('click', function(){
        active = key;
        reloadSlider();
    })
})
