document.addEventListener('DOMContentLoaded', function () {
    // --- 1. DOM Elements ---
    const searchInput = document.getElementById('foodSearch');
    const filterPills = document.querySelectorAll('.filter-pill');
    const foodItems = document.querySelectorAll('.food-item');
    const menuTitle = document.getElementById('menu-title');

    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const emptyMsg = document.getElementById('emptyCartMsg');

    // NEW: Persistent Cart State
    let cart = JSON.parse(localStorage.getItem('zingCart')) || [];

    // --- 2. Filtering Logic ---
    function filterDishes() {
        const searchTerm = searchInput.value.toLowerCase();
        const activePill = document.querySelector('.filter-pill.active')?.innerText;
        let hasResults = false;

        foodItems.forEach(item => {
            const dishName = item.querySelector('.dish-name').innerText.toLowerCase();
            const dishDesc = item.querySelector('.dish-desc').innerText.toLowerCase();
            const ratingBadge = item.querySelector('.rating-badge');
            const rating = ratingBadge ? parseFloat(ratingBadge.innerText) : 0;
            const isVeg = item.querySelector('.diet-veg') !== null;
            const isNonVeg = item.querySelector('.diet-non-veg') !== null;

            const matchesSearch = dishName.includes(searchTerm) || dishDesc.includes(searchTerm);
            let matchesPill = true;
            if (activePill === "Pure Veg") matchesPill = isVeg;
            else if (activePill === "Non-Veg") matchesPill = isNonVeg;
            else if (activePill === "Rating 4.0+") matchesPill = rating >= 4.0;

            if (matchesSearch && matchesPill) {
                item.style.display = "block";
                hasResults = true;
            } else {
                item.style.display = "none";
            }
        });

        menuTitle.innerText = !hasResults ? `No results for "${searchTerm}"` :
            (searchTerm === "" && !activePill) ? "Top Rated Dishes" : "Filtered Results";
    }

    // --- 3. Persistent Cart Functions ---
    const toggleCart = () => {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    };

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemHtml = `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-0 small fw-bold">${item.name}</h6>
                        <span class="text-muted small">₹${item.price} x ${item.quantity}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary py-0" onclick="changeQty(${index}, -1)">-</button>
                        <button class="btn btn-sm btn-outline-secondary py-0" onclick="changeQty(${index}, 1)">+</button>
                        <button class="btn btn-sm text-danger" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>`;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        cartTotalElement.innerText = `₹${total}`;
        if (emptyMsg) emptyMsg.style.display = cart.length === 0 ? 'block' : 'none';
        localStorage.setItem('zingCart', JSON.stringify(cart));
    }

    // Global helpers for cart buttons
    window.changeQty = (index, delta) => {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        updateCartUI();
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    // --- 4. Event Listeners ---
    searchInput.addEventListener('input', filterDishes);

    filterPills.forEach(pill => {
        pill.addEventListener('click', function () {
            filterPills.forEach(p => p !== this && p.classList.remove('active'));
            this.classList.toggle('active');
            filterDishes();
        });
    });

    if (openCartBtn) openCartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);

    // Add to Cart with Toast Notification
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-zing') && e.target.innerText === "Add to Cart") {
            const card = e.target.closest('.food-item') || e.target.closest('.card-body');
            const name = card.querySelector('.dish-name').innerText;
            const price = parseInt(card.querySelector('.dish-desc').innerText.match(/₹(\d+)/)[1]);

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCartUI();
            showToast(`${name} added to cart!`);
            if (!cartSidebar.classList.contains('active')) toggleCart();
        }
    });

    // Initialize UI
    updateCartUI();
});

// --- Toast Notification System ---
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'zing-toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- Dark Mode Logic ---
const themeToggle = document.getElementById('darkModeToggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.checked = true;
}

if (themeToggle) {
    themeToggle.addEventListener('change', function () {
        const theme = this.checked ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
        localStorage.setItem('theme', theme);
    });
}

// --- Image Loading / Shimmer ---
window.addEventListener('load', () => {
    document.querySelectorAll('.food-image').forEach(img => {
        const shimmer = img.parentElement.querySelector('.shimmer-wrapper');
        if (shimmer) shimmer.style.display = 'none';
        img.style.opacity = '1';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const backBtnCart = document.getElementById('backBtnCart');
    const continueShopping = document.getElementById('continueShopping');
    const closeCartBtn = document.getElementById('closeCart');

    // Function to close/go back from cart
    const closeCartAction = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    // 1. Mobile Back Arrow
    if (backBtnCart) {
        backBtnCart.addEventListener('click', closeCartAction);
    }

    // 2. Continue Shopping Button
    if (continueShopping) {
        continueShopping.addEventListener('click', closeCartAction);
    }

    // 3. Existing Close Button
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartAction);
    }

    // 4. Clicking the Overlay (Backdrop)
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartAction);
    }
});

function updateCartUI() {
    const cartCountBadge = document.getElementById('cartCount');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartItemsContainer = document.getElementById('cartItems');
    
    let totalItems = 0;
    let totalPrice = 0;

    // Assuming 'cart' is your array of objects [{price: 100, quantity: 2}, ...]
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += (item.price * item.quantity);
    });

    // 1. Update the Total Price Span
    if (cartTotalElement) {
        cartTotalElement.innerText = `₹${totalPrice}`;
    }

    // 2. Update the Badge Count
    if (cartCountBadge) {
        if (totalItems > 0) {
            cartCountBadge.innerText = totalItems;
            cartCountBadge.style.display = 'block'; // Show if items exist
        } else {
            cartCountBadge.style.display = 'none'; // Hide if empty
        }
    }

    // 3. Update the list inside the sidebar (Existing logic)
    renderCartItems(); 
    
    // Save to local storage so it persists on refresh
    localStorage.setItem('zingCart', JSON.stringify(cart));
}
