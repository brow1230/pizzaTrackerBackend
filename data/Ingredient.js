const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type:String, required: true, maxlength: 64, },
    price: { type:Number, maxlength:10000, default:100, },
    quantity: { type: Number, maxlength: 1000, default: 10 },
    isGlutentFree: { type:Boolean, default:false, },
    imgUrl: { type: String, maxlength: 1024, },
    categories: { type: String, enum: ['meat', 'spicy', 'vegitarian', 'vegan', 'halal', 'kosher', 'cheeze', 'seasonings'] }
})

const Model = mongoose.model('Ingredient', schema)
module.exports = Model;