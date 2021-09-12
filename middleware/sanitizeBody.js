const logger = require('../startup/logger')
const xss = require('xss')

const sanitize = sourceString => {
    return xss (sourceString, {
        whitelist: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    })
}

const stripTags = payload => {
    let attributes = {...payload};
    for (let key in attributes){
        if(attributes[key] instanceof Array){
            logger.log('info','recursive Array', attributes[key])
            attributes[key] = attributes[key].map(element => {
                return typeof element === 'string'
                ? sanitize(element)
                : stripTags(element) 
            })
        }else if (attributes[key] instanceof Object){
            logger.log('info','recursive Object', attributes[key])
            attributes[key] = stripTags(attributes[key])
        }else{
            attributes[key] = sanitize(attributes[key])
        }
    }
    return attributes
}

module.exports = (req,res,next) => {
    // logger.log('info',{body: req.body})
    const {id, _id, ...attributes} = req.body
    // logger.log('info',attributes)
    const sanitizedBody = stripTags(attributes)
    // logger.log('info',sanitizedBody);
    req.sanitizedBody = sanitizedBody
    console.log("Sanitization Module: ", req.sanitizedBody)
    // logger.log("info","body: "+ req.sanitizedBody )
    next();
}