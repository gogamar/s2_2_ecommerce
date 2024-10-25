export const Shop = {
  products: [],
  cart: [],
  total: 0,

  async loadProducts() {
    try {
      const response = await fetch("../data/products.json");
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      const data = await response.json();
      this.products = data.products;
      console.log("Products loaded:", this.products);
      return this.products;
    } catch (error) {
      console.error("Error loading products:", error);
    }
  },

  getProducts() {
    return this.products;
  },

  renderProducts() {
    const productLists = document.querySelectorAll(".product-list-js");
    console.log("product lists", productLists);

    productLists.forEach((productList) => {
      const productType = productList.dataset.productType;
      console.log("product type", productType);
      productList.innerHTML = "";

      const filteredProducts = this.products.filter((product) => {
        return product.type === productType;
      });

      filteredProducts.forEach((product) => {
        const productCard = `
                <div class="col mb-5">
                    <div class="card h-100">
                      <div class="image-container">
                          <img class="card-img-top" src="${product.image}" alt="${product.name}" />
                      </div>
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${product.name}</h5>
                                $${product.price.toFixed(2)}
                                ${product.offer ? `<div class="text-danger">Offer: Buy ${product.offer.number} for ${product.offer.percent}% off</div>` : ""}
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <button type="button" class="btn btn-outline-dark buy-button-js" data-product-id="${product.id}">Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        productList.innerHTML += productCard;
      });

      if (filteredProducts.length === 0) {
        productList.innerHTML = "<p>No products found for this category.</p>";
      }
    });
  },

  buy(id) {
    const product = this.products.find((prod) => prod.id === id);

    if (!product) {
      console.error("Product not found");
      return;
    }

    console.log("Product found:", product);
    const cartItem = this.cart.find((item) => item.id === id);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.updateProductCount();
    this.applyPromotionsCart();
    this.calculateTotal();
    this.printCart();
  },

  updateProductCount() {
    const totalProducts = this.cart.reduce((total, item) => total + item.quantity, 0);
    const countProductField = document.getElementById("count_product");
    countProductField.textContent = totalProducts;
  },

  calculateTotal() {
    this.total = 0;

    this.cart.forEach((item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);
      const subtotal = item.subtotalWithDiscount || price * quantity;

      this.total += isNaN(price) ? 0 : subtotal;
    });

    console.log("Total price:", this.total.toFixed(2));
    return this.total.toFixed(2);
  },

  applyPromotionsCart() {
    this.cart.forEach((item) => {
      if (item.offer) {
        const { number, percent } = item.offer;
        let discountedPrice = item.price;

        if (item.quantity >= number) {
          discountedPrice *= (100 - percent) / 100;
        }

        item.subtotalWithDiscount = parseFloat((discountedPrice * item.quantity).toFixed(2));
      }
    });

    console.log("Cart after promotions:", this.cart);
  },

  cleanCart() {
    this.cart = [];
    this.total = 0;
    this.printCart();
    console.log("Cart has been cleared.", this.cart);
  },

  printCart() {
    const cartList = document.getElementById("cart_list");
    const cartTotal = document.getElementById("total_price");

    let cartItemsHTML = "";
    cartList.innerHTML = "";

    this.cart.forEach((item) => {
      const subtotal = item.subtotalWithDiscount || (item.price * item.quantity).toFixed(2);

      cartItemsHTML += `
        <tr>
          <th scope="row">${item.name}</th>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <div class="input-group">
              <button class="btn btn-outline-secondary" type="button" onclick="decreaseQuantity(${item.id})">
                <i class="fas fa-minus"></i>
              </button>
              <input type="text" class="form-control text-center" value="${item.quantity}" readonly />
              <button class="btn btn-outline-secondary" type="button" onclick="increaseQuantity(${item.id})">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </td>
          <td>$${subtotal}</td>
        </tr>
        `;
    });

    cartList.innerHTML = cartItemsHTML;
    cartTotal.textContent = this.total.toFixed(2);

    this.updateCartVisibility();
  },

  removeFromCart(id) {
    const productIndex = this.cart.findIndex((item) => item.id === id);

    if (productIndex >= 0) {
      const product = this.cart[productIndex];

      if (product.quantity > 1) {
        product.quantity--;
        console.log("Product quantity updated:", product.quantity);
      } else {
        this.cart.splice(productIndex, 1);
      }

      this.applyPromotionsCart();
      this.calculateTotal();
      console.log("Updated cart:", this.cart);
    } else {
      console.log("Product not found in the cart.");
    }
  },

  openModal() {
    this.printCart();
  },

  updateCartVisibility() {
    const isCartEmpty = this.cart.length === 0;
    const shopButton = document.getElementById("shop-btn-js");
    const checkoutButton = document.getElementById("checkout-btn-js");
    const cleanCartButton = document.getElementById("cleancart-btn-js");

    shopButton.classList.toggle("d-none", !isCartEmpty);
    checkoutButton.classList.toggle("d-none", isCartEmpty);
    cleanCartButton.classList.toggle("d-none", isCartEmpty);
  },
};
