// 1. Expiry Date Formatter (MM/YY)
const expiryInput = document.getElementById('expiryDate');
if (expiryInput) {
    expiryInput.addEventListener('input', function (b) {
        let value = b.target.value.replace(/\D/g, ''); 
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        b.target.value = value;
    });
}

// 2. Card Number Formatter
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(d) {
        let value = d.target.value.replace(/\D/g, '');
        if (value.length > 16) {
            value = value.substring(0, 16);
        }
        let formattedvalue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        d.target.value = formattedvalue;
    });
}

// 3. Payment Form Submission Handler
const paymentForm = document.getElementById('paymentDetails');
if (paymentForm) {
    paymentForm.addEventListener('submit', function (c) {
        c.preventDefault(); 

        const paymentData = {
            fullName: document.getElementById('fullName')?.value || '',
            cardNumber: document.getElementById('cardNumber')?.value || '',
            cardType: document.getElementById('cardType')?.value || '',
            expiryDate: document.getElementById('expiryDate')?.value || '',
            cvv: document.getElementById('cvv')?.value || ''
        };
        localStorage.setItem('paymentInfo', JSON.stringify(paymentData));

        alert('Payment submitted successfully!');
    });
}

// 4. Synchronized Checkout Render (Matches Delivery Page Logic)
window.addEventListener('DOMContentLoaded', () => {
    let rawItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const container = document.getElementById('delivery-order-container');

    let savedItems = [];
    let calculatedGrandTotal = 0;

    rawItems.forEach(item => {
        let itemName = item.name ? item.name.trim().toLowerCase() : '';
        let unitPrice = Number(item.unitPrice) || 45.00;
        let itemQuantity = Number(item.quantity) || 1;

        let existing = savedItems.find(i => i.name.trim().toLowerCase() === itemName);
        if (existing) {
            existing.quantity = Math.max(existing.quantity, itemQuantity);
        } else {
            savedItems.push({
                ...item,
                unitPrice: unitPrice,
                quantity: itemQuantity
            });
        }
    });

    savedItems.forEach(item => {
        calculatedGrandTotal += (item.unitPrice * item.quantity);
    });

    localStorage.setItem('cartGrandTotal', calculatedGrandTotal.toFixed(2));

    if (savedItems.length > 0 && container) {
        container.innerHTML = ''; // Clear container completely
        
        let htmlContent = `
            <div class="pt-3 pb-4">
                <h1 class="order">Your Order</h1>
            </div>
            <hr>
        `;

        savedItems.forEach(item => {
            let itemTotal = item.unitPrice * item.quantity;
            let imageSrc = item.image ? item.image : 'assests/cart1.png';

            htmlContent += `
                <div class="row pb-2 align-items-center">
                    <div class="col-6 col-md-5 col-lg-4 text-start">
                        <img src="${imageSrc}" alt="${item.name}" class="w-75">
                    </div>
                    <div class="col-md-4 col-6 col-lg-5">
                        <h2 class="prod">${item.name}</h2>
                        <p class="des">${item.description}</p>
                        <p class="text-muted mb-0">Quantity: ${item.quantity}</p>
                    </div>
                    <div class="col-md-3 col-lg-3 text-end">
                        <h1 class="price">$${itemTotal.toFixed(2)}</h1>
                    </div>
                </div>
                <hr>
            `;
        });

        // Append Subtotal and Checkout button right after the items
        htmlContent += `
            <div class="row pb-2 pt-4">
                <div class="col-8 col-md-5 col-lg-9">
                    <h2 class="subtotal">Subtotal</h2>
                    <p class="des-del mt-2">Delivery fee have been included</p>
                </div>
                <div class="col-4 col-md-6 col-lg-3 text-end">
                    <h1 class="price" id="price-total">$${calculatedGrandTotal.toFixed(2)}</h1>
                </div>
            </div>
            <div class="pt-4">
                <button onclick="window.location.href='confirmation.html'" type="button"
                    class="but w-100 py-4 rounded-3 border-0" id="check.html">Checkout</button>
            </div>
        `;

        container.innerHTML = htmlContent;
    } else if (container) {
        container.innerHTML = `<p class="text-muted pb-3">No items in your order.</p>`;
    }
});