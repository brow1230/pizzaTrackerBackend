const jwt = require('jsonwebtoken')
const logger = require('../startup/logger')
const jwtPrivateKey = 'superSecureSecret'

// Currently broken, only returns `undefined`
const parsetoken = header => {
    if (header) {
      logger.log('info',header)
      
        const [type,token] = header.split(' ')
        if(type === 'bearer' && typeof token !== 'undefined'){
            return token
        }
        return undefined
    }
}


module.exports = (req, res, next) => {
  // logger.log('info',req.header)
  // logger.log('info',req.headers )
  // const token = parsetoken(req.headers)
  const token = req.header('bearer')
  if (!token) {
    logger.log('info',"Bearer Token is: "+ token)
    return res.status(401).send({
      errors: [
        {
          status: 'Unauthorized',
          code: '401',
          title: 'Authentication failed',
          description: 'Missing bearer token'
        }
      ]
    })
  }

  try {
    const payload = jwt.verify(token, jwtPrivateKey)
    req.user = payload
    next()
  } catch (err) {
    res.status(400).send({
      errors: [
        {
          status: 'Bad request',
          code: '400',
          title: 'Validation Error',
          description: 'Invalid bearer token'
        }
      ]
    })
  }
}