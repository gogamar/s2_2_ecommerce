// If you have time, you can move this variable "products" to a json or js file and load the data in this js. It will look more professional
let products = [];

function loadProducts() {
  fetch("../data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      products = data.products;
      console.log("Products loaded:", products);
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
}

loadProducts();

// => Reminder, it's extremely important that you debug your code.
// ** It will save you a lot of time and frustration!
// ** You'll understand the code better than with console.log(), and you'll also find errors faster.
// ** Don't hesitate to seek help from your peers or your mentor if you still struggle with debugging.

// Improved version of cartList. Cart is an array of products (objects), but each one has a quantity field to define its quantity, so these products are not repeated.
let cart = [];
let total = 0;

// Exercise 1
function buy(id) {
  // 1. Loop for to the array products to get the item to add to cart
  let product;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      product = products[i];
      break;
    }
  }

  if (!product) {
    console.error("Product not found");
    return;
  }
  console.log("Product found:", product);

  // 2. Add found product to the cart array
  let cartItem;

  for (let n = 0; n < cart.length; n++) {
    if (cart[n].id === id) {
      cartItem = cart[n];
      break;
    }
  }

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  console.log("Cart updated:", cart);
}

// Exercise 2
function cleanCart() {
  cart = [];
  total = 0;
  console.log("Cart has been cleared.", cart);
}

// Exercise 3
function calculateTotal() {
  // Calculate total price of the cart using the "cartList" array
}

// Exercise 4
function applyPromotionsCart() {
  // Apply promotions to each item in the array "cart"
}

// Exercise 5
function printCart() {
  // Fill the shopping cart modal manipulating the shopping cart dom
}

// ** Nivell II **

// Exercise 7
function removeFromCart(id) {}

function open_modal() {
  printCart();
}
