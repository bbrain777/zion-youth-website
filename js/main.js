// TODO: Replace with your real admin inbox email.
const ADMIN_NOTIFICATION_EMAIL = 'info@zionyouths.org';

// TODO: Replace with your real donation checkout link (PayPal/Stripe/Paystack/Flutterwave).
const DONATION_CHECKOUT_URL = 'https://www.paypal.com/donate/?hosted_button_id=REPLACE_ME';

function isEmailConfigured() {
  return ADMIN_NOTIFICATION_EMAIL !== 'admin@zionyouths.org';
}

function isDonationConfigured() {
  return isEmailConfigured() && !DONATION_CHECKOUT_URL.includes('REPLACE_ME');
}

async function sendFormToAdmin(payload, subject, autoReplyMessage) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append('_subject', subject);
  formData.append('_template', 'table');
  formData.append('_autoresponse', autoReplyMessage);

  const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Unable to send message right now.');
  }
}

function setFeedbackMessage(el, message, isError = false) {
  if (!el) {
    return;
  }

  el.textContent = message;
  el.classList.remove('hidden', 'error');
  if (isError) {
    el.classList.add('error');
  }
}

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
  themeToggleBtn.textContent = theme === 'dark' ? '\u2600' : '\uD83C\uDF19';
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

// Donation form: notify admin + auto reply + redirect to payment checkout
const donationForm = document.getElementById('donation-form');
const donationFeedback = document.getElementById('donation-thankyou');

if (donationForm && donationFeedback) {
  donationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isDonationConfigured()) {
      setFeedbackMessage(
        donationFeedback,
        'Setup needed: add your admin email and donation checkout link in js/main.js first.',
        true
      );
      return;
    }

    const fullName = donationForm.fullName.value.trim();
    const email = donationForm.email.value.trim();
    const amount = donationForm.amount.value.trim();
    const message = donationForm.message.value.trim();

    const payload = {
      form_type: 'Donation Intent',
      full_name: fullName,
      email,
      amount_usd: amount,
      message
    };

    try {
      await sendFormToAdmin(
        payload,
        `Donation intent from ${fullName}`,
        `Thank you ${fullName} for your donation intent. Our team has received your details and will follow up within 48 hours.`
      );

      setFeedbackMessage(
        donationFeedback,
        `Thank you, ${fullName}. Redirecting you to secure checkout now...`
      );

      donationForm.reset();
      window.setTimeout(() => {
        window.location.href = DONATION_CHECKOUT_URL;
      }, 1800);
    } catch (error) {
      setFeedbackMessage(
        donationFeedback,
        'We could not submit your donation details right now. Please try again shortly.',
        true
      );
    }
  });
}

// Contact form: notify admin + auto reply to sender
const contactForm = document.querySelector('.contact-form');
const contactThankYou = document.getElementById('contact-thankyou');

if (contactForm && contactThankYou) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isEmailConfigured()) {
      setFeedbackMessage(
        contactThankYou,
        'Setup needed: add your admin email in js/main.js first.',
        true
      );
      return;
    }

    const fullName = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    const payload = {
      form_type: 'Contact Request',
      full_name: fullName,
      email,
      message
    };

    try {
      await sendFormToAdmin(
        payload,
        `Contact request from ${fullName}`,
        `Thank you ${fullName}. We have received your message and will get back to you within 48 hours.`
      );

      setFeedbackMessage(
        contactThankYou,
        `Thank you, ${fullName}. Your message has been received. We will get back to you within 48 hours.`
      );

      contactForm.reset();
    } catch (error) {
      setFeedbackMessage(
        contactThankYou,
        'We could not submit your message right now. Please try again shortly.',
        true
      );
    }
  });
}

