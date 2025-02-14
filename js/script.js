
/* Global Variables */
let books = [];
let cartArray = [];
let cartModal;
let bookModal;
let countdownModal;

/* Book Data Management Functions */
async function fetchBooks() {
    try {
        const response = await fetch('https://striveschool-api.herokuapp.com/books');
        books = await response.json();
        displayBooks();
        displayRecommendedBooks();
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function getRandomBooks(books, count) {
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayRecommendedBooks() {
    const recommendedContainer = document.querySelector('.recommended-books');
    if (!recommendedContainer || !books.length) return;

    const randomBooks = getRandomBooks(books, 3);
    recommendedContainer.innerHTML = randomBooks.map(book => `
        <div class="col-md-4" id="book-${book.asin}">
            <div class="card h-100">
                <img src="${book.img}" alt="${book.title}" class="card-img-top p-3" style="height: 300px; object-fit: contain;">
                <div class="card-body">
                    <h3 class="card-title h5">${book.title}</h3>
                    <p class="card-text text-muted">${book.category}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-primary fw-bold">$${book.price}</span>
                        <div>
                            <button onclick="addToCart('${book.asin}')" class="btn btn-primary btn-sm me-2" id="add-${book.asin}">
                                Add to Cart
                            </button>
                            <button onclick="skipBook('${book.asin}')" class="btn btn-secondary btn-sm">
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function displayBooks(filteredBooks = books) {
    const container = document.getElementById('books-container');
    container.innerHTML = filteredBooks.map(book =>
        `<div class="col-6 col-md-4 col-lg-3" id="book-${book.asin}">
            <div class="card h-100 book-card">
                <img src="${book.img}" alt="${book.title}" class="card-img-top book-image p-3">
                <div class="card-body">
                    <h3 class="card-title h5">${book.title}</h3>
                    <p class="card-text text-primary fw-bold">$${book.price}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex justify-content-start align-items-center">
                            <button onclick="addToCart('${book.asin}')" class="btn btn-primary btn-sm me-2" id="add-${book.asin}">
                                Add to Cart
                            </button>
                            <button onclick="skipBook('${book.asin}')" class="btn btn-secondary btn-sm">
                                Skip
                            </button>
                        </div>
                        <button onclick="showBookDetails('${book.asin}')" class="btn btn-link btn-sm p-0">
                            <i class="bi bi-info-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`
    ).join('');
}

function addToCart(asin) {
    const book = books.find(b => b.asin === asin);
    const existingItem = cartArray.find(item => item.asin === asin);

    if (!existingItem) {
        cartArray.push({ ...book, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cartArray));
        updateCartCount();
        const addButton = document.getElementById(`add-${asin}`);
        addButton.textContent = 'Added';
        addButton.classList.replace('btn-primary', 'btn-secondary');
        addButton.disabled = true;
    }
}

function updateCartCount() {
    const count = cartArray.length;
    document.getElementById('cart-count').textContent = count;
}

function showCart() {
    const itemsContainer = document.getElementById('cart-items');
    const total = cartArray.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    itemsContainer.innerHTML = cartArray.map(item => `
        <div class="d-flex align-items-center gap-3 mb-3">
            <img src="${item.img}" alt="${item.title}" class="cart-book-image rounded">
            <div class="flex-grow-1">
                <h4 class="h6 mb-1">${item.title}</h4>
                <p class="mb-0">$${item.price}</p>
            </div>
            <button onclick="removeFromCart('${item.asin}')" class="btn btn-link text-danger p-0">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');

    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    cartModal.show();
}

function removeFromCart(asin) {
    cartArray = cartArray.filter(item => item.asin !== asin);
    localStorage.setItem('cart', JSON.stringify(cartArray));
    updateCartCount();
    showCart();

    const addButton = document.getElementById(`add-${asin}`);
    if (addButton) {
        addButton.textContent = 'Add to Cart';
        addButton.classList.replace('btn-secondary', 'btn-primary');
        addButton.disabled = false;
    }
}

function showBookDetails(asin) {
    const book = books.find(b => b.asin === asin);
    const detailsContainer = document.getElementById('book-details');

    detailsContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-3">
            <h5 class="modal-title">${book.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <img src="${book.img}" alt="${book.title}" class="modal-book-image">
        <p class="text-muted mb-2">Category: ${book.category}</p>
        <p class="text-muted mb-2">Price: $${book.price}</p>
        <p class="text-muted mb-0">ASIN: ${book.asin}</p>
    `;

    bookModal.show();
}

function skipBook(asin) {
    const bookCard = document.getElementById(`book-${asin}`);
    if (bookCard) {
        bookCard.style.opacity = '0';
        setTimeout(() => {
            bookCard.remove();
        }, 300);
    }
}

function showCountdownModal() {
    countdownModal.show();
    startCountdown();
}

function startCountdown() {
    let endTime = localStorage.getItem('countdownEndTime');
    const now = new Date().getTime();

    if (!endTime || now > parseInt(endTime)) {
        endTime = now + (6 * 60 * 60 * 1000);
        localStorage.setItem('countdownEndTime', endTime);
    }

    const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const distance = parseInt(endTime) - currentTime;

        if (distance < 0) {
            clearInterval(timer);
            countdownModal.hide();
            localStorage.removeItem('countdownEndTime');
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const timerElement = document.getElementById('countdown-timer');
        if (timerElement) {
            timerElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);

    return timer;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();

    cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
    bookModal = new bootstrap.Modal(document.getElementById('book-modal'));
    countdownModal = new bootstrap.Modal(document.getElementById('countdown-modal'));

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm)
            );
            displayBooks(filteredBooks);
        } else if (searchTerm.length === 0) {
            displayBooks();
        }
    });

    if (!localStorage.getItem('popupShown')) {
        setTimeout(() => {
            showCountdownModal();
            localStorage.setItem('popupShown', 'true');
        }, 15000);
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartArray = JSON.parse(savedCart);
        updateCartCount();
    }

    document.getElementById('cart-button').addEventListener('click', showCart);
    document.getElementById('checkout-button').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
});
