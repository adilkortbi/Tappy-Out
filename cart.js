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

   
    let imageHTML = '';
    if (item.image) {
      imageHTML = `<img src="${item.image}" alt="Custom Card" class="cart-item-image" />`;
    }

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
const addToCartButton = document.getElementById('addToCartButton');
let uploadedImageData = null;

imageInput.addEventListener('change', function () {
  const file = this.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (event) {
      uploadedImageData = event.target.result;
      previewDiv.innerHTML = `<img src="${uploadedImageData}" alt="Card Preview" style="max-width: 300px;">`;
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please upload a valid image file.");
  }
});

addToCartButton.addEventListener('click', function () {
  if (!uploadedImageData) {
    alert("Please upload a card image first.");
    return;
  }

  const customCard = {
    name: 'Custom Card',
    price: 24.99,
    quantity: 1,
    image: uploadedImageData
  };

  cart['custom-card'] = customCard;
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Custom card added to cart.");
  updateCartSummary();
  showCartItems();
});