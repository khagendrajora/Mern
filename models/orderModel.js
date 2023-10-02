const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: ObjectId,
        required: true,
        ref: 'orderItem'
    }],
    shippingAdress1: {
        type: String,
        required: true

    },
    shippingAdress2: {
        type: String
    },
    city: {
        type: String,
        required: true

    },
    zip: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    }


}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)