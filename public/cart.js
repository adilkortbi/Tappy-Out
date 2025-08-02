

let cart = JSON.parse(localStorage.getItem('cart')) || {};


function updateCartSummary() {
  let totalItems = 0;
  let totalPrice = 0;

  for (const id in cart) {
    let item = cart[id];
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  }

  const totalItemsElement = document.getElementById('total-items');
  const totalPriceElement = document.getElementById('total-price');

  if (totalItemsElement && totalPriceElement) {
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }
}


function showCartItems() {
  const cartContainer = document.querySelector('.cart-items');
  cartContainer.innerHTML = '';

  for (const id in cart) {
    const item = cart[id];

    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.setAttribute('data-id', id);

    const imageHTML = item.image
      ? `<img src="${item.image}" alt="Custom Card" class="cart-item-image" />`
      : '';

    cartItemDiv.innerHTML = `
      ${imageHTML}
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
        <button type="button" class="remove-cart-item">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItemDiv);
  }

 
  const removeButtons = document.querySelectorAll('.remove-cart-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productDiv = this.closest('.cart-item');
      const id = productDiv.getAttribute('data-id');
      const name = cart[id] ? cart[id].name : '';

      if (cart[id]) {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(name + " removed from cart.");
        updateCartSummary();
        showCartItems();
      }
    });
  });
}


window.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.add-to-cart');
  
  addButtons.forEach(button => {
    button.addEventListener('click', function () {
      const product = this.closest('.cart-item');
      const id = product.getAttribute('data-id');
      const name = product.querySelector('.cart-item-name').textContent;
      const priceText = product.querySelector('.cart-item-price').textContent;
      const quantityInput = product.querySelector('.cart-item-quantity');
      const price = parseFloat(priceText.replace('$', ''));
      const quantity = parseInt(quantityInput.value);

      if (isNaN(quantity) || quantity < 1) {
        alert("Please enter a valid quantity.");
        return;
      }

      
      const imgElement = product.querySelector('.cart-item-image');
      const imageSrc = imgElement ? imgElement.src : null;

      if (cart[id]) {
        cart[id].quantity += quantity;
      } else {
        cart[id] = { name, price, quantity, image: imageSrc };
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(name + " added to cart.");
      updateCartSummary();
      showCartItems();
    });
  });

  updateCartSummary();
  showCartItems();
});


function addCartSummaryToForm(event) {
  event.preventDefault();

  const cartData = JSON.parse(localStorage.getItem('cart')) || {};
  if (Object.keys(cartData).length === 0) {
    alert("Cart is empty. Please add items before submitting.");
    return false;
  }

  let summary = "";
  for (const id in cartData) {
    const item = cartData[id];
    summary += `• ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}\n`;
  }

  const total = Object.values(cartData).reduce((sum, item) => sum + item.price * item.quantity, 0);
  summary += `\nTotal Price: $${total.toFixed(2)}\n`;

  const cartSummaryInput = document.getElementById('cartSummary');
  if (cartSummaryInput) {
    cartSummaryInput.value = summary;
  }

 
  event.target.form.submit();
}


const imageInput = document.getElementById('previewUpload');
const previewDiv = document.getElementById('cardPreview');

if (imageInput && previewDiv) {
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
      previewDiv.innerHTML = ''; 
    }
  });
}


document.getElementById('checkout-button').addEventListener('click', async () => {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    });

    const data = await response.json();

    if (data.id) {
      const stripe = Stripe('pk_test_51Re1IqGastjZV4pbbPdBuW0ccEECiOmspIzV1yfICYrHB27iYMVMvdXadGHuZlnvOpr2AYBGTXtyBiFiRmxbqN1o003LtDFq8o');
      stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert("Failed to create checkout session.");
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    alert("An error occurred. Please try again.");
  }
});
