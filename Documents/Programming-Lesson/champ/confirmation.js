window.addEventListener('DOMContentLoaded', () => {
    let rawItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let savedGrandTotal = localStorage.getItem('cartGrandTotal') || '0.00';
    const container = document.getElementById('confirmation-order-container');

    let savedItems = [];
    rawItems.forEach(item => {
        let itemName = item.name ? item.name.trim().toLowerCase() : '';
        let itemQty = Number(item.quantity) || 1;
        let unitPrice = Number(item.unitPrice) || 45.00;

        let existing = savedItems.find(i => i.name.trim().toLowerCase() === itemName);
        if (existing) {
            existing.quantity = Math.max(existing.quantity, itemQty);
        } else {
            savedItems.push({
                ...item,
                unitPrice: unitPrice,
                quantity: itemQty
            });
        }
    });

    if (savedItems.length > 0 && container) {
        container.innerHTML = ''; // Clear container completely
        
        let htmlContent = `
            <div class="pt-3 pb-4">
                <h1 class="order">Furniture summary</h1>
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

        // Append Subtotal matching your exact layout
        htmlContent += `
            <div class="row pb-2 pt-4">
                <div class="col-8 col-md-5 col-lg-9">
                    <h2 class="subtotal">Subtotal</h2>
                    <p class="des-del mt-2">Delivery fee have been included</p>
                </div>
                <div class="col-4 col-md-6 col-lg-3 text-end">
                    <h1 class="price">$${Number(savedGrandTotal).toFixed(2)}</h1>
                </div>
            </div>
        `;

        container.innerHTML = htmlContent;
    }
});