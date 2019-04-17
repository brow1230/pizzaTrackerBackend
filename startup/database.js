const debug = require('debug')('app:db')
const mongoose = require('mongoose')

module.exports = () => {
    mongoose.connect(
        `mongodb://localhost:27017/mad9124`,
        {useNewUrlParser:true}
    )
    .then(()=>{
        debug('connected to MongoDB ...')
    })
    .catch((err) =>{
        debug('error connecting to MongoDB: ', err)
        process.exit(1)
    })
}