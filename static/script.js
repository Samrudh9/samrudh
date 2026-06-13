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

// ========== CONTACT FORM VALIDATION ==========

/**
 * Strict email regex — rejects gibberish TLDs, requires at least 2-char domain extension,
 * disallows consecutive dots, and requires a proper domain structure.
 */
function isValidEmail(email) {
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+\-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  if (!emailRegex.test(email)) return false;

  // Reject consecutive dots
  if (/\.\./.test(email)) return false;

  // Extract domain part
  const domain = email.split('@')[1];
  if (!domain) return false;

  // Require at least one dot in domain (e.g., example.com not just "example")
  if (!domain.includes('.')) return false;

  // Reject unreasonably long local parts or domains
  const localPart = email.split('@')[0];
  if (localPart.length > 64 || domain.length > 253) return false;

  // Reject known disposable/test patterns
  const suspiciousPatterns = [
    /^test@test/i,
    /^asdf/i,
    /^qwerty/i,
    /^aaa+@/i,
    /^bbb+@/i,
    /^abc@abc/i,
    /^123@/i,
    /^fake@/i,
    /^no@no/i,
    /^a@a\./i,
    /^noreply@/i,
  ];
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) return false;
  }

  return true;
}

/**
 * Check if a string is meaningful text — rejects keyboard smashes,
 * repeated characters, and too-short messages.
 */
function isValidName(name) {
  const trimmed = name.trim();

  // Must be at least 2 chars
  if (trimmed.length < 2) return false;

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) return false;

  // Reject all-same-character strings like "aaaa" or "xxxx"
  if (/^(.)\1+$/.test(trimmed.replace(/\s/g, ''))) return false;

  // Reject keyboard-smash patterns
  if (/^[^a-zA-Z\s]+$/.test(trimmed)) return false;

  return true;
}

function isValidMessage(message) {
  const trimmed = message.trim();

  // Must be at least 10 chars
  if (trimmed.length < 10) return false;

  // Must contain at least 2 words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) return false;

  // Must contain letters (not just numbers/symbols)
  if (!/[a-zA-Z]/.test(trimmed)) return false;

  // Reject all-same-character spam
  const uniqueChars = new Set(trimmed.replace(/\s/g, '').toLowerCase());
  if (uniqueChars.size < 3) return false;

  return true;
}

/**
 * Show/clear error on a form group
 */
function showError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const error = document.getElementById(errorId);
  if (group && error) {
    group.classList.add('has-error');
    error.textContent = message;
  }
}

function clearError(groupId, errorId) {
  const group = document.getElementById(groupId);
  const error = document.getElementById(errorId);
  if (group && error) {
    group.classList.remove('has-error');
    error.textContent = '';
  }
}

/**
 * Validate the entire form. Returns true if valid.
 */
function validateContactForm() {
  let isValid = true;

  // — Name —
  const name = document.getElementById('name');
  if (!name) return false;
  const nameVal = name.value.trim();

  if (!nameVal) {
    showError('nameGroup', 'nameError', 'Name is required');
    isValid = false;
  } else if (!isValidName(nameVal)) {
    showError('nameGroup', 'nameError', 'Please enter a real name (at least 2 letters)');
    isValid = false;
  } else if (nameVal.length > 100) {
    showError('nameGroup', 'nameError', 'Name is too long (max 100 characters)');
    isValid = false;
  } else {
    clearError('nameGroup', 'nameError');
  }

  // — Email —
  const email = document.getElementById('email');
  if (!email) return false;
  const emailVal = email.value.trim();

  if (!emailVal) {
    showError('emailGroup', 'emailError', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(emailVal)) {
    showError('emailGroup', 'emailError', 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError('emailGroup', 'emailError');
  }

  // — Message —
  const message = document.getElementById('message');
  if (!message) return false;
  const messageVal = message.value.trim();

  if (!messageVal) {
    showError('messageGroup', 'messageError', 'Message is required');
    isValid = false;
  } else if (!isValidMessage(messageVal)) {
    showError('messageGroup', 'messageError', 'Please write a meaningful message (at least 10 characters, 2 words)');
    isValid = false;
  } else if (messageVal.length > 5000) {
    showError('messageGroup', 'messageError', 'Message is too long (max 5000 characters)');
    isValid = false;
  } else {
    clearError('messageGroup', 'messageError');
  }

  return isValid;
}

// ========== CONTACT FORM SUBMISSION ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {

  // Clear errors on input (live feedback)
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim() && isValidName(nameInput.value.trim())) {
        clearError('nameGroup', 'nameError');
      }
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.value.trim() && isValidEmail(emailInput.value.trim())) {
        clearError('emailGroup', 'emailError');
      }
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim() && isValidMessage(messageInput.value.trim())) {
        clearError('messageGroup', 'messageError');
      }
    });
  }

  // Initialize EmailJS if available
  if (typeof emailjs !== 'undefined') {
    emailjs.init('ui1ogHVF1Ppm1DqEl');
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Run validation
    if (!validateContactForm()) {
      return;
    }

    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    // Disable button while sending
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    status.textContent = '';
    status.className = 'form-status';

    if (typeof emailjs === 'undefined') {
      status.textContent = '✗ Email service unavailable. Please email directly.';
      status.className = 'form-status error';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      return;
    }

    emailjs.sendForm('service_3n53gkc', 'template_p61z0id', contactForm)
      .then(() => {
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        status.className = 'form-status success';
        contactForm.reset();
        // Clear all error states
        clearError('nameGroup', 'nameError');
        clearError('emailGroup', 'emailError');
        clearError('messageGroup', 'messageError');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
      })
      .catch((error) => {
        status.textContent = '✗ Failed to send. Please try again.';
        status.className = 'form-status error';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        console.error('EmailJS error:', error);
      });
  });
}
