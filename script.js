'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  
  section1.scrollIntoView({ behavior: 'smooth' });
});



document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
// Refactored slider function to be callable after testimonials load
function sliderInit() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    dotContainer.innerHTML = '';
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Remove previous event listeners if any
  btnRight?.replaceWith(btnRight.cloneNode(true));
  btnLeft?.replaceWith(btnLeft.cloneNode(true));
  dotContainer?.replaceWith(dotContainer.cloneNode(true));

  // Re-select after cloning
  const btnLeftNew = document.querySelector('.slider__btn--left');
  const btnRightNew = document.querySelector('.slider__btn--right');
  const dotContainerNew = document.querySelector('.dots');

  btnRightNew.addEventListener('click', nextSlide);
  btnLeftNew.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainerNew.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
}

///////////////////////////////////////
// Burger menu functionality
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', function () {
  navLinks.classList.toggle('active');
  burger.classList.toggle('active');
});

// Optional: Close nav when clicking a link (mobile UX)
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', function () {
    if (window.innerWidth <= 480) {
      navLinks.classList.remove('active');
      burger.classList.remove('active');
    }
  });
});

///////////////////////////////////////
// Open Account Modal Form Validation & Show/Hide Password
const openAccountForm = document.getElementById('openAccountForm');
const formError = document.getElementById('formError');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

// Regex patterns
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{6,}$/; // min 6 chars, 1 letter, 1 number

openAccountForm.addEventListener('submit', function (e) {
  e.preventDefault();
  formError.textContent = '';
  const firstName = openAccountForm.firstName.value.trim();
  const lastName = openAccountForm.lastName.value.trim();
  const email = openAccountForm.email.value.trim();
  const password = openAccountForm.password.value;

  if (!firstName || !lastName || !email || !password) {
    formError.textContent = 'All fields must be filled.';
    return;
  }
  if (!emailRegex.test(email)) {
    formError.textContent = 'Please enter a valid email address.';
    return;
  }
  if (!passwordRegex.test(password)) {
    formError.textContent = 'Password must be at least 6 characters, include a letter and a number.';
    return;
  }
  // Success: you can proceed with form submission (AJAX, etc.)
  formError.style.color = 'var(--color-primary)';
  formError.textContent = 'Success!';
  // openAccountForm.submit(); // Uncomment to actually submit
});

togglePassword.addEventListener('click', function () {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

///////////////////////////////////////
// Fetch and display testimonials (images from server, not local repo)
async function loadTestimonials() {
  const slider = document.getElementById('testimonialsSlider');
  if (!slider) return;
  try {
    // Example: Fetching from jsonplaceholder and using their avatars (not local)
    const res = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    const data = await res.json();
    const testimonials = data.map(t => `
      <div class="slide">
        <div class="testimonial">
          <h5 class="testimonial__header">${t.name}</h5>
          <blockquote class="testimonial__text">${t.body}</blockquote>
          <address class="testimonial__author">
            <img src="https://i.pravatar.cc/100?u=${t.email}" alt="" class="testimonial__photo" />
            <h6 class="testimonial__name">${t.email}</h6>
            <p class="testimonial__location">User ID: ${t.id}</p>
          </address>
        </div>
      </div>
    `).join('');
    // Insert testimonials before slider buttons and dots
    slider.innerHTML = testimonials + slider.innerHTML;
    // Initialize slider after testimonials are loaded
    sliderInit();
  } catch (err) {
    slider.innerHTML = '<p style="color:var(--color-tertiary);padding:2rem;">Could not load testimonials.</p>' + slider.innerHTML;
  }
}
// Call on page load
loadTestimonials();

///////////////////////////////////////
// Cookie notification logic
const cookieMessage = document.getElementById('cookieMessage');
const acceptCookies = document.getElementById('acceptCookies');

if (cookieMessage && acceptCookies) {
  // Hide if already accepted
  if (localStorage.getItem('cookiesAccepted')) {
    cookieMessage.style.display = 'none';
  }
  acceptCookies.addEventListener('click', function () {
    cookieMessage.style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'true');
  });
}
