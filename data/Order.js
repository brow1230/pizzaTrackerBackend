const mongoose = require('mongoose')

const schema = new mongoose.schema({
    customer: {
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        require: true
    },
    type: {
        type: String,
        enum: ['pickup','delivery'],
        default: 'pickup'
    },
    status: {
        type: String,
        enum: ['draft', 'ordered', 'paid', 'delivered'],
        default: 'draft'
    },
    pizzas: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pizza'}]
    },
    adress: {
        type: String,
        //require if type delivery
    },
    price: {
        type: Number,
        default: 0
    },
    deliveryCharge: {
        type: Number,
        default: 0 //500 if type is delivery
    },
    tax: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

const Model = mongoose.model('Order', schema)

module.exports = Model