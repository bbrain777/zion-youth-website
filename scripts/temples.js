document.addEventListener("DOMContentLoaded", () => {
    // Footer info
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;
  
    // Hamburger menu
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");
  
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      menuBtn.textContent = navMenu.classList.contains("open") ? "✖" : "☰";
    });
  });
  