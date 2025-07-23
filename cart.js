var cart = {};


  function updateCartSummary() {
    var totalItems = 0;
    var totalPrice = 0;

   
    for (var id in cart) {
      var item = cart[id];
      totalItems = totalItems + item.quantity;
      totalPrice = totalPrice + (item.price * item.quantity);
    }

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
  }

  window.onload = function () {
 
    var addButtons = document.getElementsByClassName('add-to-cart');
   
    for (var i = 0; i < addButtons.length; i++) {
      var button = addButtons[i];

      button.addEventListener('click', function () {
        var product = this.parentElement.parentElement; 
        var id = product.getAttribute('data-id');
        var name = product.querySelector('.cart-item-name').textContent; 
        var priceText = product.querySelector('.cart-item-price').textContent; 
        var price = parseFloat(priceText.replace('$', '')); 
        var quantityInput = product.querySelector('.cart-item-quantity');
        var quantity = parseInt(quantityInput.value); 

        if (quantity < 1 || isNaN(quantity)) {
          alert("Enter a quantity of 1 or more.");
          return;
        }

       
        if (cart[id]) {
          cart[id].quantity = cart[id].quantity + quantity;
        } else {
          cart[id] = {
            name: name,
            price: price,
            quantity: quantity
          };
        }

        alert(name + " added to cart.");
        updateCartSummary();
      });
    }

   
    var removeButtons = document.getElementsByClassName('remove-cart-item');
    for (var j = 0; j < removeButtons.length; j++) {
      var removeButton = removeButtons[j];
      removeButton.addEventListener('click', function () {
      var product = this.parentElement.parentElement;
      var id = product.getAttribute('data-id');
      var name = product.querySelector('.cart-item-name').textContent;

      if (cart[id]) {
        delete cart[id];
        alert(name + " removed from cart.");
        updateCartSummary();
      } else {
        alert(name + " is not in the cart.");
      }
    });
  }
};