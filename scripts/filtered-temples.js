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

  // Temple data array
  const temples = [
    {
      templeName: "Aba Nigeria",
      location: "Aba, Nigeria",
      dedicated: "2005, August, 7",
      area: 11500,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg",
    },
    {
      templeName: "Manti Utah",
      location: "Manti, Utah, United States",
      dedicated: "1888, May, 21",
      area: 74792,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg",
    },
    {
      templeName: "Payson Utah",
      location: "Payson, Utah, United States",
      dedicated: "2015, June, 7",
      area: 96630,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg",
    },
    {
      templeName: "Yigo Guam",
      location: "Yigo, Guam",
      dedicated: "2020, May, 2",
      area: 6861,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg",
    },
    {
      templeName: "Washington D.C.",
      location: "Kensington, Maryland, United States",
      dedicated: "1974, November, 19",
      area: 156558,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg",
    },
    {
      templeName: "Lima Perú",
      location: "Lima, Perú",
      dedicated: "1986, January, 10",
      area: 9600,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg",
    },
    {
      templeName: "Mexico City Mexico",
      location: "Mexico City, Mexico",
      dedicated: "1983, December, 2",
      area: 116642,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg",
    },
    // Additional temples for assignment
    {
    templeName: "Rome Italy",
    location: "Rome, Italy",
    dedicated: "2019, March, 10",
    area: 41010,
    imageUrl: "images/london_temple.jpg"
    },
    {
    templeName: "Paris France",
    location: "Le Chesnay, France",
    dedicated: "2017, May, 21",
    area: 44000,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg",  
    },
    {
    templeName: "Tokyo Japan",
    location: "Tokyo, Japan",
    dedicated: "1980, October, 27",
    area: 52590,
    imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg",
    },
  ];

  const templeGrid = document.getElementById("templeGrid");

  function parseYear(dateStr) {
    // dateStr format: "YYYY, Month, DD"
    return parseInt(dateStr.split(",")[0]);
  }

  function renderTemples(filter = "all") {
    // Clear existing content but keep the h2
    templeGrid.innerHTML = "<h2>Temples</h2>";

    let filteredTemples = temples;

    switch (filter) {
      case "old":
        filteredTemples = temples.filter(
          (t) => parseYear(t.dedicated) < 1900
        );
        break;
      case "new":
        filteredTemples = temples.filter(
          (t) => parseYear(t.dedicated) > 2000
        );
        break;
      case "large":
        filteredTemples = temples.filter((t) => t.area > 90000);
        break;
      case "small":
        filteredTemples = temples.filter((t) => t.area < 10000);
        break;
      case "all":
      default:
        filteredTemples = temples;
        break;
    }

    filteredTemples.forEach((temple) => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = temple.imageUrl;
      img.alt = temple.templeName;
      img.loading = "lazy";

      const figcaption = document.createElement("figcaption");
      figcaption.innerHTML = `
        <strong>${temple.templeName}</strong><br />
        ${temple.location}<br />
        Dedicated: ${temple.dedicated}<br />
        Area: ${temple.area.toLocaleString()} sq ft
      `;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      templeGrid.appendChild(figure);
    });
  }

  // Initial render all temples
  renderTemples();

  // Add event listeners to nav links
  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const filter = link.getAttribute("data-filter");
      renderTemples(filter);

      // Close menu on small screens if open
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        menuBtn.textContent = "☰";
      }
    });
  });
});
