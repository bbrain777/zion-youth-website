const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setTheme(theme) {
  if (theme === "dark") {
    theme = "blue";
  }

  const isBlue = theme === "blue";
  body.classList.toggle("dark-theme", isBlue);
  localStorage.setItem("theme", theme);

  if (themeToggleBtn) {
    themeToggleBtn.textContent = isBlue ? "White" : "Blue";
    themeToggleBtn.setAttribute("aria-label", isBlue ? "Switch to white theme" : "Switch to blue theme");
    themeToggleBtn.setAttribute("title", isBlue ? "Switch to white theme" : "Switch to blue theme");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTheme(localStorage.getItem("theme") || "light");
});

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    setTheme(body.classList.contains("dark-theme") ? "light" : "blue");
  });
}

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function showStatus(target, type, message) {
  if (!target) return;
  target.className = `status-message show ${type}`;
  target.textContent = message;
}

async function submitJson(form, endpoint, successMessage) {
  const status = form.parentElement.querySelector(".status-message");
  showStatus(status, "success", "Submitting...");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataToObject(form)),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "We could not save this right now.");
    }

    form.reset();
    showStatus(status, "success", successMessage);
  } catch (error) {
    showStatus(
      status,
      "error",
      `${error.message} If this continues, please contact the ZION Youth team directly.`
    );
  }
}

document.querySelectorAll("[data-member-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitJson(
      form,
      "/api/members",
      "Thank you. Your member application has been saved and our team will follow up."
    );
  });
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitJson(
      form,
      "/api/contact",
      "Thank you. Your message has been saved and our team will respond soon."
    );
  });
});

const donationForm = document.getElementById("donation-form");

if (donationForm) {
  donationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = donationForm.parentElement.querySelector(".status-message");
    const name = donationForm.fullName.value || "friend";
    showStatus(
      status,
      "success",
      `Thank you, ${name}. Online payment processing is being connected; the team will contact you with secure giving options.`
    );
    donationForm.reset();
  });
}
