import AOS from "aos";

// Animations
AOS.init();

// Image lazy loading - usage:
//
// <img
//    data-src="..."
//    alt="..."
//    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII="
// />;
//
// the data-src attribute has the actual image URL
// the src attribute is an 1x1 PNG image
document.querySelectorAll("img[data-src]").forEach((img) => {
    const image = new Image();
    image.src = img.dataset.src;
    image.addEventListener("load", () => {
        img.src = img.dataset.src;
        img.classList.toggle("loaded");
    });
});

// toggle .scrolled on the navbar when the user scrolls down
const $nav = document.querySelector("nav");
window.addEventListener("scroll", () => {
    $nav.classList.toggle("scrolled", window.scrollY > 0);
});

// write any other frontend specific JS code here
