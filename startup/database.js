const logger = require('../startup/logger')
const config = require('config')
module.exports = () => {
    const mongoose = require('mongoose')
    const dbconfig = config.get('db')
    mongoose.connect(
        `mongodb://${dbconfig.host}:${dbconfig.port}/${dbconfig.dbName}`,
        {useNewUrlParser:true}
    )
    .then(()=>{
        logger.log('info','connected to MongoDB ...')
    })
    .catch((err) =>{
        logger.log('error','error connecting to MongoDB: ', err)
        process.exit(1)
    })
}