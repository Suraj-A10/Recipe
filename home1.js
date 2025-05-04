document.addEventListener('DOMContentLoaded', function () {

    // Initialize PureCounter
    if (typeof PureCounter !== 'undefined') {
        new PureCounter();
    }

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: false, // Har baar trigger hoga jab scroll karega
        offset: 100, // Element thoda pehle trigger hoga
    });

    // Show 'veg' items by default (yeh unrelated hai teri problem se)
    filterItems('veg');

    // Check if facts section is in view on load and trigger manually if needed
    const factsSection = document.querySelector('.facts1');
    if (isInViewport(factsSection)) {
        triggerAnimations();
    }

    // Scroll event listener to trigger animations
    window.addEventListener('scroll', function () {
        if (isInViewport(factsSection)) {
            triggerAnimations();
        }
    });
});

// Function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to manually trigger animations
function triggerAnimations() {
    const counters = document.querySelectorAll('.purecounter');
    counters.forEach(counter => {
        if (!counter.classList.contains('counted')) {
            new PureCounter(counter); // Re-initialize if not counted
            counter.classList.add('counted'); // Mark as counted
        }
    });
    AOS.refresh(); // Refresh AOS to ensure animations trigger
}

// Function to Filter Items (unchanged)
function filterItems(category) {
    let items = document.querySelectorAll('.food-item');
    let hasVisibleItem = false;

    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => (item.style.opacity = '1'), 100);
            hasVisibleItem = true;
        } else {
            item.style.display = 'none';
        }
    });

    let noItems = document.getElementById('no-items');
    if (noItems) {
        noItems.style.display = hasVisibleItem ? 'none' : 'block';
    }

    let tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[onclick="filterItems('${category}')"]`).classList.add('active');
}


function addToCart(itemName, itemPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists
    let existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${itemName} added to cart!`);
}
 
