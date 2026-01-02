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

    let cartTotal = 0;

    // --- 2. Filtering Logic (Search + Category Pills) ---
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

            // Check Search Match
            const matchesSearch = dishName.includes(searchTerm) || dishDesc.includes(searchTerm);

            // Check Pill Match
            let matchesPill = true;
            if (activePill === "Pure Veg") {
                matchesPill = isVeg;
            } else if (activePill === "Non-Veg") {
                matchesPill = isNonVeg;
            } else if (activePill === "Rating 4.0+") {
                matchesPill = rating >= 4.0;
            }

            // Display Toggle
            if (matchesSearch && matchesPill) {
                item.style.display = "block";
                hasResults = true;
            } else {
                item.style.display = "none";
            }
        });

        // Update Section Title
        if (!hasResults) {
            menuTitle.innerText = searchTerm ? `No results for "${searchTerm}"` : "No items found";
        } else {
            menuTitle.innerText = (searchTerm === "" && !activePill) ? "Top Rated Dishes" : "Filtered Results";
        }
    }

    // --- 3. Cart Functions ---
    const toggleCart = () => {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    };

    function updateCartUI() {
        cartTotalElement.innerText = `₹${cartTotal}`;
        if (emptyMsg) {
            emptyMsg.style.display = cartTotal === 0 ? 'block' : 'none';
        }
    }

    // --- 4. Event Listeners ---

    // Search and Pill Listeners
    searchInput.addEventListener('input', filterDishes);

    filterPills.forEach(pill => {
        pill.addEventListener('click', function () {
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                filterPills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
            }
            filterDishes();
        });
    });

    // Sidebar Toggle Listeners
    if (openCartBtn) openCartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart Logic (Event Delegation)
    document.addEventListener('click', function (e) {
        // Handle "Add to Cart"
        if (e.target.classList.contains('btn-zing') && e.target.innerText === "Add to Cart") {
            const card = e.target.closest('.card-body') || e.target.closest('.food-item');
            const dishName = card.querySelector('.dish-name').innerText;
            const dishDesc = card.querySelector('.dish-desc').innerText;

            const priceMatch = dishDesc.match(/₹(\d+)/);
            const price = priceMatch ? parseInt(priceMatch[1]) : 0;

            const itemHtml = `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3" data-price="${price}">
                    <div>
                        <h6 class="mb-0 small fw-bold">${dishName}</h6>
                        <span class="text-muted small">₹${price}</span>
                    </div>
                    <button class="btn btn-sm text-danger remove-item"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
            cartTotal += price;
            updateCartUI();

            if (!cartSidebar.classList.contains('active')) toggleCart();
        }

        // Handle "Remove from Cart"
        if (e.target.closest('.remove-item')) {
            const itemRow = e.target.closest('.cart-item');
            const itemPrice = parseInt(itemRow.getAttribute('data-price'));

            cartTotal -= itemPrice;
            itemRow.remove();
            updateCartUI();
        }
    });
});


// --- Dark Mode Logic ---
const themeToggle = document.getElementById('darkModeToggle');
const currentTheme = localStorage.getItem('theme');

// Check for saved user preference
if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const foodImages = document.querySelectorAll('.food-image');

    foodImages.forEach(img => {
        // If image is already in cache
        if (img.complete) {
            handleImageLoad(img);
        } else {
            img.addEventListener('load', () => handleImageLoad(img));
        }
    });

    function handleImageLoad(img) {
        // Find the shimmer wrapper in the same container
        const shimmer = img.parentElement.querySelector('.shimmer-wrapper');
        if (shimmer) {
            shimmer.style.display = 'none'; // Hide shimmer
        }
        img.style.opacity = '1'; // Fade in the actual image
    }
});

function showLoading() {
    document.getElementById('food-container').innerHTML = `
        `;
}

function displayFood(data) {
    const container = document.getElementById('food-container');
    container.innerHTML = ''; // This removes the shimmer/skeletons
    
    data.forEach(item => {
        // Append your actual food-card HTML here
    });
}

// Footer Subscription Logic
const footerForm = document.querySelector('footer form');

if (footerForm) {
    footerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents the page from reloading
        
        const data = new FormData(footerForm);
        
        try {
            const response = await fetch(footerForm.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Replaces the form with a success message
                footerForm.innerHTML = '<p class="text-success fw-bold">Success! Welcome to the ZingFood family!</p>';
            } else {
                // Handles server errors
                alert('Oops! There was a problem submitting your email.');
            }
        } catch (error) {
            // Handles network errors
            alert('Could not connect to the server. Please check your internet.');
        }
    });
}
