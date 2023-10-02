const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, { timestamps: true })
//timestamps automatically adds 2 field given below.
//createdAt
//updatedAt

module.exports = mongoose.model('Category', categorySchema) 