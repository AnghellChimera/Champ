// Load saved cart items from localStorage when the page opens
window.addEventListener('DOMContentLoaded', () => {
    const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const container = document.getElementById('cart-items-container');
    const subtotalDisplay = document.querySelector('.sub-total');

    if (savedItems.length > 0 && container) {
        let htmlContent = '';
        let grandTotal = 0;

        savedItems.forEach((item, index) => {
            let itemTotal = item.unitPrice * item.quantity;
            grandTotal += itemTotal;

            // Fallback check to make sure image path is never empty
            let imageSrc = item.image ? item.image : 'assests/cart1.png';

            htmlContent += `
                <div class="row pt-3 cart-item" data-index="${index}">
                    <div class="col-md-4 col-lg-4">
                        <img src="${imageSrc}" alt="${item.name}" style="width: 150px;">
                    </div>
                    <!-- product details -->
                    <div class="col-6 col-md-4 col-lg-4">
                        <h2 class="prod pt-2">${item.name}</h2>
                        <p class="det pt-2">${item.description}</p>
                        <!-- like and delete -->
                        <div class="pt-2 but-wrap">
                            <img src="assests/VectorC.png" alt="like">
                            <img src="assests/VectorC(1).png" alt="delete" class="ms-4" style="cursor: pointer;">
                        </div>
                    </div>
                    <!-- product price and quantity -->
                    <div class="cart-row col-6 col-md-4 col-lg-4" data-price="${item.unitPrice}">
                        <div class="col-12 d-lg-flex justify-content-lg-end text-lg-end">
                            <h1 class="price col-12 pb-4 ps-3 ps-md-0 pb-md-5 pe-2">$${itemTotal.toFixed(2)}</h1>
                        </div>
                        <!-- button for increase and decrease -->
                        <div class="col-12 d-lg-flex justify-content-lg-end">
                            <div>
                                <button class="col-but border-0 rounded-3 amount-but minus-btn">-</button>
                                <span class="number px-3">${item.quantity}</span>
                                <button class="col-but border-0 rounded-3 amount-but plus-btn">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = htmlContent;

        if (subtotalDisplay) {
            subtotalDisplay.textContent = `$${grandTotal.toFixed(2)}`;
        }
    } else if (container) {
        container.innerHTML = `<p class="text-muted pt-3">Your cart is currently empty.</p>`;
        if (subtotalDisplay) {
            subtotalDisplay.textContent = `$0.00`;
        }
    }

    // Initialize the buttons on page load
    initializeCartRows();
});

// function to calculate and update the whole cart subtotal dynamically
function updateSubtotal() {
    let grandtotal = 0;

    // Always query fresh remaining rows so deleted rows aren't counted anymore
    const cartRows = document.querySelectorAll('.cart-row');
    const subtotalDisplay = document.querySelector('.sub-total');

    cartRows.forEach(row => {
        const baseUnitPrice = parseFloat(row.getAttribute('data-price')) || 0;
        const qtyElement = row.querySelector('.number');
        
        if (qtyElement) {
            const currentQty = parseInt(qtyElement.textContent) || 1;
            grandtotal += baseUnitPrice * currentQty;
        }
    });

    // Update the subtotal display in your Cart Summary section
    if (subtotalDisplay) {
        subtotalDisplay.textContent = `$${grandtotal.toFixed(2)}`;
    } else {
        const summaryHeadings = document.querySelectorAll('h2');
        summaryHeadings.forEach(heading => {
            if (heading.innerText.includes('Subtotal')) {
                heading.innerText = `Subtotal $${grandtotal.toFixed(2)}`;
            }
        });
    }
}

// Loop through each cart row to power the plus and minus buttons (runs on page load)
function initializeCartRows() {
    const cartRows = document.querySelectorAll('.cart-row');
    
    cartRows.forEach(row => {
        const minusBtn = row.querySelector('.minus-btn');
        const plusBtn = row.querySelector('.plus-btn');
        const qtyDisplay = row.querySelector('.number');
        const itemPriceDisplay = row.querySelector('.price');
        const baseUnitPrice = parseFloat(row.getAttribute('data-price')) || 0;

        if (plusBtn && qtyDisplay) {
            plusBtn.addEventListener('click', () => {
                let currentQty = parseInt(qtyDisplay.textContent) || 1;
                currentQty++;
                qtyDisplay.textContent = currentQty;

                if (itemPriceDisplay) {
                    let newPrice = baseUnitPrice * currentQty;
                    itemPriceDisplay.textContent = `$${newPrice.toFixed(2)}`;
                }

                updateSubtotal();
            });
        }

        if (minusBtn && qtyDisplay) {
            minusBtn.addEventListener('click', () => {
                let currentQty = parseInt(qtyDisplay.textContent) || 1;

                if (currentQty > 1) {
                    currentQty--;
                    qtyDisplay.textContent = currentQty;

                    if (itemPriceDisplay) {
                        let newPrice = baseUnitPrice * currentQty;
                        itemPriceDisplay.textContent = `$${newPrice.toFixed(2)}`;
                    }

                    updateSubtotal();
                }
            });
        }
    });
}

// Listen for click events across the entire document for the delete icon
document.addEventListener('click', function(event) {
    const deleteIcon = event.target.closest('img[alt="delete"]');
    
    if (deleteIcon) {
        const productRow = deleteIcon.closest('.cart-item') || deleteIcon.closest('.row.pt-3');
        
        if (productRow) {
            productRow.remove();
            updateSubtotal();
        }
    }
});

// FIND CHECKOUT BUTTON AND SAVE ITEMS + IMAGES TO LOCALSTORAGE
const checkoutBtn = document.getElementById('checkout-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function (e) {
        // Prevent default jump so localStorage has time to save
        e.preventDefault(); 

        let cartItems = [];
        const cartRows = document.querySelectorAll('.cart-item');

        cartRows.forEach(row => {
            // Grab the product image path safely
            const imgEl = row.querySelector('img');
            const imgSrc = imgEl ? imgEl.getAttribute('src') : '';

            // Find product title
            const prodEl = row.querySelector('.prod');
            const name = prodEl ? prodEl.textContent.trim() : 'Product';

            // Find description
            const descEl = row.querySelector('.det');
            const description = descEl ? descEl.textContent.trim() : '';

            // Find unit price from data attribute
            const priceRow = row.querySelector('.cart-row');
            const baseUnitPrice = priceRow ? parseFloat(priceRow.getAttribute('data-price')) || 0 : 0;

            // Find quantity
            const qtyEl = row.querySelector('.number');
            const quantity = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;

            cartItems.push({
                image: imgSrc, // Saved image path for checkout page
                name: name,
                description: description,
                unitPrice: baseUnitPrice,
                quantity: quantity,
                totalPrice: baseUnitPrice * quantity
            });
        });

        // Grab current subtotal value text safely
        const subtotalEl = document.querySelector('.sub-total');
        let finalSubtotal = subtotalEl ? subtotalEl.textContent : '0.00';
        finalSubtotal = finalSubtotal.replace('$', '').trim(); // Ensures clean number formatting

        // Save to local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartGrandTotal', finalSubtotal);

        console.log('Saved cart items with images:', cartItems);

        // Redirect manually after saving
        window.location.href = 'delivery.html'; // Matches your current button destination
    });
} else {
    console.log('Could not find checkout button');
}

// Listen for click events across the document for the like icon
document.addEventListener('click', function(event) {
    const likeIcon = event.target.closest('img[alt="like"]');
    
    if (likeIcon) {
        likeIcon.classList.toggle('liked');
    }
});