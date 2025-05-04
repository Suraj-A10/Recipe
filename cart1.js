// Global variables
let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Cart Items
function displayCart() {
    let cartItems = document.getElementById('cart-items');
    let totalAmount = 0;

    cartItems.innerHTML = '';

    if (currentCart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('totalAmount').innerText = 0;
        updatePayButton();
        return;
    }

    currentCart.forEach((item, index) => {
        totalAmount += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="card p-3 mb-3" style="background-color:#d8e2dc;">
                <h4 style="font-weight:700;">${item.name}</h4>
                <p>Price: ₹${item.price}</p>
                <div class="d-flex align-items-center">
                    <button class="btn btn-danger btn-sm" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-success btn-sm" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById('totalAmount').innerText = totalAmount;
    updatePayButton();
}

// Change Quantity Function
function changeQuantity(index, change) {
    if (currentCart[index].quantity + change <= 0) {
        currentCart.splice(index, 1);
    } else {
        currentCart[index].quantity += change;
    }
    localStorage.setItem('cart', JSON.stringify(currentCart));
    displayCart();
    updatePayButton();
}

// Update Pay Button
function updatePayButton() {
    const totalAmount = document.getElementById('totalAmount').innerText;
    const payButton = document.getElementById('payButton');
    
    if (payButton) {
        payButton.innerText = `Pay Now (₹${totalAmount})`;
        payButton.disabled = currentCart.length === 0;
    }
}

// Payment Modal Submit Handler
const paymentForm = document.querySelector('#paymentModal form');
if (paymentForm) {
   // In cart1.js - payment form handler
   paymentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const upi = document.getElementById('upi').value;
    const pin = document.getElementById('pin').value;
    
    if (!upi || !pin) {
        alert('Please enter both UPI and PIN');
        return;
    }

    try {
        console.log("Attempting payment with:", { upi, pin, cart: currentCart });
        
        const response = await fetch('http://localhost:5000/order', { // Full URL for testing
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                upi, 
                pin, 
                cart: currentCart 
            }),
            credentials: 'same-origin'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Payment result:", result);
        
        if (result.success) {
            alert('Payment successful! Order ID: ' + (result.orderId || ''));
            // Clear cart
            currentCart = [];
            localStorage.setItem('cart', JSON.stringify(currentCart));
            displayCart();
            
            // Close modal
            const paymentModal = bootstrap.Modal.getInstance(
                document.getElementById('paymentModal')
            );
            paymentModal.hide();
        } else {
            throw new Error(result.message || 'Payment failed');
        }
    } catch (error) {
        console.error('Payment error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        alert(`Payment failed: ${error.message}`);
    }
});
}

// Recipe Form Submit Handler
// Recipe Form Submit Handler
const recipeForm = document.getElementById('paymentForm');
if (recipeForm) {
    recipeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const upiCheck = document.getElementById('upicheck').value;
        const pinCheck = document.getElementById('pincheck').value;
        
        if (!upiCheck || !pinCheck) {
            alert('Please enter both UPI and PIN to view recipes');
            return;
        }
        
        try {
            // Show loading state
            const submitBtn = recipeForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Verifying...';
            
            // Verify credentials and fetch order details
            const response = await fetch(`/order/verify?upi=${encodeURIComponent(upiCheck)}&pin=${encodeURIComponent(pinCheck)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Verification failed');
            }
            
            const result = await response.json();
            
            if (result.success) {
                showRecipeModal(result.cart);
            } else {
                throw new Error(result.message || 'Invalid credentials');
            }
            
        } catch (error) {
            console.error('Verification error:', error);
            alert(`Failed to verify: ${error.message}`);
        } finally {
            // Reset button state
            const submitBtn = recipeForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText || 'Submit Details';
            }
        }
    });
}
// Show Recipe Modal
// Show Recipe Modal (no changes needed)
function showRecipeModal(cartData) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';

    if (!cartData || cartData.length === 0) {
        modalBody.innerHTML = '<p>No dishes found!</p>';
        return;
    }

    cartData.forEach(item => {
        const pageName = item.name.toLowerCase().replace(/ /g, '');
        const pageLink = `/recipedetails/${pageName}`;
        
        modalBody.innerHTML += `
            <div class="card p-3 mb-3">
                <h5>${item.name}</h5>
                <button onclick="window.location.href='${pageLink}'" 
                        class="btn btn-success w-100">
                    View Recipe
                </button>
            </div>
        `;
    });

    // Show the modal
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    recipeModal.show();
}
// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updatePayButton();
});