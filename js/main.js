import { Shop } from "./shop.js";

async function init() {
  try {
    await Shop.loadProducts();
    await loadComponent("components/navbar.html", "navbar");
    if (window.location.pathname.includes("checkout.html")) {
      removeNavbarLinks();
    }

    await loadComponent("components/footer.html", "footer");
    await loadComponent("components/modal.html", "modal");

    loadCartFromLocalStorage();
    Shop.renderProducts();

    document.addEventListener("click", (event) => {
      if (event.target.matches(".buy-button-js")) {
        console.log("Buy button clicked");
        const productId = parseInt(event.target.dataset.productId, 10);
        Shop.buy(productId);
        saveCartToLocalStorage();
      }

      if (event.target.matches(".remove-btn-js")) {
        const productId = parseInt(event.target.dataset.productId, 10);
        Shop.removeFromCart(productId);
        saveCartToLocalStorage();
      }

      if (event.target.matches("#cleancart-btn-js")) {
        Shop.cleanCart();
        saveCartToLocalStorage();
      }
    });

    const orderDetails = document.getElementById("order-details-js");
    if (orderDetails) {
      Shop.printOrderDetails();
    }

    const currentYear = new Date().getFullYear();
    document.getElementById("current-year").textContent = currentYear;

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

function saveCartToLocalStorage() {
  const cart = Shop.getCart();
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    const cartData = JSON.parse(storedCart);
    Shop.setCart(cartData);
  }
}

// Remove navbar hash links on checkout page
function removeNavbarLinks() {
  const homepageLinks = document.querySelectorAll(".hash-link");
  if (homepageLinks.length > 0) {
    homepageLinks.forEach((link) => link.classList.add("d-none"));
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
