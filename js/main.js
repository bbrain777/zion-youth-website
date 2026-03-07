// Toggle mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Theme toggle button
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

function updateThemeToggleIcon(theme) {
  if (!themeToggleBtn) {
    return;
  }
  themeToggleBtn.textContent = theme === 'dark' ? '☀' : '🌙';
}

function setTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
  updateThemeToggleIcon(theme);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  });
}

// Donation form submission handling
const donationForm = document.getElementById('donation-form');
const thankYouMessage = document.getElementById('donation-thankyou');

if (donationForm) {
  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple form validation can be added here if desired

    // Show thank you message
    thankYouMessage.textContent = `Thank you, ${donationForm.fullName.value}, for your generous donation of $${donationForm.amount.value}!`;
    thankYouMessage.classList.remove('hidden');

    // Reset form
    donationForm.reset();
  });
}

// Contact form submission handling (static site: prevent POST to page)
const contactForm = document.querySelector('.contact-form');
const contactThankYou = document.getElementById('contact-thankyou');

if (contactForm && contactThankYou) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactThankYou.textContent = `Thank you, ${contactForm.name.value}. Your message has been received.`;
    contactThankYou.classList.remove('hidden');
    contactForm.reset();
  });
}
