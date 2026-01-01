        document.getElementById('foodSearch').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const foodItems = document.querySelectorAll('.food-item');
            let hasResults = false;

            foodItems.forEach(item => {
                const dishName = item.querySelector('.dish-name').innerText.toLowerCase();
                const dishDesc = item.querySelector('.dish-desc').innerText.toLowerCase();
                
                if (dishName.includes(searchTerm) || dishDesc.includes(searchTerm)) {
                    item.style.display = "block";
                    hasResults = true;
                } else {
                    item.style.display = "none";
                }
            });

            // Update title if no results found
            const title = document.getElementById('menu-title');
            if (!hasResults) {
                title.innerText = "No results found for '" + e.target.value + "'";
            } else {
                title.innerText = searchTerm === "" ? "Top Rated Dishes" : "Search Results";
            }
        });