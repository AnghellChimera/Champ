// 1. Load saved cart items into the order summary on page load
window.addEventListener('DOMContentLoaded', () => {
    let rawItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const container = document.getElementById('delivery-order-container');

    // --- CLEAN REPLACEMENT LOGIC ---
    let savedItems = [];
    rawItems.forEach(item => {
        let itemName = item.name ? item.name.trim().toLowerCase() : '';
        let existing = savedItems.find(i => i.name.trim().toLowerCase() === itemName);
        
        let itemQty = Number(item.quantity) || 1;
        let unitPrice = Number(item.unitPrice) || 45.00;

        if (existing) {
            // Instead of += (which adds them up and makes it 4), 
            // we keep the highest or latest accurate quantity from the cart:
            existing.quantity = Math.max(existing.quantity, itemQty);
        } else {
            savedItems.push({
                ...item,
                unitPrice: unitPrice,
                quantity: itemQty
            });
        }
    });
    // ----------------------------------------

    if (savedItems.length > 0 && container) {
        container.innerHTML = ''; // Clear container completely
        let htmlContent = '';

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
                        <h1 class="price pt-lg-3">$${itemTotal.toFixed(2)}</h1>
                    </div>
                </div>
                <hr>
            `;
        });

        container.innerHTML = htmlContent;
    } else if (container) {
        container.innerHTML = `<p class="text-muted pb-3">No items in your order.</p>`;
    }
});

// 2. Form submission event listener
const deliveryForm = document.getElementById('deliverydetails');

if (deliveryForm) {
    deliveryForm.addEventListener('submit', function (a) {
        a.preventDefault(); 

        const deliveryData = {
            state: document.getElementById('state').value,
            LocalGovernment: document.getElementById('local').value,
            address: document.getElementById('address').value,
            deliveryMethod: document.querySelector('input[name="deliveryMode"]:checked') ? document.querySelector('input[name="deliveryMode"]:checked').value : ''
        };
        localStorage.setItem('deliveryInfo', JSON.stringify(deliveryData));

        window.location.href = 'check-out.html';
    });
}