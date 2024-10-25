import { Shop } from "./shop.js";

async function init() {
  try {
    await Shop.loadProducts();
    await loadComponent("components/navbar.html", "navbar");
    removeNavbarLinks();
    await loadComponent("components/footer.html", "footer");
    await loadComponent("components/modal.html", "modal");

    Shop.renderProducts();

    document.addEventListener("click", (event) => {
      if (event.target.matches(".buy-button-js")) {
        const productId = parseInt(event.target.dataset.productId, 10);
        Shop.buy(productId);
      }

      if (event.target.matches("#cleancart-btn-js")) {
        Shop.cleanCart();
      }

      if (event.target.matches(".remove-btn-js")) {
        const productId = parseInt(event.target.dataset.productId, 10);
        Shop.removeFromCart(productId);
      }
    });

    if (window.location.hash) {
      scrollToHash();
    }
    window.addEventListener("hashchange", scrollToHash);
  } catch (error) {
    console.error("Failed to load products. Please try again later.", error);
  }
}

init();

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
    if (homepageLinks) {
      homepageLinks.classList.add("d-none");
    }
  }
}

// Smooth scrolling function
function scrollToHash() {
  const targetId = window.location.hash;
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    const navbarHeight = document.querySelector(".navbar").offsetHeight;
    const scrollToPosition = targetElement.offsetTop - navbarHeight;
    window.scrollTo({
      top: scrollToPosition,
      behavior: "smooth",
    });
  }
}
