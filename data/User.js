const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        maxlength: 64
    },
    lastName:{
        type: String,
        required: true,
        maxlength: 64
    },
    email: {
        type: String,
        required: true,
        maxlength: 64
    },
    password: {
        type: String,
        required: true,
        maxlength: 512
    },
    isStaff: {
        type: Boolean,
        default: false
    }
})

const Model = mongoose.model('User', schema)
module.exports = Model