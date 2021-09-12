const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config').get('jwt')
const saltrounds = config.saltRounds;
const logger = require('../startup/logger')



const schema = new mongoose.Schema({
    firstName:{ type: String, required: true, maxlength: 64, trim:true },
    lastName:{ type: String, required: true, maxlength: 64, trim:true },
    email: { type: String, required: true, maxlength: 64, trim:true },
    password: { type: String, required: true, maxlength: 512, trim:true },
    isStaff: { type: Boolean, default: false }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
         },
    }

)

schema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id,
        isStaff: this.isStaff
    }, 'superSecureSecret')
}

schema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email: email })
    // logger.log('info',user)
    const hashedPassword = user 
        ? user.password
        :`$2b$${saltrounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
    const passwordMatched = await bcrypt.compare(password, hashedPassword)
    // logger.log('info', 'passwords matched: '+ passwordMatched)
    return passwordMatched
        ? user
        : null
}



schema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, saltrounds)
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