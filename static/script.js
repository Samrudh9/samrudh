// ========== MOBILE NAVIGATION ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
}

if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -30px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');
if (contactForm && typeof emailjs !== 'undefined') {
  emailjs.init('ui1ogHVF1Ppm1DqEl');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    status.textContent = 'Sending...';
    status.className = 'form-status';

    emailjs.sendForm('service_3n53gkc', 'template_p61z0id', contactForm)
      .then(() => {
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        status.className = 'form-status success';
        contactForm.reset();
        setTimeout(() => { status.textContent = ''; }, 5000);
      })
      .catch((error) => {
        status.textContent = '✗ Failed to send. Please try again.';
        status.className = 'form-status error';
        console.error('EmailJS error:', error);
      });
  });
}
