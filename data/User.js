const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltrounds = 14;
const debug = require('debug')('app:schemaUSERS')



const schema = new mongoose.Schema({
    firstName:{ type: String, required: true, maxlength: 64, trim:true },
    lastName:{ type: String, required: true, maxlength: 64, trim:true },
    email: { type: String, required: true, maxlength: 64, trim:true },
    password: { type: String, required: true, maxlength: 512, trim:true },
    isStaff: { type: Boolean, default: false }
})

schema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id
    }, 'superSecureSecret')
}

schema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email: email })
    debug(user)
    const hashedPassword = user 
        ? user.password
        :`$2b$${saltrounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
    const passwordMatched = await bcrypt.compare(password, hashedPassword)
    return passwordMatched
        ? user
        : null
}

schema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, saltrounds)
    debug(this.password)
    next();
})

schema.methods.toJSON = function() {
    const obj = this.toObject()
    delete obj.password
    delete obj.__v
    return obj
}

const Model = mongoose.model('User', schema)
module.exports = Model