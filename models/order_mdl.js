const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    upi: {
        type: String,
        required: [true, 'UPI ID is required'],
        trim: true
    },
    pin: {
        type: String,
        required: [true, 'PIN is required'],
        minlength: [4, 'PIN must be at least 4 characters']
    },
    cart: {
        type: [{
            name: String,
            price: Number,
            quantity: Number
            // Add other cart item properties you need
        }],
        required: [true, 'Cart items are required'],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Cart cannot be empty'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OrderDetails', orderSchema);