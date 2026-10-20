function select() {
    document.getElementById("but-hov").classList.toggle('but-select')
}

const swatches = document.querySelectorAll('.but-hov');

swatches.forEach(button => {
    button.addEventListener('click', function () {
        swatches.forEach(btn => btn.classList.remove('selected'));

        this.classList.add('selected');
    });
});




// document.getElementById('deliverydetails').addEventListener('submit', function (a) {
//     a.preventDefault(); //stop page from refreshing

//     // save delivery info
//     const deliveryData = {
//         state: document.getElementById('state').value,
//         LocalGovernment: document.getElementById('local').value,
//         address: document.getElementById('address').value,
//         deliveryMethod: document.querySelector('input[name="deliveryMode"]:checked') ? document.querySelector('input[name="deliveryMode"]:checked').value: ''
//     };
//     localStorage.setItem('deliveryInfo', JSON.stringify(deliveryData));

//     // redirect to checkout button
//     window.location.href = '#payment.html';
// });


// Grab all checkboxes
// const boxes = document.querySelectorAll('.box');

// boxes.forEach(function (currentBox) {
//     currentBox.addEventListener('change', function () {
//         // if the current box is checked, uncheck the other(s)
//         if (this.checked) {
//             boxes.forEach(function (otherBox) {
//                 if (otherBox !== currentBox) {
//                     otherBox.checked = false;
//                 }
//             });
//         }
//     });
// });


window.addEventListener('DOMContentLoaded', () => {
    // Read the saved product from localStorage
    const savedProduct = localStorage.getItem('currentProduct');
    console.log('Loaded product from storage:', savedProduct); // Check F12 console here too!

    if (savedProduct) {
        const productData = JSON.parse(savedProduct);

        const titleEl = document.querySelector('.product');
        const priceEl = document.querySelector('.price');
        const mainImgEl = document.querySelector('.details-w');

        if (titleEl && productData.name) {
            titleEl.textContent = productData.name;
        }
        if (priceEl && productData.price) {
            priceEl.textContent = productData.price;
        }
        if (mainImgEl && productData.image) {
            mainImgEl.setAttribute('src', productData.image);
        }
    }
});

// Handle "Add to Cart" button from the details page
const addToCartBtn = document.querySelector('.add'); 
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const savedProduct = localStorage.getItem('currentProduct');
        const productData = savedProduct ? JSON.parse(savedProduct) : {
            name: 'Modern Tool Armchair',
            price: '$45.00',
            image: 'assests/details-prod.png',
            description: 'Metal Legs and wooden frame living room chair...'
        };

        const numericPrice = parseFloat(productData.price.replace(/[^0-9.]/g, '')) || 45.00;

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        const existingItem = cartItems.find(item => item.name === productData.name);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
        } else {
            cartItems.push({
                image: productData.image,
                name: productData.name,
                description: productData.description,
                unitPrice: numericPrice,
                quantity: 1,
                totalPrice: numericPrice
            });
        }

        let grandTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartGrandTotal', grandTotal.toFixed(2));

        window.location.href = 'cart.html';
    });
}