# Simple E-Commerce Demo Application

## Introduction

This is a demo e-commerce application showcasing basic shopping cart functionality, promotions, and checkout validation. Built with JavaScript and HTML, this project can be run locally using Visual Studio Code's Live Server extension.

## Requirements

### Clone this repository

To get started, clone this repository:

```bash
$ git clone https://github.com/gogamar/s2_2_ecommerce.git
```

### Open in Visual Studio Code

1. Open the project folder in [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension in VS Code if it is not already installed.

### Run the Application

1. Right-click on the `index.html` file in the file explorer.
2. Select **"Open with Live Server"**. This will launch the application in your default web browser.
3. The application will reload automatically with each code update, thanks to Live Server.

## Features

### 1. **Add Products to Cart**

- Users can add products to their cart by clicking the blue button on each product.
- When a product is added:
  - If it's not already in the cart, it is added with a quantity of 1.
  - If it’s already in the cart, its quantity is increased by 1.

### 2. **Clear Cart**

- Users can empty their cart using the `cleanCart()` function, resetting all items in the cart.

### 3. **Calculate Total Price**

- The application calculates the total amount by iterating through all items in the cart.

### 4. **Apply Promotions**

- Two promotions are applied dynamically:
  - **20% discount** on oils if 3 or more bottles are purchased.
  - **30% discount** on baking products if 10 or more items are purchased.
- The `applyPromotionsCart()` function checks eligibility and adjusts the total price accordingly.

### 5. **Display Cart**

- The `printCart()` function dynamically updates the cart modal (`cartModal`) to show current items in the cart.

### 6. **Checkout Form Validation**

- Checkout validation logic is handled in `checkout.js` and includes:
  - All fields are required and must have at least 3 characters.
  - Name and surname fields accept only letters.
  - Phone field accepts only numbers.
  - Password must contain letters and numbers.
  - Email must have a valid email format.
- If any field fails validation, it is highlighted in red with an error message.

### 7. **Remove Products from Cart**

- Users can decrease the quantity of items in the cart with `removeFromCart()`.
- If a product’s quantity reaches 1 and is decreased, it is removed from the cart. Promotions are updated accordingly.

### 8. **Styling**

- The application is styled to provide a professional appearance suitable for client demonstrations.
