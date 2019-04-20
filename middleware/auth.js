const jwt = require('jsonwebtoken')
const jwtPrivateKey = 'superSecureSecret'
const debug = require('debug')('app:auth')

const parsetoken = header => {
    if (header) {
        const [type,token] = header.split(' ')
        if(type === 'bearer' && typeof token !== 'undefined'){
            return token
        }
        return undefined
    }
}


module.exports = (req, res, next) => {
  const token = req.header('bearer')
  debug(token)
  if (!token) {
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
    debug(req.user)
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