 const input = document.getElementById('imageUpload');

 const card = document.getElementById('cardPreview');

    input.addEventListener('change', function () {
      const file = this.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (event) {
          card.style.backgroundImage = `url('${event.target.result}')`;
        };
        reader.readAsDataURL(file);
      } else {
        alert("invalid image file.");
      }
    });