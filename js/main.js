import { Shop } from "./shop.js";

async function init() {
  try {
    await Shop.loadProducts();
    await loadComponent("components/navbar.html", "navbar");
    removeNavbarLinks();
    await loadComponent("components/footer.html", "footer");
    await loadComponent("components/modal.html", "modal");

    const products = Shop.getProducts();
    Shop.renderProducts();

    document.addEventListener("click", (event) => {
      if (event.target.matches(".buy-button-js")) {
        const productId = parseInt(event.target.dataset.productId, 10);
        Shop.buy(productId);
        console.log(`Product with ID ${productId} added to cart.`);
      }
      if (event.target.matches("#cleancart-btn-js")) {
        Shop.cleanCart();
      }
    });
  } catch (error) {
    console.error("Initialization error:", error);
    alert("Failed to load products. Please try again later.");
  }
}

init();

// Load HTML content into an element
async function loadComponent(url, elementId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not load ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error("Error loading component:", error);
  }
}

// Remove navbar links on checkout page
function removeNavbarLinks() {
  if (window.location.pathname.includes("checkout.html")) {
    const homepageLinks = document.getElementById("homepage-links");
    console.log("homepageLinks", homepageLinks);
    if (homepageLinks) {
      homepageLinks.classList.add("d-none");
    }
  }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      window.scrollTo({
        top: targetElement.offsetTop - navbarHeight,
        behavior: "smooth",
      });
    }
  });
});
