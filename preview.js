const imageInput = document.getElementById('imageUpload');
const previewDiv = document.getElementById('cardPreview');
const addToCartButton = document.getElementById('addToCartButton');

let uploadedImageData = null;

// Handle image upload and preview
imageInput.addEventListener('change', function () {
  const file = this.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = function (event) {
      uploadedImageData = event.target.result;

      // Show image inside the preview box
      previewDiv.innerHTML = `<img src="${uploadedImageData}" alt="Card Preview" style="max-width: 300px;">`;

      // Optional: also set background image if you want
      // previewDiv.style.backgroundImage = `url('${uploadedImageData}')`;
    };

    reader.readAsDataURL(file);
  } else {
    alert("Please upload a valid image file.");
  }
});

// Add previewed card to localStorage and go to cart
addToCartButton.addEventListener('click', function () {
  if (!uploadedImageData) {
    alert("Please upload a card image first.");
    return;
  }

  const customCard = {
    id: 'custom-card',
    name: 'Custom Card',
    price: 24.99,
    quantity: 1,
    image: uploadedImageData
  };

  const existingCart = JSON.parse(localStorage.getItem('cart')) || {};

  existingCart[customCard.id] = customCard;

  localStorage.setItem('cart', JSON.stringify(existingCart));

  window.location.href = 'Cart.html';
});
