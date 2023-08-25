"use strict";

///////////////////////////////////////

///////////////////////////////////////////////////////
///////////////////////Functions///////////////////////
///////////////////////////////////////////////////////

function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function handlHover(el) {
  if (el.target.classList.contains("nav__link")) {
    const link = el.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((e) => {
      if (e !== link) e.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

function stickyNav(entreis) {
  const [entry] = entreis;
  !entry.isIntersecting
    ? nav.classList.add("sticky")
    : nav.classList.remove("sticky");
}

function revealSection(entreis) {
  const [entry] = entreis;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  if (entry.target === document.querySelector('.section[id="section--3"')) {
    interval();
  
  } 
}

function loadImg(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );
  observer.unobserve(entry.target);
}

function goToSlide(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}

function prevSlide() {
  curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--;
  goToSlide(curSlide);
  activateDot(curSlide);
}

function nextSlide() {
  curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
  goToSlide(curSlide);
  activateDot(curSlide);
}

function interval() {   
  timer = setInterval(nextSlide, 5000);
}

function createDots() {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
}

function activateDot(slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
}

///////////////////////////////////////////////////////
///////////////////////Variables///////////////////////
///////////////////////////////////////////////////////

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const scrolBtn = document.querySelector(".btn--scroll-to");
const secScrolTo = document.querySelector("#section--1");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab ");
const tabContent = document.querySelectorAll(".operations__content ");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const headObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});
const allSections = document.querySelectorAll(".section");
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
const allImages = document.querySelectorAll("img[data-src]");
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
const slides = document.querySelectorAll(".slide");
let curSlide = 0;
const maxSlide = slides.length;
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const slider = document.querySelector(".slider");
let timer;
const dotContainer = document.querySelector(".dots");

//////////////////////////////////////////////////////
////////////////////Event Listners////////////////////
/////////////////////////////////////////////////////

// Modal window
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//smooth scrolling
scrolBtn.addEventListener("click", function () {
  secScrolTo.scrollIntoView({ behavior: "smooth" });
});

//navbar links scrolling
document.querySelector(".nav__links").addEventListener("click", function (el) {
  el.preventDefault();
  if (el.target.classList.contains("nav__link")) {
    const id = el.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed component
tabsContainer.addEventListener("mouseover", function (el) {
  const clicked = el.target.closest(".operations__tab");

  if (!clicked) return;

  //remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabContent.forEach((c) => c.classList.remove("operations__content--active"));

  clicked.classList.add("operations__tab--active");

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Menu fade animation
nav.addEventListener("mouseover", handlHover.bind(0.5));
nav.addEventListener("mouseout", handlHover.bind(1));

//Sticky navbar
headObserver.observe(header);

//Reveal Sections
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Image lazy-loading
allImages.forEach((img) => imgObserver.observe(img));

//slider
goToSlide(curSlide);
btnLeft.addEventListener("click", prevSlide);
btnRight.addEventListener("click", nextSlide);
slider.addEventListener("mouseover", function () {
  clearInterval(timer);
});
slider.addEventListener("mouseout", function () {
  interval();
});

//slider dots
createDots();
activateDot(curSlide);

dotContainer.addEventListener("click", (el) => {
  if (el.target.classList.contains("dots__dot")) {
    const { slide } = el.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
