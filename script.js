// ===== Product Data with images =====
const products = [
  { id: 1, name: "T-shirt", price: 20, image: "images/tshirt.jpg" },
  { id: 2, name: "Jeans", price: 40, image: "images/jeans.jpg" },
  { id: 3, name: "Sneakers", price: 60, image: "images/sneakers.jpg" },
  { id: 4, name: "Hoodies", price: 60, image: "images/hoodies.jpg" },
  { id: 5, name: "Watches", price: 60, image: "images/watches.jpg" },
  { id: 6, name: "Bags", price: 60, image: "images/bags.jpg" },
];

// ===== Coupon Codes =====
const coupons = {
  SAVE10: 10,
  SAVE20: 20,
  WELCOME5: 5,
};

// ===== Global State =====
let activeDiscount = 0; // Holds current applied discount percentage
const cart = {};        // Cart object storing productId: quantity pairs

// ===== Render Product List =====
function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

// ===== Add Product to Cart =====
function addToCart(id) {
  cart[id] = cart[id] ? cart[id] + 1 : 1; // Increment quantity or initialize
  renderCart();
  updateBasketCount();
}

// ===== Render Shopping Cart =====
function renderCart() {
  const container = document.getElementById("cart");
  container.innerHTML = "";

  for (let id in cart) {
    const product = products.find(p => p.id == id);
    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="details">
        <h4>${product.name}</h4>
        <p>Quantity: ${cart[id]}</p>
        <p>Total: $${cart[id] * product.price}</p>
        <button onclick="updateCart(${id}, 1)">+</button>
        <button onclick="updateCart(${id}, -1)">-</button>
      </div>
    `;
    container.appendChild(div);
  }
}

// ===== Update Cart Quantity =====
function updateCart(id, change) {
  cart[id] += change;
  if (cart[id] <= 0) delete cart[id]; // Remove product if quantity is 0
  renderCart();
  updateBasketCount();
}

// ===== Show Checkout Panel =====
function showCheckout() {
  document.getElementById("checkout").style.display = "block";
  renderCheckout();
}

// ===== Render Checkout Summary =====
function renderCheckout() {
  const container = document.getElementById("checkout-summary");
  container.innerHTML = "";
  let subtotal = 0;

  for (let id in cart) {
    const product = products.find(p => p.id == id);
    const itemTotal = cart[id] * product.price;

    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="details">
        <h4>${product.name}</h4>
        <p>${cart[id]} × $${product.price} = $${itemTotal}</p>
      </div>
    `;
    container.appendChild(div);

    subtotal += itemTotal;
  }

  // Calculate and show discount and total
  const discountAmount = (subtotal * activeDiscount) / 100;
  const total = subtotal - discountAmount;

  container.innerHTML += `<p><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>`;
  container.innerHTML += `<p><strong>Discount (${activeDiscount}%): -$${discountAmount.toFixed(2)}</strong></p>`;
  container.innerHTML += `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;
}

// ===== Apply Coupon Code =====
function applyCoupon() {
  const code = document.getElementById("coupon").value.trim().toUpperCase();
  const message = document.getElementById("discount-message");

  if (coupons[code]) {
    activeDiscount = coupons[code];
    message.textContent = `Coupon applied: ${activeDiscount}% off`;
    message.style.color = "yellow";
  } else {
    activeDiscount = 0;
    message.textContent = "Invalid coupon code.";
    message.style.color = "red";
  }

  renderCheckout();
}

// ===== Update Basket Count in Header =====
function updateBasketCount() {
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const basketElement = document.getElementById("basket-count");
  if (basketElement) {
    basketElement.textContent = count;
  }
}

// ===== Initial Rendering =====
renderProducts();
