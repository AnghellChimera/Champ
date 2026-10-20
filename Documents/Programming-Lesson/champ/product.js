document.addEventListener('click', function (event) {
    const cartIcon = event.target.closest('img[alt="cart"]');

    if (cartIcon) {
        const productCard = cartIcon.closest('.prod-min-h');

        if (productCard) {
            // 1. Grab name
            const nameEl = productCard.querySelector('.product');
            const name = nameEl ? nameEl.textContent.trim() : 'Furniture Item';

            // 2. Grab ONLY the current price (splitting text to avoid grabbing the crossed-out price)
            const priceEl = productCard.querySelector('.current-price');
            let price = '$45.00';
            if (priceEl) {
                // Get the text and take only the first price before any extra spaces or symbols
                const priceText = priceEl.textContent.trim();
                // Splits by whitespace or grabs the first currency value
                price = priceText.split('$')[1] ? '$' + priceText.split('$')[1].trim().split(' ')[0] : priceText;
            }

            // 3. Grab the actual product image (ignoring the cart icon)
            const imgEl = productCard.querySelector('.d-flex img:not([alt="cart"])') || productCard.querySelector('img:not([alt="cart"])');
            const imgSrc = imgEl ? imgEl.getAttribute('src') : 'assests/details-prod.png';

            // Save the clean product data
            const selectedProduct = {
                name: name,
                price: price,
                image: imgSrc,
                description: 'Metal Legs and wooden frame living room chair.'
            };

            localStorage.setItem('currentProduct', JSON.stringify(selectedProduct));

            // Go to details page
            window.location.href = 'details.html';
        }
    }
});