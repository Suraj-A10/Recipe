const express = require('express');
const router = express.Router();
const OrderDetails = require('./models/order_mdl');

router.post('/', async (req, res) => { // Changed from '/order' to '/'
    console.log("Incoming request:", req.method, req.url);
    
    try {
        const { upi, pin, cart } = req.body;
        
        if (!upi || !pin || !cart) {
            console.log("Validation failed - missing fields");
            return res.status(400).json({ 
                success: false, 
                message: 'Missing UPI, PIN, or cart data' 
            });
        }

        const newOrder = new OrderDetails({ upi, pin, cart });
        const savedOrder = await newOrder.save();
        
        console.log("Order saved:");
        res.json({ 
            success: true, 
            message: 'Order saved successfully',
            orderId: savedOrder._id 
        });
        
    } catch (error) {
        console.error("Order save error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Database error: ' + error.message 
        });
    }
});

// Add this new route to order.js
router.get('/verify', async (req, res) => {
    try {
        const { upi, pin } = req.query;
        
        if (!upi || !pin) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing UPI or PIN' 
            });
        }

        // Find the most recent order matching these credentials
        const order = await OrderDetails.findOne({ upi, pin })
            .sort({ createdAt: -1 }) // Get the most recent order
            .exec();

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'No order found with these credentials' 
            });
        }

        res.json({ 
            success: true, 
            cart: order.cart 
        });
        
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Verification failed',
            error: error.message 
        });
    }
});
module.exports = router;