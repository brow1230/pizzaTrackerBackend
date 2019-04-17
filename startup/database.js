const debug = require('debug')('database:MongoDB')
const mongoose = require('mongoose')

module.exports = () => {
    mongoose.connect(
        'mongodv://localhost:27017/mad9124',
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