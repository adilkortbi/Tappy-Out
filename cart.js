let cart = JSON.parse(localStorage.getItem('cart')) || {};

function updateCartSummary() {
  let totalItems = 0;
  let totalPrice = 0;

  for (const id in cart) {
    let item = cart[id];
    totalItems = totalItems + item.quantity;
    totalPrice = totalPrice + item.price * item.quantity;
  }

  let totalItemsElement = document.getElementById('total-items');
  let totalPriceElement = document.getElementById('total-price');

  if (totalItemsElement && totalPriceElement) {
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }
}

function showCartItems() {
  let cartList = document.getElementById('cart-items-list');

  // If cart-items-list element doesn't exist yet, create and add it
  if (!cartList) {
    cartList = document.createElement('ul');
    cartList.id = 'cart-items-list';
    let cartSummary = document.getElementById('cart-summary');
    if (cartSummary) {
      cartSummary.parentNode.insertBefore(cartList, cartSummary);
    } else {
      document.body.appendChild(cartList);
    }
  }

  cartList.innerHTML = '';

  for (const id in cart) {
    let item = cart[id];
    let li = document.createElement('li');
    li.textContent = item.name + ' - $' + item.price + ' × ' + item.quantity + ' = $' + (item.price * item.quantity).toFixed(2);
    cartList.appendChild(li);
  }
}

window.onload = function() {
  let addButtons = document.getElementsByClassName('add-to-cart');
  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', function() {
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
        cart[id].quantity = cart[id].quantity + quantity;
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
    removeButtons[i].addEventListener('click', function() {
      let product = this.parentElement.parentElement;
      let id = product.getAttribute('data-id');
      let name = product.querySelector('.cart-item-name').textContent;

      if (cart[id]) {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(name + " removed from cart.");
        updateCartSummary();
        showCartItems();
      } else {
        alert(name + " is not in the cart.");
      }
    });
  }

  let clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
      if (confirm("Are you sure you want to clear the cart?")) {
        cart = {};
        localStorage.removeItem('cart');
        alert("Cart has been cleared.");
        updateCartSummary();
        showCartItems();
      }
    });
  }

  // Initialize UI on page load
  updateCartSummary();
  showCartItems();
};
