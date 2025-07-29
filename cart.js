let cart = JSON.parse(localStorage.getItem('cart')) || {};

function updateCartSummary() {
  let totalItems = 0;
  let totalPrice = 0;

  for (const id in cart) {
    let item = cart[id];
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  }

  let totalItemsElement = document.getElementById('total-items');
  let totalPriceElement = document.getElementById('total-price');

  if (totalItemsElement && totalPriceElement) {
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }
}

function showCartItems() {
  let cartContainer = document.querySelector('.cart-items');
  cartContainer.innerHTML = '';

  for (let id in cart) {
    let item = cart[id];

    let cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';

    let imageHTML = item.image
      ? `<img src="${item.image}" alt="Custom Card" class="cart-item-image" />`
      : '';

    cartItemDiv.innerHTML = `
      ${imageHTML}
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
      </div>
    `;

    cartContainer.appendChild(cartItemDiv);
  }
}

window.onload = function () {
  let addButtons = document.getElementsByClassName('add-to-cart');
  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', function () {
      let product = this.parentElement.parentElement;
      let id = product.getAttribute('data-id');
      let name = product.querySelector('.cart-item-name').textContent;
      let priceText = product.querySelector('.cart-item-price').textContent;
      let quantityInput = product.querySelector('.cart-item-quantity');
      let price = parseFloat(priceText.replace('$', ''));
      let quantity = parseInt(quantityInput.value);

      if (isNaN(quantity) || quantity < 1) {
        alert("Please enter a valid quantity.");
        return;
      }

      if (cart[id]) {
        cart[id].quantity += quantity;
      } else {
        cart[id] = { name: name, price: price, quantity: quantity };
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(name + " added to cart.");
      updateCartSummary();
      showCartItems();
    });
  }

  let removeButtons = document.getElementsByClassName('remove-cart-item');
  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener('click', function () {
      let product = this.parentElement.parentElement;
      let id = product.getAttribute('data-id');
      let name = product.querySelector('.cart-item-name').textContent;

      if (cart[id]) {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(name + " removed from cart.");
        updateCartSummary();
        showCartItems();
      }
    });
  }

  updateCartSummary();
  showCartItems();
};

const imageInput = document.getElementById('imageUpload');
const previewDiv = document.getElementById('cardPreview');

imageInput.addEventListener('change', function () {
  const file = this.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (event) {
      previewDiv.innerHTML = `<img src="${event.target.result}" alt="Card Preview" style="max-width: 300px;">`;
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please upload a valid image file.");
  }
});
document.getElementById('checkout-button').addEventListener('click', function () {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const userLink = document.getElementById('customLink')?.value.trim() || "No link provided";

  let message = "Order Summary:\n\n";

  for (let id in cart) {
    const item = cart[id];
    message += `• ${item.name} - $${item.price} x ${item.quantity}\n`;
  }

  let total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\nTotal: $${total.toFixed(2)}\n\n`;

  message += `User Link: ${userLink}\n`;

  if (cart['custom-card']?.image) {
    message += "\nPreview Image (copy & paste in browser):\n" + cart['custom-card'].image + "\n";
  }

  message += "\nPlease confirm the order.";

  const email = "adilkortbi@Tappy-Out.com";
  const subject = "New Tappy-Out Order";
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  window.location.href = mailtoLink;
});
