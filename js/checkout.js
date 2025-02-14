
/* Checkout Global Variables */
let cartArray = [];

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartArray = JSON.parse(savedCart);
        displayCheckoutItems();
    }
}

function displayCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!cartArray.length) {
        container.innerHTML = '<p class="text-gray-600">Your cart is empty</p>';
        return;
    }

    const total = cartArray.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const endTime = localStorage.getItem('countdownEndTime');
    const now = new Date().getTime();
    const isDiscountActive = endTime && now < parseInt(endTime);
    const finalTotal = isDiscountActive ? total * 0.5 : total;

    container.innerHTML = cartArray.map(item => `
        <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
            <div class="book-image-container" style="width: 80px; height: 120px; background: #f8f8f8;">
                <img src="${item.img}" alt="${item.title}" class="w-100 h-100" style="object-fit: contain;">
            </div>
            <div class="flex-grow-1">
                <h4 class="h6 mb-1">${item.title}</h4>
                <p class="mb-0">$${item.price}</p>
            </div>
        </div>
    `).join('');

    if (isDiscountActive) {
        container.innerHTML += `
            <div class="mt-4 p-2 bg-green-100 text-green-700 rounded">
                50% discount applied!
                <div>Original total: $${total.toFixed(2)}</div>
            </div>
        `;
    }

    document.getElementById('checkout-total').textContent = `$${finalTotal.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.removeItem('cart');
        window.location.href = 'thank-you.html';
    });
});
