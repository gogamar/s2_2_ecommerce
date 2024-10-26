export const Shop = {
  products: [],
  cart: [],
  total: 0,
  totalItems: 0,

  getCart() {
    return this.cart;
  },

  setCart(cartData) {
    this.cart = Array.isArray(cartData)
      ? cartData.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
          subtotalWithDiscount: item.subtotalWithDiscount || null,
        }))
      : [];
    this.updateCartState();
  },

  async loadProducts() {
    try {
      const response = await fetch("../data/products.json");
      if (!response.ok) throw new Error("Network response not ok");

      const data = await response.json();
      this.products = data.products;
      console.log("Products loaded:", this.products);
      return this.products;
    } catch (error) {
      console.error("Error loading products:", error);
    }
  },

  renderProducts() {
    const productLists = document.querySelectorAll(".product-list-js");

    productLists.forEach((productList) => {
      const productType = productList.dataset.productType;
      const filteredProducts = this.products.filter((product) => product.type === productType);

      productList.innerHTML = filteredProducts.length ? filteredProducts.map(this.createProductCard.bind(this)).join("") : "<p>No products found for this category.</p>";
    });
  },

  createProductCard(product) {
    let itemInCart;
    if (this.cart.length > 0) {
      itemInCart = this.cart.find((item) => product.id === item.id);
    }

    return `
      <div class="col mb-5">
        <div class="card h-100 py-3" id="${product.id}">
          <div class="image-container">
            <img class="card-img-top" src="${product.image}" alt="${product.name}" />
          </div>
          <div class="card-body p-2 text-center">
            <p class="product-name">${product.name}</p>
            $${product.price.toFixed(2)}
            ${product.offer ? `<div class="text-danger offer-text">Buy ${product.offer.number} for ${product.offer.percent}% off</div>` : ""}
          </div>
          <div class="card-footer p-2 pt-0 border-top-0 bg-transparent text-center">
            ${itemInCart ? `<small class="text-muted in-cart">You have ${itemInCart.quantity} in the cart.</small>` : ""}
            <button type="button" class="btn btn-outline-success buy-button-js" data-product-id="${product.id}">
              <i class="fas fa-plus"></i> Add to cart
            </button>
          </div>
        </div>
      </div>`;
  },

  buy(id) {
    const product = this.products.find((prod) => prod.id === id);
    if (!product) return console.error("Product not found");

    const cartItem = this.cart.find((item) => item.id === id);
    cartItem ? cartItem.quantity++ : this.cart.push({ ...product, quantity: 1 });

    this.updateCartState();
    this.updateInCartMessage(product.id, cartItem ? cartItem.quantity : 1);
  },

  removeFromCart(id) {
    const cartItem = this.cart.find((item) => item.id === id);
    if (!cartItem) return console.log("Product not found in the cart.");

    cartItem.quantity > 1 ? cartItem.quantity-- : (this.cart = this.cart.filter((item) => item.id !== id));
    this.updateCartState();
    if (cartItem.quantity === 0) return;
    this.updateInCartMessage(cartItem.id, cartItem.quantity);
  },

  updateInCartMessage(product_id, quantity) {
    const productCard = document.getElementById(product_id);
    const inCartMessage = productCard.querySelector(".in-cart");

    if (inCartMessage) {
      inCartMessage.textContent = `You have ${quantity} in the cart.`;
    } else {
      const message = document.createElement("small");
      message.classList.add("text-muted", "in-cart");
      message.textContent = `You have ${quantity} in the cart.`;
      const button = productCard.querySelector(".buy-button-js");
      productCard.querySelector(".card-footer").insertBefore(message, button);
    }
  },

  updateCartState() {
    this.applyPromotionsCart();
    this.calculateTotal();
    this.updateProductCount();
    this.printCart();
  },

  applyPromotionsCart() {
    this.cart.forEach((item) => {
      if (item.offer && item.quantity >= item.offer.number) {
        const discountFactor = (100 - item.offer.percent) / 100;
        item.subtotalWithDiscount = parseFloat((item.price * discountFactor * item.quantity).toFixed(2));
      } else {
        item.subtotalWithDiscount = null;
      }
    });
  },

  calculateTotal() {
    this.total = this.cart.reduce((total, item) => {
      const itemSubtotal = item.subtotalWithDiscount || item.price * item.quantity;
      return total + itemSubtotal;
    }, 0);
  },

  updateProductCount() {
    this.totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
    const countProductField = document.getElementById("count_product");
    if (countProductField) countProductField.textContent = this.totalItems;
  },

  printCart() {
    const cartList = document.getElementById("cart-list");
    const currentCartItems = new Set(this.cart.map((item) => item.id));

    this.cart.forEach((item) => {
      const subtotal = item.subtotalWithDiscount || (item.price * item.quantity).toFixed(2);
      let itemRow = cartList.querySelector(`div[data-item-id="${item.id}"]`);

      if (itemRow) {
        itemRow.querySelector("input.form-control").value = item.quantity;
        itemRow.querySelector(".subtotal").textContent = `$${subtotal}`;
      } else {
        const newRow = document.createElement("div");
        newRow.setAttribute("data-item-id", item.id);
        newRow.classList.add("row", "py-2", "border-bottom");

        newRow.innerHTML = `
          <div class="col">${item.name}</div>
          <div class="col">$${item.price.toFixed(2)}</div>
          <div class="col">
            <div class="input-group input-group-sm">
              <button type="button" class="btn btn-outline-secondary remove-btn-js" data-product-id="${item.id}" aria-label="Remove item">
                <span class="pe-none"><i class="fas fa-minus"></i></span>
              </button>
              <input type="text" class="form-control text-center" value="${item.quantity}" readonly />
              <button type="button" class="btn btn-outline-secondary buy-button-js" data-product-id="${item.id}" aria-label="Add item">
                <span class="pe-none"><i class="fas fa-plus"></i></span>
              </button>
            </div>
          </div>
          <div class="col subtotal">$${subtotal}</div>
        `;
        cartList.appendChild(newRow);
      }
    });

    cartList.querySelectorAll("div[data-item-id]").forEach((element) => {
      const itemId = parseInt(element.getAttribute("data-item-id"), 10);
      if (!currentCartItems.has(itemId)) {
        element.remove();
      }
    });

    const totalPriceField = document.getElementById("total-price");
    if (totalPriceField) totalPriceField.textContent = this.total.toFixed(2);

    this.updateCartVisibility();

    if (document.getElementById("order-details-js")) {
      this.printOrderDetails();
    }
  },

  printOrderDetails() {
    const orderDetails = document.getElementById("order-details-js");
    const orderQuantity = document.getElementById("order-quantity-js");
    const totalOrder = document.getElementById("order-total-js");

    orderQuantity.textContent = this.totalItems;

    this.cart.forEach((item) => {
      const subtotal = item.subtotalWithDiscount || (item.price * item.quantity).toFixed(2);

      let listItem = orderDetails.querySelector(`li[data-item-id="${item.id}"]`);

      if (listItem) {
        listItem.querySelector("small.text-muted").textContent = `Quantity: ${item.quantity}`;
        listItem.querySelector("span.text-muted").textContent = `$${subtotal}`;
      } else {
        const itemHTML = `
          <li class="list-group-item d-flex justify-content-between lh-sm" data-item-id="${item.id}">
            <div>
              <h6 class="my-0">${item.name}</h6>
              <small class="text-muted">Quantity: ${item.quantity}</small>
            </div>
            <span class="text-muted">$${subtotal}</span>
          </li>
        `;

        orderDetails.insertAdjacentHTML("beforeend", itemHTML);
      }
    });
    totalOrder.textContent = `$${this.total.toFixed(2)}`;
  },

  cleanCart() {
    this.cart = [];
    this.updateCartState();
  },

  updateCartVisibility() {
    const isCartEmpty = this.cart.length === 0;
    document.getElementById("cart-content-js")?.classList.toggle("d-none", isCartEmpty);
    document.getElementById("back-to-shop-js")?.classList.toggle("d-none", !isCartEmpty);
    document.getElementById("checkout-btn-js")?.classList.toggle("d-none", isCartEmpty);
    document.getElementById("cleancart-btn-js")?.classList.toggle("d-none", isCartEmpty);
  },
};
